const express = require('express');
const app = express();
var mysql = require('mysql');
const port = process.env.PORT || 3001;
var MongoClient = require('mongodb').MongoClient;

var mysqlResponse = "";
var postgresResponse = "";
var mongoResponse = "";

//mongo DB connection
// var url = "mongodb://54.169.120.205:27017/AmazonEc2DevelopmentDb";

// MongoClient.connect(url,{useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
//   if (err) throw console.log(err);
//   console.log("Mongo instance connected!")
//   mongoResponse = "Mongo Ec2 instance connected"
//   db.close();
// });


var url = "mongodb://dev1:12345@54.169.120.205:27017/";
MongoClient.connect(url,{useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
  if (err) { console.log("Connection string invalid"); mongoResponse = "Connection string invalid"; return ;}
  var dbo = db.db("AmazonEc2DevelopmentDb");
  var myobj = { name: "AmazonDB", address: "Highway Road London" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err){
     mongoResponse = {
       "connection" : "db connected",
       "mongoResponse" : err
     }
     return;
    }
    console.log("New record added!")
    mongoResponse = {
      "connection" : "db connected",
      "mongoResponse" : res
    }
    db.close();
  });
});


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
    console.log("One mysql row updated");
    mysqlResponse = result;
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
  postgresResponse = res;
  client.end()
})


app.get('/', (req, res) => {
  res.json({
    "Server running :" : "On port:" + port,   
    "Database" : "AWS rds",
    "MySQL" : mysqlResponse,
    "Postgres" : postgresResponse,
    "MongoDb" : mongoResponse 
  });
})



app.listen(port, () => {
    console.log('Server is up on : '+ port)
})