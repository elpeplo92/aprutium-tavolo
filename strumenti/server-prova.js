// Server locale per guardare il sito in prova: node Sito/strumenti/server-prova.js [cartella] [porta] → http://localhost:<porta>/index.html?prova=1&ruolo=master
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const T={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.otf':'font/otf','.ttf':'font/ttf','.woff':'font/woff','.woff2':'font/woff2','.mp3':'audio/mpeg'};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';const f=path.join(ROOT,p);if(!f.startsWith(ROOT)){r.writeHead(403);return r.end();}
fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end('no');}r.writeHead(200,{'Content-Type':T[path.extname(f).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});r.end(d);});}).listen(Number(process.argv[3])||Number(process.env.PORT)||8766,function(){console.log('pronto su '+this.address().port)});
