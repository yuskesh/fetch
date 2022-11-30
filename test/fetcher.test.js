import { strict as assert }  from 'assert';
import * as fs from "fs";
import * as path from "path";
import {expect} from "chai";
// local modules
import {fetchURL} from "../lib/fetcher.js";
import {loadMetaData} from "../lib/db.js";

describe('fetchURL', () => {
   let target_dir;
   let envBackup;
   before( () => {
      target_dir = '/tmp/fetcher_test_dir';
      process.env.FETCHER_TARGET_DIR = target_dir;
      if (!fs.existsSync(target_dir)) {
         fs.mkdirSync(target_dir);
      }
      envBackup = process.env.FETCHER_DATABASE_PATH;
      process.env.FETCHER_DATABASE_PATH = '/tmp/fetcher_test.db'
   });
   it('fetch nodejs.org file', async () => {
      const url = "https://nodejs.org";
      await fetchURL(url);
      assert(fs.existsSync(path.join(target_dir, 'nodejs.org.html')));
      const domainInfo = loadMetaData((new URL(url)).hostname);
      expect(domainInfo.domain).to.equal('nodejs.org');
   }).timeout(10000);
   after( () => {
      if (fs.existsSync(target_dir)) {
         fs.rmSync(target_dir, {recursive:true, force:true})
      }
      fs.unlinkSync(process.env.FETCHER_DATABASE_PATH);
      process.env.FETCHER_DATABASE_PATH = envBackup;
   });
});