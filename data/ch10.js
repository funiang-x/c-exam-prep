/* ============================================================
   题库 · 第10章 结构体与共用体
   教材：谭浩强《C语言程序设计教程（第4版）》
   type: single 单选 | judge 判断 | blank 程序填空 | read 看程序写结果 | code 编程题
   ============================================================ */
window.QBANK = window.QBANK || [];
window.NOTES = window.NOTES || {};

window.NOTES[10] = {
  title: '第10章 结构体与共用体',
  points:
    '<h3>📌 本章考点清单</h3>' +
    '<ul>' +
    '<li><b>结构体定义</b>：struct 类型名 { 成员列表 }; ——<b>右花括号后的分号不能少</b>。</li>' +
    '<li><b>三种定义变量的方式</b>：① 先定义类型再定义变量；② 定义类型的同时定义变量；③ 无名结构体直接定义变量。</li>' +
    '<li><b>成员访问</b>：变量用 <b>.</b>（s1.num）；指针用 <b>-&gt;</b>（p-&gt;num，等价于 (*p).num）。</li>' +
    '<li><b>初始化</b>：struct Student s1 = {1001, "Li", 89}; 花括号里的数据<b>按成员定义的顺序</b>对应。</li>' +
    '<li><b>同类型结构体变量可以整体赋值</b> s2 = s1;（逐成员拷贝），但<b>不能</b>用 == 比较、不能整体输入输出。</li>' +
    '<li><b>结构体数组</b>：struct Student stu[3]; 每个元素都是一个结构体变量，用 stu[i].num 访问。</li>' +
    '<li><b>嵌套</b>：成员可以是另一个结构体类型，逐层访问 s1.birthday.year。</li>' +
    '<li>字符数组成员<b>不能用 = 赋字符串</b>，要用 strcpy(s1.name, "Li");</li>' +
    '<li><b>共用体</b>：所有成员<b>共用同一段内存</b>；所占内存 = 最长成员；同一时刻只有<b>最后赋值的成员</b>有效。</li>' +
    '<li><b>枚举</b>：enum Color {RED, GREEN, BLUE}; 元素是常量，<b>默认从0开始依次加1</b>；可部分指定值，其后元素顺延加1；枚举变量只能取列举的值。</li>' +
    '<li><b>typedef</b>：给已有类型<b>起别名</b>，不产生新类型；与 #define 的文本替换不同。</li>' +
    '</ul>' +
    '<h3>📖 核心讲解</h3>' +
    '<h4>1. 定义结构体类型（先画图纸，再盖房子）</h4>' +
    '<pre><code>struct Student          /* struct 是关键字，Student 是类型名 */\n{\n    int   num;          /* 成员之间用分号隔开 */\n    char  name[20];\n    float score;\n};                      /* 这个分号千万不能丢！ */</code></pre>' +
    '<p>三种定义变量的方式：</p>' +
    '<pre><code>struct Student s1;                    /* ① 先定义类型，再定义变量（最常用） */\nstruct Student { int num; } s1, s2;   /* ② 定义类型的同时定义变量 */\nstruct { int num; } s1;               /* ③ 无名结构体，直接定义变量 */</code></pre>' +
    '<p>类型是“图纸”，变量才是“房子”：struct Student 只是类型名，不占内存；定义了变量 s1 才分配存储单元。</p>' +
    '<h4>2. 成员访问：. 和 -&gt; 用在哪</h4>' +
    '<pre><code>struct Student s1, *p;\np = &amp;s1;\n\ns1.num = 1001;      /* 变量用点 */\np-&gt;num = 1001;      /* 指针用箭头，p-&gt;num 等价于 (*p).num */\n\n/* p.num   ✗  p 是指针，没有 num 这个成员\n   s1-&gt;num ✗  s1 是变量，不是地址 */</code></pre>' +
    '<p>一句话：<b>变量配点，指针配箭头</b>；p-&gt;num 完全等价于 (*p).num。</p>' +
    '<h4>3. 初始化：按成员顺序对应</h4>' +
    '<pre><code>struct Student s1 = {1001, "Li Ming", 89};\n/*                    ↓        ↓        ↓\n                     num     name    score */\n\ns1.num = 1002;                /* 单独给成员赋值 */\nstrcpy(s1.name, "Wang");      /* 字符串成员要用 strcpy，需 #include &lt;string.h&gt; */\n/* s1.name = "Wang"; ✗  数组名是地址常量，不能用 = 整体赋字符串 */</code></pre>' +
    '<h4>4. 整体赋值与结构体数组</h4>' +
    '<pre><code>struct Student s1 = {1001, "Li", 89}, s2;\ns2 = s1;        /* ✓ 同类型变量可以整体赋值：逐个成员拷贝 */\n/* s1 == s2 ✗ 比较、scanf("%d", &amp;s1) ✗ 整体输入、printf("%d", s1) ✗ 整体输出 */\n\nstruct Student stu[3];          /* 结构体数组：3个学生 */\nint i;\nfor(i = 0; i &lt; 3; i++)\n    printf("%d %s %f\\n", stu[i].num, stu[i].name, stu[i].score);</code></pre>' +
    '<h4>5. 结构体嵌套：一层层点下去</h4>' +
    '<pre><code>struct Date { int year, month, day; };\nstruct Student { int num; struct Date birthday; } s1;\n\ns1.birthday.year = 2006;    /* 先点出 birthday，再点出 year */\n/* s1.year ✗  year 藏在 birthday 里面，不能跳级 */</code></pre>' +
    '<h4>6. 共用体：所有成员挤同一间房</h4>' +
    '<pre><code>union Data\n{\n    int   a;\n    char  c;\n    float f;\n};\nunion Data d;\nd.a = 65;      /* 这时读 a 有效 */\nd.f = 3.14;    /* 再给 f 赋值，a 的内容被覆盖，读 a 已无意义 */</code></pre>' +
    '<p>三条结论：① 所有成员<b>共用同一段内存</b>（起始地址相同）；② 共用体变量所占内存 = <b>最长成员</b>的大小；③ <b>同一时刻只有最后一次赋值的成员有效</b>。</p>' +
    '<h4>7. 枚举：把可能的值一个个列出来</h4>' +
    '<pre><code>enum Color { RED, GREEN, BLUE };    /* RED=0, GREEN=1, BLUE=2 */\nenum Week  { A = 3, B, C };         /* A=3, B=4, C=5（指定值后顺延加1） */\nenum Color c = GREEN;               /* 枚举变量只能取列举出来的值 */</code></pre>' +
    '<p>枚举元素是<b>常量</b>，默认从 <b>0</b> 开始依次加 1；指定了值的元素按指定值算，它后面的元素在其基础上加 1。</p>' +
    '<h4>8. typedef：给类型起个小名</h4>' +
    '<pre><code>typedef int INTEGER;            /* INTEGER 就是 int 的别名 */\nINTEGER a, b;                   /* 等价于 int a, b; */\n\ntypedef struct Student STU;     /* struct Student 的别名 STU */\nSTU s1, stu[3];\n\ntypedef struct                  /* 定义类型的同时起别名（最常用） */\n{\n    int num;\n    char name[20];\n} STU;</code></pre>' +
    '<p>typedef 只是<b>起别名</b>，不产生新类型，STU 与 struct Student 是同一个类型；它由编译器在<b>编译阶段</b>处理，而 #define 是<b>预处理阶段</b>做纯文本替换，且 #define 什么都能替换（数值、语句片段），不只限于类型。</p>' +
    '<h3>⚠️ 易错陷阱清单</h3>' +
    '<ul>' +
    '<li><b>struct 定义忘分号</b>：右花括号 } 后面的分号丢了就编译报错，而且错误常常报在下一行，很难找。</li>' +
    '<li><b>字符串成员直接赋值</b>：s1.name = "Li"; ✗，必须 strcpy(s1.name, "Li");</li>' +
    '<li><b>箭头与点用错对象</b>：指针用 -&gt;，变量用 .；p.num 和 s1-&gt;num 都是错的。</li>' +
    '<li><b>以为 typedef 创造了新类型</b>：它只是别名，STU 与原类型完全等价。</li>' +
    '<li><b>以为同类型结构体变量不能整体赋值</b>：可以 s2 = s1; 但 == 比较、整体输入输出都不行。</li>' +
    '<li><b>以为共用体各成员互不干扰</b>：一次赋值会覆盖之前的成员，最后赋值的才有效。</li>' +
    '<li>枚举元素默认值想当然从 1 开始——是从 <b>0</b> 开始。</li>' +
    '</ul>'
};

