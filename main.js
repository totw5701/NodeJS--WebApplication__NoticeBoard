var http = require('http');
var fs = require('fs');
var url = require('url'); //모듈들 받아옴.
var qs = require('querystring');


function templateHTML(title, list, body, control){
  return `
    <!doctype html>
    <html>
    <head>
      <title>Notice borad - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">Notice board</a></h1>
      ${list}
      ${control}
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
          var title = "Welcome To Oh's Notice board"
          var data = "Hello world, This is my own Notice board :D"
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${data}`, `<a href="/create">Create</a>`);
          response.writeHead(200);
          response.end(template);
        })
      } else{
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', (err, data) => {
            let title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${data}`, `
            <a href="/create">Create</a> 
            <a href="/update?id=${title}">Update</a> 
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="Delete">
            </form>
            `);
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
        <form action="/create_process" method="post">
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
        `, `Create`);
        response.writeHead(200);
        response.end(template);
      })
    } else if (pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){           //서버측에서 데이터를 조각조각 받는데 그 조각을 받을때마다 콜백함수를 실행하도록 세팅 되어있다.
        body = body + data;
      });
      request.on('end', function(){                 // 끝나면 실행하는 콜백함수
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, `utf8`, function(err){       // 파일 작성이 끝나면 콜백함수를 실행한다.
          response.writeHead(302, {Location: `/?id=${title}`});    //301은 페이지가 완전히 다른 주소로 바뀌었다는 말, 302는 이동하라는 뜻. redirection하는줄
          response.end();
        })
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, data) => {
          let title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, 
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p>
                  <input type="text" name="title" placeholder="Title" value="${title}">
              </p>
              <p>
                  <textarea name="description" placeholder="description">${data}</textarea>
              </p>
              <p>
                  <input type="submit" value="Update">
              </p>
            </form>
            `,
           `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      })
    } else if(pathname === '/update_process'){
      var body = "";
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, `utf8`, function(err){       // 파일 작성이 끝나면 콜백함수를 실행한다.
            response.writeHead(302, {Location: `/?id=${title}`});    //301은 페이지가 완전히 다른 주소로 바뀌었다는 말, 302는 이동하라는 뜻. redirection하는줄
            response.end();
          })
        });
      });
    } else if(pathname === '/delete_process'){
      var body = "";
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(error){
        var post = qs.parse(body);
        var id = post.id;
        fs.unlinkSync(`data/${id}`);
        response.writeHead(302, {Location: `/`});    //301은 페이지가 완전히 다른 주소로 바뀌었다는 말, 302는 이동하라는 뜻. redirection하는줄
        response.end();
      })
    } else  {
      response.writeHead(404);  //200 정상, 404 찾을 수 없다.
      response.end("Not found");
    }

  

});
app.listen(3000);


// 파일 제거 fs.unlinkSync(`data/${id}`);