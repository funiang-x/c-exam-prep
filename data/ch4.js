/* ============================================================
   题库 · 第4章 最简单的C程序设计——顺序程序设计
   教材：谭浩强《C语言程序设计教程（第4版）》
   type: single 单选 | judge 判断 | blank 程序填空 | read 看程序写结果 | code 编程题
   ============================================================ */
window.QBANK = window.QBANK || [];
window.NOTES = window.NOTES || {};

window.NOTES[4] = {
  title: '第4章 最简单的C程序设计——顺序程序设计',
  points:
    '<h3>📌 本章考点清单</h3>' +
    '<ul>' +
    '<li><b>C 语句五大类</b>：控制语句、函数调用语句、表达式语句、空语句（;）、复合语句（{}括起）；每条简单语句以分号结尾。</li>' +
    '<li><b>printf 格式符</b>：%d、%f、%c、%s、%ld、%u、%o、%x、%e、%%；%f 默认输出 6 位小数。</li>' +
    '<li><b>宽度与精度</b>：%5d 宽度 5 右对齐；%.2f 保留 2 位小数；%5.2f 总宽 5（含小数点）；%-8.2f 左对齐。</li>' +
    '<li><b>scanf</b>：普通变量必须加 &amp; 取地址；多个 %d 之间用空格/回车/Tab 分隔；%c 不跳过空格和回车。</li>' +
    '<li><b>字符输入输出</b>：putchar 输出一个字符；getchar 读入一个字符（回车也算字符）。</li>' +
    '<li><b>double 的读写</b>：scanf 用 %lf，printf 用 %f 即可。</li>' +
    '<li><b>赋值语句 vs 赋值表达式</b>：表达式有值可嵌套，语句以分号结尾不能再嵌套。</li>' +
    '</ul>' +
    '<h3>📖 核心讲解</h3>' +
    '<h4>1. C 语句五大类</h4>' +
    '<table>' +
    '<tr><th>类别</th><th>例子</th></tr>' +
    '<tr><td>控制语句</td><td>if、for、while、do-while、switch、break、continue、return 等</td></tr>' +
    '<tr><td>函数调用语句</td><td>printf("hello");</td></tr>' +
    '<tr><td>表达式语句</td><td>a = 3 * 5;（表达式加分号）</td></tr>' +
    '<tr><td>空语句</td><td>;（只有一个分号，什么也不做）</td></tr>' +
    '<tr><td>复合语句</td><td>{ t=a; a=b; b=t; }（{} 括起，{} 外不加分号）</td></tr>' +
    '</table>' +
    '<h4>2. printf 详解</h4>' +
    '<p>格式：printf(格式控制串, 输出列表); 普通字符原样输出，格式符被输出列表中的数据依次替换。</p>' +
    '<pre><code>printf("%5d", 42);       /* □□□42   宽度5，右对齐补空格 */\nprintf("%.2f", 3.14159); /* 3.14     保留2位小数 */\nprintf("%5.2f", 3.14159);/* □3.14    总宽5（含小数点） */\nprintf("%-8.2f", 1.5);   /* 1.50□□□□ 负号=左对齐 */\nprintf("100%%");         /* 100%     %%输出百分号本身 */</code></pre>' +
    '<p>（□表示一个空格）%m.nf：m 是总宽度，n 是小数位数，右对齐左边补空格；m 前加负号则左对齐右边补空格。</p>' +
    '<h4>3. 常用格式符速查</h4>' +
    '<table>' +
    '<tr><th>格式符</th><th>对应数据</th><th>示例</th></tr>' +
    '<tr><td>%d / %ld</td><td>int / long</td><td>printf("%d", 42); 得 42</td></tr>' +
    '<tr><td>%u</td><td>unsigned int</td><td>printf("%u", 10); 得 10</td></tr>' +
    '<tr><td>%o / %x</td><td>八进制 / 十六进制</td><td>printf("%x", 255); 得 ff</td></tr>' +
    '<tr><td>%f / %e</td><td>小数 / 指数形式</td><td>printf("%e", 123.4); 得 1.234000e+02</td></tr>' +
    '<tr><td>%c</td><td>一个字符</td><td>printf("%c", \'A\'); 得 A</td></tr>' +
    '<tr><td>%s</td><td>字符串</td><td>printf("%s", "hi"); 得 hi</td></tr>' +
    '<tr><td>%%</td><td>百分号本身</td><td>printf("100%%"); 得 100%</td></tr>' +
    '</table>' +
    '<h4>4. scanf 详解</h4>' +
    '<pre><code>int a, b;\nscanf("%d%d", &amp;a, &amp;b);   /* 必须加 &amp; 取地址 */\n/* 输入时两个数之间用空格、回车或 Tab 分隔均可 */</code></pre>' +
    '<p>经典陷阱：scanf("%d%c", &amp;n, &amp;c); 中 %c 不跳过空格和回车——输入 12 A 时，c 读到的是空格而不是 A。</p>' +
    '<h4>5. putchar 与 getchar</h4>' +
    '<pre><code>char ch;\nch = getchar();   /* 读一个字符，回车也算一个字符 */\nputchar(ch);      /* 输出一个字符 */</code></pre>' +
    '<h4>6. double 的读写</h4>' +
    '<pre><code>double d;\nscanf("%lf", &amp;d);     /* 输入必须用 %lf，用 %f 读不进去 */\nprintf("%f", d);      /* 输出用 %f 就行，默认6位小数 */</code></pre>' +
    '<h3>⚠️ 易错陷阱清单</h3>' +
    '<ul>' +
    '<li>scanf 少写 &amp;：编译一般能通过，但数据存不进变量，是最常见的隐蔽错误。</li>' +
    '<li>double 用 scanf 读入时写成 %f 会出错，必须用 %lf。</li>' +
    '<li>%c 会把空格、回车也读走：scanf("%d%c",...) 输入 12 A 时 c 得到的是空格。</li>' +
    '<li>语句漏写分号，编译报错却常常指向下一行。</li>' +
    '<li>printf 里想输出 % 本身要连写两个 %%。</li>' +
    '<li>%5d 右对齐，空格补在左边；%-8.2f 左对齐，空格补在右边。</li>' +
    '<li>a/b 整除之后再赋给 double 不会变回小数：7/2 得 3.00 而不是 3.50。</li>' +
    '<li>复合语句用 {} 把多条语句括起来，{} 本身后面不需要再加分号。</li>' +
    '</ul>'
};

