const express=require("express");
const ejs=require("ejs")
const mysql=require("mysql")
 const bodyParser=require('body-parser');
const app=express()
const port=8000
 app.use(bodyParser.urlencoded({ extended: true }))
app.set("views",__dirname+"/views")
app.set("view engine","ejs")
app.engine('html',ejs.renderFile)
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myBookshop'
});
// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;
app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            res.render("list",{books:result})
         });
    });

app.get('/addBook',function(req,res){
     res.render("addBook")
})
 app.post('/bookadded', function (req,res) {
          // saving data in database
          let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
          // execute sql query
         
          let newrecord = [req.body.name, req.body.price];
          db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
              return console.error(err.message);
            }
            else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price);
            });
      });
app.get('/bargainbooks',function(req, res) {
        let sqlquery = "SELECT * FROM books where price < 20"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            res.render("bargain",{books:result})
        })
    });
 app.get('/search',function(req,res){
res.render('search')
})
app.post('/search-result',function(req,res){
     let sqlquery = "SELECT * FROM books where name LIKE '%"+req.body.name+"%'"; // query database to get all the books
     console.log(req.body)
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            res.render("search-result",{books:result})
        })
})

app.get('/',function(req,res){
res.render('index')
})
app.listen(port,()=>{
    console.log("app runing on port:"+port)
})