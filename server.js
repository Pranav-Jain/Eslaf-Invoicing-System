var http = require('http');
var fs = require('fs');
var url = require('url');
var excel2Json = require('node-excel-to-json');
var express = require('express');
var formidable = require('formidable');
var mysql = require('mysql');
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  // password: "root",
  database: "eslaf2"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE if not exists test", function (err, result) {
    if (err) throw err;
    //console.log("Database created");
    var sql1 = "CREATE TABLE if not exists `J S FABTEX PVT. LTD` (`GST INVOICE` INT, `RCM INVOICE` INT, `DELIVERY CHALLAN` INT, `DEBIT NOTE` INT, `CREDIT NOTE` INT)";
    var sql2 = "CREATE TABLE if not exists `J S TEXTILES` (`GST INVOICE` INT, `RCM INVOICE` INT, `DELIVERY CHALLAN` INT, `DEBIT NOTE` INT, `CREDIT NOTE` INT)";
     var sql3 = "CREATE TABLE if not exists `GARJAN INTERNATIONAL` (`GST INVOICE` INT, `RCM INVOICE` INT, `DELIVERY CHALLAN` INT, `DEBIT NOTE` INT, `CREDIT NOTE` INT)";
     var sql4 = "CREATE TABLE if not exists `LAMODE INTIMATES` (`GST INVOICE` INT, `RCM INVOICE` INT, `DELIVERY CHALLAN` INT, `DEBIT NOTE` INT, `CREDIT NOTE` INT)";
     var sql5 = "Create TABLE if not exists `data` (`date` varchar(255), `invoice` varchar(255), `company` varchar(255), `customer` varchar(500), `url` varchar(2082), `pending` varchar(2))";        // 
  con.query(sql1, function (err, result) {
    if (err) throw err;
    //console.log("Table jstextiles created");
 });
  con.query(sql2, function (err, result) {
    if (err) throw err;
    //console.log("Table jsfabtex created");
 });
  con.query(sql3, function (err, result) {
    if (err) throw err;
    //console.log("Table lamode created");
 });
  con.query(sql4, function (err, result) {
    if (err) throw err;
    //console.log("Table garjan created");
 });
  con.query(sql5, function (err, result) {
    if (err) throw err;
    //console.log("Table data created");
 });
  });
});

app.post('/geturl', function(req, res){
   var data = req.body;
   //console.log(data);
   var sql = "select * from DATA where invoice='"+data['invoice']+"' and company='"+data['company']+"';";
   con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if(result[0]==null)
      res.status(200).send("no");
      // console.log("no");
   else{
      //console.log(result);
      res.status(200).send(result);
   }
  });
});

app.post('/geturltrans', function(req, res){
   var data = req.body;
   //console.log(data);
   if(data['invoice']==null)
   var sql = "select * from DATA where company='"+data['company']+"' and customer='"+data['customer']+"' and pending=1";
  else
    var sql = "select * from DATA where company='"+data['company']+"' and customer='"+data['customer']+"' and pending=1 and invoice='"+data['invoice']+"' and date='"+data['date']+"';";
   con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if(result[0]==null)
      res.status(200).send("no");
  	  // console.log("no");
   else{
      //console.log(result);
      res.status(200).send(result);
   }
  });
});

