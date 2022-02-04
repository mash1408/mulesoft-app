var mysql = require('mysql');
const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const { JSON } = require('mysql/lib/protocol/constants/types');
const { json } = require('body-parser');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mulesoft"
});

app.use(express.json()); 

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
})


function insertData(req,res){
    console.log(req.body);
    var sql
    req.body.forEach(movie => {
       sql="INSERT INTO movies (name,actor,actress,director,year_of_release) value('" +movie.name+ "','" +movie.actor+ "','" +movie.actress+ "','" +movie.director+ "','" +movie.year_of_release+"')"
       con.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("record inserted");  
        }); 
    });
 
    res.status(200).send('data inserted')
    
   
}
function displayData(req,res){
    var sql='SELECT * FROM movies';
    con.query(sql, function (err, result) {  
        if (err) throw err;  
            return res.status(200).send(result)
        }); 
}
function displayDataOfActor(req,res){
    var sql='SELECT * FROM movies where actor="'+req.params.actorName+'"';
    con.query(sql, function (err, result) {  
        if (err) throw err;  
            return res.status(200).send(result)
        }); 
}
app.get('/',function(req,res){

    con.query("SELECT COUNT(DISTINCT table_name) AS TotalNumberOfTables FROM information_schema.columns WHERE table_schema = 'mulesoft'", function (err, result, fields) {
        if (err) throw err;
        var string=JSON.stringify(result);
        var message=JSON.parse(string)[0].TotalNumberOfTables
        if(!message){
            var sql = "CREATE TABLE movies (Movie_Id int  auto_increment primary key,name VARCHAR(255), actor VARCHAR(255), actress VARCHAR(255), director VARCHAR(255), year_of_release date)";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Table created");
            });
        }
        else
            res.status(405).send('Database is not empty\n Make some operations')
      });

})

app.post('/insert',insertData)
app.get('/movies',displayData)
app.get('/movies/:actorName',displayDataOfActor)
app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
  })
