import { strict as assert }  from 'assert';
import * as fs from "fs";
import * as path from "path";
import {expect} from "chai";
// local modules
import {fetchURLs} from "../index.js";
import {loadMetaData} from "../lib/db.js";

describe('fetchURLs', () => {
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
   it('fetch multiple domains with fetchURLs', async () => {
      const url1 = "https://nodejs.org";
      const url2 = "https://www.google.com";
      await fetchURLs([url1, url2]);
      assert(fs.existsSync(path.join(target_dir, 'nodejs.org.html')));
      assert(fs.existsSync(path.join(target_dir, 'www.google.com.html')));
      const domainInfo = loadMetaData((new URL(url2)).hostname);
      expect(domainInfo.domain).to.equal('www.google.com');
   }).timeout(10000);
   after( () => {
      if (fs.existsSync(target_dir)) {
         fs.rmSync(target_dir, {recursive:true, force:true})
      }
      fs.unlinkSync(process.env.FETCHER_DATABASE_PATH);
      process.env.FETCHER_DATABASE_PATH = envBackup;
   });
});