app.post('/puturl', function(req, res){
   var data = req.body;
   var sql = "INSERT into data (date, invoice, company, customer, url, pending) values('"+data['date']+"','"+data['invoice']+"','"+data['company']+"','"+data['customer']+"','"+String(data['url'])+"','"+data['pending']+"');";
   con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.post('/updateurl', function(req, res){
   var data = req.body;
   var sql = "update data set url='"+data['url']+"', pending='"+data['pending']+"', customer='"+data['customer']+"' where date='"+data['date']+"' and invoice='"+data['invoice']+"' and company='"+data['company']+"'";
   con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.post('/updateinvoice', function(req, res){
   var data = req.body;
   var sql = "update `"+data['company']+"` set `"+data['invoice']+"`= `"+data['invoice']+"` + 1";
   con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.post('/getcustomer', function(req, res){
   var data = req.body;
   //console.log(data);
   var sql = "select * from DATA where company='"+data['company']+"' and invoice='"+data['invoice']+"';";
   con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if(result[0]==null)
      res.status(200).send("no");
  	  // console.log("no");
   else{
      //console.log(result);
      res.status(200).send(result);
   }
  });
});


app.post('/getinvoice', function(req, res){
   var data = req.body;
   //console.log(data);
   var sql = "SELECT `"+data['invoice']+"` from `"+data['company']+"`";
   con.query(sql, function (err, result, fields) {
    if (err) throw err;
    //console.log(result[0][data['invoice']]);
    res.status(200).send(String(result[0][data['invoice']]));
  });
});


app.post('/upload', function(req, res){
   var form = new formidable.IncomingForm();
   form.keepExtensions = true;     //keep file extension
    form.parse(req, function (err, fields, files) {
        console.log("form.bytesReceived");
        console.log("file size: "+JSON.stringify(files.fileUploaded.size));
        console.log("file path: "+JSON.stringify(files.fileUploaded.path));
        console.log("file name: "+JSON.stringify(files.fileUploaded.name));
        console.log("file type: "+JSON.stringify(files.fileUploaded.type));
        console.log("astModifiedDate: "+JSON.stringify(files.fileUploaded.lastModifiedDate));
      fs.rename(files.fileUploaded.path, './'+files.fileUploaded.name, function(err) {
        if (err) throw err;
        res.redirect(301, '/home');
      });
 });
});

app.get('/master', function(request, response){
   XLSX = require('xlsx');
   var workbook = XLSX.readFile('GST.xlsx');
   var result = {};
   workbook.SheetNames.forEach(function(sheetName) {
   if(sheetName.toString().trim() === "MASTER"){
   var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
   if(roa.length > 0){
   result[sheetName] = roa;
   }}
    });
    response.send(result);
});

app.get('/customer', function(request, response){
   XLSX = require('xlsx');
   var workbook = XLSX.readFile('GST.xlsx');
   var result = {};
   workbook.SheetNames.forEach(function(sheetName) {
   if(sheetName.toString().trim() === "CUSTOMER MASTER"){
   var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
   if(roa.length > 0){
   result[sheetName] = roa;
   }}
    }); 
    response.send(result);
  
});

app.get('/home', function(request, response){
   fs.readFile('home.html', function (err, data) {
      if (err) {
         //console.log(err);
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {  
         response.writeHead(200, {'Content-Type': 'text/html'});  

         response.write(data.toString());    
      }
      response.end();
   });   
});

app.get('/', function (request, response) {  
   
   fs.readFile('index.html', function (err, data) {
      if (err) {
         //console.log(err);
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {	
        
         response.writeHead(200, {'Content-Type': 'text/html'});	
         response.write(data.toString());		
      }
      response.end();
   });   
});

app.get('/edit/trans', function (request, response) {  
   
   fs.readFile('edit_trans.html', function (err, data) {
      if (err) {
         //console.log(err);
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else { 
        
         response.writeHead(200, {'Content-Type': 'text/html'});  
         response.write(data.toString());   
      }
      response.end();
   });   
});

app.get('/update', function(request, response){
   fs.readFile('update.html', function (err, data) {
      if (err) {
         //console.log(err);
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {  
        
         response.writeHead(200, {'Content-Type': 'text/html'});  
         response.write(data.toString());    
      }
      response.end();
   });   
});

app.get('/transport', function(request, response){
   fs.readFile('transport.html', function (err, data) {
      if (err) {
         //console.log(err);
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {  
        
         response.writeHead(200, {'Content-Type': 'text/html'});  
         response.write(data.toString());    
      }
      response.end();
   });   
});

app.get('/view', function(request, response){
   fs.readFile('view.html', function (err, data) {
      if (err) {
         //console.log(err);
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {  
        
         response.writeHead(200, {'Content-Type': 'text/html'});  
         response.write(data.toString());    
      }
      response.end();
   });   
});

app.get('/reports', function(request, response){
   fs.readFile('reports.html', function (err, data) {
      if (err) {
         //console.log(err);
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {  
        
         response.writeHead(200, {'Content-Type': 'text/html'});  
         response.write(data.toString());    
      }
      response.end();
   });   
});

app.get('/edit', function(request, response){
   fs.readFile('editing.html', function (err, data) {
      if (err) {
         //console.log(err);
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {  
        
         response.writeHead(200, {'Content-Type': 'text/html'});  
         response.write(data.toString());    
      }
      response.end();
   });   
});

app.get('/fulledit', function(request, response){
   fs.readFile('fulledit.html', function (err, data) {
      if (err) {
         //console.log(err);
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {  
        
         response.writeHead(200, {'Content-Type': 'text/html'});  
         response.write(data.toString());    
      }
      response.end();
   });   
});

app.listen(1998, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 8081);
});
