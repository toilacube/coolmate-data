import mysql from "mysql2";
import * as fs from "fs";
const connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "ecommerce3",
  password: "bo777909",
});

function getRandomNumber() {
  const min = 500; // Smallest number to start the range (500000 divided by 50)
  const max = 2000; // Largest number to end the range (2000000 divided by 50)

  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  return randomNumber * 1000;
}

// Array to store SQL insert queries for shop_order and order_line
const insertQueries = [];

// Generate 500 INSERT statements for shop_order and order_line
const startDate = new Date("2023-01-01");
const endDate = new Date("2023-12-31");

for (let i = 1; i <= 1000; i++) {
  let orderDate = new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime())
  );
  const formattedOrderDate = orderDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const total = getRandomNumber();

  // const shopOrderQuery = `INSERT INTO shop_order
  //     (user_id, order_date, payment_method, shipping_address, name, phone, email, shipping_method, order_total, order_status)
  //     VALUES
  //     ('${i % 100}', '${formattedOrderDate}', ${
  //   i % 3
  // }, 'Address ${i}', 'User ${i}', '1234567890', 'user${i}@gmail.com', '1', ${total}, 1)`;

  //insertQueries.push(shopOrderQuery);

  // const orderLineQuery = `INSERT INTO order_line
  //     (product_item_id, order_id, qty, price)
  //     VALUES
  //     (${i}, LAST_INSERT_ID(), 2, ${total / 2})`;

  const shopOrderQuery = `INSERT INTO shop_order 
      (id, user_id, order_date, payment_method, shipping_address, name, phone, email, shipping_method, order_total, order_status) 
      VALUES 
      (${i},'${i % 100}', '${formattedOrderDate}', ${
    i % 3
  }, 'Address ${i}', 'User ${i}', '1234567890', 'user${i}@gmail.com', '1', ${total}, 1)`;

  const orderLineQuery = `INSERT INTO order_line 
  (product_item_id, order_id, qty, price) 
  VALUES 
  (${i}, ${i}, 2, ${total / 2})`;

  // write output to a txt file
  fs.appendFileSync("insert_queries.txt", shopOrderQuery + "\n");
  fs.appendFileSync("insert_queries.txt", orderLineQuery + "\n");

  //insertQueries.push(orderLineQuery);
}

// Execute the insert queries
insertQueries.forEach((query) => {
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error:", error.message);
    } else {
      console.log("Insert successful");
    }
  });
});
