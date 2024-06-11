'use strict';

import * as cheerio from 'cheerio';
import puppeteer from "puppeteer";

class Web {
  constructor() {
    this.browser = null;
    this.page = null;
  }
}

/**
 * 
 */
Web.prototype.init = async function() {
  if (this.browser) {
    await this.destory();
  }
  this.browser = await puppeteer.launch();
  this.page = await this.browser.newPage();
}

/**
 * 
 */
Web.prototype.destory = async function() {
  if (this.page) {
    await this.page.close();
    this.page = null;
  }
  if (this.browser) {
    await this.browser.close();
    this.browser = null;
  }
}

/**
 * 
 * @param {string} url 
 * @returns 
 */
Web.prototype.get = async function(url) {
  if (!this.browser) {
    throw new Error("Browser has not been initialized.");
  }
  await this.page.goto(url);
}

/**
 * 
 * @param {string} selector 
 * @param {number} delay ms, default 30000
 */
Web.prototype.wait = async function(selector, delay) {
  if (!this.browser) {
    throw new Error("Browser has not been initialized.");
  }

  await this.page.waitForSelector(selector, {
    timeout: delay || 1000 * 30, // 30sec
  });
}

/**
 * 
 * @param {number} delay ms, default 1000
 * @param {number} timeout ms, default 3000
 */
Web.prototype.scroll = async function(delay, timeout) {
  if (!this.browser) {
    throw new Error("Browser has not been initialized.");
  }

  while (true) {
    const previousHeight = await this.page.evaluate("document.body.scrollHeight");
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    try {
      await this.page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`,
        { timeout: timeout || 1000 * 3 }
      );
    } catch {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, delay || 1000));
  }
}

/**
 * 
 * @param {array} selectors default ["body *"]
 * @returns 
 */
Web.prototype.parse = async function(selectors) {
  if (!this.browser) {
    throw new Error("Browser has not been initialized.");
  }

  if (typeof selectors === "string") {
    selectors = [selectors];
  } else if (!Array.isArray(selectors)) {
    selectors = ["body *"];
  }

  const content = await this.page.content();

  const $ = cheerio.load(content);

  return selectors.reduce(function(prev, curr) {
    return prev.concat($(curr).contents().toArray());
  }, []);
}

// esm
export default Web