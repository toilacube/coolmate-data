import puppeteer from "puppeteer";
import * as fs from "fs";
import { get } from "http";

// .collection-section-loadmore__btn .btn

const getDetail = async (product_url) => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
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
          list_feat += feature.innerText + "| ";
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

let list = [
  "https://www.coolmate.me/product/ao-polo-ice-cooling-thoang-mat",
  "https://www.coolmate.me/product/quan-dai-kaki-slim-fit-truot-nuoc",
  "https://www.coolmate.me/product/ao-ni-chui-dau-essential",
  "https://www.coolmate.me/product/quan-dai-the-thao-pro-active",
  "https://www.coolmate.me/product/ao-khoac-the-thao-pro-active-khong-mu",
  "https://www.coolmate.me/product/quan-joggers-the-thao-daily-wear",
  "https://www.coolmate.me/product/quan-ni-jogger-essential-basics",
  "https://www.coolmate.me/product/quan-joggers-co-gian-excool",
  "https://www.coolmate.me/product/ao-ni-chui-dau-lifewear",
  "https://www.coolmate.me/product/shorts-the-thao-9",
  "https://www.coolmate.me/product/ao-khoac-nam-co-mu-daily-wear-truot-nuoc-chong-uv-99",
  "https://www.coolmate.me/product/ao-thun-co-tron-excool",
  "https://www.coolmate.me/product/quan-dai-kaki-excool-co-gian",
  "https://www.coolmate.me/product/quan-dai-nam-jogger-pants",
  "https://www.coolmate.me/product/ao-hoodie-essential",
  "https://www.coolmate.me/product/ao-thun-nam-cotton-coolmate-basics-200gsm",
  "https://www.coolmate.me/product/coolmate-x-copper-denim-quan-jeans-dang-straight",
  "https://www.coolmate.me/product/ao-sat-nach-the-thao-nam-dri-breathe-thoang-mat?itm_source=normal",
  "https://www.coolmate.me/product/quan-shorts-nam-new-french-terry-v2",
  "https://www.coolmate.me/product/ao-polo-nam-pique-cotton-usa-tham-hut-toi-da",
  "https://www.coolmate.me/product/quan-nam-daily-short-soi-sorona-nhuom-cleandye",
  "https://www.coolmate.me/product/jeans-dang-slim-fit-v2",
  "https://www.coolmate.me/product/combo-03-tat-co-trung-cotton-supima",
  "https://www.coolmate.me/product/tat-co-ngan-cotton-supima",
  "https://www.coolmate.me/product/coolmate-x-copper-denim-ao-thun-phoi-jean",
  "https://www.coolmate.me/product/ao-ba-lo-cotton-100-coolmate-basics-v2",
  "https://www.coolmate.me/product/combo-4-tat-luoi-cotton-chong-truot",
  "https://www.coolmate.me/product/ao-dai-tay-cotton-compact-v2",
  "https://www.coolmate.me/product/quan-dai-nam-ut-pants",
  "https://www.coolmate.me/product/ao-thun-100-cotton-220gsm",
  "https://www.coolmate.me/product/polo-pique-basic-cotton-100",
  // "https://www.coolmate.me/product/coolmate-x-copper-denim-quan-jeans-dang-og-slim",
  // "https://www.coolmate.me/product/coolmate-x-copper-denim-quan-jeans-dang-slim-fit",
  // "https://www.coolmate.me/product/ao-so-mi-nam-dai-tay-cafe-dris-khu-mui",
  // "https://www.coolmate.me/product/ao-thun-nam-cotton-compact-chong-nhan",
  // "https://www.coolmate.me/product/gang-tay-da-nang-chong-tia-uv",
  // "https://www.coolmate.me/product/ao-so-mi-nam-excool",
  // "https://www.coolmate.me/product/ao-polo-nam-cafe",
  // "https://www.coolmate.me/product/ao-polo-nam-excool-mem-min-thoang-mat",
  // "https://www.coolmate.me/product/mu-non-luoi-trai-nam-classic-cap-theu-logo-coolmate",
  // "https://www.coolmate.me/product/quan-nam-daily-short-v2-soi-sorona-co-tui-sau",
  // "https://www.coolmate.me/product/coolmate-x-copper-denim-ao-polo-phoi-jeans",
  // "https://www.coolmate.me/product/mu-non-luoi-trai-nam-tech-cap-theu-logo-coolmate",
  // "https://www.coolmate.me/product/ao-hoodie-nam-daily-wear-mu-trum-co-day-rut",
  // "https://www.coolmate.me/product/coolmate-x-copper-denim-mu-dadcap-jeans",
  // "https://www.coolmate.me/product/mu-luoi-trai-vai-kaki-theu-care-share",
  // "https://www.coolmate.me/product/quan-shorts-nam-french-terry-logo-marvel",
  // "https://www.coolmate.me/product/combo-2-doi-tat-vo-co-trung-care-share-cotton-thoang-khi",
  // "https://www.coolmate.me/product/mu-bucket-hat-theu-care-share-handwriting-mau-be",
  // "https://www.coolmate.me/product/mu-bucket-hat-theu-care-share-typo",
  // "https://www.coolmate.me/product/mu-bucket-hat-theu-care-share-box-mau-den",
  // "https://www.coolmate.me/product/mu-bucket-hat-care-share",
  // "https://www.coolmate.me/product/combo-3-doi-tat-co-dai-cotton-solid-casual",
  // "https://www.coolmate.me/product/tat-co-ngan-cotton-thoang-khi",
  // "https://www.coolmate.me/product/ao-so-mi-nam-dai-tay-nano-tech-easycare-mau-xanh-dblue",
  // "https://www.coolmate.me/product/quan-ni-nam-jogger-casual-co-gian",
  // "https://www.coolmate.me/product/mu-luoi-trai-nam-thoang-khi-phoi-luoi-baseball-cap",
  // "https://www.coolmate.me/product/mu-luoi-trai-nam-thoang-khi-phoi-luoi-baseball-cap-logo-coolmate",
  // "https://www.coolmate.me/product/mu-luoi-trai-tech-caps",
  // "https://www.coolmate.me/product/ao-thun-nam-in-coolmate-cotton-compact-mau-trang-5",
  // "https://www.coolmate.me/product/mu-non-luoi-trai-nam-simple-cool-v2",
  // "https://www.coolmate.me/product/combo-4-doi-tat-co-ngan-modal-khang-khuan",
  // "https://www.coolmate.me/product/combo-4-doi-tat-co-trung-cotton-thoang-khi",
  // "https://www.coolmate.me/product/mu-luoi-trai-nam-classic-cap",
  // "https://www.coolmate.me/product/balo-backpack-logo-84rising",
];

list.forEach(async (url) => {
  await getDetail(url);
  //await new Promise((resolve) => setTimeout(resolve, 10000));
});
