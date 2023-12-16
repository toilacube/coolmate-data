import puppeteer from "puppeteer";
import * as fs from "fs";
import { log } from "console";

// .collection-section-loadmore__btn .btn

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.goto(
    "https://www.coolmate.me/collection/coolmate-activewear?itm_source=navbar",
    {
      waitUntil: "domcontentloaded",
    }
  );
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  await scrape(page);
  await browser.close();
})();

const scrape = async (page) => {
  while (true) {
    try {
      await page.$eval(".collection-section-loadmore__btn.btn", (el) =>
        el.click()
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.log(error);
      break;
    }
  }
  let list = [];
  list = await page.$$eval(".grid__column", (listFeat) => {
    return listFeat.map((feat) => {

      const getHtml = (query) => {
        return feat.querySelector(query);
      };

      let link = getHtml(".product-grid__image > a");
      if (link) link = link.getAttribute("href");

      return link;
    });
  });

  list = list.filter((element) => {
    return element != null;
  });

  
  console.log(list);
  console.log(list.length)
};
