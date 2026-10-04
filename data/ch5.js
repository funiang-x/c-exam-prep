// 第5章 选择结构程序设计
window.QBANK = window.QBANK || [];
window.NOTES = window.NOTES || {};
window.NOTES[5] = {
  title: '第5章 选择结构程序设计',
  points: '<h3>📌 本章考点清单</h3>' +
    '<ul>' +
    '<li><b>关系运算符</b>：&lt; &lt;= &gt; &gt;= 优先级相同（高于 == !=）；关系表达式的值只有 1（真）和 0（假）。</li>' +
    '<li><b>逻辑运算符</b>：优先级 ! → &amp;&amp; → ||；C语言里<b>任意非 0 值都算真</b>（-1 也是真）。</li>' +
    '<li><b>优先级链</b>（高→低）：! → 算术 → 关系 → &amp;&amp; → || → 赋值=。</li>' +
    '<li><b>短路求值</b>：a&amp;&amp;b 左边为 0 时右边不算；a||b 左边非 0 时右边不算。</li>' +
    '<li><b>if 三种形式</b>：单分支、双分支 if-else、多分支 if-else if-else；if(x) 等价于 if(x!=0)。</li>' +
    '<li><b>else 配对</b>：与前面最近的、尚未配对的 if 配对，与缩进无关。</li>' +
    '<li><b>条件表达式</b>：a&gt;b ? a : b，与 if-else 可互相改写。</li>' +
    '<li><b>switch</b>：case 后只能是常量或常量表达式；无 break 时落空往下执行；所有 case 都不匹配才执行 default。</li>' +
    '</ul>' +
    '<h3>📖 核心讲解</h3>' +
    '<p><b>1. 关系表达式的值是 1 或 0</b>：3+2&gt;4 先算 3+2 得 5，再算 5&gt;4，整个表达式值为 1，可以赋给 int 变量。连续比较 c&gt;b&gt;a 是从左到右一步步算，不是数学上的含义。</p>' +
    '<p><b>2. == 与 = 混用（必考送分题）</b></p>' +
    '<pre>if(a=5)   赋值，表达式值恒为 5，条件恒真\nif(a=0)   赋值 0，条件恒假，else 分支必执行\nif(a==5)  这才是判断 a 是否等于 5</pre>' +
    '<p><b>3. 闰年表达式（必背）</b>：year%4==0 &amp;&amp; year%100!=0 || year%400==0。&amp;&amp; 优先级高于 ||，不加括号也正确，但加括号更清晰。</p>' +
    '<p><b>4. 短路求值（读程序高频）</b></p>' +
    '<pre>int a=1, b=2, c=3, d=4, m=1, n=1;\n(m=a&gt;b) &amp;&amp; (n=c&gt;d);\n/* a&gt;b 为 0，m 被赋成 0；左边已假，\n   右边 n=c&gt;d 不执行，n 仍是 1 */</pre>' +
    '<p><b>5. if 三种形式模板</b></p>' +
    '<pre>/* 单分支 */\nif(x &gt; 0)\n    printf("positive");\n\n/* 双分支 */\nif(a &gt; b)\n    max = a;\nelse\n    max = b;\n\n/* 多分支：从上往下依次判断，命中一个分支后其余全跳过 */\nif(score &gt;= 90)      printf("A");\nelse if(score &gt;= 80) printf("B");\nelse if(score &gt;= 60) printf("C");\nelse                 printf("D");</pre>' +
    '<p><b>6. 悬空 else</b></p>' +
    '<pre>if(a &gt; 5)\n    if(b &gt; 5)\n        printf("A");\n    else\n        printf("B");\n/* else 与内层 if 配对（最近的未配对 if），\n   外层条件为假时整个 if-else 都不执行 */</pre>' +
    '<p><b>7. 条件表达式</b>：max = (a&gt;b) ? a : b; 等价于 if-else 双分支。问号后是"条件成立"的结果，冒号后是"不成立"的结果。</p>' +
    '<p><b>8. switch 模板与 break 的作用</b></p>' +
    '<pre>switch(score / 10)\n{\ncase 10:\ncase 9:  printf("A"); break;   /* 10 和 9 共用一段：前一个 case 落空 */\ncase 8:  printf("B"); break;\ncase 6:  printf("D"); break;\ndefault: printf("E");          /* 最后一段可不加 break */\n}\n/* 没 break 会继续往下执行后面 case 的语句；\n   所有 case 都不匹配时从 default 开始执行；\n   case 后只能是整型/字符型常量，不能是变量、实型或区间 */</pre>' +
    '<h3>⚠️ 易错陷阱清单</h3>' +
    '<ul>' +
    '<li>把 <b>== 写成 =</b>：if(a=5) 恒真、if(a=0) 恒假，而且 a 的值被偷偷改掉。</li>' +
    '<li>if 后面<b>乱加分号</b>：if(a&gt;b); 相当于条件只控制一条空语句，后面的语句照常执行。</li>' +
    '<li>if 后多条语句<b>不加花括号</b>：只有第一条受控制。经典题 if(a&gt;b) t=a; b=a; a=b; 只有 t=a 受控，输出 1,1。</li>' +
    '<li><b>else 配对</b>看结构不看缩进：总是配最近的未配对 if。</li>' +
    '<li>switch <b>忘写 break</b> 导致落空；case 后写变量、实型常量、case 90..100 这种区间都是错的。</li>' +
    '<li>逻辑运算里<b>非 0 都算真</b>：!(-1) 是 0，!0 是 1；x 为负数时 if(x) 同样成立。</li>' +
    '<li>关系表达式连写 a&lt;b&lt;c 不等于数学含义：先算 a&lt;b 得 0 或 1，再拿 0 或 1 和 c 比。</li>' +
    '</ul>'
};
window.QBANK.push(
  { id: 'ch5-1', ch: 5, type: 'single', q: '下列运算符中，优先级最高的是（　）。', opts: ['==', '>=', '&&', '||'], ans: 1, exp: '关系运算符（如>=）优先级高于相等运算符==，更高于逻辑运算符&&和||。优先级链：关系 → == != → && → ||。' },
  { id: 'ch5-2', ch: 5, type: 'single', q: '在C语言中，关系表达式 a>b 的值是（　）。', opts: ['0或1', 'true或false', 'a和b中较大的值', '无法确定'], ans: 0, exp: 'C语言没有true/false这种布尔值，关系表达式的值用 1 表示真、0 表示假，是 int 型的 1 和 0。' },
  { id: 'ch5-3', ch: 5, type: 'single', q: '已知 int a=3, b=4, c=5; 则表达式 c>b>a 的值是（　）。', opts: ['1', '5', '0', '语法错误'], ans: 2, exp: '关系运算符从左到右结合：先算 c>b 即 5>4 得 1，再算 1>a 即 1>3 得 0。连续比较要一步步算，不能按数学含义理解。' },
  { id: 'ch5-4', ch: 5, type: 'single', q: '有以下程序段：\nint a=0;\nif(a=5)\n    printf("yes");\nelse\n    printf("no");\n执行后的输出是（　）。', opts: ['no', 'yes', '不输出任何内容', '编译出错'], ans: 1, exp: 'if(a=5) 括号里是赋值不是判断，赋值表达式的值是 5，非 0 即真，所以输出 yes。最经典的 = 与 == 混用陷阱。' },
  { id: 'ch5-5', ch: 5, type: 'single', q: '已知 int a=1, b=2, c=3, d=4, m=1, n=1;\n执行语句 (m=a>b) && (n=c>d); 后，m、n 的值是（　）。', opts: ['m=0, n=1', 'm=0, n=0', 'm=1, n=1', 'm=0, n=4'], ans: 0, exp: 'a>b 为假，m 被赋成 0；&& 左边为 0 时发生短路，右边 n=c>d 不被执行，n 保持原值 1。这是短路求值的经典考题。' },
  { id: 'ch5-6', ch: 5, type: 'single', q: '能正确表示"year 是闰年"的逻辑表达式是（　）。', opts: ['year%4==0', 'year%400==0', '(year%4==0 && year%100!=0) || year%400==0', 'year%4!=0 || year%100!=0'], ans: 2, exp: '闰年条件：能被4整除但不能被100整除，或者能被400整除。只写 year%4==0 会把 1900 这种整百年误判成闰年。' },
  { id: 'ch5-7', ch: 5, type: 'single', q: '与 if(x) 中的条件（x 为 int 型）完全等价的写法是（　）。', opts: ['if(x==0)', 'if(x!=0)', 'if(x>0)', 'if(x==1)'], ans: 1, exp: 'if(x) 的含义是 x 非 0 就成立，等价于 if(x!=0)。x 为 -1 时条件也成立，所以 if(x>0) 不等价。' },
  { id: 'ch5-8', ch: 5, type: 'single', q: '有以下程序段：\nint a=2, b=3;\nif(a>5)\n    if(b>5)\n        printf("A");\n    else\n        printf("B");\nprintf("C");\n执行后的输出是（　）。', opts: ['A', 'B', 'C', 'BC'], ans: 2, exp: 'else 与它前面最近的未配对 if（内层 if(b>5)）配对。外层条件 a>5 为假，内层整个 if-else 都不执行，只输出最后的 C。' },
  { id: 'ch5-9', ch: 5, type: 'single', q: '有以下程序段：\nint a=1, b=2, t;\nif(a>b)\n    t=a;\nb=a;\na=b;\nprintf("%d,%d", a, b);\n执行后的输出是（　）。', opts: ['1,2', '2,1', '2,2', '1,1'], ans: 3, exp: 'if 后面没有花括号，只能控制紧跟的一条语句 t=a。条件为假 t=a 不执行；b=a 使 b 变 1，a=b 使 a 变 1，输出 1,1。想交换必须给三条语句加花括号。' },
  { id: 'ch5-10', ch: 5, type: 'single', q: '已知 int x=-5, y;\ny = x>0 ? 1 : -1;\n则 y 的值是（　）。', opts: ['1', '0', '-1', '-5'], ans: 2, exp: 'x=-5 不大于 0，条件表达式取冒号后面的 -1。它等价于 if(x>0) y=1; else y=-1; 双分支。' },
  { id: 'ch5-11', ch: 5, type: 'single', q: '关于 switch 语句中 case 后面的内容，下列说法正确的是（　）。', opts: ['可以是变量', '可以是实型常量', '可以是任意表达式', '只能是整型或字符型的常量、常量表达式，且各 case 互不相同'], ans: 3, exp: 'case 后只能放整型或字符型常量（常量表达式），不能用变量、实型，也不能写区间。' },
  { id: 'ch5-12', ch: 5, type: 'single', q: '有以下程序段：\nint x=2;\nswitch(x)\n{\ncase 1: printf("1");\ncase 2: printf("2");\ncase 3: printf("3"); break;\ncase 4: printf("4");\n}\n执行后的输出是（　）。', opts: ['2', '23', '234', '123'], ans: 1, exp: '从 case 2 进入输出 2，case 2 后没有 break，落空继续执行 case 3 输出 3，遇到 break 才结束。case 1 在入口之前，不会被执行。' },
  { id: 'ch5-13', ch: 5, type: 'single', q: '有以下程序段：\nint x=5;\nswitch(x)\n{\ncase 1: printf("A"); break;\ndefault: printf("D");\ncase 2: printf("B");\n}\n执行后的输出是（　）。', opts: ['A', 'B', 'D', 'DB'], ans: 3, exp: 'x=5 没有匹配的 case，从 default 进入输出 D；default 后面没有 break，继续落空执行 case 2 的语句输出 B。' },
  { id: 'ch5-14', ch: 5, type: 'single', q: '逻辑运算符 !、&&、|| 按优先级从高到低排列，正确的是（　）。', opts: ['! → && → ||', '&& → ! → ||', '|| → && → !', '&& → || → !'], ans: 0, exp: '! 最高，&& 其次，|| 最低。完整优先级链是：! → 算术 → 关系 → && → || → 赋值。' },
  { id: 'ch5-15', ch: 5, type: 'judge', q: '在C语言中，if(a=0) 与 if(a==0) 的判断效果相同。', opts: ['正确', '错误'], ans: 1, exp: 'if(a=0) 是赋值，表达式值恒为 0，条件恒假；if(a==0) 才是判断 a 是否等于 0，两者效果不同。' },
  { id: 'ch5-16', ch: 5, type: 'judge', q: 'else 总是与它前面最近的、尚未配对的 if 配对。', opts: ['正确', '错误'], ans: 0, exp: 'else 配对只看结构（最近的未配对 if），与缩进和书写位置无关。' },
  { id: 'ch5-17', ch: 5, type: 'judge', q: 'switch 语句中，每个 case 后面都必须写 break 语句，否则编译出错。', opts: ['正确', '错误'], ans: 1, exp: 'break 可以省略，省略后发生"落空"，继续执行后面 case 的语句，这不是语法错误。case 10: case 9: 共用一段正是利用落空。' },
  { id: 'ch5-18', ch: 5, type: 'judge', q: 'if 语句的条件可以是任意表达式，只要表达式的值非 0 就执行 if 后面的语句。', opts: ['正确', '错误'], ans: 0, exp: 'if 的条件不限于关系或逻辑表达式，赋值、算术表达式都可以，判据是"非 0 即真"。' },
  { id: 'ch5-19', ch: 5, type: 'blank', q: '程序功能：输入两个整数，输出较大的数。请补全 if 括号中的条件。\n#include <stdio.h>\nint main()\n{\n    int a, b, max;\n    scanf("%d%d", &a, &b);\n    if(____)\n        max = a;\n    else\n        max = b;\n    printf("max=%d", max);\n    return 0;\n}', opts: ['a<b', 'a==b', 'a>b', 'max>a'], ans: 2, exp: 'a>b 成立说明较大的是 a，把 a 赋给 max；否则较大的是 b。注意条件是关系表达式 a>b，不能写成赋值 a=b。' },
  { id: 'ch5-20', ch: 5, type: 'blank', q: '程序功能：输入百分制成绩，用 switch 输出等级。请补全 switch 括号中的表达式。\n#include <stdio.h>\nint main()\n{\n    int score;\n    scanf("%d", &score);\n    switch(____)\n    {\n    case 10:\n    case 9: printf("A"); break;\n    case 8: printf("B"); break;\n    case 7: printf("C"); break;\n    case 6: printf("D"); break;\n    default: printf("E");\n    }\n    return 0;\n}', opts: ['score%10', 'score/10', 'score*10', 'score-10'], ans: 1, exp: 'score/10 把成绩压缩成 0~10 的整数，才能与 case 9、case 8 等常量一一对应。score%10 得到的是个位数字，无法划分等级。' },
  { id: 'ch5-21', ch: 5, type: 'blank', q: '程序功能：输入一个整数，偶数输出 ou，奇数输出 ji。请补全关键字。\n#include <stdio.h>\nint main()\n{\n    int x;\n    scanf("%d", &x);\n    if(x%2==0)\n        printf("ou");\n    ____\n        printf("ji");\n    return 0;\n}', opts: ['else', 'else if', 'if', 'break'], ans: 0, exp: '这是 if-else 双分支：条件成立走 if 分支，不成立走 else 分支，else 后面不能再跟条件。' },
  { id: 'ch5-22', ch: 5, type: 'read', q: '写出下面程序的运行结果。\n#include <stdio.h>\nint main()\n{\n    int a=2, b=3, c=1;\n    if(a>b)\n        if(a>c)\n            printf("%d", a);\n        else\n            printf("%d", b);\n    return 0;\n}', opts: ['2', '3', '无任何输出', '编译错误'], ans: 2, exp: 'else 与内层 if(a>c) 配对。外层条件 a>b 即 2>3 为假，内层整个 if-else 都不执行，程序没有任何输出。这是悬空 else 的经典题。' },
  { id: 'ch5-23', ch: 5, type: 'read', q: '写出下面程序的运行结果。\n#include <stdio.h>\nint main()\n{\n    int x=0;\n    if(x>0)\n        printf("1");\n    else if(x==0)\n        printf("0");\n    else\n        printf("-1");\n    return 0;\n}', opts: ['-1', '0', '1', '不输出'], ans: 1, exp: '多分支从上往下判断：x>0 不成立，x==0 成立就执行第二个分支输出 0，后面的分支不再判断。整个 if-else if-else 只会执行其中一个分支。' },
  { id: 'ch5-24', ch: 5, type: 'code', q: '编写完整程序：输入一个年份 year，判断它是否为闰年。闰年条件：能被4整除但不能被100整除，或者能被400整除。是闰年输出 yes，否则输出 no。', sample: '#include <stdio.h>\nint main()\n{\n    int year;\n    scanf("%d", &year);\n    if((year%4==0 && year%100!=0) || year%400==0)\n        printf("yes\\n");\n    else\n        printf("no\\n");\n    return 0;\n}', exp: '思路：闰年 =（能被4整除且不能被100整除）或（能被400整除），把这句话直接翻译成一个逻辑表达式，配合 if-else 输出。要点：% 是求余；&& 比 || 优先级高；输入用 scanf("%d",&year)。例如 2000 输出 yes，1900 输出 no。' },
  { id: 'ch5-25', ch: 5, type: 'code', q: '编写完整程序：输入一个百分制成绩 score（0~100 的整数），用 switch 语句输出等级：90~100 为 A，80~89 为 B，70~79 为 C，60~69 为 D，60 以下为 E。', sample: '#include <stdio.h>\nint main()\n{\n    int score;\n    scanf("%d", &score);\n    switch(score/10)\n    {\n    case 10:\n    case 9:  printf("A\\n"); break;\n    case 8:  printf("B\\n"); break;\n    case 7:  printf("C\\n"); break;\n    case 6:  printf("D\\n"); break;\n    default: printf("E\\n");\n    }\n    return 0;\n}', exp: '思路：case 后只能写单个常量，写不了区间，所以用 score/10 把 100 种取值压缩成 0~10 共 11 种。case 10 和 case 9 后面都不写语句，落空到下一行共用 printf("A")；每个等级后必须 break 防止落空；default 处理 60 分以下。' }
);
