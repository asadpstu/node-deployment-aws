const express = require('express');
const app = express();
var mysql = require('mysql');
const port = process.env.PORT || 3001;
var MongoClient = require('mongodb').MongoClient;

var mysqlResponse = "";
var postgresResponse = "";
var mongoResponse = "";

//mongo DB connection  record creation || Master || Primary db

var url = "mongodb://root:password@52.77.211.189:27017/";
MongoClient.connect(url,{useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
  if (err) { console.log("Connection string invalid",err); mongoResponse = "Connection string invalid"; return ;}
  var dbo = db.db("AmazonEc2DevelopmentDb");
  var myobj = { value1: Math.random(), value2: Math.random() };
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


app.get('/',(req, res) => {
  res.json({
    "Server running :" : "On port:" + port,   
    "Database" : "AWS rds",
    "MySQL" : mysqlResponse,
    "Postgres" : postgresResponse,
    "MongoDb" : mongoResponse
  });
})



//Mongo db record pulling from secondary node || Slave || Secondary db
app.get('/mongo/secondary',(req, res) => {
  var url_slave = "mongodb://root:password@13.229.112.209:27017/?readPreference=secondaryPreferred";
  MongoClient.connect(url_slave,{useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("AmazonEc2DevelopmentDb");
    //Find all documents in the customers collection:
    dbo.collection("customers").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.json({
        "result" : result
      });
      db.close();
    });
  }); 
})



app.listen(port, () => {
    console.log('Server is up on : '+ port)
})