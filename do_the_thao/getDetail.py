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
        path = "./do_the_thao/data_do_the_thao.json"
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
  'https://www.coolmate.me/product/set-do-the-thao-ao-khoac-quan-dai-pro-active',
  'https://www.coolmate.me/product/quan-dai-chay-bo-fast-free-nhanh-kho',
  'https://www.coolmate.me/product/ao-thun-the-thao-active-phoi-mau-thoang-khi2',
  'https://www.coolmate.me/product/ao-dai-tay-tap-gym-powerfit',
  'https://www.coolmate.me/product/quan-shorts-tap-gym-5-essentials',
  'https://www.coolmate.me/product/ao-tanktop-the-thao-active-phoi-mau-thoang-khi',
  'https://www.coolmate.me/product/ao-khoac-the-thao-pro-active-khong-mu',
  'https://www.coolmate.me/product/ao-khoac-gio-the-thao-phoi-mau',
  'https://www.coolmate.me/product/quan-joggers-co-gian-excool',
  'https://www.coolmate.me/product/ao-the-thao-dai-tay-active-v2',
  'https://www.coolmate.me/product/ao-thun-chay-bo-nam-graphic-special',
  'https://www.coolmate.me/product/tanktop-the-thao-active-v2',
  'https://www.coolmate.me/product/ao-khoac-nam-co-mu-daily-wear-truot-nuoc-chong-uv-99',
  'https://www.coolmate.me/product/ao-polo-the-thao-nam-recycle-active-v2',
  'https://www.coolmate.me/product/ao-polo-the-thao-nam-recycle-active-v1',
  'https://www.coolmate.me/product/quan-short-nam-the-thao-movement-7-co-gian',
  'https://www.coolmate.me/product/quan-short-nam-chay-bo-movement-5-co-gian',
  'https://www.coolmate.me/product/quan-short-nam-the-thao-5-new-ultra',
  'https://www.coolmate.me/product/ao-thun-the-thao-nam-promax-s1?itm_source=normal',
  'https://www.coolmate.me/product/quan-jogger-the-thao-co-gian-graphene',
  'https://www.coolmate.me/product/quan-the-thao-nam-promax-s1',
  'https://www.coolmate.me/product/quan-dai-the-thao-pro-active',
  'https://www.coolmate.me/product/quan-joggers-the-thao-daily-wear',
  'https://www.coolmate.me/product/quan-long-tights-mac-trong',
  'https://www.coolmate.me/product/ao-tanktop-gym-powerfit',
  'https://www.coolmate.me/product/quan-shorts-cotton-gym-6-inch',
  'https://www.coolmate.me/product/ao-drop-arm-gym-powerfit',
  'https://www.coolmate.me/product/ao-singlet-chay-bo-nam-fast-free-run',
  'https://www.coolmate.me/product/quan-lot-nam-chay-bo-fast-free-run',
  'https://www.coolmate.me/product/ao-sat-nach-the-thao-nam-dri-breathe-thoang-mat?itm_source=normal',
  'https://www.coolmate.me/product/ao-tank-top-the-thao-nam-thoang-khi-outlet',
  'https://www.coolmate.me/product/quan-lot-gym-powerfit',
  'https://www.coolmate.me/product/quan-shorts-nam-the-thao-recycle-7-v2-tui-sau-co-khoa-keo',
  'https://www.coolmate.me/product/ao-tanktop-the-thao-nam-recycle-active-v1',
  'https://www.coolmate.me/product/quan-the-thao-ngan-5-inch-thoang-khi-vai-recycle',
  'https://www.coolmate.me/product/ao-polo-nam-the-thao-thoang-khi-nhuom-sach-cleandye',
  'https://www.coolmate.me/product/quan-lot-nam-long-leg-the-thao',
  'https://www.coolmate.me/product/combo-02-quan-lot-nam-the-thao-boxer-briefs-ex-dry-microfiber',
  'https://www.coolmate.me/product/quan-shorts-chay-bo-coolmate-bassics',
  'https://www.coolmate.me/product/ao-thun-chay-bo-nam-essential-fast-free-run?itm_source=normal',
  'https://www.coolmate.me/product/quan-shorts-chay-bo-ultra-fast-free-run',
  'https://www.coolmate.me/product/combo-03-quan-short-nam-the-thao-promax-s1-thoang-khi',
  'https://www.coolmate.me/product/ao-the-thao-nam-promax-recycle-basics1?itm_source=normal',
  'https://www.coolmate.me/product/ao-polo-the-thao-nam-promax-s1-logo-1?itm_source=normal',
  'https://www.coolmate.me/product/dai-deo-bung-chay-bo-fast-free',
  'https://www.coolmate.me/product/shorts-the-thao-9',
  'https://www.coolmate.me/product/gaiter-mat-na-da-nang-chay-bo',
  'https://www.coolmate.me/product/quan-shorts-chay-bo-2-lop-essential-fast-free-run',
  'https://www.coolmate.me/product/ao-thun-chay-bo-basics',
  'https://www.coolmate.me/product/quan-shorts-gym-power-2-lop',
  'https://www.coolmate.me/product/quan-short-gym-7-power',
  'https://www.coolmate.me/product/ao-thun-gym-powerfit',
  'https://www.coolmate.me/product/ao-thun-chay-bo-nam-advanced-fast-free-run?itm_source=normal',
  'https://www.coolmate.me/product/combo-ultra-run-quan-shorts-chay-bo-ultra-fast-quan-lot-chay-bo1',
  'https://www.coolmate.me/product/quan-shorts-chay-bo-advanced-fast-free-run',
  'https://www.coolmate.me/product/combo-03-quan-short-nam-the-thao-recycle-7-thoang-khi',
  'https://www.coolmate.me/product/ao-thun-the-thao-nam-recycle-active-v1',
  'https://www.coolmate.me/product/quan-short-nam-the-thao-recycle-7-thoang-khi',
  'https://www.coolmate.me/product/mu-non-luoi-trai-nam-classic-cap-theu-logo-coolmate',
  'https://www.coolmate.me/product/ao-polo-the-thao-nam-promax-s2-logo-thoang-khi',
  'https://www.coolmate.me/product/combo-gym-drop-arm',
  'https://www.coolmate.me/product/quan-boi-nam-coolwaves-dang-brief-boxer',
  'https://www.coolmate.me/product/quan-the-thao-jogger-co-gian',
  'https://www.coolmate.me/product/quan-boi-nam-coolwaves-dang-trunk',
  'https://www.coolmate.me/product/mu-non-luoi-trai-nam-tech-cap-theu-logo-coolmate',
  'https://www.coolmate.me/product/khan-tap-gym-100-cotton-tham-hut-tot',
  'https://www.coolmate.me/product/tat-chay-bo-co-ngan-active',
  'https://www.coolmate.me/product/promax-tee-combo',
  'https://www.coolmate.me/product/dri-breathe-combo',
  'https://www.coolmate.me/product/promax-s1-combo',
  'https://www.coolmate.me/product/active-v2-combo-polo-active-v2-shorts-the-thao-5',
  'https://www.coolmate.me/product/active-v1-combo-t-shirt-active-v1-shorts-the-thao-5',
  'https://www.coolmate.me/product/quan-short-gym-5-inch-basic',
  'https://www.coolmate.me/product/tat-chay-bo-co-dai-coolmate-active1',
  'https://www.coolmate.me/product/ultra-fast-running-set-ao-quan',
  'https://www.coolmate.me/product/combo-chay-bo-advanced',
  'https://www.coolmate.me/product/combo-chay-bo-basics',
  'https://www.coolmate.me/product/essential-basics-combo',
  'https://www.coolmate.me/product/singlet-basics-combo',
  'https://www.coolmate.me/product/tat-vo-chay-bo-chuyen-dung-professional',
  'https://www.coolmate.me/product/advanced-running-set-ao-thun-quan-chay-bo',
  'https://www.coolmate.me/product/combo-tank-top-chay-bo-ao-tank-top-quan-shorts-ultra-fast',
  'https://www.coolmate.me/product/tat-vo-chay-bo-co-trung-advanced',
  'https://www.coolmate.me/product/tat-vo-chay-bo-co-ngan-essential',
  'https://www.coolmate.me/product/combo-03-ao-thun-the-thao-nam-promax-s1',
  'https://www.coolmate.me/product/ao-khoac-gio-the-thao-heiq-viroblock-chong-uv-truot-nuoc',
  'https://www.coolmate.me/product/tat-the-thao-co-dai-chong-truot',
  'https://www.coolmate.me/product/tat-the-thao-co-ngan-chong-truot',
  'https://www.coolmate.me/product/tat-the-thao-co-dai-compression-cushion',
  'https://www.coolmate.me/product/mu-luoi-trai-tech-caps',
  'https://www.coolmate.me/product/tat-the-thao-co-ngan-compression-techfit',
  'https://www.coolmate.me/product/combo-02-doi-tat-the-thao-active-co-dai',
  'https://www.coolmate.me/product/set-t-shirt-gym',
  'https://www.coolmate.me/product/set-tanktop-gym-tanktop-gym-shorts-gym-2-lop',
  'https://www.coolmate.me/product/combo-03-ao-sat-nach-the-thao-nam-dri-breathe-thoang-mat',
  'https://www.coolmate.me/product/mu-luoi-trai-nam-classic-cap',
  'https://www.coolmate.me/product/tat-the-thao-co-ngan-compression-bouncing'
]
    start_time = time.time()
    for i in list: get_detail(i)
    print("--- %s seconds ---" % (time.time() - start_time))

  #  get_detail('https://www.coolmate.me/product/set-do-the-thao-ao-khoac-quan-dai-pro-active')

