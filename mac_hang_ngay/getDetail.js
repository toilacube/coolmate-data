import puppeteer from "puppeteer";
import * as fs from "fs";
import { get } from "http";

// .collection-section-loadmore__btn .btn

const getDetail = async (product_url) => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.goto(product_url, {
      waitUntil: "domcontentloaded",
    });
    await scrape(page);
    await browser.close();
  })();

  const scrape = async (page) => {
    let itemList = [];

    itemList = await page.$eval(".product-single__summary", (items) => {
      const getHtml = (query) => {
        return items.querySelector(query);
      };

      let name = getHtml(".product-single__title");

      let price = getHtml(".product-single__prices > ins");
      if (name) name = name.innerText;
      let price_int = 0;
      if (price) {
        price = price.innerText;
        let price_str = price.slice(0, -1);
        const cleanedStr = price_str.replace(".", ""); // Remove the comma
        price_int = parseInt(cleanedStr, 10);
      }

      let list_color = getHtml(".option-select.option-select--color"); // get all the color and their images in product detail

      let color_object = [];

      if (list_color)
        Array.from(list_color.querySelectorAll(".option-select__item")).map(
          (color) => {
            let object = {};

            object["name"] = color
              .querySelector("input")
              .getAttribute("data-title");

            if (!object["name"]) return;

            const bg_btn = color.querySelector(".checkmark");
            object["background"] = bg_btn.getAttribute("style");

            if (object["background"]) {
              object["background"] = object["background"].split("'")[1];
            }

            /**
             * Get each color product images
             */

            object["img"] = color
              .querySelector("input")
              .getAttribute("data-gallery");

            if (object["img"]) {
              object["img"] = object["img"].replace(/\\/g, "");
              object["img"] = JSON.parse(object["img"]);
              object["img"].forEach((element) => {
                const baseUrl =
                  "https://media.coolmate.me/cdn-cgi/image/quality=80,format=auto";
                const imgUrl = baseUrl.concat(element.src);
                element.src = imgUrl;
              });
              object["img"].pop(); // remove last element because it is color background
            }

            color_object.push(object);
          }
        );
      let list_feat = "";

      Array.from(items.querySelectorAll(".product-features__item")).map(
        (feature) => {
          list_feat += feature.innerText + ", " ;
        }
      );

      if (name && price) {
        return {
          name,
          price_str: price,
          price_int,
          color_object,
          list_feat,
        };
      }
    });
    console.log(itemList);

    // itemList = itemList.filter((element) => {
    //   return element != null;
    // });

    const path = "./mac_hang_ngay/test.json";

    // const item_json = JSON.stringify(itemList);
    // fs.writeFileSync(file_name, item_json);

    fs.readFile(path, (err, data) => {
      if (err) {
        console.log("Error reading file");
        return;
      }
      try {
        // Parse the JSON data into a JavaScript array
        const existingData = JSON.parse(data);

        // Add the new object to the array
        existingData.push(itemList);

        // Convert the JavaScript array back to a JSON string
        const updatedData = JSON.stringify(existingData, null, 2); // null and 2 for pretty-printing

        // Write the updated JSON string back to the file
        fs.writeFile(path, updatedData, "utf-8", (err) => {
          if (err) {
            console.error("Error writing the file:", err);
          } else {
            console.log("Data added to the file.");
          }
        });
      } catch (parseError) {
        console.error("Error parsing the JSON data:", parseError);
      }
    });
  };
};

getDetail(
  "https://www.coolmate.me/product/ao-khoac-the-thao-pro-active-khong-mu?color=xanh-navy"
);
