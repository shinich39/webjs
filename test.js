import Web from "./index.js";
import fs from "node:fs";
import path from "node:path";

// google translate
;(async function() {
  const text = "hero";
  const from = "en";
  const to = "fr";
  const url = `https://translate.google.com/?op=translate&text=${text}&sl=${from}&tl=${to}`
  const selectors = ["span.ryNqvb"];

  const web = new Web();
  await web.init();
  await web.get(url);
  await web.wait(selectors[0]);
  await web.scroll();

  const data = await web.parse(selectors);
  console.log(data);
  // [
  //   Text {
  //     parent: Element {
  //       parent: [Element],
  //       prev: null,
  //       next: [Element],
  //       startIndex: null,
  //       endIndex: null,
  //       children: [Array],
  //       name: 'span',
  //       attribs: [Object: null prototype],
  //       type: 'tag',
  //       namespace: 'http://www.w3.org/1999/xhtml',
  //       'x-attribsNamespace': [Object: null prototype],
  //       'x-attribsPrefix': [Object: null prototype]
  //     },
  //     prev: null,
  //     next: null,
  //     startIndex: null,
  //     endIndex: null,
  //     data: 'héros', <= value
  //     type: 'text'
  //   }
  // ]

  await web.destory();
})();