'use strict';
/* ============================================================
   C语言备考学习系统  ·  2026-12-16 转段考试《程序设计基础》
   闭环：① 学讲义 → ② 刷题 → ③ 编程题 → ④ 错题清零 → ⑤ 对话汇报
   进度数据保存在浏览器 localStorage（键 cstudy_v1）
   ============================================================ */

/* ================= 基础常量与状态 ================= */
const EXAM = new Date(2026, 11, 16);
const LS_KEY = 'cstudy_v1';
const TYPE_NAME = { single: '单选题', judge: '判断题', blank: '程序填空', read: '读程序写结果', code: '编程题' };
const TYPE_SCORE = { single: 2, judge: 2, blank: 5, read: 5 };
const DEF_STATE = { done: {}, stats: {}, wrong: [], activeDays: [], mockHist: [], mockCurrent: null, mockPending: null, mockLast: null, srs: {}, log: {} };
const VERSION = 'v3.0 豪华工作台版';

let S = loadState();
function loadState() {
  try { return Object.assign({}, DEF_STATE, JSON.parse(localStorage.getItem(LS_KEY) || '{}')); }
  catch (e) { return JSON.parse(JSON.stringify(DEF_STATE)); }
}
function save() { localStorage.setItem(LS_KEY, JSON.stringify(S)); }

