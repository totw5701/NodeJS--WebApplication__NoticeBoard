var http = require('http');
var url = require('url'); //모듈들 받아옴.
var topic = require('./lib/topic.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    const pathname =  url.parse(_url, true).pathname;
    if(pathname === "/"){
      if(queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.page(request, response);
      }
    } else if (pathname === '/create') {
      topic.create(request, response);
    } else if (pathname === '/create_process'){
      topic.create_process(request, response);
    } else if(pathname === '/update'){
      topic.update(request,response);
    } else if(pathname === '/update_process'){
      topic.update_process(request, response);        
    } else if(pathname === '/delete_process'){
      topic.delete_process(request,response);
    } else  {
      response.writeHead(404);  //200 정상, 404 찾을 수 없다.
      response.end("Not found");
    }
});
app.listen(3000);


// 파일 제거 fs.unlinkSync(`data/${id}`);