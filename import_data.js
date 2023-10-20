import { error } from "console";
import * as fs from "fs";
import mysql from "mysql2";

var connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "ecommerce",
  password: "",
});

let rawdata = fs.readFileSync("./mac_hang_ngay/mac_hang_ngay.json");
let datas = JSON.parse(rawdata);

let sql = "";
let values = "";

console.log("Products count: ", datas.length);

datas.forEach((data) => {
  console.log("Colors count of each product: ", data.color_object.length);

  /*
    ADD DATA TO product TABLE
+-------------+---------------+------+-----+---------+----------------+
| Field       | Type          | Null | Key | Default | Extra          |
+-------------+---------------+------+-----+---------+----------------+
| id          | int           | NO   | PRI | NULL    | auto_increment |
| category_id | int           | YES  | MUL | NULL    |                |
| name        | varchar(500)  | YES  |     | NULL    |                |
| description | varchar(4000) | YES  |     | NULL    |                |
+-------------+---------------+------+-----+---------+----------------+

  */

  sql = "insert into product (name) values ?;";
  values = [[data.name]];
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
| color        | varchar(10)   | YES  |     | NULL    |                |
| color_image  | varchar(1000) | YES  |     | NULL    |                |
| qty_in_stock | int           | YES  |     | NULL    |                |
| price        | varchar(15)   | YES  |     | NULL    |                |
+--------------+---------------+------+-----+---------+----------------+

    */

    data.color_object.forEach((color) => {
      sql =
        "insert into product_item (product_id, size, color, color_image, price) values ?";
      values = [[product_id, "M", color.name, color.background, data.price]];

      connection.query(sql, [values], (err, result) => {
        if (err) throw err;

        const id = result.insertId;

        color.img.forEach((element) => {
          /*
          ADD DATA TO product_image TABLE
+-----------------+--------------+------+-----+---------+----------------+
| Field           | Type         | Null | Key | Default | Extra          |
+-----------------+--------------+------+-----+---------+----------------+
| id              | int          | NO   | PRI | NULL    | auto_increment |
| product_item_id | int          | YES  | MUL | NULL    |                |
| url             | varchar(100) | YES  |     | NULL    |                |
+-----------------+--------------+------+-----+---------+----------------+

        */
          sql = "insert into product_image (product_item_id, url) values ?";
          values = [[id, element.src]];
          connection.query(sql, [values], (err, result) => {
            if (err) throw err;
          });
        });
      });
    });
  });
});