function todayStr(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function parseDate(s) { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function addDays(s, n) { const d = parseDate(s); d.setDate(d.getDate() + n); return todayStr(d); }
function daysToExam() { return Math.round((EXAM - parseDate(todayStr())) / 86400000); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function pickN(arr, n) { return shuffle(arr).slice(0, n); }
function fmtPct(x) { return Math.round(x * 100) + '%'; }

/* DOM 构造助手 */
function h(tag, attrs) {
  const e = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (let i = 2; i < arguments.length; i++) appendKids(e, arguments[i]);
  return e;
}
function appendKids(e, c) {
  if (c == null || c === false) return;
  if (Array.isArray(c)) { c.forEach(x => appendKids(e, x)); return; }
  e.append(c.nodeType ? c : document.createTextNode(String(c)));
}

/* ================= 题库访问 ================= */
function qb() { return window.QBANK || []; }
function byId(id) { return qb().find(q => q.id === id); }
function chBy(ch) { return qb().filter(q => q.ch === ch); }
function chTitle(ch) { return (window.NOTES[ch] && window.NOTES[ch].title) || ('第' + ch + '章'); }
function chShort(ch) { return chTitle(ch).replace(/^第?\d*章?\s*/, '') || ('第' + ch + '章'); }
function chWrong(ch) { return S.wrong.map(byId).filter(q => q && q.ch === ch); }
function chStat(ch) {
  const qs = chBy(ch); let r = 0, w = 0, touched = 0;
  qs.forEach(q => { const st = S.stats[q.id]; if (st) { touched++; r += st.r; w += st.w; } });
  return { n: qs.length, touched, r, w, rate: (r + w) ? r / (r + w) : null };
}
function rateHtml(rate) {
  const cls = rate >= 0.9 ? 'rate-good' : rate >= 0.75 ? 'rate-mid' : 'rate-bad';
  return '<b class="' + cls + '">' + fmtPct(rate) + '</b>';
}

/* ================= 自进化引擎：知识点标签 ================= */
/* 规则自动打标（按顺序命中，最多3个）：做题数据会反哺每个标签的掌握度 */
const TAG_RULES = [
  ['自增自减', /自增|自减|前置|后置|先用后加|先加后用/],
  ['printf输出', /printf|格式符|%d|%f|%c|%s|%ld|%lf|%5d|%\.2f|%-8|putchar|宽度|精度/],
  ['scanf输入', /scanf|getchar|读入|输入函数/],
  ['运算符优先级', /优先级|结合性/],
  ['类型转换', /类型转换|强制转换|\(int\)|隐式|自动转换/],
  ['常量与标识符', /标识符|八进制|十六进制|转义字符|合法的|常量的/],
  ['数据类型', /\bint\b型|\bchar\b型|\bfloat\b|\bdouble\b|字节|unsigned|数据类型|\blong\b/],
  ['赋值表达式', /赋值表达式|复合赋值|连续赋值|\*=|\+=|-=|\/=/],
  ['逗号表达式', /逗号/],
  ['逻辑运算', /&&|\|\||逻辑|短路/],
  ['关系运算', /关系运算|关系表达式|==\s|\s==|!=/],
  ['if语句', /\bif\s*\(|else\b|条件表达式|闰年|悬空|分支/],
  ['switch语句', /switch|case\b|default/],
  ['for循环', /for\s*\(/],
  ['while循环', /while|do-while|do…while/],
  ['break与continue', /break|continue/],
  ['嵌套循环', /双重循环|嵌套|外层|内层|九九/],
  ['二维数组', /二维|\]\[\d\]|\[2\]\[3\]|行优先/],
  ['数组', /数组|\[\d+\]|\[\]/],
  ['字符串', /字符串|strlen|strcpy|strcat|strcmp|字符数组|gets|puts|\\0/],
  ['参数传递', /形参|实参|值传递|传地址|swap|交换/],
  ['递归', /递归|f\(n-1\)|fact\(/],
  ['作用域与static', /局部变量|全局变量|作用域|static|auto|存储类别/],
  ['编译预处理', /#define|#include|宏|预处理|条件编译|#ifdef|#ifndef/],
  ['结构体', /结构体|struct|->|成员/],
  ['共用体', /共用体|union/],
  ['枚举', /枚举|enum/],
  ['typedef', /typedef/i],
  ['函数', /函数定义|函数声明|函数原型|嵌套调用|调用函数|无参|有参|函数名/]
];
function tagsOf(q) {
  const text = (q.q || '') + '\n' + (q.exp || '');
  const out = [];
  TAG_RULES.forEach(function (r) {
    if (out.length >= 3) return;
    if (r[1].test(text) && out.indexOf(r[0]) < 0) out.push(r[0]);
  });
  return out;
}
function tagStats() {
  const map = {};
  qb().forEach(function (q) {
    if (q.type === 'code') return;
    const tags = tagsOf(q);
    (tags.length ? tags : ['综合']).forEach(function (tag) {
      const m = map[tag] || (map[tag] = { n: 0, r: 0, w: 0 });
      m.n++;
      const st = S.stats[q.id];
      if (st) { m.r += st.r; m.w += st.w; }
    });
  });
  return Object.keys(map).map(function (k) {
    const m = map[k];
    return { tag: k, n: m.n, r: m.r, w: m.w, rate: (m.r + m.w) ? m.r / (m.r + m.w) : null };
  }).filter(function (m) { return m.r + m.w >= 3; })
    .sort(function (a, b) { return (a.rate == null ? 1 : a.rate) - (b.rate == null ? 1 : b.rate); });
}

/* ================= 自进化引擎：SRS 记忆曲线调度 ================= */
/* 答错 → 等级归零、明天重考；答对 → 等级+1，间隔 1/2/4/7/15 天后自动回到智能练习 */
const SRL_INTERVALS = [1, 2, 4, 7, 15];
function dueCount() {
  const t = todayStr();
  return qb().filter(function (q) { return q.type !== 'code' && S.srs[q.id] && S.srs[q.id].due && S.srs[q.id].due <= t; }).length;
}
function newCount() {
  return qb().filter(function (q) { return q.type !== 'code' && !S.stats[q.id]; }).length;
}

/* ================= 自进化引擎：智能推题 ================= */
function smartPick(n) {
  const t = todayStr();
  const chRate = {};
  for (let ch = 1; ch <= 10; ch++) { const st = chStat(ch); chRate[ch] = (st.r + st.w >= 3) ? st.rate : null; }
  const tstats = {};
  tagStats().forEach(function (m) { tstats[m.tag] = m; });
  const scored = qb().filter(q => q.type !== 'code').map(function (q) {
    let s = Math.random() * 8;
    const rec = S.srs[q.id];
    if (rec && rec.due && rec.due <= t) s += 100 + (parseDate(t) - parseDate(rec.due)) / 86400000 * 10;
    const st = S.stats[q.id];
    if (!st) s += 20;
    else if (st.last === 'w') s += 30;
    const cr = chRate[q.ch];
    if (cr != null) s += (1 - cr) * 40;
    tagsOf(q).forEach(function (tag) {
      const m = tstats[tag];
      if (m && m.rate != null && m.rate < 0.6) s += 15;
    });
    return { q: q, s: s };
  }).sort(function (a, b) { return b.s - a.s; });
  return scored.slice(0, n).map(x => x.q.id);
}

/* ================= 自进化引擎：教练建议 ================= */
function planLagDays() {
  const t = todayStr();
  let lag = 0;
  SCHEDULE.forEach(function (d) {
    if (d.date >= t) return;
    let all = true;
    d.tasks.forEach(function (_, i) { if (!S.done[d.date + '#' + i]) all = false; });
    if (!all) lag++;
  });
  return lag;
}
function getAdvice() {
  const out = [];
  const t = todayStr();
  const idx = SCHEDULE.findIndex(d => d.date === t);
  if (idx >= 0) {
    const lag = planLagDays();
    if (lag >= 2) out.push(['⏰', '计划已落后约 ' + lag + ' 天。别慌也别弃疗，回对话发「落后了帮我调整计划」，我帮你重排后面的安排。']);
    else if (lag === 0 && t > '2026-10-03') out.push(['✅', '进度正常，一天都没落下，按今天的任务走就行。']);
  }
  const due = dueCount();
  if (due > 0) out.push(['🔁', '有 ' + due + ' 题到了记忆复习时间（答过但快忘了的），先做「智能练习」巩固，再刷新题。']);
  const weak = [];
  for (let ch = 1; ch <= 10; ch++) {
    const st = chStat(ch);
    if (st.touched >= 5 && st.rate != null && st.rate < 0.75) weak.push({ ch: ch, rate: st.rate });
  }
  weak.sort((a, b) => a.rate - b.rate);
  if (weak.length) out.push(['🎯', '最弱章节：第' + weak[0].ch + '章（正确率仅 ' + fmtPct(weak[0].rate) + '），今天优先回炉它的讲义和错题。']);
  if (S.wrong.length >= 15) out.push(['📒', '错题本积压 ' + S.wrong.length + ' 题。超过15题先清零再学新内容，否则漏的洞越滚越大。']);
  else if (S.wrong.length > 0 && S.wrong.length < 15 && idx >= 0 && due === 0) out.push(['📒', '错题本还有 ' + S.wrong.length + ' 题待消灭，睡前清零再休息。']);
  const wtags = tagStats().filter(m => m.rate != null && m.rate < 0.6).slice(0, 2);
  wtags.forEach(function (m) { out.push(['🧩', '知识点「' + m.tag + '」正确率仅 ' + fmtPct(m.rate) + '，做智能练习时它会优先出现，专门练到会。']); });
  if (S.mockHist.length) {
    const last = S.mockHist[S.mockHist.length - 1];
    if (last.total < 70) out.push(['📝', '上次模拟 ' + last.total + ' 分：客观题丢分多就回炉讲义，编程弱就专项练 code 题。']);
    else if (last.total >= 85) out.push(['🏆', '上次模拟 ' + last.total + ' 分，稳了，保持节奏到考场！']);
  }
  const st = streakCount();
  if (st >= 3) out.push(['🔥', '已连续学习 ' + st + ' 天，习惯成型了。中断一天也别自责，第二天接上就是。']);
  if (!out.length) out.push(['💡', '先完成今天的任务。做得越多，这里的建议和推荐就越懂你。']);
  return out.slice(0, 4);
}

/* ================= 汇报与备份 ================= */
function buildReport() {
  const t = todayStr();
  const lg = S.log[t] || { n: 0, r: 0 };
  const lines = [];
  lines.push('【今日汇报】' + t);
  lines.push('今日刷题：' + lg.n + ' 题，正确率 ' + (lg.n ? Math.round(lg.r * 100 / lg.n) : 0) + '%');
  lines.push('错题本待清：' + S.wrong.length + ' 题；连续学习 ' + streakCount() + ' 天');
  if (S.mockHist.length) lines.push('最近一次模拟：' + S.mockHist[S.mockHist.length - 1].total + ' 分');
  const wtags = tagStats().filter(m => m.rate != null).slice(0, 3).map(m => m.tag + ' ' + fmtPct(m.rate)).join('、');
  if (wtags) lines.push('薄弱考点：' + wtags);
  lines.push('（请抽查提问，讲解我报不会的题号）');
  return lines.join('\n');
}
function copyText(text, okMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { alert(okMsg); }, function () { showTransfer('export', text); });
  } else showTransfer('export', text);
}
function showTransfer(mode, preset) {
  const mask = h('div', { class: 'modal-mask', onclick: function (e) { if (e.target === mask) mask.remove(); } });
  const ta = h('textarea');
  const modal = h('div', { class: 'modal' });
  if (mode === 'export') {
    ta.value = preset != null ? preset : JSON.stringify(S);
    modal.append(
      h('h3', null, mode === 'export' && preset != null ? '📋 今日汇报（已生成）' : '💾 导出备份'),
      h('p', { class: 'muted' }, preset != null ? '点下面按钮复制，然后粘贴到 ZCode 对话框发给我。' : '全选复制下面的内容保存到别处（换浏览器/换电脑时用它恢复）。'),
      ta,
      h('div', { class: 'mrow' },
        h('button', {
          class: 'btn primary', onclick: function () { ta.select(); document.execCommand('copy'); alert('已复制到剪贴板'); }
        }, '📋 复制'),
        h('button', { class: 'btn', onclick: function () { mask.remove(); } }, '关闭'))
    );
  } else {
    modal.append(
      h('h3', null, '📥 导入备份'),
      h('p', { class: 'muted' }, '粘贴之前导出的备份内容，点击导入会覆盖当前进度。'),
      ta,
      h('div', { class: 'mrow' },
        h('button', {
          class: 'btn primary', onclick: function () {
            try {
              const obj = JSON.parse(ta.value);
              if (!obj || !obj.stats || !('wrong' in obj)) { alert('内容不像本系统的备份文件'); return; }
              S = Object.assign({}, DEF_STATE, obj);
              save();
              location.reload();
            } catch (e) { alert('导入失败：' + e.message); }
          }
        }, '导入并覆盖'),
        h('button', { class: 'btn', onclick: function () { mask.remove(); } }, '取消'))
    );
  }
  mask.append(modal);
  document.body.append(mask);
}

/* ================= v3 豪华版：金句 / 彩带 / 专注计时器 ================= */
const QUOTES = [
  '你刷的不是题，是 12 月 16 日走进考场时的底气。',
  '基础题占 70 分——稳住它们，你就赢了大半。',
  '代码是敲出来的，不是看出来的。今天你敲了吗？',
  '把每一道错题变成垫脚石，而不是绊脚石。',
  '今天的 20 道题，就是考场上的 2 分一道。',
  '看懂 ≠ 会写，会写 ≠ 写对。动手，再动手。',
  '别人的焦虑与你无关，你只管按计划往前走。',
  '每天进步 1%，74 天后就是另一个你。',
  '错题本越厚，考场越稳——前提是你要清零它。',
  '现在偷的懒，12 月都会变成卷面上的泪。',
  '循环要一圈一圈算，日子要一天一天过。',
  'scanf 少个 &，考场丢 5 分——细节就是分数。',
  '你不是在备考，你是在给未来的自己发录取通知。',
  '坚持到今天的人，已经赢了一半。',
  '别怕慢，就怕断。断了就接上，天塌不下来。'
];
function quoteOfDay() {
  const d = parseDate(todayStr());
  const start = new Date(2026, 0, 1);
  const day = Math.floor((d - start) / 86400000);
  return QUOTES[day % QUOTES.length];
}
function confetti(n) {
  const colors = ['#2563eb', '#7c3aed', '#f59e0b', '#ef4444', '#16a34a', '#06b6d4', '#ec4899'];
  for (let i = 0; i < (n || 60); i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = (2.2 + Math.random() * 1.6) + 's';
    p.style.animationDelay = (Math.random() * .5) + 's';
    p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
    document.body.append(p);
    setTimeout(function () { p.remove(); }, 4600);
  }
}
/* 带字母徽章的选项按钮 */
function optBtn(oi, opt, cls, onClick) {
  const b = h('button', { class: 'opt' + (cls ? ' ' + cls : '') },
    h('span', { class: 'letter' }, String.fromCharCode(65 + oi)), opt);
  if (onClick) b.addEventListener('click', onClick);
  return b;
}
/* 专注计时器（番茄钟） */
const FOCUS = { total: 25 * 60, left: 25 * 60, running: false, tick: null };
function fmtClock(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function focusTick() {
  if (!FOCUS.running) return;
  FOCUS.left--;
  const el = document.getElementById('fclk');
  if (el) el.textContent = fmtClock(Math.max(FOCUS.left, 0));
  if (FOCUS.left <= 0) {
    focusPause();
    alert('⏰ 25 分钟专注时间到！站起来喝口水，休息 5 分钟再战。');
    const st = document.getElementById('fstate');
    if (st) st.textContent = '🍅 完成一个番茄！休息 5 分钟';
    focusReset();
  }
}
function focusStart() {
  if (FOCUS.running) return;
  FOCUS.running = true;
  const st = document.getElementById('fstate');
  if (st) st.textContent = '专注中…别切走，代码在等你';
  FOCUS.tick = setInterval(focusTick, 1000);
}
function focusPause() {
  FOCUS.running = false;
  if (FOCUS.tick) { clearInterval(FOCUS.tick); FOCUS.tick = null; }
  const st = document.getElementById('fstate');
  if (st && FOCUS.left > 0 && FOCUS.left < FOCUS.total) st.textContent = '已暂停，随时继续';
}
function focusReset() {
  focusPause();
  FOCUS.left = FOCUS.total;
  const el = document.getElementById('fclk');
  if (el) el.textContent = fmtClock(FOCUS.left);
  const st = document.getElementById('fstate');
  if (st) st.textContent = '';
}
function focusCard() {
  return h('div', { class: 'card' },
    h('h2', null, '⏱ 专注计时器'),
    h('div', { class: 'focus-clock', id: 'fclk' }, fmtClock(FOCUS.left)),
    h('div', { class: 'focus-state', id: 'fstate' }, ''),
    h('div', { class: 'ch-actions', style: 'justify-content:center' },
      h('button', { class: 'btn primary', onclick: focusStart }, '▶ 开始 25 分钟专注'),
      h('button', { class: 'btn', onclick: focusPause }, '⏸ 暂停'),
      h('button', { class: 'btn', onclick: focusReset }, '↺ 重置')
    ),
    h('p', { class: 'muted center' }, '学 25 分钟 · 休 5 分钟 = 一个番茄。今天的目标：4 个番茄。')
  );
}

/* ================= v3 豪华版：速记手册 ================= */
const FLASHCARDS = [
  { tag: '必背', title: '运算符优先级链', kw: '优先级 结合性 运算符', body: '<p>从高到低（考试只考相对顺序）：</p><pre>!  →  算术(* / %)  →  算术(+ -)  →  关系(< <= > >=)  →  关系(== !=)  →  &&  →  ||  →  赋值(=)  →  逗号(,)</pre><ul><li>口诀：<b>算术 > 关系 > 逻辑(&amp;&amp; 高于 ||) > 赋值 > 逗号</b>，! 是例外它最高</li><li>单目运算符（! ++ --）高于双目</li></ul>' },
  { tag: '必背', title: 'printf 格式符速查', kw: 'printf 格式符 输出 %d %f %c %s', body: '<table><tr><th>格式符</th><th>用途</th></tr><tr><td>%d</td><td>十进制整数</td></tr><tr><td>%f</td><td>小数（默认6位）</td></tr><tr><td>%lf</td><td>double 的 <b>scanf</b> 读取</td></tr><tr><td>%c</td><td>单个字符</td></tr><tr><td>%s</td><td>字符串</td></tr><tr><td>%ld</td><td>long 整数</td></tr><tr><td>%%</td><td>输出 % 本身</td></tr></table><pre>printf("%5d", 42);      → □□□42   宽度5右对齐\nprintf("%.2f", 3.14159) → 3.14     保留2位\nprintf("%5.2f", 3.14159)→ □3.14    总宽5含小数点\nprintf("%-8.2f", 1.5)   → 1.50□□□□ 负号左对齐</pre>' },
  { tag: '必背', title: 'scanf 三条铁律', kw: 'scanf 输入 & 取地址 getchar', body: '<ul><li>普通变量前必须有 <b>&amp;</b>：scanf("%d",&amp;a)，<b>数组名前不加</b>（它本身就是地址）</li><li>多个 %d 时，空格/回车/Tab 都能分隔输入</li><li><b>大坑</b>：scanf("%d%c",&amp;n,&amp;c) 里 %c 会读走紧跟着的空格或回车！</li></ul><pre>double x; scanf("%lf", &x);   /* 读 double 用 %lf */\nprintf("%f", x);              /* 输出 double 用 %f 就行 */</pre>' },
  { tag: '必背', title: '自增自减口诀', kw: '自增 自减 ++ -- 前置 后置', body: '<pre>int i=3, j;\nj = i++;   /* 后置：先用后加 → j=3, i=4 */\nj = ++i;   /* 前置：先加后用 → j=4, i=4 */</pre><ul><li><b>拆开写最保险</b>，严禁在一个表达式里对同一变量多次 ++</li><li>做题时逐句模拟，把每一步的值标在旁边</li></ul>' },
  { tag: '必背', title: '类型转换两规则', kw: '类型转换 强制转换 int', body: '<ul><li><b>运算时向上转</b>：char/short → int → unsigned → long → double，混合运算取最高类型</li><li><b>赋值时向左转</b>：右边转成左边类型，double→int 丢小数（不是四舍五入）</li></ul><pre>int x = (int)2.5 + (int)4.7;   /* 2+4=6  先各自取整 */\nint y = (int)(2.5 + 4.7);      /* (int)7.2=7  先求和再取整 */</pre>' },
  { tag: '必背', title: '整除与取余', kw: '整除 取余 / % 截断', body: '<pre>5 / 2   = 2      /* 整数除整数，直接丢小数 */\n5.0 / 2 = 2.5    /* 有一个实数，才按实数除 */\n-5 / 2  = -2     /* 向零取整 */\n5 % 2   = 1      /* 余数符号跟被除数：-5%2 = -1 */\n5.5 % 2 ✗        /* % 两侧必须是整型！ */</pre>' },
  { tag: '必背', title: 'if 语句三形式与易错', kw: 'if else 分支 条件', body: '<pre>if(x>0) printf("1");\nif(a>b) max=a; else max=b;\nif(s>=90) printf("A");\nelse if(s>=80) printf("B");\nelse printf("C");</pre><ul><li>if(x) 等价 if(x!=0)；if(a=5) 恒真、if(a=0) 恒假（= 与 == 之坑）</li><li>if 后多条语句必须加 {}，否则只管第一条</li><li>else 配最近未配对的 if（悬空 else）</li><li>闰年：year%4==0 &amp;&amp; year%100!=0 || year%400==0</li></ul>' },
  { tag: '必背', title: 'switch 要点', kw: 'switch case default break 落空', body: '<ul><li>case 后只能是<b>整型/字符型常量</b>，不能是变量、实型、区间</li><li>没 break 就<b>落空</b>：继续执行后面 case 的语句</li><li>都不匹配走 default；case 10: case 9: 共用一段 = 利用落空</li></ul><pre>switch(score/10) {\ncase 10:\ncase 9:  printf("A"); break;\ncase 8:  printf("B"); break;\ndefault: printf("E");\n}</pre>' },
  { tag: '必背', title: '三种循环对比', kw: 'for while do-while 循环', body: '<table><tr><th></th><th>while</th><th>do-while</th><th>for</th></tr><tr><td>判断时机</td><td>先判断</td><td>先执行后判断</td><td>先判断</td></tr><tr><td>最少执行</td><td>0 次</td><td><b>1 次</b></td><td>0 次</td></tr><tr><td>注意</td><td></td><td>while( ) 后<b>有分号</b></td><td>for(;;)=死循环；for(...)后面别多写;</td></tr></table><p><b>for 执行顺序</b>：表达式1 → 表达式2 → 循环体 → 表达式3 → 表达式2 → …</p><pre>for(i=0; i<10; i+=3)  /* i:0,3,6,9 执行4次，结束 i=12 */</pre>' },
  { tag: '必背', title: 'break vs continue', kw: 'break continue 跳出', body: '<ul><li><b>break</b>：结束<b>整层</b>循环（或跳出 switch）；嵌套时只跳本层</li><li><b>continue</b>：跳过本次剩下的语句，直接进入下次判断</li></ul><pre>for(i=1;i<=5;i++){ if(i==3) continue; printf("%d",i); }  → 1245\nfor(i=1;i<=5;i++){ if(i==3) break;    printf("%d",i); }  → 12</pre><p>break 不能单独用在 if 里（必须在循环或 switch 内）。</p>' },
  { tag: '编程题', title: '必会经典程序模板', kw: '累加 累乘 水仙花 素数 斐波那契 九九表 模板', body: '<pre>/* 累加：1~100 */ int s=0; for(i=1;i<=100;i++) s+=i;\n/* 累乘：n! */   long f=1; for(i=1;i<=n;i++) f*=i;\n/* 偶数和 */     for(i=2;i<=100;i+=2) s+=i;      /* 2550 */\n/* 水仙花 */     a=n/100; b=n/10%10; c=n%10;\n/* 素数 */       for(i=2;i<=n-1;i++) if(n%i==0) break;\n                if(i>=n) 是素数;\n/* 斐波那契 */   f1=1; f2=1; f3=f1+f2; 逐项递推\n/* 九九表 */     for(i=1;i<=9;i++) for(j=1;j<=i;j++) printf("%d*%d=%d\\t",j,i,i*j);</pre>' },
  { tag: '必背', title: '数组要点', kw: '数组 下标 越界 初始化 二维', body: '<ul><li>int a[10] 的下标是 <b>0~9</b>，a[10] 越界（C不检查，可能出错）</li><li>int a[5]={1,2}; → 其余自动为 <b>0</b>；int a[]={1,2,3}; → 长度3</li><li>二维按<b>行优先</b>连续存放；int a[2][3]={{1},{4,5}}; → {1,0,0}和{4,5,0}</li><li>可省行数 a[][3]={...}，<b>不能省列数</b></li></ul>' },
  { tag: '必背', title: '字符串函数表', kw: '字符串 strlen strcpy strcat strcmp gets puts \\0', body: '<table><tr><th>函数</th><th>功能</th></tr><tr><td>strlen(s)</td><td>求长度（不含\'\\0\'）</td></tr><tr><td>strcpy(s1,s2)</td><td>s2 复制给 s1</td></tr><tr><td>strcat(s1,s2)</td><td>s2 接到 s1 后面</td></tr><tr><td>strcmp(s1,s2)</td><td>相等返回 <b>0</b></td></tr></table><ul><li>\'\\0\' 是字符串结束标志，定义数组要多留一位：char s[10]="abc" 占4格</li><li>strlen("abc\\0def") = <b>3</b></li><li>char s[10]; s="abc"; ✗ 数组名不能赋值 → 用 strcpy</li><li>scanf("%s",s) 不加 &amp;、遇空格停；gets(s) 能读整行</li></ul>' },
  { tag: '编程题', title: '冒泡排序模板（必背）', kw: '冒泡 排序 排序算法', body: '<pre>/* 对10个数升序：大的往后沉 */\nfor(i=0; i<9; i++)\n    for(j=0; j<9-i; j++)\n        if(a[j] > a[j+1])\n        { t=a[j]; a[j]=a[j+1]; a[j+1]=t; }</pre><ul><li>外层 n-1 轮，内层逐对比较</li><li>降序把 > 改 <</li><li>三变量交换：t=a; a=b; b=t;</li></ul>' },
  { tag: '必背', title: '函数定义与声明', kw: '函数 声明 定义 原型 void return', body: '<pre>int max(int a, int b);        /* 声明(原型)：末尾有分号 */\nint max(int a, int b)         /* 定义：末尾无分号，有函数体 */\n{ return a>b ? a : b; }</pre><ul><li>定义写在使用之后 → <b>必须先声明</b>；写在前面可省</li><li>形参要逐个写类型：int max(int a,int b) ✓，int max(a,b) ✗</li><li>return 只能返回<b>一个</b>值；无返回值用 void</li></ul>' },
  { tag: '必背', title: '值传递 vs 数组传参', kw: '形参 实参 值传递 swap 数组参数', body: '<pre>void swap(int a, int b)      /* 值传递：改的是副本 */\n{ int t=a; a=b; b=t; }       /* main 里换不了！ */\n\nvoid f(int a[], int n)       /* 数组传首地址：改得到 */\n{ a[0]=100; }                /* main 里的数组真变了 */</pre><ul><li>普通变量 = 复印件；数组名 = 地址</li><li>形参数组可不写长度，长度另传一个参数 n</li></ul>' },
  { tag: '必背', title: 'static 与变量全家桶', kw: 'static 局部变量 全局变量 作用域 auto', body: '<table><tr><th>变量</th><th>初始化时机</th><th>生命周期</th></tr><tr><td>局部 auto</td><td>每次调用都重新初始化</td><td>函数内</td></tr><tr><td>局部 <b>static</b></td><td><b>只初始化一次</b></td><td>全程，但只在函数内可见</td></tr><tr><td>全局变量</td><td>编译时</td><td>定义处到文件尾</td></tr></table><pre>int fun(){ static int c=0; c++; return c; }\n/* 调用3次输出：1 2 3；去掉 static 则 1 1 1 */</pre><p>全局与局部同名时，<b>局部屏蔽</b>全局。</p>' },
  { tag: '必背', title: '宏定义两大陷阱', kw: '宏 define 预处理 替换', body: '<pre>#define M N+1        /* M*M → N+1*N+1 ！ */\n#define M (N+1)      /* 正确：整体加括号 */\n#define S(a) a*a     /* S(3+2) → 3+2*3+2 = 11 */\n#define S(a) (a)*(a) /* 正确：参数加括号 */</pre><ul><li>宏是<b>纯文本替换</b>，不计算不求值，发生在编译之前</li><li>#define 行末<b>不加分号</b>；宏名习惯大写</li><li>#include &lt;&gt; 找系统目录，#include "" 先找当前目录</li></ul>' },
  { tag: '必背', title: '结构体速记', kw: '结构体 struct 成员 -> 初始化', body: '<pre>struct Student { int num; char name[20]; double score; };\nstruct Student s1 = {1001, "Li", 89};   /* 按顺序初始化 */\nstruct Student *p = &s1;\ns1.num    等价于    p->num    等价于    (*p).num</pre><ul><li>struct 定义末尾<b>必须有分号</b></li><li>字符串成员不能 s1.name="Li" ✗ → strcpy(s1.name,"Li")</li><li>同类型结构体可整体赋值：s2 = s1;</li></ul>' },
  { tag: '了解', title: '共用体 / 枚举 / typedef', kw: '共用体 union 枚举 enum typedef', body: '<ul><li><b>共用体</b>：成员共用同一段内存，大小=最长成员，同只保存最后赋的值</li><li><b>枚举</b>：enum Color{RED,GREEN,BLUE}; 从 0 开始逐个+1；enum {A=3,B,C}; 则 B=4,C=5</li><li><b>typedef</b>：给类型起别名，不产生新类型。typedef int INTEGER; typedef struct {...} STU;</li></ul>' }
];
function renderCheat() {
  $view.append(h('div', { class: 'card' },
    h('h2', null, '⚡ 速记手册'),
    h('p', { class: 'muted' }, '考前冲刺就看这里：' + FLASHCARDS.length + ' 张高频考点浓缩卡。点卡片展开详情，搜索框秒查。碎片时间翻两张，比刷手机强。'),
    h('input', {
      id: 'cheatSearch', placeholder: '🔍 搜考点，如：优先级 / printf / 冒泡 / 递归 / static…',
      oninput: function (e) {
        const kw = e.target.value.trim().toLowerCase();
        document.querySelectorAll('#cheatList .flash').forEach(function (d) {
          d.style.display = (!kw || d.getAttribute('data-kw').indexOf(kw) >= 0) ? '' : 'none';
        });
      }
    })
  ));
  const list = h('div', { id: 'cheatList' });
  FLASHCARDS.forEach(function (c) {
    list.append(h('details', { class: 'flash', 'data-kw': (c.title + c.kw + c.tag).toLowerCase() },
      h('summary', null, h('span', { class: 'ftag' }, c.tag), c.title),
      h('div', { class: 'fbody', html: c.body })
    ));
  });
  $view.append(list);
}

/* ================= 计划生成 ================= */
const PHASE_NAME = {
  1: '第①阶段 · 基础重建（10.03 ~ 11.08）',
  2: '第②阶段 · 专题强化（11.09 ~ 11.30）',
  3: '第③阶段 · 模拟冲刺（12.01 ~ 12.16）'
};
const P1 = [
  [1, '2026-10-03', 2], [2, '2026-10-05', 2], [3, '2026-10-07', 5], [4, '2026-10-12', 3],
  [5, '2026-10-15', 4], [6, '2026-10-19', 5], [7, '2026-10-24', 5], [8, '2026-10-29', 5],
  [9, '2026-11-03', 2], [10, '2026-11-05', 4]
];
const SCHEDULE = [];
function buildSchedule() {
  P1.forEach(function (row) {
    const ch = row[0], start = row[1], days = row[2];
    for (let i = 0; i < days; i++) {
      const tasks = [];
      if (i === 0) tasks.push('🎲 摸底：先做本章“摸底5题”，看看自己现在的水平（不会很正常，别慌）');
      tasks.push('📖 学：看“学习·刷题”里本章讲义 + 教材对应小节，边看边在 VSCode 里敲示例');
      tasks.push('✏️ 练：本章题目刷 ≥10 道，基础题正确率目标 ≥95%');
      if (i === days - 1) {
        tasks.push('💻 编程：独立写出本章编程题，再对照参考答案复述思路');
        tasks.push('🔁 清零：错题本中本章错题重做到全对');
      }
      tasks.push('💬 汇报：回 ZCode 对话发“今日汇报 + 正确率 + 不懂的题号”，我来抽查答疑');
      SCHEDULE.push({ date: addDays(start, i), phase: 1, ch: ch, title: chShort(ch) + '（第' + (i + 1) + '/' + days + '天）', tasks: tasks });
    }
  });
  const P2 = [
    ['2026-11-09', 4, '专项：单项选择题', '混合刷全部章节的选择题 40 道，把错因归类：概念不清 / 没算对 / 看错题'],
    ['2026-11-13', 4, '专项：程序填空', '刷完全部“程序填空”题 + 教材例题，练“看空猜意图”的能力'],
    ['2026-11-17', 5, '专项：读程序写结果', '刷完全部“读程序写结果”题，每题先在纸上写推演过程再看答案'],
    ['2026-11-22', 8, '专项：程序设计题', '全部编程题独立写一遍：第1-2天循环、第3-5天数组/字符串、第6-7天函数/递归、第8天结构体']
  ];
  P2.forEach(function (row) {
    const start = row[0], days = row[1], title = row[2], task = row[3];
    for (let i = 0; i < days; i++) {
      SCHEDULE.push({
        date: addDays(start, i), phase: 2, title: title + '（第' + (i + 1) + '/' + days + '天）',
        tasks: ['🎯 ' + task, '🔁 当天错题清零', '💬 汇报：回对话发“今日汇报”']
      });
    }
  });
  SCHEDULE.push({
    date: '2026-11-30', phase: 2, title: '第一轮收官：错题大清零',
    tasks: ['🔁 错题本全部重做到清零', '📝 还是不懂的题发到对话里让我讲解', '💬 发“第一轮总结”，我帮你评估是否进入冲刺']
  });
  for (let k = 0; k < 7; k++) {
    SCHEDULE.push({
      date: addDays('2026-12-01', k * 2), phase: 3, title: '模拟考 第' + (k + 1) + '套（限时120分钟）',
      tasks: ['🎯 完成整套模拟卷（编程题按评分标准自评）', '💬 把分数发我：“模拟卷' + (k + 1) + '：XX分”，我帮你分析']
    });
    SCHEDULE.push({
      date: addDays('2026-12-02', k * 2), phase: 3, title: '模拟卷 第' + (k + 1) + '套 · 复盘',
      tasks: ['🔁 本套错题重做到清零', '📖 回炉错题对应章节讲义', '💻 编程题对照参考答案重写一遍']
    });
  }
  SCHEDULE.push({
    date: '2026-12-15', phase: 3, title: '考前一天：只看不做',
    tasks: ['📖 只翻各章讲义的 ⚠️ 易错清单 + 错题本扫一遍', '🧘 不做新题，晚上早睡', '🎒 备好准考证、文具']
  });
  SCHEDULE.push({
    date: '2026-12-16', phase: 3, title: '🎉 考试日！',
    tasks: ['✅ 放轻松，先易后难', '选择填空稳拿分，编程题先写框架再填细节', '交卷前检查：scanf 的 &、语句分号、循环边界']
  });
}

/* ================= 状态记录 ================= */
function recordActive() {
  const t = todayStr();
  if (!S.activeDays.includes(t)) { S.activeDays.push(t); save(); }
}
function recordAnswer(q, ok) {
  const st = S.stats[q.id] || (S.stats[q.id] = { r: 0, w: 0 });
  if (ok) st.r++; else st.w++;
  st.last = ok ? 'r' : 'w';
  if (!ok && !S.wrong.includes(q.id)) S.wrong.push(q.id);
  const rec = S.srs[q.id] || (S.srs[q.id] = { lvl: 0, due: todayStr() });
  if (ok) {
    rec.lvl = Math.min((rec.lvl || 0) + 1, 5);
    rec.due = addDays(todayStr(), SRL_INTERVALS[Math.min(rec.lvl - 1, 4)]);
  } else {
    rec.lvl = 0;
    rec.due = addDays(todayStr(), 1);
  }
  const t = todayStr();
  const lg = S.log[t] || (S.log[t] = { n: 0, r: 0 });
  lg.n++;
  if (ok) lg.r++;
  save();
}
function removeFromWrong(id) { S.wrong = S.wrong.filter(x => x !== id); save(); }

/* ================= 路由 ================= */
let TAB = 'today';
let QUIZ = null;            // { qids, i, mode:'ch'|'wrong'|'bottom', ch, picked, sessionWrong }
let MOCK_VIEW = 'home';
let MOCK_TICK = null;
const $view = document.getElementById('view');

function setTab(t) { TAB = t; render(); }
function startQuiz(qids, mode, ch) { QUIZ = { qids: qids, i: 0, mode: mode, ch: ch, picked: null, sessionWrong: [] }; TAB = 'study'; render(); }
function startChapterQuiz(ch) { startQuiz(chBy(ch).map(q => q.id), 'ch', ch); }
function goChapter(ch) { TAB = 'study'; QUIZ = null; render(); const el = document.getElementById('chcard' + ch); if (el) el.scrollIntoView({ behavior: 'smooth' }); }

function render() {
  if (MOCK_TICK) { clearInterval(MOCK_TICK); MOCK_TICK = null; }
  const wb = document.getElementById('wrongBadge');
  wb.textContent = S.wrong.length || '';
  wb.classList.toggle('hidden', !S.wrong.length);
  const dl = daysToExam();
  document.getElementById('countdown').textContent = dl >= 0 ? '距考试 ' + dl + ' 天' : '考试加油';
  document.getElementById('streak').textContent = '🔥 连续学习 ' + streakCount() + ' 天';
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === TAB));
  $view.innerHTML = '';
  if (TAB === 'today') renderWorkbench();
  else if (TAB === 'study') { if (QUIZ) renderQuiz(); else renderStudy(); }
  else if (TAB === 'cheat') renderCheat();
  else if (TAB === 'mock') renderMock();
  else if (TAB === 'wrong') renderWrong();
  else if (TAB === 'stats') renderStats();
  else if (TAB === 'help') renderHelp();
}

/* ================= 今日任务 ================= */
/* ================= 工作台 DIY 布局系统 ================= */
const DEFAULT_LAYOUT = ['countdown', 'tasks', 'smart', 'advice', 'focus', 'notes', 'loop'];
let EDIT_MODE = false;
let dragId = null;

const WIDGETS = {
  countdown: { name: '📅 考试倒计时', render: renderWCountdown },
  tasks: { name: '📋 今日任务', render: renderWTasks },
  smart: { name: '🧠 智能练习', render: renderWSmart },
  advice: { name: '🧑‍🏫 教练建议', render: renderWAdvice },
  focus: { name: '⏱ 专注计时器', render: function (el) { el.append(focusCard()); } },
  notes: { name: '📝 我的便签', render: renderWNotes },
  loop: { name: '🔁 每日闭环', render: function (el) { el.append(loopCard()); } },
  wrongquick: { name: '📒 错题本速览', render: renderWWrong },
  chapters: { name: '📊 各章掌握速览', render: renderWChapters },
  mock: { name: '🎯 模拟考速览', render: renderWMock },
  heat: { name: '🧩 薄弱考点Top5', render: renderWHeat },
  streak14: { name: '📈 最近14天', render: renderW14 },
  flash: { name: '⚡ 随机速记卡', render: renderWFlash },
  quote: { name: '💬 每日金句', render: renderWQuote },
  nextdays: { name: '🗓 接下来两天', render: renderWNext },
  todo: { name: '✅ 我的待办清单', render: renderWTodo },
  links: { name: '🔗 常用链接', render: renderWLinks },
  doodle: { name: '🖌 涂鸦白板', render: renderWDoodle },
  week: { name: '📆 本周日历', render: renderWWeek },
  badges: { name: '🏆 成就徽章', render: renderWBadges }
};
function layout() {
  if (!S.layout || !S.layout.length) S.layout = DEFAULT_LAYOUT.slice();
  return S.layout;
}
function renderWorkbench() {
  const bar = h('div', { class: 'card', style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap' },
    h('b', null, EDIT_MODE ? '🛠 编辑模式：拖动卡片排序，✕ 移除，下方可添加' : '🏠 我的工作台'),
    h('span', { style: 'flex:1' }),
    EDIT_MODE
      ? [h('button', { class: 'btn small primary', onclick: function () { EDIT_MODE = false; save(); render(); } }, '✓ 完成编辑'),
         h('button', { class: 'btn small', onclick: function () { S.layout = DEFAULT_LAYOUT.slice(); save(); render(); } }, '↺ 恢复默认')]
      : h('button', { class: 'btn small', onclick: function () { EDIT_MODE = true; render(); } }, '🛠 DIY 布局')
  );
  $view.append(bar);
  const L = layout();
  L.forEach(function (id) {
    const w = WIDGETS[id];
    if (!w) return;
    const c = h('div', { class: 'card widget', 'data-wid': id });
    if (EDIT_MODE) {
      c.classList.add('editing');
      c.draggable = true;
      c.append(h('div', { class: 'wctrl' },
        h('button', { class: 'wbtn', title: '上移', onclick: function () { moveW(id, -1); } }, '↑'),
        h('button', { class: 'wbtn', title: '下移', onclick: function () { moveW(id, 1); } }, '↓'),
        h('button', { class: 'wbtn danger', title: '移除', onclick: function () { S.layout = S.layout.filter(x => x !== id); save(); render(); } }, '✕')
      ));
      c.addEventListener('dragstart', function () { dragId = id; c.classList.add('dragging'); });
      c.addEventListener('dragend', function () { c.classList.remove('dragging'); });
      c.addEventListener('dragover', function (e) { e.preventDefault(); });
      c.addEventListener('drop', function (e) { e.preventDefault(); dropW(id); });
    }
    w.render(c);
    $view.append(c);
  });
  if (EDIT_MODE) {
    const off = Object.keys(WIDGETS).filter(k => L.indexOf(k) < 0);
    const panel = h('div', { class: 'card' },
      h('h2', null, '➕ 可添加的模块'),
      off.length
        ? h('div', { class: 'ch-actions' }, off.map(k => h('button', { class: 'btn', onclick: function () { S.layout.push(k); save(); render(); } }, WIDGETS[k].name)))
        : h('p', { class: 'muted' }, '所有模块都已在用，先移除一些再添加。')
    );
    $view.append(panel);
  }
}
function moveW(id, dir) {
  const L = layout();
  const i = L.indexOf(id), j = i + dir;
  if (j < 0 || j >= L.length) return;
  const tmp = L[i]; L[i] = L[j]; L[j] = tmp;
  save(); render();
}
function dropW(targetId) {
  const L = layout();
  const from = L.indexOf(dragId), to = L.indexOf(targetId);
  if (from < 0 || to < 0 || from === to) return;
  L.splice(from, 1);
  L.splice(to, 0, dragId);
  save(); render();
}
/* ---------- 各模块 ---------- */
function renderWCountdown(el) {
  const dl = daysToExam();
  el.append(h('h2', null, '📅 考试倒计时'));
  el.append(h('div', { class: 'bigcount' }, dl >= 0 ? dl + ' 天' : '考试周'));
  el.append(h('p', { class: 'muted center' }, '2026年12月16日 · 《程序设计基础》 · 闭卷120分钟 · 满分100'));
}
function renderWQuote(el) {
  el.append(h('div', { class: 'quote' }, '💬 ' + quoteOfDay()));
}
function renderWTasks(el) {
  const t = todayStr();
  const idx = SCHEDULE.findIndex(d => d.date === t);
  el.append(h('h2', null, '📋 今日任务 · ' + t));
  if (idx < 0) {
    el.append(h('p', null, t < '2026-10-03'
      ? '正式计划从 2026-10-03 开始。现在可以先去“学习·刷题”读第1章讲义、做套摸底题热身。'
      : '计划已经全部走完——考场见真章，加油！💪'));
    return;
  }
  const day = SCHEDULE[idx];
  el.append(h('div', { class: 'phase-banner' }, h('b', null, PHASE_NAME[day.phase]), '　', h('span', { class: 'muted' }, day.title)));
  let prevDone = -1;
  const barFill = h('div');
  const pct = h('div', { class: 'muted', style: 'margin-top:4px' });
  function updateBar() {
    let n = 0;
    day.tasks.forEach(function (_, i) { if (S.done[day.date + '#' + i]) n++; });
    const p = Math.round(n * 100 / day.tasks.length);
    barFill.style.width = p + '%';
    pct.textContent = '完成 ' + n + '/' + day.tasks.length + (p === 100 ? '　🎉 全部完成！记得回对话发“今日汇报”' : '');
    if (p === 100 && prevDone !== -1 && prevDone < day.tasks.length) confetti(70);
    prevDone = n;
  }
  day.tasks.forEach(function (task, i) {
    const key = day.date + '#' + i;
    const cb = h('input', { type: 'checkbox' });
    cb.checked = !!S.done[key];
    cb.addEventListener('change', function () { S.done[key] = cb.checked; save(); row.classList.toggle('done', cb.checked); updateBar(); });
    const row = h('label', { class: 'task' + (cb.checked ? ' done' : '') }, cb, h('span', null, task));
    el.append(row);
  });
  updateBar();
  el.append(h('div', { class: 'bar', style: 'margin-top:12px' }, barFill), pct);
  const quick = h('div', { class: 'ch-actions' });
  if (day.phase === 1 && day.ch) {
    quick.append(
      h('button', { class: 'btn', onclick: function () { goChapter(day.ch); } }, '📖 本章讲义'),
      h('button', { class: 'btn primary', onclick: function () { startChapterQuiz(day.ch); } }, '✏️ 开始刷本章')
    );
  }
  if (day.phase === 2) {
    quick.append(h('button', { class: 'btn primary', onclick: function () { TAB = 'study'; QUIZ = null; render(); } }, '✏️ 去专项刷题'));
  }
  if (day.title.indexOf('模拟考') >= 0) {
    quick.append(h('button', { class: 'btn primary', onclick: function () { TAB = 'mock'; QUIZ = null; render(); } }, '🎯 开始模拟考'));
  }
  el.append(quick);
}
function renderWSmart(el) {
  const due = dueCount();
  const fresh = newCount();
  el.append(h('h2', null, '🧠 智能练习'));
  el.append(h('p', { class: 'muted' }, '按错题、薄弱章节和记忆曲线自动挑题。'));
  if (due > 0) el.append(h('div', { class: 'due-tip' }, '🔁 有 ' + due + ' 题到复习时间了'));
  el.append(h('div', { class: 'ch-actions' },
    h('button', { class: 'btn primary', onclick: function () { startQuiz(smartPick(10), 'bottom', null); } }, '🧠 智能练习 10 题'),
    h('button', { class: 'btn', onclick: function () { startQuiz(smartPick(20), 'bottom', null); } }, '20 题'),
    due ? h('button', { class: 'btn', onclick: function () {
      const t = todayStr();
      const ids = qb().filter(q => q.type !== 'code' && S.srs[q.id] && S.srs[q.id].due && S.srs[q.id].due <= t).map(q => q.id);
      startQuiz(shuffle(ids), 'wrong', null);
    } }, '🔁 只做到期题') : null,
    h('span', { class: 'muted', style: 'align-self:center' }, '剩 ' + fresh + ' 道新题')
  ));
}
function renderWAdvice(el) {
  el.append(h('h2', null, '🧑‍🏫 教练建议'));
  getAdvice().forEach(function (a) {
    el.append(h('div', { class: 'advice-item' }, h('span', { class: 'ico' }, a[0]), h('div', null, a[1])));
  });
  const weakCh = [];
  for (let ch = 1; ch <= 10; ch++) {
    const st = chStat(ch);
    if (st.touched >= 5 && st.rate != null && st.rate < 0.85) weakCh.push({ ch: ch, rate: st.rate });
  }
  weakCh.sort((a, b) => a.rate - b.rate);
  if (weakCh.length) {
    const chips = h('div', { class: 'weak-chips' });
    weakCh.slice(0, 3).forEach(function (w) {
      chips.append(h('button', { onclick: function () { goChapter(w.ch); } }, '第' + w.ch + '章 ' + fmtPct(w.rate) + ' ⚠'));
    });
    el.append(h('div', { class: 'muted', style: 'margin-top:8px' }, '薄弱章节直达：'), chips);
  }
}
function renderWNotes(el) {
  el.append(h('h2', null, '📝 我的便签'));
  const ta = h('textarea', { class: 'notebox', placeholder: '随手记：今天的疑问、要问教练的题号、自己的弱点…（自动保存）' });
  ta.value = S.note || '';
  let timer = null;
  ta.addEventListener('input', function () {
    S.note = ta.value;
    if (timer) clearTimeout(timer);
    timer = setTimeout(save, 400);
  });
  el.append(ta);
}
function renderWWrong(el) {
  el.append(h('h2', null, '📒 错题本'));
  el.append(h('div', { class: 'bigcount', style: S.wrong.length ? 'color:#dc2626' : '' }, String(S.wrong.length)));
  el.append(h('p', { class: 'muted center' }, S.wrong.length ? '题待消灭，睡前清零' : '已清零，漂亮！'));
  if (S.wrong.length) {
    el.append(h('div', { class: 'ch-actions', style: 'justify-content:center' },
      h('button', { class: 'btn primary', onclick: function () { TAB = 'wrong'; render(); } }, '去清零')));
  }
}
function renderWChapters(el) {
  el.append(h('h2', null, '📊 各章掌握速览'));
  for (let ch = 1; ch <= 10; ch++) {
    const st = chStat(ch);
    const row = h('div', { class: 'minirow', onclick: function () { goChapter(ch); }, title: '点击进入第' + ch + '章' },
      h('span', { class: 'mname' }, ch + '·' + chShort(ch)),
      h('div', { class: 'tbar bar' }, h('div', { style: 'width:' + (st.rate == null ? 0 : Math.round(st.rate * 100)) + '%' })),
      h('span', { class: 'trate' }, st.rate == null ? '—' : fmtPct(st.rate))
    );
    el.append(row);
  }
}
function renderWMock(el) {
  el.append(h('h2', null, '🎯 模拟考'));
  if (S.mockHist.length) {
    const last = S.mockHist[S.mockHist.length - 1];
    el.append(h('div', { class: 'bigcount' }, last.total + ' 分'));
    el.append(h('p', { class: 'muted center' }, '最近一次 · 共考 ' + S.mockHist.length + ' 次'));
  } else {
    el.append(h('p', { class: 'muted' }, '还没考过。12月起按计划每周一套。'));
  }
  el.append(h('div', { class: 'ch-actions', style: 'justify-content:center' },
    h('button', { class: 'btn primary', onclick: function () { TAB = 'mock'; QUIZ = null; MOCK_VIEW = 'home'; render(); } }, S.mockCurrent ? '继续考试中' : '🚀 开始一套模拟卷')));
}
function renderWHeat(el) {
  el.append(h('h2', null, '🧩 薄弱考点 Top5'));
  const ts = tagStats().filter(m => m.rate != null);
  if (!ts.length) { el.append(h('p', { class: 'muted' }, '做够 3 题后自动生成。')); return; }
  ts.slice(0, 5).forEach(function (m) {
    el.append(h('div', { class: 'minirow' },
      h('span', { class: 'mname' }, m.tag),
      h('div', { class: 'tbar bar' }, h('div', { style: 'width:' + Math.round(m.rate * 100) + '%;background:' + (m.rate >= 0.85 ? 'var(--ok)' : m.rate >= 0.7 ? 'var(--warn)' : 'var(--bad)') })),
      h('span', { class: 'trate' }, fmtPct(m.rate))
    ));
  });
}
function renderW14(el) {
  el.append(h('h2', null, '📈 最近 14 天'));
  const days = [];
  for (let i = 13; i >= 0; i--) days.push(addDays(todayStr(), -i));
  const maxN = Math.max(10, Math.max.apply(null, days.map(d => (S.log[d] ? S.log[d].n : 0))));
  const bars = h('div', { class: 'logbars' });
  days.forEach(function (d) {
    const lg = S.log[d];
    const n = lg ? lg.n : 0;
    bars.append(h('div', { class: 'lb' + (n ? '' : ' zero'), title: d + '：' + n + ' 题' },
      h('div', { class: 'cap' }, n ? String(n) : ''),
      h('div', { class: 'bar2', style: 'height:' + Math.max(n ? Math.round(n * 60 / maxN) : 2, 2) + 'px' })
    ));
  });
  el.append(bars);
}
function renderWFlash(el) {
  el.append(h('h2', null, '⚡ 随机速记卡'));
  const box = h('div');
  function show() {
    const c = FLASHCARDS[Math.floor(Math.random() * FLASHCARDS.length)];
    box.innerHTML = '';
    box.append(h('p', { html: '<b>' + c.title + '</b>' }), h('div', { class: 'fbody', html: c.body }));
  }
  show();
  el.append(box);
  el.append(h('div', { class: 'ch-actions' }, h('button', { class: 'btn small', onclick: show }, '🔄 换一张')));
}
function renderWNext(el) {
  el.append(h('h2', null, '🗓 接下来两天'));
  const t = todayStr();
  const idx = SCHEDULE.findIndex(d => d.date === t);
  if (idx < 0) { el.append(h('p', { class: 'muted' }, '——')); return; }
  [1, 2].forEach(function (k) {
    const d = SCHEDULE[idx + k];
    if (d) el.append(h('p', null, h('b', null, d.date + '　'), d.title));
  });
}
/* ---------- v4 新模块 ---------- */
function renderWTodo(el) {
  el.append(h('h2', null, '✅ 我的待办'));
  S.todo = S.todo || [];
  const list = h('div');
  function redraw() {
    list.innerHTML = '';
    if (!S.todo.length) list.append(h('p', { class: 'muted' }, '还没有待办。'));
    S.todo.forEach(function (td, i) {
      const cb = h('input', { type: 'checkbox' });
      cb.checked = !!td.done;
      cb.addEventListener('change', function () { td.done = cb.checked; save(); row.classList.toggle('done', cb.checked); });
      const del = h('button', { class: 'wbtn danger', style: 'margin-left:auto', onclick: function () { S.todo.splice(i, 1); save(); redraw(); } }, '✕');
      const row = h('label', { class: 'task' + (td.done ? ' done' : '') }, cb, h('span', { style: 'flex:1' }, td.txt), del);
      list.append(row);
    });
  }
  redraw();
  const inp = h('input', { class: 'cheatin', placeholder: '新待办，回车添加…' });
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && inp.value.trim()) {
      S.todo.push({ txt: inp.value.trim(), done: false });
      inp.value = '';
      save(); redraw();
    }
  });
  el.append(list, inp);
}
function renderWLinks(el) {
  el.append(h('h2', null, '🔗 常用链接'));
  S.links = S.links || [];
  const list = h('div');
  function redraw() {
    list.innerHTML = '';
    if (!S.links.length) list.append(h('p', { class: 'muted' }, '添加你常用的网址（如网课、题库网站）。'));
    S.links.forEach(function (lk, i) {
      list.append(h('div', { class: 'linkrow' },
        h('a', { href: lk.u, target: '_blank' }, lk.n),
        h('button', { class: 'wbtn danger', onclick: function () { S.links.splice(i, 1); save(); redraw(); } }, '✕')
      ));
    });
  }
  redraw();
  const name = h('input', { class: 'cheatin', placeholder: '名称', style: 'width:34%' });
  const url = h('input', { class: 'cheatin', placeholder: '网址 https://…', style: 'width:52%' });
  const add = h('button', { class: 'btn small primary', onclick: function () {
    if (!name.value.trim() || !url.value.trim()) return;
    let u = url.value.trim();
    if (!/^https?:\/\//.test(u)) u = 'https://' + u;
    S.links.push({ n: name.value.trim(), u: u });
    name.value = ''; url.value = '';
    save(); redraw();
  } }, '＋');
  el.append(list, h('div', { style: 'display:flex;gap:6px;margin-top:8px;flex-wrap:wrap' }, name, url, add));
}
function renderWDoodle(el) {
  el.append(h('h2', null, '🖌 涂鸦白板'), h('p', { class: 'muted' }, '推演循环、画流程、打草稿（自动保存）'));
  const cv = h('canvas', { class: 'doodle', width: 620, height: 220 });
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
  if (S.doodle) { const img = new Image(); img.onload = function () { ctx.drawImage(img, 0, 0); }; img.src = S.doodle; }
  let drawing = false;
  function pos(e) {
    const r = cv.getBoundingClientRect();
    return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height };
  }
  cv.addEventListener('pointerdown', function (e) { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
  cv.addEventListener('pointermove', function (e) {
    if (!drawing) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();
  });
  window.addEventListener('pointerup', function () {
    if (!drawing) return;
    drawing = false;
    S.doodle = cv.toDataURL('image/png');
    save();
  });
  el.append(cv, h('div', { class: 'ch-actions' },
    h('button', { class: 'btn small', onclick: function () { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); S.doodle = cv.toDataURL('image/png'); save(); } }, '🗑 清空')
  ));
}
function renderWWeek(el) {
  el.append(h('h2', null, '📆 本周日历'));
  const now = new Date();
  const mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  let any = false;
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i);
    const ds = todayStr(d);
    const entry = SCHEDULE.find(x => x.date === ds);
    const isToday = ds === todayStr();
    el.append(h('div', { class: 'weekrow' + (isToday ? ' today' : '') + (d.getDay() === 0 || d.getDay() === 6 ? ' weekend' : '') },
      h('b', null, '周' + '一二三四五六日'[(d.getDay() + 6) % 7] + ' ' + ds.slice(5)),
      h('span', null, entry ? entry.title : (ds > '2026-12-16' ? '' : '自由安排/补进度'))
    ));
    if (entry) any = true;
  }
  if (!any) el.append(h('p', { class: 'muted' }, '本周暂无计划项（可能已考完或未开始）。'));
}
function renderWBadges(el) {
  el.append(h('h2', null, '🏆 成就徽章'));
  let total = 0;
  Object.keys(S.stats).forEach(function (k) { const st = S.stats[k]; total += st.r + st.w; });
  const allClear = S.wrong.length === 0 && total > 0;
  const badges = [
    ['🎬', '启程', true],
    ['🔥', '连续3天', streakCount() >= 3],
    ['📚', '做题50', total >= 50],
    ['💯', '做题150', total >= 150],
    ['🧹', '错题清零', allClear],
    ['🎯', '单章85%+', (function () { for (let ch = 1; ch <= 10; ch++) { const st = chStat(ch); if (st.touched >= 10 && st.rate >= 0.85) return true; } return false; })()],
    ['📝', '首战模拟', S.mockHist.length >= 1],
    ['🥇', '模拟85+', S.mockHist.some(m => m.total >= 85)],
    ['👑', '十年磨剑', total >= 400]
  ];
  const grid = h('div', { class: 'badgegrid' });
  badges.forEach(function (b) {
    grid.append(h('div', { class: 'badge' + (b[2] ? ' on' : ''), title: b[2] ? '已达成' : '未达成' },
      h('div', { class: 'bico' }, b[0]), h('div', { class: 'bname' }, b[1])));
  });
  el.append(grid);
}

