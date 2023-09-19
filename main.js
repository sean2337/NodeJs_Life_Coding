var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var testFolder = './data/';
function sendPage(response, title, description) {
  fs.readdir(testFolder, (err, fileList) => {
    if (err) {
      console.error(err);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
      return;
    }
    var listItems = fileList.map(
      (element) => `<li><a href="/?id=${element}">${element}</a></li>`
    );
    var template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          ${listItems.join('')}
        </ol>
        <a href="/create">create</a>
        <a href="/update?id=${title}">update</a>
        <h2>${title}</h2>
        <p>${description}</p>
      </body>
      </html>
    `;
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(template);
  });
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var title = queryData.id;
  var pathName = url.parse(_url, true).pathname;

  if (pathName === '/') {
    // id값이 없다면 초기화면
    if (!title) {
      title = 'Welcome';
      var description = 'Welcome hello Node.js';
      sendPage(response, title, description);
    } else {
      // 그게 아니라면 파일 읽어오기
      // 파일 읽어오는 부분
      fs.readFile(`data/${title}`, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
          return;
        }
        sendPage(response, title, data);
      });
    }
  } else if (pathName === '/create') {
    title = 'create';
    description = 'decription';
    fs.readdir(testFolder, (err, fileList) => {
      var listItems = fileList.map(
        (element) => `<li><a href="/?id=${element}">${element}</a></li>`
      );
      var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB2 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ol>
            ${listItems.join('')}
          </ol>
          <a href="/create">create</a>
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
          </form>
        </body>
        </html>
      `;
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(template);
    });
  } else if (pathName === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;

      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end('success');
      });
    });
  } else if (pathName === '/update') {
    //////
    fs.readdir(testFolder, (err, fileList) => {
      fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
        var listItems = fileList.map(
          (element) => `<li><a href="/?id=${element}">${element}</a></li>`
        );
        var template = `
            <h1><a href="/">Update</a></h1>
            <form action="/update_process" method="post">
            <p><input type="text" name="id" hidden value="${title}"></p>
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p><textarea name="description" placeholder="description">${description}</textarea></p>
            <p><input type="submit"></p>
          </form>
        `;
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(template);
      });
    });
    ///////
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not Found');
  }
});

// 포트번호 3000번
app.listen(3000);
