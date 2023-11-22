import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import random
import re
import time
def get_detail(product_url):
    
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    chrome_driver_binary = "/usr/bin/chromedriver"
    service = Service(executable_path=chrome_driver_binary)
    driver = webdriver.Chrome(service=service, options=options)


    try:
        driver.get(product_url)
        time.sleep(3)
        # driver.save_screenshot('screenshot.png')
        name = -1
        # Extract information using Selenium
        name = driver.find_element(By.CSS_SELECTOR ,".product-single__title").text

        if name == -1: 
            print(product_url)
            return

        price_str = driver.find_element(By.CLASS_NAME ,"product-single__regular-price").text
        price_int = int(price_str.replace(".", "")[:-1])

        list_color = driver.find_elements(By.CSS_SELECTOR, ".option-select.option-select--color > .option-select__item.option-select__item")
        color_object = []
        for color in list_color:
            object = {}
            ele = color.find_element(By.TAG_NAME, "input")
            object["name"] = ele.get_attribute("data-title")
            if not object["name"]: break

            object["background"] = color.find_element(By.TAG_NAME, "span").get_attribute("style")
            if object["background"]:
              match = re.search(r'url\("([^"]+)"\)', object["background"])
              if match:
                  object["background"] = match.group(1)
            
    
            object["img"] = ele.get_attribute("data-gallery")
            if object["img"]:
                object["img"] = object["img"].replace("\\", "")
                object["img"] = json.loads(object["img"])
                for element in object["img"]:
                    baseUrl = "https://media.coolmate.me/cdn-cgi/image/quality=80,format=auto"
                    imgUrl = baseUrl + element["src"]
                    element["src"] = imgUrl
            object["img"].pop()  # remove last element because it is color background
            color_object.append(object)
        features_ele = driver.find_elements(By.CLASS_NAME, "product-features__item") 
        features = ""
        for feature in features_ele:
            features += feature.text + " | "

        # Create a dictionary with extracted data
        item_dict = {
            "name": name,
            "price_str": price_str,
            "price_int": price_int,
            "description": features,
            "color_object": color_object,
            # Add other extracted data fields here
        }

        
        if(len(item_dict["color_object"]) == 0): return

        # Save the dictionary to a JSON file
        path = "./mac_hang_ngay/data_mac_hang_ngay.json"
        try:
            with open(path, "r", encoding="utf-8") as file:
                existing_data = json.load(file)
                existing_data.append(item_dict)

            with open(path, "w", encoding="utf-8") as file:
                json.dump(existing_data, file, indent=2, ensure_ascii=False)

            print("Data added to the file.")
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error handling file: {e}")
    except NoSuchElementException as e:
         # Handle the "no such element" error
        print("Error during scraping:", e)
        print(product_url)
    except Exception as e:
        print(f"Error during scraping: {e}")
    
    finally:
        driver.quit()

if __name__ == "__main__":
   
    list = [
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
  "https://www.coolmate.me/product/coolmate-x-copper-denim-quan-jeans-dang-og-slim",
  "https://www.coolmate.me/product/coolmate-x-copper-denim-quan-jeans-dang-slim-fit",
  "https://www.coolmate.me/product/ao-so-mi-nam-dai-tay-cafe-dris-khu-mui",
  "https://www.coolmate.me/product/ao-thun-nam-cotton-compact-chong-nhan",
  "https://www.coolmate.me/product/gang-tay-da-nang-chong-tia-uv",
  "https://www.coolmate.me/product/ao-so-mi-nam-excool",
  "https://www.coolmate.me/product/ao-polo-nam-cafe",
  "https://www.coolmate.me/product/ao-polo-nam-excool-mem-min-thoang-mat",
  "https://www.coolmate.me/product/mu-non-luoi-trai-nam-classic-cap-theu-logo-coolmate",
  "https://www.coolmate.me/product/quan-nam-daily-short-v2-soi-sorona-co-tui-sau",
  "https://www.coolmate.me/product/coolmate-x-copper-denim-ao-polo-phoi-jeans",
  "https://www.coolmate.me/product/mu-non-luoi-trai-nam-tech-cap-theu-logo-coolmate",
  "https://www.coolmate.me/product/ao-hoodie-nam-daily-wear-mu-trum-co-day-rut",
  "https://www.coolmate.me/product/coolmate-x-copper-denim-mu-dadcap-jeans",
  "https://www.coolmate.me/product/mu-luoi-trai-vai-kaki-theu-care-share",
  "https://www.coolmate.me/product/quan-shorts-nam-french-terry-logo-marvel",
  "https://www.coolmate.me/product/combo-2-doi-tat-vo-co-trung-care-share-cotton-thoang-khi",
  "https://www.coolmate.me/product/mu-bucket-hat-theu-care-share-handwriting-mau-be",
  "https://www.coolmate.me/product/mu-bucket-hat-theu-care-share-typo",
  "https://www.coolmate.me/product/mu-bucket-hat-theu-care-share-box-mau-den",
  "https://www.coolmate.me/product/mu-bucket-hat-care-share",
  "https://www.coolmate.me/product/combo-3-doi-tat-co-dai-cotton-solid-casual",
  "https://www.coolmate.me/product/tat-co-ngan-cotton-thoang-khi",
  "https://www.coolmate.me/product/ao-so-mi-nam-dai-tay-nano-tech-easycare-mau-xanh-dblue",
  "https://www.coolmate.me/product/quan-ni-nam-jogger-casual-co-gian",
  "https://www.coolmate.me/product/mu-luoi-trai-nam-thoang-khi-phoi-luoi-baseball-cap",
  "https://www.coolmate.me/product/mu-luoi-trai-nam-thoang-khi-phoi-luoi-baseball-cap-logo-coolmate",
  "https://www.coolmate.me/product/mu-luoi-trai-tech-caps",
  "https://www.coolmate.me/product/ao-thun-nam-in-coolmate-cotton-compact-mau-trang-5",
  "https://www.coolmate.me/product/mu-non-luoi-trai-nam-simple-cool-v2",
  "https://www.coolmate.me/product/combo-4-doi-tat-co-ngan-modal-khang-khuan",
  "https://www.coolmate.me/product/combo-4-doi-tat-co-trung-cotton-thoang-khi",
  "https://www.coolmate.me/product/mu-luoi-trai-nam-classic-cap",
  "https://www.coolmate.me/product/balo-backpack-logo-84rising",
]
    start_time = time.time()
    for i in list: get_detail(i)
    print("--- %s seconds ---" % (time.time() - start_time))

    product_url = "https://www.coolmate.me/product/ao-polo-nam-cafe"
    #get_detail("https://www.coolmate.me/product/quan-joggers-the-thao-daily-wear?color=den")#