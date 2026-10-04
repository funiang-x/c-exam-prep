// 第6章 循环控制
window.QBANK = window.QBANK || [];
window.NOTES = window.NOTES || {};
window.NOTES[6] = {
  title: '第6章 循环控制',
  points: '<h3>📌 本章考点清单</h3>' +
    '<ul>' +
    '<li><b>while</b>：先判断后执行，条件一开始为假则循环体一次都不执行（最少 0 次）。</li>' +
    '<li><b>do-while</b>：先执行后判断，循环体至少执行 1 次；while(表达式) 后面<b>必须有分号</b>。</li>' +
    '<li><b>for(表达式1;表达式2;表达式3)</b>：执行顺序 表达式1 → 表达式2 → 循环体 → 表达式3 → 表达式2…；三个表达式都可省，但两个分号不能省，for(;;) 是死循环。</li>' +
    '<li><b>break</b>：跳出<b>本层</b>循环（或 switch）；<b>continue</b>：结束本次循环，进入下一次循环的判定。</li>' +
    '<li><b>嵌套循环</b>：外层 m 次、内层 n 次，内层循环体共执行 m×n 次；break 只跳出一层。</li>' +
    '<li><b>累加先清零、累乘先置 1</b>；循环变量必须更新，否则死循环。</li>' +
    '<li><b>goto 与语句标号</b>：同一函数内跳转，可以构成循环，考试只要求了解。</li>' +
    '</ul>' +
    '<h3>📖 核心讲解</h3>' +
    '<p><b>1. 三种循环对比（必考）</b></p>' +
    '<table><tr><th></th><th>while</th><th>do-while</th><th>for</th></tr>' +
    '<tr><td>执行顺序</td><td>先判断后执行</td><td>先执行后判断</td><td>表达式1→判断→体→表达式3</td></tr>' +
    '<tr><td>最少执行次数</td><td>0 次</td><td>1 次</td><td>0 次</td></tr>' +
    '<tr><td>适用场景</td><td>次数不确定</td><td>至少做一次（如菜单）</td><td>次数已知（最常用）</td></tr></table>' +
    '<p>三种循环可以互相转换、互相嵌套。条件一开始就为假时：while 执行 0 次，do-while 执行 1 次。</p>' +
    '<p><b>2. for 的执行流程</b>（口诀：①②④③ 循环）</p>' +
    '<pre>for(i=0; i&lt;10; i++)\n    ① i=0          只做 1 次\n    ② i&lt;10 成立？   不成立就退出\n    ④ 循环体\n    ③ i++          然后回到 ②\n/* 循环正常结束时 i=10（第一次不满足条件的值） */</pre>' +
    '<p><b>3. while 与 do-while 的区别</b></p>' +
    '<pre>int x = 10;\nwhile(x &lt; 5) { printf("*"); }      /* 先判断：条件为假，0 个 * */\ndo { printf("*"); } while(x &lt; 5);  /* 先执行一次：1 个 * */</pre>' +
    '<p><b>4. break 与 continue 对比</b></p>' +
    '<pre>for(i=1; i&lt;=5; i++)\n{\n    if(i==3) break;      /* break 跳出整个循环：输出 12 */\n    printf("%d", i);\n}\nfor(i=1; i&lt;=5; i++)\n{\n    if(i==3) continue;   /* continue 只跳过 i=3 这次：输出 1245 */\n    printf("%d", i);\n}</pre>' +
    '<p><b>5. 死循环的写法与退出</b></p>' +
    '<pre>for(;;) { ... }     /* 三个表达式全省，条件恒真 */\nwhile(1) { ... }    /* 条件恒真 */\n/* 循环体内忘记写 i++ 也是死循环 */\n/* 退出方式：break、return、goto */</pre>' +
    '<p><b>6. 经典算法套路（背模板）</b></p>' +
    '<p><b>累加</b>——和先清零：</p>' +
    '<pre>s = 0;\nfor(i=1; i&lt;=100; i++)\n    s = s + i;          /* 1~100 的和 5050 */</pre>' +
    '<p><b>累乘</b>——积先置 1：</p>' +
    '<pre>f = 1;\nfor(i=1; i&lt;=n; i++)\n    f = f * i;          /* n! */</pre>' +
    '<p><b>偶数和</b>：i 从 2 开始每次加 2，或逐个判断 i%2==0。1~100 偶数和是 2550。</p>' +
    '<p><b>计数</b>——计数器清零，满足条件加 1：</p>' +
    '<pre>c = 0;\nfor(i=1; i&lt;=100; i++)\n    if(i%3==0) c++;     /* 统计 1~100 中 3 的倍数个数 */</pre>' +
    '<p><b>水仙花数</b>（三位数等于各位数字的立方和）——关键是分离各位：</p>' +
    '<pre>a = n/100; b = n/10%10; c = n%10;   /* 百位、十位、个位 */\nif(a*a*a + b*b*b + c*c*c == n) printf("%d", n);</pre>' +
    '<p><b>素数判断</b>：</p>' +
    '<pre>for(i=2; i&lt;=n-1; i++)\n    if(n%i == 0) break;      /* 能被整除，不是素数 */\nif(i &gt;= n) printf("yes");    /* 循环跑完都没被整除则是素数 */</pre>' +
    '<p><b>斐波那契数列</b>（1 1 2 3 5 8 …）——滚动递推：</p>' +
    '<pre>f1 = 1; f2 = 1;\nfor(i=1; i&lt;=20; i++)\n{\n    printf("%d %d ", f1, f2);\n    f1 = f1 + f2;    /* f1 变成下一项 */\n    f2 = f1 + f2;    /* f2 变成再下一项 */\n}</pre>' +
    '<p><b>九九乘法表</b>——嵌套循环 + 换行：</p>' +
    '<pre>for(i=1; i&lt;=9; i++)\n{\n    for(j=1; j&lt;=i; j++)\n        printf("%d*%d=%d  ", j, i, i*j);\n    printf("\\n");        /* 每行结束换行 */\n}</pre>' +
    '<h3>⚠️ 易错陷阱清单</h3>' +
    '<ul>' +
    '<li><b>while() 后多写分号</b>：while(i&lt;10); 循环体变成空语句，可能死循环。</li>' +
    '<li><b>do-while 少分号</b>：}while(表达式) 后面的分号不能省，省了语法错误。</li>' +
    '<li><b>循环变量不更新</b>：循环体内忘记 i++，条件永远成立，死循环。</li>' +
    '<li><b>把 = 当 ==</b>：while(i=1) 是赋值，值恒为 1，死循环。</li>' +
    '<li><b>for 后多分号</b>：for(i=0;i&lt;10;i++); 分号成了循环体，后面的语句只执行一次。</li>' +
    '<li><b>break 与 continue 用混</b>：break 跳出整层循环，continue 只跳过本次；break 不能用在单独的 if 里（必须处在循环或 switch 中）。</li>' +
    '<li><b>累加不清零、累乘不置 1</b>：s 没清零会多加；f 初值为 0 则乘积恒为 0。</li>' +
    '<li><b>嵌套循环</b>：内外层不能用同一个循环变量；break 只跳出它所在的那一层。</li>' +
    '</ul>'
};
window.QBANK.push(
  { id: 'ch6-1', ch: 6, type: 'single', q: '关于 while 语句和 do-while 语句，下列说法正确的是（　）。', opts: ['两者都至少执行 1 次循环体', '两者都可能一次也不执行循环体', '当循环条件一开始就为假时，while 执行 0 次，do-while 执行 1 次', '当循环条件一开始就为假时，while 执行 1 次，do-while 执行 0 次'], ans: 2, exp: 'while 先判断后执行，条件为假一次都不做；do-while 先执行后判断，无论条件如何至少做 1 次。' },
  { id: 'ch6-2', ch: 6, type: 'single', q: 'do-while 语句中，while(表达式) 的末尾（　）。', opts: ['必须有分号', '可有可无', '必须没有分号', '必须用逗号'], ans: 0, exp: 'do-while 的语法是 do 循环体 while(表达式); 这个分号是语句结束的标志，不能省。' },
  { id: 'ch6-3', ch: 6, type: 'single', q: 'for(表达式1; 表达式2; 表达式3) { 循环体 } 的执行顺序是（　）。', opts: ['表达式1 → 表达式2 → 表达式3 → 循环体，循环', '表达式1 → 循环体 → 表达式2 → 表达式3，循环', '表达式2 → 表达式1 → 循环体 → 表达式3，循环', '表达式1 → 表达式2 → 循环体 → 表达式3，再回到表达式2'], ans: 3, exp: '表达式1 只执行一次，之后不断重复"表达式2判断 → 循环体 → 表达式3"；表达式3 在循环体之后才执行。' },
  { id: 'ch6-4', ch: 6, type: 'single', q: '执行 for(i=0; i<10; i+=3) printf("*"); 后，输出的 * 个数和循环结束时 i 的值是（　）。', opts: ['4次，结束时 i=12', '3次，结束时 i=9', '4次，结束时 i=10', '10次，结束时 i=12'], ans: 0, exp: 'i 依次取 0、3、6、9，共执行 4 次；i 加到 12 时 12<10 不成立退出，i 最终是 12 而不是 10。' },
  { id: 'ch6-5', ch: 6, type: 'single', q: '有以下程序段：\nint i;\nfor(i=0; i<10; i++);\nprintf("%d", i);\n执行后的输出是（　）。', opts: ['0123456789', '10', '012345678910', '9'], ans: 1, exp: 'for 后面的分号是一条空语句，它才是循环体，printf 不在循环内。循环结束后 i=10，只输出 10。易错点：for() 后多写分号。' },
  { id: 'ch6-6', ch: 6, type: 'single', q: 'continue 语句的作用是（　）。', opts: ['结束本次循环，接着进行下一次是否循环的判定', '终止整个循环的执行', '跳出 switch 语句', '结束整个程序的运行'], ans: 0, exp: 'continue 只跳过本次循环体中剩下的语句，回到条件判断处；终止整个循环用的是 break。' },
  { id: 'ch6-7', ch: 6, type: 'single', q: '有以下程序段：\nint i;\nfor(i=1; i<=5; i++)\n{\n    if(i==3) break;\n    printf("%d", i);\n}\n执行后的输出是（　）。', opts: ['12345', '1245', '12', '123'], ans: 2, exp: 'i=1、2 时输出 1、2；i=3 时遇到 break 直接跳出循环，4、5 不再执行。若换成 continue 则输出 1245。' },
  { id: 'ch6-8', ch: 6, type: 'single', q: '在双重循环中，内层循环体里的 break 语句（　）。', opts: ['跳出双重循环', '只跳出内层循环', '跳过内层循环的本次执行', '结束整个程序'], ans: 1, exp: 'break 只能跳出它所在的那一层循环，外层循环继续执行。要一次跳出多层需要用标志变量或 goto。' },
  { id: 'ch6-9', ch: 6, type: 'single', q: '语句 for(;;) printf("*"); 的执行结果是（　）。', opts: ['只输出一个 *', '一个 * 也不输出', '无限输出 *', '语法错误'], ans: 2, exp: 'for 的三个表达式都可以省略，但两个分号不能省。省略表达式2 相当于条件恒真，是死循环。' },
  { id: 'ch6-10', ch: 6, type: 'single', q: '有以下程序段：\nint x=10;\nwhile(x<5)\n{\n    printf("*");\n    x++;\n}\n执行后输出 * 的个数是（　）。', opts: ['0个', '1个', '5个', '无限个'], ans: 0, exp: 'while 先判断：10<5 不成立，循环体一次都不执行，输出 0 个 *。若改成 do-while 则会先执行一次，输出 1 个。' },
  { id: 'ch6-11', ch: 6, type: 'single', q: '有以下程序段：\nint i, j;\nfor(i=0; i<2; i++)\n    for(j=0; j<3; j++)\n        printf("*");\n执行后输出 * 的个数是（　）。', opts: ['2', '3', '5', '6'], ans: 3, exp: '外层执行 2 次，每次外层中内层完整执行 3 次，共 2×3=6 个 *。嵌套循环次数 = 外层次数 × 内层次数。' },
  { id: 'ch6-12', ch: 6, type: 'single', q: '用循环求 n!（阶乘）时，存放阶乘结果的变量 f 应初始化为（　）。', opts: ['0', '1', '-1', 'n'], ans: 1, exp: '累乘的初值必须是 1：f=f*i 中若 f 初值为 0，乘任何数都是 0。记住口诀：累加清零，累乘置 1。' },
  { id: 'ch6-13', ch: 6, type: 'single', q: 'while(i) 等价于（　）。', opts: ['while(i!=0)', 'while(i==0)', 'while(i>0)', 'while(i<0)'], ans: 0, exp: '条件 i 非 0 即真，等价于 while(i!=0)。i 为负数时 while(i) 仍成立，所以 while(i>0) 不等价。' },
  { id: 'ch6-14', ch: 6, type: 'single', q: '下列程序段中，会构成死循环的是（　）。', opts: ['int i=1; while(i<10){ i++; }', 'int i=1; while(i<10) printf("*");', 'int i=1; while(i<10){ printf("*"); i++; }', 'int i; for(i=0; i<3; i++);'], ans: 1, exp: '选项 B 的循环体内没有对 i 更新，i 永远是 1，条件 i<10 永远成立。死循环最常见的原因就是循环变量不更新。' },
  { id: 'ch6-15', ch: 6, type: 'single', q: '关于 break 语句，下列说法正确的是（　）。', opts: ['break 可以用在任意语句中', 'if 语句中可以单独使用 break', 'break 只能用在循环语句和 switch 语句中', 'break 能一次跳出所有循环'], ans: 2, exp: 'break 的适用范围只有两种：循环语句和 switch。它只跳出本层，不能一次跳出所有循环。' },
  { id: 'ch6-16', ch: 6, type: 'single', q: '关于 goto 语句和语句标号，下列说法正确的是（　）。', opts: ['标号必须是一个数字', 'goto 可以跳转到另一个函数中', 'goto 必须与 break 配合使用', 'goto 只能在同一函数内跳转，配合标号可以构成循环'], ans: 3, exp: 'goto 的用法是 goto 标号; 标号用"标识符:"定义，只在同一函数内有效。滥用 goto 破坏结构化，考试只要求了解。' },
  { id: 'ch6-17', ch: 6, type: 'judge', q: 'while 循环的条件一开始就为假时，循环体一次也不执行。', opts: ['正确', '错误'], ans: 0, exp: 'while 先判断后执行，这是它与 do-while（至少执行 1 次）的本质区别。' },
  { id: 'ch6-18', ch: 6, type: 'judge', q: 'continue 语句的作用是终止整个循环的执行。', opts: ['正确', '错误'], ans: 1, exp: 'continue 只结束本次循环、跳到下一次循环的判定；终止整个循环的是 break。' },
  { id: 'ch6-19', ch: 6, type: 'judge', q: 'for 语句的三个表达式都可以省略，但两个分号不能省略。', opts: ['正确', '错误'], ans: 0, exp: 'for(;;) 是合法写法，相当于 while(1) 死循环；分号起分隔作用，必须保留。' },
  { id: 'ch6-20', ch: 6, type: 'judge', q: 'goto 语句可以从一个函数跳转到另一个函数。', opts: ['正确', '错误'], ans: 1, exp: 'goto 和标号只在同一函数内有效，不能跨函数跳转。' },
  { id: 'ch6-21', ch: 6, type: 'blank', q: '程序功能：求 1+2+3+…+100 的值。请补全 for 语句的第三个表达式。\n#include <stdio.h>\nint main()\n{\n    int i, s = 0;\n    for(i=1; i<=100; ____)\n        s = s + i;\n    printf("s=%d", s);\n    return 0;\n}', opts: ['i--', 'i+=2', 'i++', 'i=i+3'], ans: 2, exp: '求和需要 i 从 1 到 100 每次加 1，用 i++。i+=2 会隔一个加一个，i-- 则 i 越来越小永远到不了 100，死循环。' },
  { id: 'ch6-22', ch: 6, type: 'blank', q: '程序功能：输入 n，求 n!。请补全累乘变量的初始化语句。\n#include <stdio.h>\nint main()\n{\n    int i, n;\n    long f;\n    scanf("%d", &n);\n    ____;\n    for(i=1; i<=n; i++)\n        f = f * i;\n    printf("%d!=%ld", n, f);\n    return 0;\n}', opts: ['f=1', 'f=0', 'f=n', 'f=i'], ans: 0, exp: '累乘初值必须是 1：f=0 时任何乘积都是 0；f=n 或 f=i 会随输入变化而出错。' },
  { id: 'ch6-23', ch: 6, type: 'blank', q: '程序功能：输出 1~9 中的奇数。请补全关键字。\n#include <stdio.h>\nint main()\n{\n    int i;\n    for(i=1; i<=9; i++)\n    {\n        if(i%2==0)\n            ____;\n        printf("%d", i);\n    }\n    return 0;\n}', opts: ['break', 'continue', 'exit', 'return'], ans: 1, exp: '遇到偶数用 continue 结束本次循环，跳过 printf 进入下一次循环，所以只输出奇数 13579。若用 break，i=2 时就直接退出整个循环了。' },
  { id: 'ch6-24', ch: 6, type: 'read', q: '写出下面程序的运行结果。\n#include <stdio.h>\nint main()\n{\n    int i;\n    for(i=1; i<=5; i++)\n    {\n        if(i==3) continue;\n        printf("%d", i);\n    }\n    return 0;\n}', opts: ['1245', '12345', '124', '12'], ans: 0, exp: 'i=3 时 continue 跳过 printf，其余的 i 都输出，所以是 1245。若把 continue 换成 break 则只输出 12，注意区分。' },
  { id: 'ch6-25', ch: 6, type: 'read', q: '写出下面程序的运行结果（共输出三行）。\n#include <stdio.h>\nint main()\n{\n    int i, j;\n    for(i=1; i<=3; i++)\n    {\n        for(j=1; j<=i; j++)\n            printf("%d", j);\n        printf("\\n");\n    }\n    return 0;\n}', opts: ['123\n123\n123', '1\n22\n333', '1\n12\n123', '111\n222\n333'], ans: 2, exp: '外层 i=1、2、3，内层 j 从 1 数到 i：第一行输出 1，第二行输出 12，第三行输出 123，每行结束换行。这是数字三角形经典题，内层次数受外层 i 控制。' },
  { id: 'ch6-26', ch: 6, type: 'read', q: '写出下面程序的运行结果。\n#include <stdio.h>\nint main()\n{\n    int x=5;\n    do\n    {\n        printf("%d", x);\n        x--;\n    } while(x>0);\n    return 0;\n}', opts: ['4321', '543210', '5432', '54321'], ans: 3, exp: 'do-while 先执行后判断：依次输出 5、4、3、2、1，x 减到 0 时条件 0>0 不成立退出，输出 54321。' },
  { id: 'ch6-27', ch: 6, type: 'code', q: '编写完整程序：求 1~100 中所有偶数之和，并输出结果。', sample: '#include <stdio.h>\nint main()\n{\n    int i, s = 0;\n    for(i=2; i<=100; i=i+2)\n        s = s + i;\n    printf("s=%d\\n", s);\n    return 0;\n}', exp: '思路：累加和 s 先清零。让 i 从 2 开始每次加 2，只取到偶数（结果 2550）；也可以写成 for(i=1;i<=100;i++) 配合 if(i%2==0) s=s+i; 两种写法都要会。' },
  { id: 'ch6-28', ch: 6, type: 'code', q: '编写完整程序：输入一个正整数 n，求 n!（n 的阶乘，即 1×2×3×…×n），并输出结果。', sample: '#include <stdio.h>\nint main()\n{\n    int i, n;\n    long f = 1;\n    scanf("%d", &n);\n    for(i=1; i<=n; i++)\n        f = f * i;\n    printf("%d!=%ld\\n", n, f);\n    return 0;\n}', exp: '思路：累乘变量 f 必须初始化为 1（为 0 则结果恒为 0），循环 i 从 1 到 n 做 f=f*i。阶乘增长很快，f 用 long 型，输出用 %ld。n=0 时循环一次都不执行，输出 0!=1，也符合阶乘定义。' },
  { id: 'ch6-29', ch: 6, type: 'code', q: '编写完整程序：输出所有的水仙花数。水仙花数是指一个三位数，它等于其各位数字的立方和，例如 153 = 1*1*1 + 5*5*5 + 3*3*3。', sample: '#include <stdio.h>\nint main()\n{\n    int n, a, b, c;\n    for(n=100; n<=999; n++)\n    {\n        a = n / 100;        /* 百位 */\n        b = n / 10 % 10;    /* 十位 */\n        c = n % 10;         /* 个位 */\n        if(a*a*a + b*b*b + c*c*c == n)\n            printf("%d\\n", n);\n    }\n    return 0;\n}', exp: '思路：用 for 把 100~999 的所有三位数逐个检查。关键是分离各位：百位 n/100、十位 n/10%10、个位 n%10。判断立方和等于本身要用 ==（两个等号）。结果共 4 个：153、370、371、407。' }
);
