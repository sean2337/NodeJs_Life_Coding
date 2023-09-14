var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var title = queryData.id;
  var pathName = url.parse(_url, true).pathname;

  var description = '';
  if (pathName === '/') {
    //id값이 없다면 초기화면
    if (title === undefined) {
      title = 'WelCome';
      description = 'Welcome hello Node.js';
      sendPage();
    } else {
      // 그게 아니라면 파일 읽어오기
      //파일 읽어오는 부분
      fs.readFile(`data/${title}`, 'utf8', (err, data) => {
        description = data;
        console.log('데이터: ', description);
        sendPage();
      });
    }

    const sendPage = () => {
      var template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
       
        </p><p style="margin-top:45px;">${description}</p>
      </body>
      </html>
      `;

      response.writeHead(200);
      response.end(template);
    };
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});

//포트번호 3000번
app.listen(3000);
