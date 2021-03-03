var http = require('http');
var fs = require('fs');
var url = require('url'); //모듈들 받아옴.
var qs = require('querystring');
var template = require('./lib/template.js');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '89940775',
  database: 'opentutorials'
});
db.connect();


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    const pathname =  url.parse(_url, true).pathname;
    if(pathname === "/"){
      if(queryData.id === undefined){

        db.query('SELECT * FROM topic', function(error, topics){
          if(error){
            throw error;
          }
          var title = "Welcome To Oh's Notice Board"
          var data = "Hello world, This is my own Notice board :D"
          /*
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${data}`, `<a href="/create">Create</a>`);
          response.writeHead(200);
          response.end(template);
          */

         var list = template.list(topics);
         var html = template.HTML(title, list, `<h2>${title}</h2>${data}`, `<a href="/create">Create</a>`);
         response.writeHead(200);
         response.end(html);
        })

        
      } else{

        db.query('SELECT * FROM topic', function(error, topics){
          if(error){
            throw error;
          }
          db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=${queryData.id}`, function(error2, topic){
            if(error2){
              throw error2;
            }
            let title = topic[0].title;
            var list = template.list(topics);
            var html = template.HTML(title, list, `
            <h2>${title}</h2>${topic[0].description} <p>By ${topic[0].name}</p>
            `, `
            <a href="/create">Create</a> 
            <a href="/update?id=${queryData.id}">Update</a> 
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="Delete">
            </form>
            `);
            response.writeHead(200);
            response.end(html);
          })
        })
      }
    } else if (pathname === '/create') {

      db.query('SELECT * FROM topic', function(error, topics){
        if(error){
          throw error;
        }
        db.query('SELECT * FROM author', function(error2, authors){
          if(error2){
            throw error2;
          }

          

          var title = "WEB -Create"
          var list = template.list(topics);
          var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p>
                <input type="text" name="title" placeholder="Title">
            </p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            ${template.authorList(authors)}
            <p>
                <input type="submit" value="Create">
            </p>
          </form>
          `, `Create`);
          response.writeHead(200);
          response.end(html);
        })
      })
      
    } else if (pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){           //서버측에서 데이터를 조각조각 받는데 그 조각을 받을때마다 콜백함수를 실행하도록 세팅 되어있다.
        body = body + data;
      });
      request.on('end', function(){                 // 끝나면 실행하는 콜백함수
        var post = qs.parse(body);
        db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, post.author],
        function(error, result ){
          if(error){
            throw error;
           }
          response.writeHead(302, {Location: `/?id=${result.insertId}`});    //301은 페이지가 완전히 다른 주소로 바뀌었다는 말, 302는 이동하라는 뜻. redirection하는줄
          response.end();
        })
      });

    } else if(pathname === '/update'){
      db.query('SELECT * FROM topic', function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id] , function(error2, topic){
          if(error2){
            throw error2;
          }
          db.query(`SELECT * FROM author`, function(error3, authors){
            if(error3){
              throw error3;
            }
            let title = topic[0].title;
            var list = template.list(topics);
            var html = template.HTML(title, list, 
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p>
                    <input type="text" name="title" placeholder="Title" value="${title}">
                </p>
                <p>
                    <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                  ${template.authorList(authors, queryData.id)}
                <p>
                    <input type="submit" value="Update">
                </p>
              </form>
              `,
             `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`);
            response.writeHead(200);
            response.end(html);            
          })

          
        })


        

      })

      
    } else if(pathname === '/update_process'){
      var body = "";
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        
        db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', 
        [post.title, post.description, post.author, post.id],
        function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${post.id}`});    //301은 페이지가 완전히 다른 주소로 바뀌었다는 말, 302는 이동하라는 뜻. redirection하는줄
          response.end();
            
          });

        })

        
    } else if(pathname === '/delete_process'){
      var body = "";
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(error){
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});    //301은 페이지가 완전히 다른 주소로 바뀌었다는 말, 302는 이동하라는 뜻. redirection하는줄
          response.end();          
        })
      })
    } else  {
      response.writeHead(404);  //200 정상, 404 찾을 수 없다.
      response.end("Not found");
    }
});
app.listen(3000);


// 파일 제거 fs.unlinkSync(`data/${id}`);