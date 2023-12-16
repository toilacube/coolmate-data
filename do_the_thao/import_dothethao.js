import { error } from "console";
import * as fs from "fs";
import mysql from "mysql2";

var connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "ecommerce3",
  password: "bo777909",
});

export default function mac_hang_ngay() {
  let rawdata = fs.readFileSync("./do_the_thao/data_do_the_thao.json");
  let datas = JSON.parse(rawdata);

  let sql = "";
  let values = "";

  console.log("Products count: ", datas.length);

  datas.forEach((data) => {
    /*
    classify the products' category
+--------------------+--------------+------+-----+---------+----------------+
| Field              | Type         | Null | Key | Default | Extra          |
+--------------------+--------------+------+-----+---------+----------------+
| id                 | int          | NO   | PRI | NULL    | auto_increment |
| parent_category_id | int          | YES  |     | NULL    |                |
| category_name      | varchar(200) | YES  |     | NULL    |                |
| category_slug      | varchar(200) | YES  |     | NULL    |                |
+--------------------+--------------+------+-----+---------+----------------+
4 rows in set (0,00 sec)

    
  */

    let category_slug = "phu-kien-the-thao";
    let category_id = 0;

    const checkCategory = (str) => {
      if (data.name.toLowerCase().includes(str)) return true;
    };

    const listAo = ["áo", "shirt", "sơ mi", "polo", "tanktop"];
    const listQuan = ["quần", "jogger", "short"];
    const listChayBo = ["chạy bộ"];
    const listCombo = ["combo", "set"];
    const listDoThuDong = ["thể  thao"];
    const listGym = ["gym"];

    listAo.forEach((element) => {
      if (checkCategory(element)) category_slug = "ao-the-thao";
    });

    listQuan.forEach((element) => {
      if (checkCategory(element)) category_slug = "quan-the-thao";
    });

    listChayBo.forEach((element) => {
      if (checkCategory(element)) category_slug = "chay-bo";
    });

    listCombo.forEach((element) => {
      if (checkCategory(element)) category_slug = "combo";
    });

    listDoThuDong.forEach((element) => {
      if (checkCategory(element)) category_slug = "do-thu-dong";
    });

    listGym.forEach((element) => {
      if (checkCategory(element)) category_slug = "gym";
    });

    sql = "select id from product_category where category_slug = ?";
    values = [[category_slug]];

    connection.query(sql, [values], (err, results) => {
      if (err) throw err;
      category_id = results[0].id;

      /*
    ADD DATA TO product TABLE
+-------------+---------------+------+-----+---------+----------------+
| Field       | Type          | Null | Key | Default | Extra          |
+-------------+---------------+------+-----+---------+----------------+
| id          | int           | NO   | PRI | NULL    | auto_increment |
| category_id | int           | YES  | MUL | NULL    |                |
| name        | varchar(100)  | YES  |     | NULL    |                |
| description | varchar(1000) | YES  |     | NULL    |                |
| price_int   | int           | YES  |     | NULL    |                |
| price_str   | varchar(10)   | YES  |     | NULL    |                |
+-------------+---------------+------+-----+---------+----------------+
6 rows in set (0,00 sec)


  */

      sql =
        "insert into product (category_id, name,price_str, price_int, description) values ?;";
      values = [
        [
          category_id,
          data.name,
          data.price_str,
          data.price_int,
          data.description,
        ],
      ];
      let product_id = -1;
      connection.query(sql, [values], (error, results) => {
        if (error) throw error;
        product_id = results.insertId;

        /*
        ADD DATA TO product_item TABLE
+--------------+---------------+------+-----+---------+----------------+
| Field        | Type          | Null | Key | Default | Extra          |
+--------------+---------------+------+-----+---------+----------------+
| id           | int           | NO   | PRI | NULL    | auto_increment |
| product_id   | int           | YES  | MUL | NULL    |                |
| size         | varchar(10)   | YES  |     | NULL    |                |
| color        | varchar(50)   | YES  |     | NULL    |                |
| color_image  | varchar(1000) | YES  |     | NULL    |                |
| qty_in_stock | int           | YES  |     | NULL    |                |
+--------------+---------------+------+-----+---------+----------------+
6 rows in set (0,00 sec)

    */

        data.color_object.forEach((color) => {
          const listSize = ["M", "L", "XL"];

          listSize.forEach((size) => {
            sql =
              "insert into product_item (product_id, size, color, color_image, qty_in_stock) values ?";
            values = [
              [
                product_id,
                size,
                color.name,
                color.background,
                Math.floor(Math.random() * (50 - 10 + 1)) + 10,
              ],
            ];

            connection.query(sql, [values], (err, result) => {
              if (err) throw err;

              const id = result.insertId;

              color.img.forEach((element) => {
                /*
          ADD DATA TO product_item_image TABLE
+-----------------+--------------+------+-----+---------+----------------+
| Field           | Type         | Null | Key | Default | Extra          |
+-----------------+--------------+------+-----+---------+----------------+
| id              | int          | NO   | PRI | NULL    | auto_increment |
| product_item_id | int          | YES  | MUL | NULL    |                |
| url             | varchar(200) | YES  |     | NULL    |                |
+-----------------+--------------+------+-----+---------+----------------+
3 rows in set (0,00 sec)

        */
                sql =
                  "insert into product_item_image (product_item_id, url) values ?";
                values = [[id, element.src]];
                connection.query(sql, [values], (err, result) => {
                  if (err) throw err;
                });
              });
            });
          });
        });
      });
    });
  });
  console.log("Query complete");
}

mac_hang_ngay()