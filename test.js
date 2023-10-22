// var connection = mysql.createPool({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     database: "ecommerce",
//     password: "",
//   });

// let sql = ''
// let values = ''

import removeVietnameseTones from "./removeVN.js"

let s = "Áo các loại"

console.log(removeVietnameseTones(s))