function loopCard() {
  return h('div', { class: 'card' },
    h('h2', null, '🔁 每日闭环（记住这五步）'),
    h('div', { class: 'loop-steps' }, ['① 学讲义', '② 刷题', '③ 做编程题', '④ 错题清零', '⑤ 对话汇报']),
    h('p', { class: 'muted' }, '第⑤步最重要：点下面的按钮一键生成今日汇报，粘贴到 ZCode 对话发给我，我负责批改、抽查、把你不懂的讲透。'),
    h('div', { class: 'ch-actions' },
      h('button', { class: 'btn primary', onclick: function () { copyText(buildReport(), '汇报已复制，去粘贴给教练吧！'); } }, '📋 一键生成今日汇报')
    )
  );
}

/* ================= 学习 · 章节 ================= */
function renderStudy() {
  $view.append(h('div', { class: 'card' },
    h('h2', null, '📚 十章讲义 + 题库'),
    h('p', { class: 'muted' }, '按计划顺序：第1章 → 第10章。每章先看讲义，再点“开始刷题”；正确率 ≥95% 再进下一章（冲最高分的门槛）。')
  ));
  for (let ch = 1; ch <= 10; ch++) {
    const st = chStat(ch);
    const cw = chWrong(ch).length;
    const notes = window.NOTES[ch];
    const card = h('div', { class: 'card', id: 'chcard' + ch });
    card.append(h('div', { class: 'ch-head' },
      h('h2', { class: 'grow' }, '第' + ch + '章　' + chShort(ch)),
      h('span', { class: 'pill gray' }, st.n + ' 题'),
      st.rate == null ? h('span', { class: 'pill gray' }, '未开始') : h('span', { class: 'pill ' + (st.rate >= 0.85 ? 'ok' : st.rate >= 0.7 ? 'warn' : 'bad'), html: '正确率 ' + fmtPct(st.rate) }),
      cw ? h('span', { class: 'pill bad' }, '错题 ' + cw) : null
    ));
    const actions = h('div', { class: 'ch-actions' });
    if (st.n) {
      actions.append(
        h('button', { class: 'btn primary', onclick: function () { startChapterQuiz(ch); } }, '✏️ 开始刷题'),
        h('button', { class: 'btn', onclick: function () { startQuiz(shuffle(chBy(ch).map(q => q.id)).slice(0, 5), 'bottom', ch); } }, '🎲 摸底5题'),
        cw ? h('button', { class: 'btn', onclick: function () { startQuiz(shuffle(chWrong(ch).map(q => q.id)), 'wrong', ch); } }, '🔁 只刷本章错题') : null
      );
    } else {
      actions.append(h('span', { class: 'muted' }, '本章题库缺失——回对话告诉我“第' + ch + '章题库没加载”'));
    }
    card.append(actions);
    if (notes && notes.points) {
      card.append(h('details', { class: 'notes' },
        h('summary', null, '📖 点开看本章讲义（考点清单 + 易错陷阱）'),
        h('div', { class: 'notes-body', html: notes.points })
      ));
    }
    $view.append(card);
  }
  $view.append(loopCard());
}

