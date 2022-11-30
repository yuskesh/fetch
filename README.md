# Website fetcher -- fetch

This command tries to fetch websites' html and assets and store them in a directory.

## Install locally

```shell
% cd $PROJECT_DIR
% npm install
% npm link
% hash -r # for reloading executable commands in $PATH, `rehash` for bash users
% fetch https://nodejs.org 
```

## Usage

```shell
fetch <domains...>
```
You can fetch multiple domains' html and asset.

```shell
fetch --meta <domains...>
```
You can see the latest fetch info with `-m` or `--meta` option.

## Run the program in a Docker machine

In a docker machine, the `fetch` symbolic link is in the `/usr/local/bin/`, so you can use the command anywhere you like.

```shell
% cd $PROJECT_DIR
% mkdir tmp
% docker build . -t node-fetcher
% docker run -itd -v /$PROJECT_DIR/tmp/:/usr/src/app/tmp/  node-fetcher
% docker exec -it $CONTAINER_ID /bin/bash
```

Then in the docker machine,

```shell
bash-5.1# cd tmp # This is the mounted dir we created in the previous step
bash-5.1# fetch https://nodejs.org
✔ fetch nodejs.org
bash-5.1# ls
asset            nodejs.org.html
bash-5.1# fetch --meta https://nodejs.org
site       : nodejs.org
num_links  : 35
images     : 3
last_fetch : 2022-11-30 04:28:49 UTC
bash-5.1#
```

Go to the `/$PROJECT_DIR/tmp/` in your host machine, then you can open the file with a browser.

## Environment Variable
`FETCHER_DATABASE_PATH`: The default db file is `/tmp/fetcher.db`, you can change it by setting this variable.  
`FETCHER_TARGET_DIR`: You can store the file in a specific directory with this optional variable. 

## Developer's Note
This program is still in development status, The parser script can't recognize `<picture><source srcset..><img srcset..>` as an image yet.
Also, some javascript code behaves weirdly.

This program uses 

* [website-scraper](https://github.com/website-scraper/node-website-scraper) for fetching/storing a website
  * Really handy because it has many hooks then we can customize a lot.
* [Cheerio](https://cheerio.js.org/) as a HTML parser
  * It has jQuery-like interfaces. Normally people don't like jQuery, but it's really useful for parsing purpose.
* [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for managing metadata
  * SQLite3 is my go-to database for creating a bite-sized app. We don't need to think about a daemon, authentication, authorization etc...
* [Commander.js](https://github.com/tj/commander.js#readme) for creating a CLI command.
  * A famous npm module for creating CLI program

