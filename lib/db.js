import Database from "better-sqlite3";
import * as dotenv from 'dotenv'
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db;

function loadEnv() {
    const envfilePath = path.join(__dirname, '..', '.env');
    dotenv.config({ path: envfilePath });

    if (!process.env.FETCHER_DATABASE_PATH) {
        console.error('Please specify FETCHER_DATABASE_PATH environment variable before running the program');
        process.exit(1);
    }
}

function initializeFetcherHistoryTable (db) {
    const initializeSql = fs.readFileSync(path.join(__dirname, "initializeTable.sql"), 'utf8');
    db.exec(initializeSql);
}

function getDbHandle(options, renew) {
    if (!db || !db.open || renew) {
        loadEnv();

        if (!options) {
            options = {};
        }
        // initialize database
        db = new Database(`${process.env.FETCHER_DATABASE_PATH}`, options);

        // set journal mode WAL
        // https://www.sqlite.org/pragma.html#pragma_journal_mode
        db.pragma('journal_mode = WAL');
    }
    return db;
}

function getConnection() {
    const handle = getDbHandle();
    initializeFetcherHistoryTable(handle);
    return handle;
}

function insertMetaData(obj) {
    if (!db || !db.open) {
        getConnection();
    }
    const sql = 'INSERT INTO fetch_history (domain, links, images) VALUES (@domain, @links, @images)';
    const stmt = db.prepare(sql);
    const insert = db.transaction((obj) => {
        stmt.run(obj);
    });
    insert(obj);
    closeConnection();
}

function loadMetaData(domain) {
    if (!db || !db.open) {
        getConnection();
    }
    const sql = 'SELECT domain, links, images, fetched_at FROM fetch_history WHERE domain = ? ORDER BY id DESC';
    const stmt = db.prepare(sql);
    const result =  stmt.get(domain);
    closeConnection();
    return result;
}

function closeConnection() {
    if (db && db.open) {
        db.close();
    }
}

// export all function for testing
export {
    getDbHandle,
    initializeFetcherHistoryTable,
    getConnection,
    insertMetaData,
    loadMetaData,
    closeConnection
}


