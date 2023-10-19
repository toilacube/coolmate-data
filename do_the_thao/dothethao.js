import puppeteer from "puppeteer";
import * as fs from "fs";
import { get } from "http";

// .collection-section-loadmore__btn .btn

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.goto(
    "https://www.coolmate.me/collection/coolmate-activewear?itm_source=navbar",
    {
      waitUntil: "domcontentloaded",
    }
  );
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await scrape(page);
  await browser.close();
})();

const scrape = async (page) => {
  let itemList = [];
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

  itemList = await page.$$eval(".grid__column", (items) => {
    return items.map((item) => {
      const getHtml = (query) => {
        return item.querySelector(query);
      };

      let name = getHtml(".product-grid__title > a");

      let price = getHtml(".product-prices > ins");

      let img = getHtml(".product-grid__image .home-banner");

      let hover = getHtml(".product-grid__image .hover");

      let list_color = getHtml(".options-color"); // get all the color and their images in product detail

      let color_object = [];

      if (list_color)
        Array.from(list_color.querySelectorAll(".option-color__item")).map(
          (color) => {

            let object = {};

            object["name"] = color.getAttribute("data-title");

            const bg_btn = color.querySelector(".checkmark");
            object["background"] = bg_btn.getAttribute("style");

            if(object["background"]){
              object["background"] = object["background"].split("'")[1]
            }


            object["img"] = color.getAttribute("data-images");

            if (object["img"]) {
              object["img"] = object["img"].replace(/\\/g, "");
              object["img"] = JSON.parse(object["img"]);
            }

            color_object.push(object);
          }
        );

      if (name) name = name.innerText;
      if (price) price = price.innerText;
      if (img) img = img.getAttribute("src");
      if (hover) hover = hover.getAttribute("src");

      if (name && price) {
        return {
          name,
          price,
          img,
          hover,
          color_object,
        };
      }
    });
  });

  itemList = itemList.filter((element) => {
    return element != null;
  });

  if (itemList.length > 11) itemList = itemList.slice(0, -6);

  const file_name = "./do_the_thao/do_the_thao_data";

  const item_json = JSON.stringify(itemList);
  fs.writeFileSync(`${file_name}${itemList.length}.json`, item_json);
};