/* ================= 刷题引擎 ================= */
function renderQuiz() {
  const q = byId(QUIZ.qids[QUIZ.i]);
  if (!q) { QUIZ = null; render(); return; }
  const total = QUIZ.qids.length;
  const card = h('div', { class: 'card' });
  card.append(h('div', { class: 'qtop' },
    h('span', { class: 'pill' }, chTitle(q.ch)),
    h('span', { class: 'pill gray' }, TYPE_NAME[q.type]),
    h('span', { class: 'pill gray' }, '第 ' + (QUIZ.i + 1) + ' / ' + total + ' 题'),
    h('span', { class: 'srs-lv' }, S.stats[q.id] ? ('记忆等级 Lv' + (S.srs[q.id] ? S.srs[q.id].lvl : 0)) : '新题'),
    h('button', { class: 'btn small', style: 'margin-left:auto', onclick: function () { QUIZ = null; render(); } }, '✕ 退出本组')
  ));
  const qtags = tagsOf(q);
  if (qtags.length) {
    const tagRow = h('div', { style: 'margin-bottom:8px' });
    qtags.forEach(function (t) { tagRow.append(h('span', { class: 'pill warn' }, '🧩 ' + t)); });
    card.append(tagRow);
  }
  card.append(h('div', { class: 'bar', style: 'margin-bottom:12px' }, h('div', { style: 'width:' + (QUIZ.i * 100 / total) + '%' })));
  card.append(h('div', { class: 'qtext' }, q.q));
  const graded = QUIZ.picked != null;

  if (q.type === 'code') {
    if (!graded) {
      const sampleBox = h('div', { class: 'codebox hidden' }, q.sample);
      card.append(h('button', {
        class: 'btn small', onclick: function (e) {
          sampleBox.classList.toggle('hidden');
          e.target.textContent = sampleBox.classList.contains('hidden') ? '👁 先自己写，再对照参考答案' : '🙈 收起参考答案';
        }
      }, '👁 先自己写，再对照参考答案'));
      card.append(sampleBox);
      const box = h('div', { class: 'selfgrade' });
      [['15', '完全独立写出，逻辑正确'], ['10', '思路正确，有小错误'], ['5', '看了提示或答案才写出来'], ['0', '还完全不会']].forEach(function (r) {
        box.append(h('button', {
          class: 'btn', onclick: function () {
            QUIZ.picked = +r[0];
            recordAnswer(q, +r[0] >= 5);
            if (QUIZ.mode === 'wrong' && +r[0] >= 5) removeFromWrong(q.id);
            if (+r[0] < 5) QUIZ.sessionWrong.push(q.id);
            render();
          }
        }, '自评 ' + r[0] + ' 分：' + r[1]));
      });
      card.append(box);
    } else {
      card.append(h('div', { class: 'expbox ' + (QUIZ.picked >= 5 ? 'good' : 'bad2') },
        QUIZ.picked >= 5 ? '💪 很好！建议明天再独立默写一遍。' : '📘 没关系，把参考答案逐行看懂，之后错题本里还会见到它。'
      ));
      card.append(h('div', { class: 'codebox' }, q.sample));
      if (q.exp) card.append(h('p', { class: 'muted', style: 'margin-top:6px' }, '思路：' + q.exp));
      card.append(qnav());
    }
    $view.append(card);
    return;
  }

  /* 客观题 */
  const optsBox = h('div', { class: 'opts' });
  q.opts.forEach(function (opt, oi) {
    let cls = '';
    let onClick = null;
    if (graded) {
      cls = 'locked';
      if (oi === q.ans) cls += ' correct';
      else if (oi === QUIZ.picked) cls += ' wrong';
    } else {
      onClick = function () {
        QUIZ.picked = oi;
        const ok = oi === q.ans;
        recordAnswer(q, ok);
        if (QUIZ.mode === 'wrong' && ok) removeFromWrong(q.id);
        if (!ok) QUIZ.sessionWrong.push(q.id);
        render();
      };
    }
    optsBox.append(optBtn(oi, opt, cls, onClick));
  });
  card.append(optsBox);
  if (graded) {
    const ok = QUIZ.picked === q.ans;
    card.append(h('div', { class: 'expbox ' + (ok ? 'good' : 'bad2') },
      h('b', null, ok ? '✅ 答对了！' : '❌ 答错了，正确答案是 ' + String.fromCharCode(65 + q.ans) + '。'),
      ' ', q.exp
    ));
    card.append(qnav());
  }
  $view.append(card);
}
function qnav() {
  return h('div', { class: 'qnav' },
    h('button', { class: 'btn primary', onclick: nextQ }, QUIZ.i + 1 < QUIZ.qids.length ? '下一题 →' : '🏁 看本组总结'),
    h('button', { class: 'btn', onclick: function () { QUIZ = null; render(); } }, '结束退出')
  );
}
function nextQ() {
  QUIZ.picked = null;
  QUIZ.i++;
  if (QUIZ.i >= QUIZ.qids.length) { renderQuizSummary(); return; }
  render();
}
function renderQuizSummary() {
  const wrong = QUIZ.sessionWrong.filter(function (x, i, a) { return a.indexOf(x) === i; });
  const total = QUIZ.qids.length;
  if (wrong.length === 0) confetti(90);
  const card = h('div', { class: 'card' });
  card.append(h('div', { class: 'big-emoji' }, wrong.length === 0 ? '🎉' : '📝'));
  card.append(h('h2', { class: 'center' }, '本组完成！共 ' + total + ' 题，错 ' + wrong.length + ' 题'));
  if (wrong.length) {
    card.append(h('p', { class: 'center muted' }, '错题已自动收进错题本。趁热打铁，马上重做一遍效果最好。'));
    card.append(h('div', { class: 'ch-actions', style: 'justify-content:center' },
      h('button', { class: 'btn primary', onclick: function () { startQuiz(shuffle(wrong), 'wrong', QUIZ.ch); } }, '🔁 立刻重做本组错题')
    ));
  } else {
    card.append(h('p', { class: 'center muted' }, '全对！错题本不会新增记录，太棒了。'));
  }
  card.append(h('div', { class: 'ch-actions', style: 'justify-content:center' },
    QUIZ.ch ? h('button', { class: 'btn', onclick: function () { startChapterQuiz(QUIZ.ch); } }, '✏️ 再刷一组本章') : null,
    h('button', { class: 'btn', onclick: function () { QUIZ = null; render(); } }, '📚 返回章节列表')
  ));
  $view.append(card);
  $view.append(loopCard());
}

