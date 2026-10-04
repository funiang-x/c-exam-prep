// 第7章 数组
window.QBANK = window.QBANK || [];
window.NOTES = window.NOTES || {};
window.NOTES[7] = {
  title: '第7章 数组',
  points: '<h3>📌 本章考点清单</h3>' +
    '<ul>' +
    '<li><b>一维数组</b>：定义 <code>int a[10];</code>，下标 0~9；引用 <code>a[10]</code> 是越界（编译不查、运行出错）。</li>' +
    '<li><b>一维初始化</b>：<code>int a[5]={1,2};</code> 其余自动为 0；<code>int a[]={1,2,3};</code> 长度自动为 3；<code>int a[5]={0};</code> 全零惯用写法。</li>' +
    '<li><b>遍历处理</b>：循环累加求和、打擂台求最大值（记下标）、首尾交换逆置。</li>' +
    '<li><b>二维数组</b>：<code>int a[2][3];</code> 按行优先存放；<code>{{1},{4,5}}</code> 缺的补 0；行数可省、列数不能省。</li>' +
    '<li><b>字符数组与字符串</b>：<code>char s[10]="abc";</code> 存 a、b、c、\'\\0\'；\'\\0\' 是结束标志，必须留一个位置。</li>' +
    '<li><b>strlen 与 sizeof</b>：<code>char s[10]="abc";</code> strlen=3、sizeof=10；strlen("abc\\0def")=3。</li>' +
    '<li><b>字符串函数</b>：strlen 求长、strcpy 复制、strcat 连接、strcmp 比较（相等返回 0）。</li>' +
    '<li><b>高频算法</b>：打擂台、冒泡排序、逆置、回文判断、大小写转换（-32 / +32）。</li>' +
    '</ul>' +
    '<h3>📖 核心讲解</h3>' +
    '<h4>1. 一维数组：定义、初始化、下标</h4>' +
    '<p>定义形式：<code>类型名 数组名[长度];</code>。<b>下标从 0 开始，最大下标 = 长度 - 1</b>。定义 int a[5]; 后能用的只有 a[0]~a[4]，写 a[5] 就是越界。</p>' +
    '<pre>int a[5] = {1, 2};      /* 得到 1 2 0 0 0，其余自动补 0 */\nint b[]  = {1, 2, 3};   /* 长度自动确定为 3 */\nint c[100] = {0};       /* 100 个元素全为 0 的惯用写法 */\nfor(i=0; i&lt;5; i++)      /* 遍历模板 */\n    printf("%d ", a[i]);</pre>' +
    '<h4>2. 打擂台求最大值（记下标）与逆置</h4>' +
    '<pre>/* 打擂台：k 记录最大值的下标 */\nint a[6] = {3,7,2,9,5,1}, i, k = 0;\nfor(i=1; i&lt;6; i++)\n    if(a[i] &gt; a[k]) k = i;      /* 最大值就是 a[k] */\n\n/* 逆置：首尾交换，只循环一半 */\nfor(i=0; i&lt;5/2; i++)\n{\n    t = a[i]; a[i] = a[4-i]; a[4-i] = t;\n}</pre>' +
    '<h4>3. 二维数组</h4>' +
    '<p><code>int a[2][3];</code> 是 2 行 3 列共 6 个元素，内存中<b>按行优先</b>连续存放：a[0][0], a[0][1], a[0][2], a[1][0], a[1][1], a[1][2]。</p>' +
    '<pre>int a[2][3] = {{1},{4,5}};\n/* 第一行: 1 0 0 ；第二行: 4 5 0 （缺的自动补 0） */\n\nint b[][3] = {1,2,3,4,5,6};   /* 对：行数可省，自动分 2 行 */\nint c[2][];                   /* 错：列数不能省！ */\n\nfor(i=0; i&lt;2; i++)            /* 双重循环：外层行、内层列 */\n    for(j=0; j&lt;3; j++)\n        s = s + a[i][j];</pre>' +
    '<h4>4. 字符数组与结束标志 \'\\0\'</h4>' +
    '<p><code>char s[10]="abc";</code> 里依次存放 a、b、c、\'\\0\'。存 n 个字符的字符串，数组长度至少要 n+1，<b>多出来的那个位置就是给结束标志留的</b>——没有 \'\\0\'，printf、strlen 等函数就不知道字符串到哪里结束。</p>' +
    '<pre>char s[10] = "abc";\nstrlen(s)           /* 3  ：数到 \'\\0\' 为止，不含 \'\\0\' */\nsizeof(s)           /* 10 ：数组总共占的字节数 */\nstrlen("abc\\0def")  /* 3  ：遇到第一个 \'\\0\' 就停 */\n\n/* 逐个处理字符串的标准循环（必背） */\nfor(i=0; s[i]!=\'\\0\'; i++)\n    { /* 对 s[i] 做处理 */ }</pre>' +
    '<h4>5. 字符数组的三种输入方式</h4>' +
    '<table><tr><th>方式</th><th>写法</th><th>特点</th></tr>' +
    '<tr><td>scanf %s</td><td><code>scanf("%s", s);</code></td><td>遇空格/回车/Tab 结束；s 前<b>不加</b> &amp;</td></tr>' +
    '<tr><td>gets</td><td><code>gets(s);</code></td><td>读一整行，可以带空格，回车结束</td></tr>' +
    '<tr><td>逐个字符</td><td><code>while((s[i]=getchar())!=\'\\n\') i++;</code></td><td>最灵活，适合按字符处理</td></tr></table>' +
    '<p>注意：<code>char s[10]; s="abc";</code> 是非法的——数组名是地址常量，不能整体赋值。定义时可以 <code>char s[10]="abc";</code>，之后想重新赋值只能 <code>strcpy(s,"abc");</code>。</p>' +
    '<h4>6. 常用字符串函数速查（#include &lt;string.h&gt;）</h4>' +
    '<table><tr><th>函数</th><th>功能</th><th>备注</th></tr>' +
    '<tr><td>strlen(s)</td><td>求串长（不含 \'\\0\'）</td><td>结果可以赋给 int 变量</td></tr>' +
    '<tr><td>strcpy(s1,s2)</td><td>把 s2 复制到 s1</td><td>不能写 s1=s2</td></tr>' +
    '<tr><td>strcat(s1,s2)</td><td>把 s2 接到 s1 后面</td><td>s1 要足够长</td></tr>' +
    '<tr><td>strcmp(s1,s2)</td><td>逐字符比较两串</td><td><b>相等返回 0</b>，s1 大返回正数、s1 小返回负数</td></tr></table>' +
    '<p>大小写转换：小写→大写 <code>s[i]=s[i]-32;</code>，大写→小写 <code>s[i]=s[i]+32;</code>（也可用 toupper / tolower）。</p>' +
    '<h4>7. 经典模板：冒泡排序与回文</h4>' +
    '<pre>/* 冒泡排序（10 个数升序）——必背 */\nfor(i=0; i&lt;9; i++)              /* 9 趟 */\n    for(j=0; j&lt;9-i; j++)        /* 每趟比较 9-i 次 */\n        if(a[j] &gt; a[j+1])\n        {\n            t = a[j]; a[j] = a[j+1]; a[j+1] = t;\n        }\n\n/* 回文判断：i 从头、j 从尾向中间靠 */\nj = strlen(s) - 1;\nfor(i=0; i&lt;j; i++, j--)\n    if(s[i] != s[j]) { flag = 0; break; }</pre>' +
    '<h3>⚠️ 易错陷阱清单</h3>' +
    '<ul>' +
    '<li><b>下标越界 a[5]</b>：int a[5]; 只有 a[0]~a[4]；C 编译不查越界，运行可能出错。</li>' +
    '<li><b>s = "abc";</b>：数组名不能整体赋值，必须 strcpy(s,"abc"); 或定义时初始化。</li>' +
    '<li><b>scanf("%s",&amp;s)</b>：s 本身就是地址，前面<b>不加</b> &amp;。</li>' +
    '<li><b>strlen / sizeof 混淆</b>：char s[10]="abc"; strlen 是 3（内容长度），sizeof 是 10（数组大小）。</li>' +
    '<li><b>忘给 \'\\0\' 留位置</b>：存 10 个字符要开长度 11 的数组。</li>' +
    '<li><b>strcmp 结果</b>：相等返回 0 而不是 1；返回值的正负代表两串的大小关系。</li>' +
    '<li><b>二维数组省列数</b>：int a[2][]; 错；行数可省、列数必写。</li>' +
    '<li><b>初值个数超长度</b>：int a[3]={1,2,3,4}; 编译出错。</li>' +
    '</ul>'
};
window.QBANK.push(
  { id: 'ch7-1', ch: 7, type: 'single', q: '已定义 int a[10]; 则数组元素下标的合法范围是（　）。', opts: ['1~10', '0~9', '0~10', '1~9'], ans: 1, exp: '数组下标从 0 开始，int a[10]; 的合法下标是 0~9。a[10] 越界，是最常见的错误。' },
  { id: 'ch7-2', ch: 7, type: 'single', q: '已定义 int a[5]; 下列对数组元素的引用中错误的是（　）。', opts: ['a[0]', 'a[5-1]', 'a[5]', 'a[2+2]'], ans: 2, exp: '合法下标是 0~4，a[5] 越界。C 编译系统不检查下标越界，运行时可能得到错误结果甚至破坏数据。' },
  { id: 'ch7-3', ch: 7, type: 'single', q: '已定义 int a[5]={1,2}; 则 a[3] 的值是（　）。', opts: ['0', '2', '1', '编译出错'], ans: 0, exp: '初始化时只给前两个元素赋值，其余元素自动为 0，所以 a[3] 是 0。注意不是"不确定"。' },
  { id: 'ch7-4', ch: 7, type: 'single', q: '已定义 int a[]={1,2,3,4,5}; 则数组 a 的长度是（　）。', opts: ['4', '3', '不确定', '5'], ans: 3, exp: '定义并初始化时省略长度，编译器按初值个数自动确定长度为 5。' },
  { id: 'ch7-5', ch: 7, type: 'single', q: '要把整型数组 a 的 5 个元素全部初始化为 0，正确的写法是（　）。', opts: ['int a[5]=0;', 'int a[5]={1};', 'int a[5]={0};', 'int a[5]=0,0,0,0,0;'], ans: 2, exp: 'int a[5]={0}; 使第一个元素为 0，其余自动补 0，是全零的惯用写法。A、D 不符合语法，B 只把 a[0] 初始化为 1。' },
  { id: 'ch7-6', ch: 7, type: 'single', q: '下列二维数组的定义中正确的是（　）。', opts: ['int a[2,3];', 'int a[2][3];', 'int a[2][];', 'int a[][];'], ans: 1, exp: '二维数组定义必须写两个方括号，且列数不能省略，正确形式如 int a[2][3];。' },
  { id: 'ch7-7', ch: 7, type: 'single', q: '已定义 int a[2][3]={{1},{4,5}}; 则 a[1][2] 的值是（　）。', opts: ['5', '1', '0', '4'], ans: 2, exp: '按行分组初始化：第一行是 1 0 0，第二行是 4 5 0，缺失的元素自动补 0，故 a[1][2]=0。' },
  { id: 'ch7-8', ch: 7, type: 'single', q: '下列对二维数组的初始化中，合法的是（　）。', opts: ['int a[2][]={{1,2,3},{4,5,6}};', 'int a[][]={{1,2},{3,4}};', 'int a[][3]={1,2,3,4,5,6};', 'int a[2][3]={{1,2},{3,4,5,6}};'], ans: 2, exp: '初始化时行数可以省略（自动分组），列数绝不能省。D 选项第二行给了 4 个数，超过列数 3，编译出错。' },
  { id: 'ch7-9', ch: 7, type: 'single', q: '二维数组在内存中的存放顺序是（　）。', opts: ['按列优先存放', '随机存放', '按行优先存放', '按元素大小存放'], ans: 2, exp: '二维数组按行优先存放：先存第 0 行的全部元素，再存第 1 行，依此类推。' },
  { id: 'ch7-10', ch: 7, type: 'single', q: '已定义 char s[10]="abc"; 则 s[3] 中存放的是（　）。', opts: ['空格字符', "'c'", "'\\0'", '不确定的值'], ans: 2, exp: '字符串常量"abc"末尾自动加结束标志\'\\0\'，所以 s[3] 存放的是\'\\0\'。' },
  { id: 'ch7-11', ch: 7, type: 'single', q: '已定义 char s[10]="abc"; 则 strlen(s) 和 sizeof(s) 的值分别是（　）。', opts: ['10 和 3', '3 和 3', '10 和 10', '3 和 10'], ans: 3, exp: 'strlen 统计\'\\0\'之前的字符个数，结果 3；sizeof 求数组占的总字节数，结果 10。两者极易混淆。' },
  { id: 'ch7-12', ch: 7, type: 'single', q: '表达式 strlen("abc\\0def") 的值是（　）。', opts: ['3', '7', '6', '4'], ans: 0, exp: 'strlen 遇到第一个\'\\0\'就停止统计，"abc\\0def" 的有效字符只有 abc，故结果为 3 而不是 7。' },
  { id: 'ch7-13', ch: 7, type: 'single', q: '已定义 char s[10]; 要把字符串"abc"存入 s，下列语句正确的是（　）。', opts: ['s="abc";', 's[10]="abc";', 'strcpy(s,"abc");', 'scanf("%s",&s);'], ans: 2, exp: '数组名是地址常量，不能整体赋值，必须用 strcpy 复制。scanf 的 s 前也不能加 &，s 本身就是地址。' },
  { id: 'ch7-14', ch: 7, type: 'single', q: '执行 scanf("%s", s); 时从键盘输入 how are you，则字符数组 s 中得到的是（　）。', opts: ['how are you', 'are you', 'howareyou', 'how'], ans: 3, exp: 'scanf 用 %s 输入字符串时遇空格、回车或 Tab 即结束，所以 s 只得到 how。要读入带空格的整行应使用 gets。' },
  { id: 'ch7-15', ch: 7, type: 'single', q: '要从键盘输入一行可能含空格的字符串存入字符数组 s，应使用的语句是（　）。', opts: ['gets(s);', 'scanf("%s",s);', 'scanf("%c",s);', 'puts(s);'], ans: 0, exp: 'gets 能读入包括空格在内的整行字符，遇回车结束；scanf("%s",s) 遇空格就停；puts 是输出函数。' },
  { id: 'ch7-16', ch: 7, type: 'single', q: '若字符串 s1 与 s2 内容完全相同，则 strcmp(s1,s2) 的返回值是（　）。', opts: ['1', '-1', '0', '两串长度之差'], ans: 2, exp: 'strcmp 按字典序逐个字符比较：相等返回 0，s1 大返回正数，s1 小返回负数。' },
  { id: 'ch7-17', ch: 7, type: 'single', q: '函数 strcat(s1,s2) 的功能是（　）。', opts: ['把 s2 连接到 s1 的后面', '比较 s1 和 s2 的大小', '把 s1 复制到 s2 中', '交换 s1 和 s2 的内容'], ans: 0, exp: 'strcat(s1,s2) 把 s2 接到 s1 的末尾，结果存放在 s1 中，要求 s1 足够长。' },
  { id: 'ch7-18', ch: 7, type: 'single', q: '字符数组 s 中存放的是小写字母，要把 s[i] 转换成对应的大写字母，正确的写法是（　）。', opts: ['s[i]=s[i]+32;', 's[i]=s[i]-32;', "s[i]=s[i]-'0';", 's[i]=s[i]*2;'], ans: 1, exp: '小写字母的 ASCII 码比对应大写字母大 32，减 32 即转大写；加 32 是大写转小写。' },
  { id: 'ch7-19', ch: 7, type: 'single', q: '有以下程序段：\nint a[6]={3,7,2,9,5,1}, i, k=0;\nfor(i=1; i<6; i++)\n    if(a[i]>a[k]) k=i;\nprintf("%d,%d\\n", a[k], k);\n执行后输出结果是（　）。', opts: ['3,9', '9,9', '1,5', '9,3'], ans: 3, exp: '打擂台法中 k 记录最大值的下标：最大值 9 在 a[3]，故输出 9,3。注意 printf 里先输出 a[k]（最大值），再输出 k（下标）。' },
  { id: 'ch7-20', ch: 7, type: 'judge', q: 'C 语言对数组下标越界不作检查，如 int a[5]; 后引用 a[5]，编译时不一定报错，但运行时可能出错。', opts: ['正确', '错误'], ans: 0, exp: 'C 编译系统不检查下标越界，越界引用编译能通过，但可能破坏内存中的数据，是隐蔽的错误。' },
  { id: 'ch7-21', ch: 7, type: 'judge', q: '已定义 char s[10]; 执行 s="abc"; 就能把字符串"abc"存入数组 s。', opts: ['正确', '错误'], ans: 1, exp: '数组名是地址常量，不能被赋值。只能定义时初始化，或用 strcpy 复制，或逐个元素赋值。' },
  { id: 'ch7-22', ch: 7, type: 'judge', q: '二维数组 int a[2][3] 的 6 个元素在内存中按行优先的顺序连续存放。', opts: ['正确', '错误'], ans: 0, exp: '先存 a[0][0]、a[0][1]、a[0][2]，再存 a[1][0]、a[1][1]、a[1][2]，内存中是连续的。' },
  { id: 'ch7-23', ch: 7, type: 'judge', q: '字符串"abc"在内存中占用 3 个字节。', opts: ['正确', '错误'], ans: 1, exp: '字符串末尾有结束标志\'\\0\'，"abc"实际占 4 个字节。strlen("abc") 是 3，占用字节数是 4，两者不一样。' },
  { id: 'ch7-24', ch: 7, type: 'blank', q: '程序功能：用"打擂台"法求数组中的最大值。请补全 if 语句的条件。\n#include <stdio.h>\nint main()\n{\n    int a[6]={8,3,9,1,6,4}, i, max;\n    max = a[0];\n    for(i=1; i<6; i++)\n        if(____)\n            max = a[i];\n    printf("max=%d\\n", max);\n    return 0;\n}', opts: ['a[i]>max', 'a[i]<max', 'max>a[i]', 'a[i]>a[0]'], ans: 0, exp: '打擂台法：max 先当擂主，后面的元素比 max 大就替换它，条件是 a[i]>max。B、C 方向反了，D 是每次都跟第一个元素比。' },
  { id: 'ch7-25', ch: 7, type: 'blank', q: '程序功能：把数组 a 中的 5 个元素逆置（首尾交换）。请补全交换语句。\n#include <stdio.h>\nint main()\n{\n    int a[5]={1,2,3,4,5}, i, t;\n    for(i=0; i<2; i++)\n    {\n        t = a[i];\n        ____;\n        a[4-i] = t;\n    }\n    for(i=0; i<5; i++)\n        printf("%d ", a[i]);\n    return 0;\n}', opts: ['a[4-i]=a[i];', 'a[i]=a[4-i];', 'a[i]=t;', 'a[i+1]=a[i];'], ans: 1, exp: '三步交换：t 暂存 a[i]，把 a[4-i] 交给 a[i]，最后把 t 交给 a[4-i]，故填 a[i]=a[4-i];。程序运行后输出 5 4 3 2 1。' },
  { id: 'ch7-26', ch: 7, type: 'read', q: '写出下面程序的运行结果。\n#include <stdio.h>\nint main()\n{\n    int a[6]={1,2,3,4,5,6}, i, s=0;\n    for(i=1; i<6; i+=2)\n        s = s + a[i];\n    printf("%d\\n", s);\n    return 0;\n}', opts: ['21', '12', '9', '6'], ans: 1, exp: '循环取下标 1、3、5 的元素：a[1]+a[3]+a[5]=2+4+6=12。注意 i 从 1 开始、每次加 2；21 是全部元素之和，9 是偶数下标元素之和。' },
  { id: 'ch7-27', ch: 7, type: 'read', q: '写出下面程序的运行结果。\n#include <stdio.h>\nint main()\n{\n    char s[]="level2026";\n    int i, n=0;\n    for(i=0; s[i]!=\'\\0\'; i++)\n        if(s[i]>=\'0\' && s[i]<=\'9\')\n            n++;\n    printf("%d\\n", n);\n    return 0;\n}', opts: ['2', '4', '5', '9'], ans: 1, exp: '逐个字符判断是否数字字符：2、0、2、6 共 4 个，输出 4。5 是字母个数，9 是总长度。注意 s[i] 是字符，要与\'0\'和\'9\'比较而不是与 0 和 9 比较。' },
  { id: 'ch7-28', ch: 7, type: 'code', q: '编写完整程序：从键盘输入 10 个整数存入数组，求其中的最大值、最小值和平均值并输出。', sample: '#include <stdio.h>\nint main()\n{\n    int a[10], i, max, min, sum = 0;\n    double avg;\n    for(i=0; i<10; i++)\n        scanf("%d", &a[i]);\n    max = min = a[0];\n    for(i=1; i<10; i++)\n    {\n        if(a[i] > max) max = a[i];    /* 打擂台：更大的换上 */\n        if(a[i] < min) min = a[i];    /* 更小的换上 */\n        sum = sum + a[i];\n    }\n    avg = (double)sum / 10;\n    printf("max=%d\\n", max);\n    printf("min=%d\\n", min);\n    printf("avg=%f\\n", avg);\n    return 0;\n}', exp: '思路：max、min 都初始化为 a[0]，从 a[1] 开始逐个比较更新（打擂台法）；累加求和顺便进行。平均值用 (double)sum/10 计算，避免整数除法丢掉小数部分。' },
  { id: 'ch7-29', ch: 7, type: 'code', q: '编写完整程序：从键盘输入 10 个整数，用冒泡排序法将它们按从小到大的顺序排序后输出。', sample: '#include <stdio.h>\nint main()\n{\n    int a[10], i, j, t;\n    for(i=0; i<10; i++)\n        scanf("%d", &a[i]);\n    for(i=0; i<9; i++)              /* 共进行 9 趟 */\n        for(j=0; j<9-i; j++)        /* 每趟比较 9-i 次 */\n            if(a[j] > a[j+1])       /* 前面的大就交换 */\n            {\n                t = a[j];\n                a[j] = a[j+1];\n                a[j+1] = t;\n            }\n    for(i=0; i<10; i++)\n        printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}', exp: '思路：外层控制趟数（n-1 趟），内层控制每趟比较次数（n-1-i 次），相邻两数比较，大的往后沉。核心是三变量交换，双重循环的边界要背熟。' },
  { id: 'ch7-30', ch: 7, type: 'code', q: '编写完整程序：输入一个字符串，判断它是否为回文（正读反读都相同，如 level），是则输出 yes，否则输出 no。', sample: '#include <stdio.h>\n#include <string.h>\nint main()\n{\n    char s[80];\n    int i, j, flag = 1;\n    gets(s);\n    j = strlen(s) - 1;          /* j 指向最后一个字符 */\n    for(i=0; i<j; i++, j--)\n        if(s[i] != s[j])        /* 首尾不对称就不是回文 */\n        {\n            flag = 0;\n            break;\n        }\n    if(flag == 1)\n        printf("yes\\n");\n    else\n        printf("no\\n");\n    return 0;\n}', exp: '思路：i 从头、j 从尾向中间走，j 的初值是 strlen(s)-1，只要出现 s[i]!=s[j] 就置 flag=0 并跳出循环。也可以不用 break，循环结束后统一判断 flag。' }
);
