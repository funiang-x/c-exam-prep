// C语言学习系统 本地服务器（电脑+手机同一Wi-Fi访问）
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  fs.readFile(path.join(__dirname, p), (e, d) => {
    if (e) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(d);
  });
}).listen(8736, () => {
  console.log('========================================');
  console.log('  C语言学习系统已启动（保持此窗口开着）');
  console.log('  电脑访问:  http://localhost:8736');
  const nets = os.networkInterfaces();
  Object.keys(nets).forEach(k => {
    nets[k].forEach(n => {
      if (n.family === 'IPv4' && !n.internal)
        console.log('  手机(同一Wi-Fi)访问:  http://' + n.address + ':8736');
    });
  });
  console.log('  关闭此窗口 = 停止服务');
  console.log('========================================');
});
