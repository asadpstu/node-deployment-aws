const express = require('express');
const app = express();
var mysql = require('mysql');

app.get('/', (req, res) => {
    res.send('Hello world from a Node.js app!')
})

//Mysql connection testing
var con = mysql.createConnection({
  host: "sample-node-app.cchkqma9cnjs.ap-southeast-1.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "samplenodeapp"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Databse connected!");
  
//   var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table customer table created!");
//   });


  var sqlInsert = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  con.query(sqlInsert, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});


//postgres connection pooling'
const { Pool, Client } = require('pg')
const connectionString = 'postgresql://postgres:password@postgresinstance.cchkqma9cnjs.ap-southeast-1.rds.amazonaws.com:5432/samplenodeapppostgres'


/*
|| For connection pooling ||
const pool = new Pool({
  connectionString: connectionString,
})
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})*/
const client = new Client({
  connectionString: connectionString,
})
client.connect()
client.query('SELECT NOW()', (err, res) => {
  if(err) console.log("Postgres connection failed!");
  else console.log("Postgress connection successfull");
  client.end()
})



app.listen(3000, () => {
    console.log('Server is up on 3000')
})