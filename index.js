import {oraPromise} from "ora";
import {fetchURL} from "./lib/fetcher.js";

// Multiple website fetcher
// Maybe this API can be moved in the lib directory,
// but I leave it here because it's a representative API
async function fetchURLs(urls) {
    if (urls.length === 0) {
        return;
    }
    let tasks = [];

    urls.forEach((url) => {
       let domain = (new URL(url)).hostname;
       // We need fancy spinners for waiting long
       tasks.push(oraPromise(fetchURL(url), {
           text: `fetch ${domain}`
       }));
    });

    return Promise.allSettled(tasks);
}

export {
    fetchURLs
}