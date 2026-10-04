// 打包手机版：node build.js → 生成 学习系统手机版.html（单文件，含全部题库/讲义/功能）
const fs = require('fs'), path = require('path');
const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
let html = read('学习系统.html');
const css = read('style.css');
const mobileCss = `
/* ===== 手机版补充样式 ===== */
body { -webkit-tap-highlight-color: transparent; }
nav { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 2px; }
nav button { flex: none; }
.opt { padding-left: 48px; font-size: 14px; }
.qtext { font-size: 14.5px; }
.bigcount { font-size: 38px; }
.focus-clock { font-size: 38px; }
.brand h1 { font-size: 15px; }
.countdown { font-size: 12px; }
main { margin-top: 10px; }
`;
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + mobileCss + '\n</style>');
html = html.replace(/<link rel="manifest"[^>]*>\s*/i, '');
html = html.replace(/<link rel="apple-touch-icon"[^>]*>\s*/i, '');
html = html.replace('<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">');
html = html.replace(/<script src="([^"]+)"><\/script>/g, function (m, src) {
  return '<script>\n' + read(src) + '\n</script>';
});
html = html.replace('<title>C语言备考学习系统 · 12月16日转段考试</title>', '<title>C语言备考系统·手机版</title>');
fs.writeFileSync(path.join(__dirname, '学习系统手机版.html'), html);
console.log('built 学习系统手机版.html:', Math.round(html.length / 1024) + ' KB, 题库', (html.match(/id: 'c[hx]|id: "ch/g) || '').length);
