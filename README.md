## coolmate-data
**For school projects**

- Crawl data from [coolmate website](https://www.coolmate.me/) 
- Import data to mysql

### All the tables for the data 

**product table**

`+-------------+---------------+------+-----+---------+----------------+
| Field       | Type          | Null | Key | Default | Extra          |
+-------------+---------------+------+-----+---------+----------------+
| id          | int           | NO   | PRI | NULL    | auto_increment |
| category_id | int           | YES  | MUL | NULL    |                |
| name        | varchar(500)  | YES  |     | NULL    |                |
| description | varchar(4000) | YES  |     | NULL    |                |
| img         | varchar(200)  | YES  |     | NULL    |                |
| hover       | varchar(200)  | YES  |     | NULL    |                |
| price_int   | int           | YES  |     | NULL    |                |
| price_str   | varchar(10)   | YES  |     | NULL    |                |
+-------------+---------------+------+-----+---------+----------------+
8 rows`

**product_category table**

`+--------------------+--------------+------+-----+---------+----------------+
| Field              | Type         | Null | Key | Default | Extra          |
+--------------------+--------------+------+-----+---------+----------------+
| id                 | int          | NO   | PRI | NULL    | auto_increment |
| parent_category_id | int          | YES  |     | NULL    |                |
| category_name      | varchar(200) | YES  |     | NULL    |                |
+--------------------+--------------+------+-----+---------+----------------+
3 rows`

**product_item table**
`
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
6 rows`

**product_image table**

`+-----------------+--------------+------+-----+---------+----------------+
| Field           | Type         | Null | Key | Default | Extra          |
+-----------------+--------------+------+-----+---------+----------------+
| id              | int          | NO   | PRI | NULL    | auto_increment |
| product_item_id | int          | YES  | MUL | NULL    |                |
| url             | varchar(200) | YES  |     | NULL    |                |
+-----------------+--------------+------+-----+---------+----------------+
3 rows`