/* ================= 错题本 ================= */
function renderWrong() {
  const card = h('div', { class: 'card' });
  card.append(h('h2', null, '📒 错题本（' + S.wrong.length + ' 题待消灭）'));
  if (!S.wrong.length) {
    card.append(h('div', { class: 'big-emoji' }, '🎉'));
    card.append(h('p', { class: 'center' }, '错题本清零！做错的题重做答对一次就会自动移出。'));
    $view.append(card);
    return;
  }
  card.append(h('p', { class: 'muted' }, '规则：重做时答对（编程题自评 ≥5 分）即自动移出错题本。建议每天睡前把错题清零。'));
  const byCh = {};
  S.wrong.map(byId).forEach(function (q) { if (q) { (byCh[q.ch] = byCh[q.ch] || []).push(q); } });
  Object.keys(byCh).sort(function (a, b) { return a - b; }).forEach(function (ch) {
    card.append(h('p', null, h('span', { class: 'pill bad' }, '第' + ch + '章 ' + chShort(+ch)), '错 ' + byCh[ch].length + ' 题'));
  });
  const actions = h('div', { class: 'ch-actions' },
    h('button', { class: 'btn primary', onclick: function () { startQuiz(shuffle(S.wrong.slice()), 'wrong', null); } }, '🔁 重做全部错题')
  );
  Object.keys(byCh).sort(function (a, b) { return a - b; }).forEach(function (ch) {
    actions.append(h('button', { class: 'btn', onclick: function () { startQuiz(shuffle(byCh[ch].map(q => q.id)), 'wrong', +ch); } }, '只刷第' + ch + '章'));
  });
  card.append(actions);
  $view.append(card);
  $view.append(loopCard());
}