window.QBANK.push(
  { id: 'ch4-1', ch: 4, type: 'single', q: '以下选项中，不属于C语句的是（　）。', opts: ['a = 3 * 5', ';', '{ a = 1; b = 2; }', 'a = 3;'], ans: 0, exp: '表达式后面加上分号才是表达式语句，a=3*5 没加分号只是表达式；; 是空语句，{} 括起来的是复合语句，a=3; 是表达式语句。' },
  { id: 'ch4-2', ch: 4, type: 'single', q: '以下选项中，属于复合语句的是（　）。', opts: ['a = 1;', ';', '{ int t; t = a; a = b; b = t; }', 'printf("hi");'], ans: 2, exp: '用一对花括号把若干语句括起来就构成复合语句，语法上相当于一条语句；{} 外面不需要再加分号。' },
  { id: 'ch4-3', ch: 4, type: 'single', q: '语句 printf("a=%d,b=%d", 3, 4 + 5); 的输出结果是（　）。', opts: ['a=3,b=9', 'a=%d,b=%d', 'a=3,b=4', 'a=3,b=45'], ans: 0, exp: '格式串中的 %d 依次被输出列表中的数据替换，4+5 先算出 9 再输出；a=、b= 和逗号都是普通字符，原样输出。' },
  { id: 'ch4-4', ch: 4, type: 'single', q: '语句 printf("%5d", 42); 的输出结果是（　）。（选项中□表示一个空格）', opts: ['42□□□', '□□□42', '00042', '□□42'], ans: 1, exp: '%5d 指定输出宽度为 5，数据不足 5 位时右对齐、左边补空格，所以是 3 个空格加 42；printf 不会用 0 填充。' },
  { id: 'ch4-5', ch: 4, type: 'single', q: '语句 printf("%.2f", 3.14159); 的输出结果是（　）。', opts: ['3.14159', '3.1', '3.15', '3.14'], ans: 3, exp: '%.2f 表示保留 2 位小数输出，第 3 位四舍五入：3.14159 的小数点后第 3 位是 1，舍去得 3.14。' },
  { id: 'ch4-6', ch: 4, type: 'single', q: '语句 printf("%5.2f", 3.14159); 的输出结果是（　）。（选项中□表示一个空格）', opts: ['3.14□', '□3.14', '3.14', '□□3.14'], ans: 1, exp: '%5.2f 中 5 是总宽度（含小数点）、2 是小数位数：3.14 只有 4 位，右对齐左边补 1 个空格，即 □3.14。' },
  { id: 'ch4-7', ch: 4, type: 'single', q: '语句 printf("%-8.2f", 1.5); 的输出结果是（　）。（选项中□表示一个空格）', opts: ['□□□□1.50', '1.500000', '1.50□□□□', '1.50'], ans: 2, exp: '%-8.2f 中的负号表示左对齐：输出 1.50 后右边补 4 个空格凑满总宽度 8；没有负号时空格补在左边。' },
  { id: 'ch4-8', ch: 4, type: 'single', q: '设有定义 double x = 2.5; 语句 printf("%f", x); 的输出结果是（　）。', opts: ['2.5', '2.500000', '2.50', '%f'], ans: 1, exp: '%f 默认输出 6 位小数，不足的补 0，所以输出 2.500000；只想输出 2 位小数要写成 %.2f。' },
  { id: 'ch4-9', ch: 4, type: 'single', q: '已有定义 int a; 要通过键盘输入 a 的值，正确的输入语句是（　）。', opts: ['scanf("%d", a);', 'scanf("%lf", &a);', 'scanf("%d", *a);', 'scanf("%d", &a);'], ans: 3, exp: 'scanf 必须把变量的地址告诉它，普通变量前要加 & 取地址；%lf 对应 double，int 型要用 %d。' },
  { id: 'ch4-10', ch: 4, type: 'single', q: '执行 scanf("%d%d", &a, &b); 时，输入的两个整数之间可以用下列哪个字符分隔（　）。', opts: ['逗号', '分号', '空格', '冒号'], ans: 2, exp: '多个 %d 之间可用空格、回车或 Tab 键分隔（它们都是空白符）；逗号不是分隔符，除非格式串本身写成"%d,%d"。' },
  { id: 'ch4-11', ch: 4, type: 'single', q: '已有定义 int n; char c; 执行 scanf("%d%c", &n, &c); 时从键盘输入（12 与 A 之间有一个空格）：\n12 A\n则变量 c 得到的字符是（　）。', opts: ['字母A', '回车符', '空格', '数字1'], ans: 2, exp: '%c 不跳过空格和回车：%d 读走 12 后，紧跟其后的空格被 %c 读走，所以 c 得到的是空格；想读到 A 应输入 12A。' },
  { id: 'ch4-12', ch: 4, type: 'single', q: '已有定义 double d; 下列正确的输入语句是（　）。', opts: ['scanf("%f", &d);', 'scanf("%lf", d);', 'scanf("%d", &d);', 'scanf("%lf", &d);'], ans: 3, exp: 'double 变量用 scanf 读入必须用 %lf，写成 %f 读不进去；漏写 & 也不行。输出时用 %f 即可。' },
  { id: 'ch4-13', ch: 4, type: 'single', q: '关于赋值语句和赋值表达式，下列说法正确的是（　）。', opts: ['赋值表达式有值，可以嵌套在其他表达式中；赋值语句以分号结尾，不能再嵌套', '两者完全相同，可以混用', '赋值语句可以出现在算术表达式中', '赋值表达式末尾必须写分号'], ans: 0, exp: '如 x=(a=5)+2 中嵌套的是赋值表达式（它有值）；加了分号就成了语句，语句不能再作为表达式的一部分。' },
  { id: 'ch4-14', ch: 4, type: 'single', q: '语句 printf("%x,%o", 255, 8); 的输出结果是（　）。', opts: ['ff,10', 'FF,8', '255,10', 'ff,8'], ans: 0, exp: '%x 按十六进制输出：255 的十六进制是 ff；%o 按八进制输出：8 的八进制是 10。' },
  { id: 'ch4-15', ch: 4, type: 'judge', q: 'printf 函数的格式串中，%% 用来输出一个百分号本身。', opts: ['正确', '错误'], ans: 0, exp: '% 在格式串中是特殊字符，想输出百分号本身必须连写两个：printf("100%%") 输出 100%。' },
  { id: 'ch4-16', ch: 4, type: 'judge', q: 'getchar() 每次只能读取一个字符，回车符也会作为一个有效字符被读入。', opts: ['正确', '错误'], ans: 0, exp: 'getchar 一次从输入缓冲区读一个字符，空格、回车都不跳过；连续输入 ab 后回车，第三个 getchar 读到的就是回车符。' },
  { id: 'ch4-17', ch: 4, type: 'judge', q: 'scanf 语句中如果漏写了取地址符 &，编译时一定会报错，程序无法通过编译。', opts: ['正确', '错误'], ans: 1, exp: '漏写 & 在语法上没错，编译一般能通过，但输入的数据存不进变量，运行时可能出错或结果不对，是最常见的隐蔽错误。' },
  { id: 'ch4-18', ch: 4, type: 'blank', q: '下面程序的功能是输入两个整数并原样输出，请补全程序：\n#include <stdio.h>\nint main()\n{\n    int a, b;\n    printf("input a and b:");\n    scanf("%d%d", ____);\n    printf("a=%d,b=%d\\n", a, b);\n    return 0;\n}\n横线处应填（　）。', opts: ['a, b', '&a, &b', '*a, *b', 'a, &b'], ans: 1, exp: 'scanf 需要的是变量的地址，普通变量前必须加 &：&a, &b；直接写 a、b 传的是值不是地址，输入存不进变量。' },
  { id: 'ch4-19', ch: 4, type: 'blank', q: '下面程序要按保留 2 位小数的格式输出平均分，请补全程序：\n#include <stdio.h>\nint main()\n{\n    double s = 85.678;\n    printf("avg=____\\n", s);   /* 保留 2 位小数 */\n    return 0;\n}\n横线处应填（　）。', opts: ['%.2d', '%2f', '%.2f', '%.f2'], ans: 2, exp: '%.2f 按 2 位小数输出（四舍五入得 85.68）；%.2d 是整数格式符；%2f 里的宽度 2 起不了作用，仍按 %f 输出 6 位小数。' },
  { id: 'ch4-20', ch: 4, type: 'blank', q: '下面程序的功能是交换两个变量的值，请补全程序：\n#include <stdio.h>\nint main()\n{\n    int a = 3, b = 5, t;\n    ____;        /* 将 a 的值暂存到 t 中 */\n    a = b;\n    b = t;\n    printf("a=%d,b=%d\\n", a, b);\n    return 0;\n}\n横线处应填（　）。', opts: ['a = t', 't = b', 'b = t', 't = a'], ans: 3, exp: '三变量交换的固定套路：t=a 暂存 → a=b → b=t，执行后 a=5、b=3；若第一句写成 a=t，t 还没有值，交换就乱了。' },
  { id: 'ch4-21', ch: 4, type: 'read', q: '有以下程序\n#include <stdio.h>\nint main()\n{\n    int a = 42;\n    double x = 3.14159;\n    printf("%d\\n", a);\n    printf("%5d\\n", a);\n    printf("%.2f\\n", x);\n    return 0;\n}\n程序运行后的输出结果是（　）。（选项中□表示一个空格）', opts: ['42\\n42□□□\\n3.14', '42\\n□□□42\\n3.14159', '42\\n□□□42\\n3.14', '42\\n□□□42\\n3.15'], ans: 2, exp: '42 按 %d 原样输出；%5d 宽度 5 右对齐，左边补 3 个空格；%.2f 保留 2 位小数得 3.14。' },
  { id: 'ch4-22', ch: 4, type: 'read', q: '有以下程序\n#include <stdio.h>\nint main()\n{\n    int n;\n    char c;\n    scanf("%d%c", &n, &c);\n    printf("n=%d,c=%c\\n", n, c);\n    return 0;\n}\n运行时输入（12 与 A 之间有一个空格）：12 A\n程序运行后的输出结果是（　）。（选项中□表示一个空格）', opts: ['n=12,c=A', 'n=12,c=□', 'n=1,c=2', 'n=12,c=12'], ans: 1, exp: '%d 读走 12 后，%c 不跳过空格，把紧随其后的空格读走，所以输出 n=12,c=□。这是 %d 和 %c 连用时的经典陷阱。' },
  { id: 'ch4-23', ch: 4, type: 'read', q: '有以下程序\n#include <stdio.h>\nint main()\n{\n    char c1, c2, c3;\n    c1 = getchar();\n    c2 = getchar();\n    c3 = getchar();\n    putchar(c1);\n    putchar(c2);\n    putchar(c3);\n    return 0;\n}\n运行时输入：ab 后回车\n程序运行后的输出结果是（　）。', opts: ['输出ab后换一行', '输出ab后不换行', '只输出a', '输出abab'], ans: 0, exp: '前两个 getchar 读到 a 和 b，第三个读到的是回车符；putchar 把它原样输出，效果就是输出 ab 后换行。回车也算一个字符。' },
  { id: 'ch4-24', ch: 4, type: 'read', q: '有以下程序\n#include <stdio.h>\nint main()\n{\n    int a = 7, b = 2;\n    double m;\n    m = a / b;\n    printf("m=%.2f\\n", m);\n    printf("r=%d\\n", a % b);\n    return 0;\n}\n程序运行后的输出结果是（　）。', opts: ['m=3.50\\nr=1', 'm=3\\nr=1', 'm=3.00\\nr=1.0', 'm=3.00\\nr=1'], ans: 3, exp: 'a/b 是两个 int 先整除得 3，再转 double 得 3.00（不是 3.50）；7%2=1。整数除法发生在赋值之前。' },
  { id: 'ch4-25', ch: 4, type: 'code',
    q: '编写一个完整的C程序：从键盘输入一个华氏温度 f，计算并输出对应的摄氏温度 c（保留 2 位小数）。换算公式：c = 5.0 * (f - 32) / 9。',
    sample: '#include <stdio.h>\n' +
            'int main()\n' +
            '{\n' +
            '    double f, c;\n' +
            '    scanf("%lf", &f);\n' +
            '    c = 5.0 * (f - 32) / 9;\n' +
            '    printf("c=%.2f\\n", c);\n' +
            '    return 0;\n' +
            '}',
    exp: '思路：按公式 c = 5.0*(f-32)/9 计算，千万不能写成 5/9*(f-32)，因为 5/9 是整数相除结果为 0；double 读入用 %lf，输出用 %.2f 保留 2 位小数。' }
);
