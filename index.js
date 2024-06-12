'use strict';

import util from "./libs/util.js";
import * as cheerio from 'cheerio';
import puppeteer from "puppeteer";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36";

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
  await this.page.setUserAgent(USER_AGENT);
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
 * @param {number} delay ms, default 30000
 * @param {string} selector 
 */
Web.prototype.wait = async function(delay, selector) {
  if (!this.browser) {
    throw new Error("Browser has not been initialized.");
  }

  if (!delay) {
    delay = 1000 * 30; // 30 sec
  }

  if (selector) {
    await this.page.waitForSelector(selector, {
      timeout: delay,
    });
  } else {
    await util.wait(delay);
  }
}

/**
 * 
 * @param {string} selector default document.documentElement
 */
Web.prototype.scroll = async function(selector) {
  if (!this.browser) {
    throw new Error("Browser has not been initialized.");
  }

  await this.page.evaluate(function(selector) {
    if (selector) {
      document.querySelector(selector).scrollTo(0, document.querySelector(selector).scrollHeight);
    } else {
      window.scrollTo(0, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
    }
  }, selector);
}

/**
 * 
 * @param {string} selector default document.documentElement
 * @returns 
 */
Web.prototype.getScroll = async function(selector) {
  if (!this.browser) {
    throw new Error("Browser has not been initialized.");
  }

  return await this.page.evaluate(function(selector) {
    return selector ? 
      document.querySelector(selector).scrollTop :
      document.documentElement.scrollTop;
  }, selector);
}

/**
 * 
 * @param {string} selector default document.documentElement
 * @returns 
 */
Web.prototype.getHeight = async function(selector) {
  if (!this.browser) {
    throw new Error("Browser has not been initialized.");
  }

  return await this.page.evaluate(function(selector) {
    return selector ? 
      document.querySelector(selector).scrollHeight :
      document.documentElement.scrollHeight;
  }, selector);
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