/* ================= 模拟考 ================= */
function renderMock() {
  if (S.mockCurrent) { renderMockRun(); return; }
  if (S.mockPending) { renderMockSelf(); return; }
  if (MOCK_VIEW === 'result' && S.mockLast) { renderMockResult(); return; }
  MOCK_VIEW = 'home';
  const card = h('div', { class: 'card' });
  card.append(h('h2', null, '🎯 模拟考'));
  card.append(h('p', { class: 'muted' }, '仿真考卷（按2027大纲）：单选 20 题 ×2分 ＋ 程序填空 3 题 ×5分 ＋ 看程序写结果 3 题 ×5分 ＋ 编程 2 题 ×15分（自评），限时 120 分钟。组卷含 2 道拉满单选和 1 道压轴难题，比真题略狠——练得狠，考得稳。请安排整块时间一次做完，中途别翻讲义。'));
  card.append(h('div', { class: 'ch-actions' }, h('button', { class: 'btn primary', onclick: startMock }, '🚀 开始一套模拟卷')));
  $view.append(card);

  const hist = h('div', { class: 'card' });
  hist.append(h('h2', null, '历次成绩'));
  if (!S.mockHist.length) hist.append(h('p', { class: 'muted' }, '还没有模拟考记录。12月起按计划每周刷一套，分数会越来越高。'));
  else {
    const tb = h('table', { class: 'stats' }, h('tr', null, h('th', null, '日期'), h('th', null, '总分/100'), h('th', null, '客观题/70'), h('th', null, '编程自评/30')));
    S.mockHist.slice().reverse().forEach(function (m) {
      tb.append(h('tr', null, h('td', null, m.date), h('td', null, String(m.total)), h('td', null, String(m.machine)), h('td', null, String(m.codeself))));
    });
    hist.append(tb);
  }
  $view.append(hist);
  if (S.mockHist.length >= 2) {
    const ms = S.mockHist.slice(-10);
    const Wt = 300, Ht = 80, pd = 10;
    const pts = ms.map(function (m, i) {
      const x = pd + i * ((Wt - 2 * pd) / Math.max(ms.length - 1, 1));
      const y = Ht - pd - (m.total / 100) * (Ht - 2 * pd);
      return Math.round(x) + ',' + Math.round(y);
    });
    $view.append(h('div', { class: 'card trendbox' }, h('h2', null, '📉 分数走势'),
      h('div', { html: '<svg width="' + Wt + '" height="' + Ht + '" style="background:#f6f8fa;border-radius:8px"><polyline points="' + pts.join(' ') + '" fill="none" stroke="#2563eb" stroke-width="2"/></svg>' })));
  }
}
function startMock() {
  // 真题保真组卷（按2027大纲）：单选20（18基础按章轮转+2拉满）＋填空3＋读程序3（2基础+1拉满）＋编程2（1基础+1压轴）
  const baseS = qb().filter(q => q.type === 'single' && !q.hard);
  const hardS = qb().filter(q => q.type === 'single' && q.hard);
  const blanks = qb().filter(q => q.type === 'blank');
  const baseR = qb().filter(q => q.type === 'read' && !q.hard);
  const hardR = qb().filter(q => q.type === 'read' && q.hard);
  const baseC = qb().filter(q => q.type === 'code' && !q.hard);
  const hardC = qb().filter(q => q.type === 'code' && q.hard);
  const byCh = {};
  baseS.forEach(q => { (byCh[q.ch] = byCh[q.ch] || []).push(q); });
  Object.keys(byCh).forEach(c => { byCh[c] = shuffle(byCh[c]); });
  const chosen = [];
  let more = true;
  while (more && chosen.length < 18) {
    more = false;
    Object.keys(byCh).forEach(function (c) {
      if (byCh[c].length && chosen.length < 18) { chosen.push(byCh[c].shift()); more = true; }
    });
  }
  const singles = chosen.concat(pickN(hardS, 2));
  const leftover = shuffle(Object.keys(byCh).reduce(function (a, c) { return a.concat(byCh[c]); }, []));
  let li = 0;
  while (singles.length < 20 && li < leftover.length) singles.push(leftover[li++]);
  const hardRead = pickN(hardR, 1);
  const reads = hardRead.concat(pickN(baseR, 3 - hardRead.length));
  const hardCode = pickN(hardC, 1);
  const codes = hardCode.concat(pickN(baseC, 2 - hardCode.length));
  const paper = singles.concat(pickN(blanks, 3), reads, codes);
  S.mockCurrent = { started: Date.now(), ids: paper.map(q => q.id), answers: {}, cur: 0 };
  save();
  TAB = 'mock';
  render();
}
function renderMockRun() {
  const mc = S.mockCurrent;
  const card = h('div', { class: 'card' });
  const timerEl = h('span', { class: 'timer' }, '--:--');
  function tick() {
    const left = 120 * 60 - Math.floor((Date.now() - mc.started) / 1000);
    if (left <= 0) { submitMock(true); return; }
    timerEl.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
    timerEl.classList.toggle('low', left < 10 * 60);
  }
  card.append(h('div', { class: 'qtop' },
    h('b', null, '模拟考进行中'), timerEl,
    h('button', { class: 'btn small primary', style: 'margin-left:auto', onclick: trySubmit }, '交卷'),
    h('button', {
      class: 'btn small danger', onclick: function () {
        if (confirm('确定放弃本次模拟考吗？进度将丢失。')) { S.mockCurrent = null; save(); render(); }
      }
    }, '放弃')
  ));
  const grid = h('div', { class: 'qgrid' });
  mc.ids.forEach(function (id, i) {
    const answered = mc.answers[id] != null;
    grid.append(h('button', {
      class: (i === mc.cur ? 'cur ' : '') + (answered ? 'done' : ''),
      onclick: function () { mc.cur = i; save(); render(); }
    }, String(i + 1)));
  });
  card.append(grid);
  const q = byId(mc.ids[mc.cur]);
  card.append(h('div', { class: 'qtop' },
    h('span', { class: 'pill' }, chTitle(q.ch)),
    h('span', { class: 'pill gray' }, TYPE_NAME[q.type]),
    h('span', { class: 'pill gray' }, '第 ' + (mc.cur + 1) + ' / ' + mc.ids.length + ' 题')
  ));
  card.append(h('div', { class: 'qtext' }, q.q));
  if (q.type === 'code') {
    card.append(h('p', { class: 'muted' }, '⏱ 考场上编程题写在纸上/VSCode 里；在这里点“已完成”即可，交卷后再按评分标准自评。'));
    card.append(h('button', {
      class: 'btn ' + (mc.answers[q.id] != null ? '' : 'primary'),
      onclick: function () { if (mc.answers[q.id] != null) delete mc.answers[q.id]; else mc.answers[q.id] = 1; save(); render(); }
    }, mc.answers[q.id] != null ? '✔ 已标记完成（再点一次取消）' : '☑ 我已在纸上/VSCode 完成本题'));
  } else {
    const box = h('div', { class: 'opts' });
    q.opts.forEach(function (opt, oi) {
      box.append(optBtn(oi, opt, mc.answers[q.id] === oi ? 'correct' : '', function () {
        mc.answers[q.id] = oi; save(); render();
      }));
    });
    card.append(box);
  }
  card.append(h('div', { class: 'qnav' },
    h('button', { class: 'btn', onclick: function () { if (mc.cur > 0) { mc.cur--; save(); render(); } }, disabled: mc.cur === 0 }, '← 上一题'),
    h('button', { class: 'btn primary', onclick: function () { if (mc.cur < mc.ids.length - 1) { mc.cur++; save(); render(); } }, disabled: mc.cur === mc.ids.length - 1 }, '下一题 →')
  ));
  $view.append(card);
  tick();
  MOCK_TICK = setInterval(tick, 1000);
}
function trySubmit() {
  const mc = S.mockCurrent;
  if (!mc) return;
  const unanswered = mc.ids.filter(id => mc.answers[id] == null).length;
  if (unanswered && !confirm('还有 ' + unanswered + ' 题没做，确定交卷吗？')) return;
  submitMock(false);
}
function submitMock(auto) {
  const mc = S.mockCurrent;
  if (!mc) return;
  if (MOCK_TICK) { clearInterval(MOCK_TICK); MOCK_TICK = null; }
  const detail = mc.ids.map(function (id) {
    const q = byId(id);
    const a = mc.answers[id];
    const obj = q.type !== 'code';
    const ok = obj && a === q.ans;
    return { id: id, pick: a, ok: ok, score: obj ? (ok ? TYPE_SCORE[q.type] : 0) : null, self: null };
  });
  const machine = detail.reduce(function (s, d) { return s + (d.score || 0); }, 0);
  S.mockPending = { machine: machine, detail: detail };
  S.mockCurrent = null;
  save();
  if (auto) alert('时间到，自动交卷！');
  TAB = 'mock';
  render();
}
function renderMockSelf() {
  const p = S.mockPending;
  p.self = p.self || {};
  const codes = p.detail.filter(d => byId(d.id).type === 'code');
  const card = h('div', { class: 'card' });
  card.append(h('h2', null, '📝 编程题自评（' + codes.length + ' 道 × 15 分）'));
  card.append(h('p', { class: 'muted' }, '按考场评分标准给自己打分：独立写出且逻辑正确 15 分；思路对有小错 10 分；看提示写出 5 分；没写出来 0 分。对照参考答案诚一点，模拟才有意义。'));
  $view.append(card);
  const allDone = function () { return codes.every(d => p.self[d.id] != null); };
  const finishBtn = h('button', { class: 'btn primary', disabled: true, onclick: finishMock }, '（请先给每道编程题自评）');
  const refreshFinish = function () {
    finishBtn.disabled = !allDone();
    finishBtn.textContent = allDone() ? '🏁 生成成绩单' : '（请先给每道编程题自评）';
  };
  codes.forEach(function (d) {
    const q = byId(d.id);
    const c = h('div', { class: 'card' });
    c.append(h('div', { class: 'qtext' }, q.q));
    c.append(h('div', { class: 'codebox' }, q.sample));
    if (q.exp) c.append(h('p', { class: 'muted', style: 'margin:6px 0' }, '思路：' + q.exp));
    const box = h('div', { class: 'selfgrade' });
    [['15', '独立写出，完全正确'], ['10', '思路对，有小错误'], ['5', '看了提示才写出'], ['0', '没写出来']].forEach(function (r) {
      const input = h('input', { type: 'radio', name: 'sg-' + q.id });
      input.addEventListener('change', function () { p.self[q.id] = +r[0]; save(); refreshFinish(); });
      if (p.self[q.id] === +r[0]) input.checked = true;
      box.append(h('label', null, input, h('span', null, '自评 ' + r[0] + ' 分：' + r[1])));
    });
    c.append(box);
    $view.append(c);
  });
  const done = h('div', { class: 'card center' }, finishBtn);
  $view.append(done);
}
function finishMock() {
  const p = S.mockPending;
  let codeself = 0;
  p.detail.forEach(function (d) {
    const q = byId(d.id);
    if (q.type === 'code') {
      d.score = p.self[q.id] || 0;
      codeself += d.score;
      d.ok = d.score >= 5;
      if (!d.ok && !S.wrong.includes(q.id)) S.wrong.push(q.id);
    } else if (!d.ok && !S.wrong.includes(d.id)) {
      S.wrong.push(d.id);
    }
  });
  const total = p.detail.reduce((s, d) => s + d.score, 0);
  S.mockHist.push({ date: todayStr(), machine: p.machine, codeself: codeself, total: total });
  S.mockLast = { detail: p.detail, machine: p.machine, codeself: codeself, total: total };
  S.mockPending = null;
  MOCK_VIEW = 'result';
  save();
  render();
}
function renderMockResult() {
  const m = S.mockLast;
  const card = h('div', { class: 'card center' });
  card.append(
    h('div', { class: 'big-emoji' }, m.total >= 90 ? '🏆' : m.total >= 75 ? '👍' : '📖'),
    h('h2', null, '本次模拟：' + m.total + ' / 100 分'),
    h('p', { class: 'muted' }, '客观题 ' + m.machine + ' / 70 ＋ 编程自评 ' + m.codeself + ' / 30'),
    h('p', { class: 'muted' }, '考后 24 小时内复盘效果最好——下面逐题看解析，错题已进错题本。别忘了回对话发“模拟卷成绩 +XX分”。')
  );
  $view.append(card);
  m.detail.forEach(function (d, i) {
    const q = byId(d.id);
    const c = h('div', { class: 'card' });
    c.append(h('div', { class: 'qtop' },
      h('span', { class: 'pill gray' }, '第' + (i + 1) + '题'),
      h('span', { class: 'pill' }, chTitle(q.ch)),
      h('span', { class: 'pill gray' }, TYPE_NAME[q.type]),
      h('span', { class: 'pill ' + (d.ok ? 'ok' : 'bad') }, d.ok ? '✓ +' + d.score + ' 分' : '✗ +' + (d.score || 0) + ' 分')
    ));
    c.append(h('div', { class: 'qtext' }, q.q));
    if (q.type === 'code') {
      c.append(h('div', { class: 'codebox' }, q.sample));
      if (q.exp) c.append(h('p', { class: 'muted', style: 'margin-top:6px' }, '思路：' + q.exp));
    } else {
      const box = h('div', { class: 'opts' });
      q.opts.forEach(function (opt, oi) {
        const cls = (oi === q.ans ? ' correct' : (oi === d.pick ? ' wrong' : ''));
        box.append(optBtn(oi, opt, 'locked' + cls, null));
      });
      c.append(box);
      c.append(h('div', { class: 'expbox ' + (d.ok ? 'good' : 'bad2') },
        h('b', null, d.ok ? '✅ 答对了' : '❌ 正确答案：' + String.fromCharCode(65 + q.ans)), ' ', q.exp));
    }
    $view.append(c);
  });
  $view.append(h('div', { class: 'card center' },
    h('button', { class: 'btn', onclick: function () { MOCK_VIEW = 'home'; render(); } }, '返回模拟考首页'),
    ' ',
    h('button', { class: 'btn primary', onclick: function () { TAB = 'wrong'; render(); } }, '🔁 去错题本清错题')
  ));
}

