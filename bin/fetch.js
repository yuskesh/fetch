#! /usr/bin/env node

import { program } from 'commander';
import { fetchURLs } from "../index.js";
import { printMetaData } from "../lib/meta.js";

program
    .argument('<domains...>')
    .option('-m, --meta', 'output meta info')
    .action(async function (domains, options) {
        if (options.meta) {
            domains.forEach(domain => {
                printMetaData(domain);
            })
        } else {
            await fetchURLs(domains);
        }
    });

program.parse(process.argv);
