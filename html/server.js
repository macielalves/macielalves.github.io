const http = require('http');
const fs = require('fs');
const path = require('path');

let porta = 3000;
let servidor = '192.168.0.114';

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'index.html');

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Erro ao carregar o arquivo HTML');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

server.listen(porta, servidor, () => {
    console.log('Servidor rodando em http://'+servidor+':'+porta);
});