/* ================= 统计 ================= */
function renderStats() {
  const all = qb();
  const obj = all.filter(q => q.type !== 'code');
  let r = 0, w = 0;
  obj.forEach(q => { const st = S.stats[q.id]; if (st) { r += st.r; w += st.w; } });
  const covered = obj.filter(q => S.stats[q.id]).length;
  const head = h('div', { class: 'card' },
    h('h2', null, '📊 总体进度'),
    h('p', null, '题库共 ', h('b', null, String(all.length)), ' 题（含编程题 ' + all.filter(q => q.type === 'code').length + ' 道）；',
      '客观题已做 ', h('b', null, covered + '/' + obj.length), '；',
      '总正确率 ', r + w ? h('span', { html: rateHtml(r / (r + w)) }) : '—'),
    h('p', { class: 'muted' }, '目标：12月前客观题正确率 ≥95%、错题本清零。现在离目标还有多远，看下表哪章最弱就先补哪章。')
  );
  $view.append(head);
  const tb = h('table', { class: 'stats' }, h('tr', null, h('th', null, '章节'), h('th', null, '题量'), h('th', null, '已做'), h('th', null, '正确率'), h('th', null, '待清错题'), h('th', null, '')));
  for (let ch = 1; ch <= 10; ch++) {
    const st = chStat(ch);
    const cw = chWrong(ch).length;
    tb.append(h('tr', null,
      h('td', null, '第' + ch + '章 ' + chShort(ch)),
      h('td', null, String(st.n)),
      h('td', null, String(st.touched)),
      h('td', { html: st.rate == null ? '—' : rateHtml(st.rate) }),
      h('td', null, String(cw)),
      h('td', null, h('button', { class: 'btn small', onclick: function () { startChapterQuiz(ch); } }, '去刷'))
    ));
  }
  $view.append(h('div', { class: 'card' }, h('h2', null, '各章掌握情况'), tb));
  const mockCard = h('div', { class: 'card' }, h('h2', null, '模拟考成绩'));
  if (!S.mockHist.length) mockCard.append(h('p', { class: 'muted' }, '还没有模拟考记录，12月冲刺阶段每周一套。'));
  else {
    const mt = h('table', { class: 'stats' }, h('tr', null, h('th', null, '日期'), h('th', null, '总分'), h('th', null, '客观题'), h('th', null, '编程自评')));
    S.mockHist.slice().reverse().forEach(function (m) {
      mt.append(h('tr', null, h('td', null, m.date), h('td', null, String(m.total)), h('td', null, String(m.machine)), h('td', null, String(m.codeself))));
    });
    mockCard.append(mt);
  }
  $view.append(mockCard);
  $view.append(h('div', { class: 'card' },
    h('h2', null, '🔥 连续学习'),
    h('p', null, '已连续学习 ', h('b', null, String(streakCount())), ' 天。中断一天也别自责，第二天接上就行。')
  ));
  /* 知识点热力图 */
  const ts = tagStats();
  if (ts.length) {
    const heat = h('div', { class: 'card' },
      h('h2', null, '🧩 知识点掌握热力图'),
      h('p', { class: 'muted' }, '按正确率从低到高排（做过≥3次才计入）。最上面的就是最该补的——智能练习会自动多推它们。')
    );
    ts.forEach(function (m) {
      if (m.rate == null) return;
      heat.append(h('div', { class: 'heat-row' },
        h('span', { class: 'tname' }, m.tag),
        h('div', { class: 'tbar bar' }, h('div', { style: 'width:' + Math.round(m.rate * 100) + '%;background:' + (m.rate >= 0.85 ? 'var(--ok)' : m.rate >= 0.7 ? 'var(--warn)' : 'var(--bad)') })),
        h('span', { class: 'trate', html: rateHtml(m.rate) })
      ));
    });
    $view.append(heat);
  }
  /* 最近14天学习量 */
  const days = [];
  for (let i = 13; i >= 0; i--) days.push(addDays(todayStr(), -i));
  const maxN = Math.max(10, ...days.map(d => (S.log[d] ? S.log[d].n : 0)));
  const bars = h('div', { class: 'logbars' });
  days.forEach(function (d) {
    const lg = S.log[d];
    const n = lg ? lg.n : 0;
    bars.append(h('div', { class: 'lb' + (n ? '' : ' zero'), title: d + '：' + n + ' 题' },
      h('div', { class: 'cap' }, n ? String(n) : ''),
      h('div', { class: 'bar2', style: 'height:' + Math.max(n ? Math.round(n * 60 / maxN) : 2, 2) + 'px' })
    ));
  });
  $view.append(h('div', { class: 'card' }, h('h2', null, '📈 最近 14 天刷题量'), bars,
    h('p', { class: 'muted' }, '目标：每天至少 10 题。柱子断一天，记忆曲线就会回头咬你——智能练习会把快忘的题再送回来。')));
  /* 模拟考趋势 */
  if (S.mockHist.length >= 2) {
    const H = 90, W = 300, pad = 10;
    const ms = S.mockHist.slice(-10);
    const pts = ms.map(function (m, i) {
      const x = pad + i * ((W - 2 * pad) / Math.max(ms.length - 1, 1));
      const y = H - pad - (m.total / 100) * (H - 2 * pad);
      return Math.round(x) + ',' + Math.round(y);
    });
    const last = ms[ms.length - 1];
    const lx = pad + (ms.length - 1) * ((W - 2 * pad) / Math.max(ms.length - 1, 1));
    const ly = H - pad - (last.total / 100) * (H - 2 * pad);
    $view.append(h('div', { class: 'card trendbox' },
      h('h2', null, '📉 模拟考成绩趋势'),
      h('p', { class: 'muted' }, '共 ' + S.mockHist.length + ' 次模拟，最近 ' + ms.length + ' 次走势（满分100，60分格线为及格目标）：'),
      h('div', { html: '<svg width="' + W + '" height="' + H + '" style="background:#f6f8fa;border-radius:8px">' +
        '<line x1="' + pad + '" y1="' + (H - pad - 0.6 * (H - 2 * pad)) + '" x2="' + (W - pad) + '" y2="' + (H - pad - 0.6 * (H - 2 * pad)) + '" stroke="#fca5a5" stroke-dasharray="4 3"/>' +
        '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#2563eb" stroke-width="2"/>' +
        '<circle cx="' + Math.round(lx) + '" cy="' + Math.round(ly) + '" r="4" fill="#dc2626"/>' +
        '<text x="' + Math.min(Math.round(lx) + 6, W - 40) + '" y="' + Math.max(Math.round(ly) - 6, 14) + '" font-size="12" fill="#1f2937">' + last.total + '分</text>' +
        '</svg>' })
    ));
  }
  /* 备份与汇报 */
  $view.append(h('div', { class: 'card' },
    h('h2', null, '💾 备份 · 汇报 · 自进化'),
    h('p', { class: 'muted' }, '进度存在浏览器本地。换浏览器/换电脑前先导出；平时汇报直接用工作台的「一键生成今日汇报」。'),
    h('div', { class: 'ch-actions' },
      h('button', { class: 'btn primary', onclick: function () { copyText(buildReport(), '汇报已复制，去粘贴给教练吧！'); } }, '📋 一键生成今日汇报'),
      h('button', { class: 'btn', onclick: function () { showTransfer('export'); } }, '💾 导出备份'),
      h('button', { class: 'btn', onclick: function () { showTransfer('import'); } }, '📥 导入备份')
    )
  ));
}

