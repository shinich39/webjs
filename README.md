# webjs

Web crawler in javascript.

## Usage

```js
import Web from "webjs";
```

```js
;(async function() {
  const url = "https://www.google.com/search?q=bing";

  // create web
  const web = new Web();

  // create browser
  await web.init();

  // load page
  await web.get(url);

  let prev = -1,
      curr = await web.getHeight();

  // scroll to bottom
  while (prev !== curr) {
    prev = curr;

    // scroll to bottom
    await web.scroll();

    // wait 1000 ms
    await web.wait(1000);

    curr = await web.getHeight();
  }

  // get dom elements
  const elements = await web.parse();

  // end

  await web.destory();

  // or continue crawling...

  await web.get(OTHER_URL);
})();
```

## References

- [cheerio](https://github.com/cheeriojs/cheerio)
- [puppeteer](https://github.com/puppeteer/puppeteer)