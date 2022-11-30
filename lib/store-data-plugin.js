import * as cheerio from 'cheerio';
import {insertMetaData} from "./db.js";
import path from "path";
import fs from "fs-extra";

class StoreDataPlugin {
    apply (registerAction) {
        let absoluteDirectoryPath, loadedResources = [];

        registerAction('beforeStart', ({options}) => {
            // The library tries to have us use a non-existing library, but we rebel here
            if (!options.directory || typeof options.directory !== 'string') {
                throw new Error(`Incorrect directory ${options.directory}`);
            }

            absoluteDirectoryPath = path.resolve(process.cwd(), options.directory);
        });

        registerAction('saveResource', async ({resource}) => {
            const filename = path.join(absoluteDirectoryPath, resource.getFilename());
            const text = resource.getText();
            await fs.outputFile(filename, text, { encoding: resource.getEncoding() });
            loadedResources.push(resource);
        });

        registerAction('afterResponse', async ({response}) => {
            if (response.statusCode === 404) {
                return null;
            } else {
                let contentType = response.headers['content-type'];

                // sometimes the content-type is like "text/html; charset=UTF-8", need to use "includes"
                if (contentType.toLowerCase().includes("text/html")) {
                    let body = response.body.toString();
                    let domain = (new URL(response.request.requestUrl.toString())).hostname;

                    // here he comes, Cheerios Kid!
                    const $ = cheerio.load(body);
                    const imageCount = $("img").length + $("svg").length;
                    const linkCount = $("a").length;
                    const metaData = {
                        domain,
                        "images": imageCount,
                        "links": linkCount
                    };
                    insertMetaData(metaData);
                }
                return response;
            }
        });

        // Tries to remove an entire directory if trouble happened
        // Too dangerous to use the logic
        registerAction('error', async (error) => {
            // if (loadedResources.length > 0) {
            //     await fs.remove(absoluteDirectoryPath);
            // }
            console.error(error)
        });
    }
}

export default StoreDataPlugin;