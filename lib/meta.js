import {loadMetaData} from "./db.js";
import chalk from 'chalk';

function printMetaData(url) {
    const domain = (new URL(url)).hostname;
    const domainInfo = loadMetaData(domain);
    if (!domainInfo) {
        // if there is no data
        console.log(`${chalk.bold.redBright('There is no fetched data for ')+domain}`);
        return;
    }
    console.log(
`${chalk.cyan(   'site       : ')}${domainInfo.domain}
${chalk.green(  'num_links  : ')}${domainInfo.links}
${chalk.yellow( 'images     : ')}${domainInfo.images}
${chalk.magenta('last_fetch : ')}${domainInfo.fetched_at} UTC
`);
    return domainInfo;
}

export {
    printMetaData
}