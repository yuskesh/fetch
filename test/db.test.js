import { strict as assert }  from 'assert';
import {expect} from "chai";
import {getDbHandle, initializeFetcherHistoryTable,
    getConnection, insertMetaData, loadMetaData} from "../lib/db.js";
import * as fs from "fs";

describe('setup Database', () => {
    let envBackup;
    let db;
    const sql = 'SELECT COUNT(*) as c FROM sqlite_master WHERE type=\'table\' AND name= ?';
    beforeEach( () => {
        envBackup = process.env.FETCHER_DATABASE_PATH;
        process.env.FETCHER_DATABASE_PATH = '/tmp/fetcher_test.db'
    });
    it('should create fetcher history table', () => {
        db = getDbHandle({}, true);
        initializeFetcherHistoryTable(db);
        const stmt = db.prepare(sql);
        const res = stmt.get('fetch_history');
        assert(res.c);
    });
    it('getConnection should creates table', () => {
        db = getDbHandle({}, true);
        const stmt = db.prepare(sql);
        let res = stmt.get('fetch_history');
        // no fetch_history
        assert(!res.c);

        getConnection();
        res = stmt.get('fetch_history');
        assert(res.c);
    });
    afterEach( () => {
        db.close();
        fs.unlinkSync(process.env.FETCHER_DATABASE_PATH);
        process.env.FETCHER_DATABASE_PATH = envBackup;
    });
});

describe('insert/load meta info', () => {
    let envBackup;
    beforeEach( () => {
        envBackup = process.env.FETCHER_DATABASE_PATH;
        process.env.FETCHER_DATABASE_PATH = '/tmp/fetcher_test.db'
    });
    it('should insert/load data', () => {
        const domain = 'www.example.com';
        const domain_info = {
            domain: domain,
            links: 12,
            images: 3
        };
        insertMetaData(domain_info);
        domain_info.links = 15;
        insertMetaData(domain_info);

        const loadedInfo = loadMetaData(domain);
        expect(loadedInfo.domain).to.equal(domain);

        // latest row should have 15 as links
        expect(loadedInfo.links).to.equal(15)

        const noInfo = loadMetaData('www.sample.com');
        expect(noInfo).to.be.undefined;
    });
    afterEach( () => {
        fs.unlinkSync(process.env.FETCHER_DATABASE_PATH);
        process.env.FETCHER_DATABASE_PATH = envBackup;
    });
});

