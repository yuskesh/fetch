// This is a promising npm module for storing entire assets Cheerio can recognize.
// And the libray is powered mostly by got(http library) and cheerio(HTML parser)
import scrape from 'website-scraper';

// Load a custom plugin for storing metadata
import StoreDataPlugin from "./store-data-plugin.js";

// We can use Puppeteer as a client, but it's too slow to scrape a site.
// But if we'd like to scrape a dynamic site, using this plugin will help
// And if we can contribute, adding resource management on Puppeteer would speed it up.
// import PuppeteerPlugin from 'website-scraper-puppeteer';

// storing in the current directory as default.
// targetDir can be changed by specifying FETCHER_TARGET_DIR env var.
let targetDir = process.cwd();

function fetchURL(url) {
    let domain = (new URL(url)).hostname;
    if (!domain) {
        throw new Error("please specify valid URL");
    }

    if (process.env.FETCHER_TARGET_DIR) {
        targetDir = process.env.FETCHER_TARGET_DIR;
    }
    const options = {
        urls: [{url: url, filename: `${domain}.html`}],
        directory: targetDir,
        plugins: [
            // new PuppeteerPlugin(),
            new StoreDataPlugin()
        ],
        // i.e. if the website is http://www.google.com, assets will be saved in
        // $CWD/asset/www.google.com/
        // Not covered everything yet
        subdirectories: [
            {directory: `asset/${domain}/img`, extensions: ['.jpg', '.png', '.svg', '.ico', '.webp']},
            {directory: `asset/${domain}/js`, extensions: ['.js']},
            {directory: `asset/${domain}/css`, extensions: ['.css']},
            {directory: `asset/${domain}/fonts`, extensions: ['.ttf', '.woff', '.woff2']},
        ],
        request: {
            headers: {
                // mimic Chrome browser
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'accept-language': 'en-US,en;q=0.9,ja;q=0.8'
            }
        }
    };

    return scrape(options);
}

export {
    fetchURL
}