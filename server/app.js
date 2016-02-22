"use strict";

var http = require('http');
var url = require('url');

var server = http.createServer();

let mysql = require('mysql');
let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  database: 'cars'
});

db.connect();


function selectAll(res) {
  db.query('SELECT * FROM cars.cars', function (err, rows, fields) {
    if (err) throw err;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(rows));

    res.end()
  });
}

function saveCar(car) {
  let sql = `UPDATE cars.cars SET cars.capacity = '${car.capacity}'
  WHERE cars.id = ${car.id};`;
  db.query(sql, function (err) {
    if (err) throw err;
    console.log('car saved');
  });
}

server.on('request', function (req, res) {
  var urlParsed = url.parse(req.url, true);

  /*console.log(req.url);

  console.log('method: ' + req.method);
  console.log('urlParsed: ' );
  console.log(urlParsed);
  console.log(urlParsed.query);*/


  if (req.method == 'GET' && urlParsed.pathname == '/cars') {
    console.log('get all cars');
    selectAll(res);

  } else if (req.method === 'POST') {

    if (urlParsed.pathname && urlParsed.pathname === '/car') {
      saveCar({
        id: urlParsed.query.id,
        capacity: urlParsed.query.capacity
      });
      //res.writeHead(200, { 'Content-Type': 'application/json' });
      res.writeHead(200);
      res.write('OK');
      //res.json({foo: 'bar'});
      res.end()
    } else {
      res.end('nothing')
    }
  } else {
    res.end('nothing')
  }
});

server.listen(3000);