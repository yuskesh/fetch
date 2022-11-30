import * as fs from "fs";
import {expect} from "chai";
// local modules
import {printMetaData} from "../lib/meta.js";
import {fetchURL} from "../lib/fetcher.js";

describe('print meta data', () => {
    let test_target_dir;
    let envBackup;
    before( () => {
        test_target_dir = '/tmp/fetcher_test_dir';
        process.env.FETCHER_TARGET_DIR = test_target_dir;
        if (!fs.existsSync(test_target_dir)) {
            fs.mkdirSync(test_target_dir);
        }
        envBackup = process.env.FETCHER_DATABASE_PATH;
        process.env.FETCHER_DATABASE_PATH = '/tmp/fetcher_test.db'
    });
    it('print something', async () => {
        const url = "https://nodejs.org";
        await fetchURL(url);
        const domainInfo = printMetaData(url);
        expect(domainInfo.domain).to.equal('nodejs.org');
    }).timeout(10000);
    after( () => {
        if (fs.existsSync(test_target_dir)) {
            fs.rmSync(test_target_dir, {recursive:true, force:true})
        }
        fs.unlinkSync(process.env.FETCHER_DATABASE_PATH);
        process.env.FETCHER_DATABASE_PATH = envBackup;
    });
});