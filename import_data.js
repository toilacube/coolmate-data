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

console.log(datas.length);

datas.forEach((data) => {
  console.log(data.color_object.length)

  data.color_object.forEach((color) => {
    console.log(color.name)
    
    let sql =
      "insert into product_item (size, color, color_image, price) values ?";
    let values = [["M", color.name, color.background, data.price]];

    connection.query(sql, [values], (err, result) => {
      if (err) throw err;

      const id = result.insertId;

      color.img.forEach(element => {
        sql = 'insert into product_image (product_item_id, url) values ?'
        values = [[id, element.src]]
        connection.query(sql, [values], (err, result) => {
          if (err) throw err;
        })
      });

    });
  });
});