/* ================= 帮助 ================= */
function renderHelp() {
  const steps = h('div', { class: 'card' }, h('h2', null, '🔁 每日学习闭环'));
  [['1', '学', '打开“学习·刷题”，看当天章节的讲义，对照教材和 VSCode 敲示例代码。不求背，求看懂。'],
   ['2', '练', '点“开始刷题”，鼠标点击选项作答，每题立刻出对错和解析。目标：基础题正确率 ≥95%。'],
   ['3', '测', '每章最后一天做编程题：先自己写，再对照参考答案自评。写完可以在 VSCode 里跑一遍验证。'],
   ['4', '补', '睡前打开“错题本”，把今天的错题重做到清零。答对自动移出，答错继续留着。'],
   ['5', '报', '回 ZCode 对话发“今日汇报”：正确率、不懂的题号、编程题代码。我负责批改、抽查、讲透你不会的。']
  ].forEach(function (s) {
    steps.append(h('div', { class: 's' }, h('div', { class: 'num' }, s[0]),
      h('div', null, h('b', null, s[1] + '　'), s[2])));
  });
  $view.append(steps);
  $view.append(h('div', { class: 'card' },
    h('h2', null, '🧾 考试结构（程序设计基础·闭卷120分钟·满分100）'),
    h('table', { class: 'stats' },
      h('tr', null, h('th', null, '题型'), h('th', null, '数量 × 分值'), h('th', null, '合计')),
      h('tr', null, h('td', null, '单项选择题'), h('td', null, '20 × 2分'), h('td', null, '40分')),
      h('tr', null, h('td', null, '程序填空题'), h('td', null, '3 × 5分'), h('td', null, '15分')),
      h('tr', null, h('td', null, '看程序写结果'), h('td', null, '3 × 5分'), h('td', null, '15分')),
      h('tr', null, h('td', null, '程序设计题'), h('td', null, '2 × 15分'), h('td', null, '30分')),
      h('tr', null, h('td', null, '难度比'), h('td', null, '基础70% + 中档20% + 较难10%'), h('td', null, '—'))
    ),
    h('p', { class: 'muted', style: 'margin-top:8px' }, '参考教材：谭浩强《C语言程序设计教程（第4版）》清华大学出版社')
  ));
  $view.append(h('div', { class: 'card' },
    h('h2', null, '💬 随时可以在对话里对我说'),
    h('ul', null,
      h('li', null, '「今日汇报：第3章正确率80%，ch3-12 和 ch3-17 不懂」—— 我会逐题讲解并抽你几道类似的'),
      h('li', null, '「给我讲讲冒泡排序」—— 我用大白话+图解讲到你懂'),
      h('li', null, '「这道编程题帮我看看哪里错了」—— 直接贴代码，我批改'),
      h('li', null, '「今天有事，计划顺延」—— 我帮你调整后面的安排'),
      h('li', null, '「模拟卷 76 分，帮我分析」—— 我根据成绩单给针对性建议')
    )
  ));
  $view.append(h('div', { class: 'card' },
    h('h2', null, '💡 使用小贴士'),
    h('ul', null,
      h('li', null, '进度保存在浏览器本地：请固定用同一个浏览器打开本页，不要清除浏览器数据。'),
      h('li', null, '“摸底5题”是用来暴露问题的，做错很正常——错题自动进错题本，这就是你的私人复习清单。'),
      h('li', null, '编程题一定要亲手敲，看懂 ≠ 会写。VSCode 新建 main.c，跑通一道是一道。'),
      h('li', null, '每天3小时：建议 1小时学 + 1.5小时刷题 + 0.5小时错题与汇报。')
    )
  ));
  $view.append(h('div', { class: 'card' },
    h('h2', null, '🧬 这个系统会自进化'),
    h('ul', null,
      h('li', null, h('b', null, '它越用越懂你：'), '每道题都有知识点标签和记忆等级。做错的题等级归零、明天自动回炉；连对的题间隔 1→2→4→7→15 天才回来；薄弱章节和考点会被智能练习优先推送。'),
      h('li', null, h('b', null, '建议跟着数据变：'), '工作台的「教练建议」每天根据你的正确率、错题量、复习到期数自动更新，照着做就行。'),
      h('li', null, h('b', null, '我也在进化它：'), '发现题目答案有问题、想要新题型、落后需要重排计划——直接在对话里说，我改完你刷新页面就是新版。'),
      h('li', null, h('b', null, '换设备不丢进度：'), '统计页底部可「导出备份/导入备份」，一键搬家。'),
      h('li', null, h('b', null, '碎片时间用法：'), '打开「⚡ 速记手册」翻两张考点卡；学习时用工作台的专注计时器，25分钟一个番茄。'),
      h('li', null, '当前版本：' + VERSION)
    )
  ));
}

/* ================= 启动 ================= */
function streakCount() {
  const set = new Set(S.activeDays);
  let n = 0;
  const d = new Date();
  if (!set.has(todayStr(d))) d.setDate(d.getDate() - 1);
  while (set.has(todayStr(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function init() {
  buildSchedule();
  recordActive();
  document.querySelectorAll('#tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      const t = b.dataset.tab;
      if (t !== 'mock') MOCK_VIEW = 'home';
      setTab(t);
    });
  });
  if (S.mockCurrent || S.mockPending) TAB = 'mock';
  if (!qb().length) {
    $view.innerHTML = '<div class="card"><h2>⚠️ 题库没有加载</h2><p>data 文件夹下的 ch1.js ~ ch10.js 没找到。请保持 学习系统.html 与 data 文件夹在同一目录，再用浏览器打开本页。</p></div>';
    return;
  }
  render();
}
init();

/* ===== PWA：可安装成app（https/localhost生效；局域网http或file://自动跳过） ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}