window.QBANK.push(
  { id: 'ch10-1', ch: 10, type: 'single',
    q: '已定义结构体类型 struct Student 和变量 struct Student s1;，正确引用其学号成员 num 的写法是（　）。',
    opts: ['s1.num', 's1->num', 'num.s1', 's1#num'],
    ans: 0,
    exp: '结构体变量用成员运算符“.”访问成员，写作 s1.num。“->”只能用于结构体指针；num.s1 把变量和成员写反了。'
  },
  { id: 'ch10-2', ch: 10, type: 'single',
    q: '下列定义结构体类型的语句中，正确的是（　）。',
    opts: [
      'struct Student {int num; char name[20];}',
      'struct Student {int num; char name[20];};',
      'Student struct {int num; char name[20];};',
      'struct Student {int num; char name[20]}'
    ],
    ans: 1,
    exp: '正确格式是 struct 类型名 { 成员列表 };——struct 在最前，右花括号后必须有分号，每个成员用分号结束。第1、4项少了分号，第3项把 Student 和 struct 写反。'
  },
  { id: 'ch10-3', ch: 10, type: 'single',
    q: '设有 struct Student s1, *p = &s1; ，下列与 p->num 等价的表达式是（　）。',
    opts: ['*p.num', 'p.num', '(*p).num', '&p.num'],
    ans: 2,
    exp: 'p->num 等价于 (*p).num：先取 p 指向的结构体变量，再点出成员。*p.num 因优先级会先算 p.num，是错的；p 本身是地址，没有 num 成员。'
  },
  { id: 'ch10-4', ch: 10, type: 'single',
    q: '已先定义了结构体类型 struct Student，随后定义该类型变量 s1 的正确写法是（　）。',
    opts: ['Student s1;', 'struct s1 Student;', 's1 struct Student;', 'struct Student s1;'],
    ans: 3,
    exp: '用已定义的类型声明变量必须带上关键字 struct：struct Student s1;。只写 Student s1; 是C++的写法，C语言里不行。'
  },
  { id: 'ch10-5', ch: 10, type: 'single',
    q: '有以下程序段\nstruct Stu {int num; char name[20]; float score;};\nstruct Stu s = {1001, "Wang", 90.5};\n则 s.num、s.name 的值分别是（　）。',
    opts: ['1001、"Wang"', '"Wang"、1001', '90.5、"Wang"', '1001、90.5'],
    ans: 0,
    exp: '初始化列表按成员定义的顺序依次对应：1001→num，"Wang"→name，90.5→score。顺序一乱，成员的值就跟着错。'
  },
  { id: 'ch10-6', ch: 10, type: 'single',
    q: '设有同类型的 struct Student s1, s2;，下列操作正确的是（　）。',
    opts: [
      '可以直接用 == 判断 s1 与 s2 是否相等',
      '可以用 scanf("%d", &s1); 整体输入 s1',
      '可以用赋值号整体赋值：s2 = s1;',
      '可以用 printf("%d", s1); 整体输出 s1'
    ],
    ans: 2,
    exp: '同类型结构体变量之间可以用 = 整体赋值，效果是逐个成员拷贝；但结构体不能整体输入输出，也不能直接用 == 比较，只能逐成员处理。'
  },
  { id: 'ch10-7', ch: 10, type: 'single',
    q: '设有 struct Student {int num; char name[20];} s1;，想把字符串"Li Ming"存入 s1.name，正确的语句是（　）。',
    opts: [
      's1.name = "Li Ming";',
      'strcpy(s1.name, "Li Ming");',
      's1.name[20] = "Li Ming";',
      'name = "Li Ming";'
    ],
    ans: 1,
    exp: 'name 是字符数组，数组名是地址常量，不能用 = 整体赋字符串；必须用字符串拷贝函数 strcpy（需 #include <string.h>）。'
  },
  { id: 'ch10-8', ch: 10, type: 'single',
    q: '有以下定义\nstruct Date {int year; int month; int day;};\nstruct Student {int num; struct Date birthday;} s1;\n访问 s1 出生年份的正确写法是（　）。',
    opts: ['s1.year', 's1.birthday->year', 's1.birthday.year', 'birthday.year'],
    ans: 2,
    exp: '结构体可以嵌套定义，访问时一层一层点：先点出内层结构体成员 birthday，再点 year，即 s1.birthday.year。s1 是变量，不能在 birthday 后用箭头。'
  },
  { id: 'ch10-9', ch: 10, type: 'single',
    q: '语句 struct Student stu[3]; 的含义是（　）。',
    opts: [
      '定义了3个结构体类型',
      '定义了一个名为 stu 的结构体变量',
      '定义了指向结构体的指针 stu',
      '定义了含3个元素的结构体数组，每个元素都是一个 struct Student 型变量'
    ],
    ans: 3,
    exp: '结构体数组的每个元素都是一个结构体变量，用 stu[i].num 这样的形式访问第 i 个学生的成员。'
  },
  { id: 'ch10-10', ch: 10, type: 'single',
    q: '关于共用体（联合体），下列说法错误的是（　）。',
    opts: [
      '所有成员共用同一段内存空间，起始地址相同',
      '同一时刻只有最后一次赋值的成员有效',
      '共用体变量所占内存等于最长的成员所占的内存',
      '给某个成员赋值后，其他成员的值仍然保持不变'
    ],
    ans: 3,
    exp: '共用体成员挤在同一段内存里，给一个成员赋值就会覆盖其他成员，同一时刻只有最后赋值的成员有效。“赋值后其他成员不变”是错误说法。'
  },
  { id: 'ch10-11', ch: 10, type: 'single',
    q: '有枚举定义 enum Color {RED, GREEN, BLUE}; ，则 RED、GREEN、BLUE 的值分别是（　）。',
    opts: ['1、2、3', '都是0', '0、1、2', '不确定'],
    ans: 2,
    exp: '枚举元素是常量，默认从0开始依次加1：RED=0、GREEN=1、BLUE=2。想当然从1开始是常见错误。'
  },
  { id: 'ch10-12', ch: 10, type: 'single',
    q: '有枚举定义 enum Week {A = 3, B, C}; ，则 B、C 的值分别是（　）。',
    opts: ['4、5', '3、4', '0、1', '1、2'],
    ans: 0,
    exp: '指定了值的元素按指定值取值，其后的元素在此基础上依次加1：A=3、B=4、C=5。'
  },
  { id: 'ch10-13', ch: 10, type: 'single',
    q: '下列关于 typedef 的叙述中，错误的是（　）。',
    opts: [
      'typedef 可以为已存在的类型起一个新名字',
      'typedef int INTEGER; 之后语句 INTEGER a; 等价于 int a;',
      'typedef struct {int num;} STU; 之后可以用 STU 定义变量',
      'typedef 可以创造一种C语言中原来没有的全新数据类型'
    ],
    ans: 3,
    exp: 'typedef 只是给已有类型起别名，并不产生新类型，STU 与原结构体是同一个类型。它由编译阶段处理，与预处理命令 #define 的文本替换是两回事。'
  },
  { id: 'ch10-14', ch: 10, type: 'single',
    q: '下列定义结构体变量的语句中，属于“定义类型的同时定义变量”的是（　）。',
    opts: [
      'struct Student {int num;} s1;',
      'struct Student s1;',
      'struct {int num;} Student s1;',
      'Student s1;'
    ],
    ans: 0,
    exp: '花括号后直接跟变量名（struct Student {int num;} s1;）就是定义类型的同时定义变量。B项是先定义类型再定义变量；C项语法错误；D项缺 struct。'
  },
  { id: 'ch10-15', ch: 10, type: 'judge',
    q: '定义结构体类型时，右花括号后面的分号可以省略。',
    opts: ['正确', '错误'],
    ans: 1,
    exp: '错误。struct 定义末尾的分号是类型定义的一部分，不能省略；忘了分号是初学者最常见的编译错误之一。'
  },
  { id: 'ch10-16', ch: 10, type: 'judge',
    q: '结构体成员是字符数组时，可以用赋值号（=）直接给它整体赋一个字符串。',
    opts: ['正确', '错误'],
    ans: 1,
    exp: '错误。字符数组名是地址常量，不能放在赋值号左边整体赋字符串，要用 strcpy(s1.name, "Li"); 拷贝进去。'
  },
  { id: 'ch10-17', ch: 10, type: 'judge',
    q: 'typedef 只是给已有的类型起一个别名，并不产生新的数据类型。',
    opts: ['正确', '错误'],
    ans: 0,
    exp: '正确。typedef 定义之后，新旧类型名完全等价，用它只是让书写更简洁、程序更易读。'
  },
  { id: 'ch10-18', ch: 10, type: 'judge',
    q: '共用体变量的所有成员共占用同一段内存，同一时刻只有最后一次赋值的成员有效。',
    opts: ['正确', '错误'],
    ans: 0,
    exp: '正确。各成员共用同一起始地址的内存，后一次赋值会覆盖前一次，所以“最后赋值者有效”；共用体变量所占内存等于最长成员的大小。'
  },
  { id: 'ch10-19', ch: 10, type: 'blank',
    q: '程序功能：定义学生结构体并输出。请补全关键字。\n#include <stdio.h>\n____ Student\n{\n    int num;\n    char name[20];\n    float score;\n};\nint main()\n{\n    struct Student s1 = {1001, "Li", 89};\n    printf("%d %s %f\\n", s1.num, s1.name, s1.score);\n    return 0;\n}',
    opts: ['struct', 'union', 'enum', 'typedef'],
    ans: 0,
    exp: '定义结构体类型用关键字 struct：struct Student { 成员列表 };，右花括号后的分号不能少。union 定义的是共用体，enum 定义的是枚举。'
  },
  { id: 'ch10-20', ch: 10, type: 'blank',
    q: '程序功能：通过结构体指针输出成员。请补全运算符。\n#include <stdio.h>\nstruct Stu {int num; int score;};\nint main()\n{\n    struct Stu s = {1, 95};\n    struct Stu *p = &s;\n    printf("%d,%d\\n", p->num, p____score);\n    return 0;\n}',
    opts: ['.', '->', '*', '&'],
    ans: 1,
    exp: 'p 是结构体指针，访问成员用指向运算符“->”：p->score 等价于 (*p).score，程序输出 1,95。“.”只能用于结构体变量本身。'
  },
  { id: 'ch10-21', ch: 10, type: 'blank',
    q: '程序功能：给结构体的字符串成员赋值后输出。请补全函数名。\n#include <stdio.h>\n#include <string.h>\nstruct Student {int num; char name[20];};\nint main()\n{\n    struct Student s1;\n    s1.num = 1001;\n    ____(s1.name, "Wang");\n    printf("%d %s\\n", s1.num, s1.name);\n    return 0;\n}',
    opts: ['strlen', 'strcat', 'strcpy', 'strcmp'],
    ans: 2,
    exp: '字符串成员不能用 = 赋值，要用 strcpy(s1.name, "Wang") 把字符串拷贝进字符数组，程序输出 1001 Wang。strcat 是拼接、strcmp 是比较、strlen 是求长度。'
  },
  { id: 'ch10-22', ch: 10, type: 'read',
    q: '写出下面程序的运行结果。\n#include <stdio.h>\nstruct Stu {int num; int score;};\nint main()\n{\n    struct Stu s[3] = {{1, 70}, {2, 90}, {3, 80}};\n    int i, k = 0;\n    for(i = 1; i < 3; i++)\n        if(s[i].score > s[k].score)\n            k = i;\n    printf("%d,%d\\n", s[k].num, s[k].score);\n    return 0;\n}',
    opts: ['1,70', '2,90', '3,80', '2,80'],
    ans: 1,
    exp: '循环在3个学生中找最高分：k 从0开始，s[1].score=90 大于 s[0].score=70，k 变为1；s[2].score=80 不大于90，k 不再变。最后输出下标1的学生：学号2、成绩90。'
  },
  { id: 'ch10-23', ch: 10, type: 'read',
    q: '写出下面程序的运行结果。\n#include <stdio.h>\ntypedef struct {int x; int y;} Point;\nint main()\n{\n    Point p1 = {2, 3}, p2;\n    p2 = p1;\n    p2.x = 10;\n    printf("%d,%d\\n", p1.x, p2.x);\n    return 0;\n}',
    opts: ['10,10', '10,3', '2,10', '2,3'],
    ans: 2,
    exp: 'p2 = p1 是整体赋值，把 p1 各成员的值拷贝给 p2，之后两个变量互不影响，改 p2.x 不影响 p1.x，所以输出 2,10。typedef 后 Point 可直接当类型名使用。'
  },
  { id: 'ch10-24', ch: 10, type: 'code',
    q: '编写完整程序：定义学生结构体 struct Student（成员：学号 int num、姓名 char name[20]、成绩 float score），在 main 函数中输入3个学生的数据，找出成绩最高的学生，输出其全部信息（学号、姓名、成绩）。',
    sample: '#include <stdio.h>\nstruct Student\n{\n    int num;\n    char name[20];\n    float score;\n};\nint main()\n{\n    struct Student stu[3];\n    int i, k = 0;\n    for(i = 0; i < 3; i++)\n    {\n        scanf("%d%s%f", &stu[i].num, stu[i].name, &stu[i].score);\n    }\n    for(i = 1; i < 3; i++)\n        if(stu[i].score > stu[k].score)\n            k = i;\n    printf("%d %s %f\\n", stu[k].num, stu[k].name, stu[k].score);\n    return 0;\n}',
    exp: '思路：① 先定义结构体类型，右花括号后的分号别丢；② 用结构体数组 stu[3] 存3个学生；输入时 %s 对应的 name 是数组名，前面不加 &；③ 用 k 记录当前最高分的下标，逐个比较更新，这是“打擂台”法；④ 最后输出 stu[k] 的三个成员即可。'
  }
);
