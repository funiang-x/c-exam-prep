// 题库校验脚本：node check.js
// 校验 ch1.js~ch10.js 的格式、id 唯一性、答案下标、讲义完整性
const fs = require('fs');
const path = require('path');
global.window = global;
const dir = path.join(__dirname, 'data');
const errors = [];
const missing = [];
for (let i = 1; i <= 10; i++) {
  const f = path.join(dir, 'ch' + i + '.js');
  if (!fs.existsSync(f)) { missing.push(i); continue; }
  try { require(f); } catch (e) { errors.push('ch' + i + '.js 加载失败: ' + e.message); }
}
const extraF = path.join(dir, 'extra.js');
if (fs.existsSync(extraF)) { try { require(extraF); } catch (e) { errors.push('extra.js 加载失败: ' + e.message); } }
const hardF = path.join(dir, 'hard.js');
if (fs.existsSync(hardF)) { try { require(hardF); } catch (e) { errors.push('hard.js 加载失败: ' + e.message); } }
for (let g = 1; g <= 5; g++) {
  const f = path.join(dir, 'gd' + g + '.js');
  if (fs.existsSync(f)) { try { require(f); } catch (e) { errors.push('gd' + g + '.js 加载失败: ' + e.message); } }
}
const QB = window.QBANK || [];
const ids = new Set();
const cnt = {};
QB.forEach(q => {
  ['id', 'ch', 'type', 'q', 'exp'].forEach(k => { if (q[k] === undefined) errors.push((q.id || '?') + ' 缺少字段 ' + k); });
  if (ids.has(q.id)) errors.push('重复 id: ' + q.id);
  ids.add(q.id);
  if (!/^(ch\d+|ex|gd\d+|hd\d*)-\d+$/.test(q.id || '')) errors.push('id 格式不对: ' + q.id);
  if (!cnt[q.ch]) cnt[q.ch] = {};
  cnt[q.ch][q.type] = (cnt[q.ch][q.type] || 0) + 1;
  if (q.type === 'code') {
    if (!q.sample) errors.push(q.id + ' code 题缺 sample');
    if (q.opts || q.ans !== undefined) errors.push(q.id + ' code 题不应有 opts/ans');
  } else {
    if (!Array.isArray(q.opts) || q.opts.length < 2) errors.push(q.id + ' opts 有问题');
    else if (typeof q.ans !== 'number' || q.ans < 0 || q.ans >= q.opts.length) errors.push(q.id + ' ans 下标越界: ' + q.ans);
    else if (q.type === 'judge' && q.opts.length !== 2) errors.push(q.id + ' 判断题选项应为2个');
  }
});
for (let i = 1; i <= 10; i++) {
  if (!window.NOTES[i]) { if (!missing.includes(i)) errors.push('NOTES[' + i + '] 缺失'); continue; }
  if (!window.NOTES[i].points || window.NOTES[i].points.length < 200) errors.push('NOTES[' + i + '] 讲义内容过短');
}
console.log('题目总数:', QB.length);
console.log('各章分布:', JSON.stringify(cnt));
console.log('缺失文件:', missing.length ? 'ch' + missing.join(', ch') : '无');
if (errors.length) { console.error('\n发现问题:\n' + errors.join('\n')); process.exitCode = 1; }
else console.log('\n✅ 格式校验全部通过' + (missing.length ? '（但 ' + missing.length + ' 个文件未生成）' : ''));
