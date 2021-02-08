var http = require('http');
var fs = require('fs');
var url = require('url'); //모듈들 받아옴.

function templateHTML(title, list, body){
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      <a href="/create">Create</a>
      ${body}
    </body>
    </html>
  `
};

function templateList(filelist){
  var list = '<ul>';
  let i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;

    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    const pathname =  url.parse(_url, true).pathname;
    if(pathname === "/"){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = "Welcome"
          var data = "Hello, nomeJs hahaha :D"
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${data}`);
          response.writeHead(200);
          response.end(template);
        })
      } else{
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', (err, data) => {
            let title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${data}`);
            response.writeHead(200);
            response.end(template);
          });
        })
      }
    } else if (pathname === '/create') {
      fs.readdir('./data', function(error, filelist){
        var title = "WEB -Create"
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
        <form action="http://localhost:3000/process_create" method="post">
          <p>
              <input type="text" name="title" placeholder="Title">
          </p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
              <input type="submit" value="Create">
          </p>
        </form>
        `);
        response.writeHead(200);
        response.end(template);
      })
    } else {
      response.writeHead(404);  //200 정상, 404 찾을 수 없다.
        response.end("Not found");
    }

  

});
app.listen(3000);