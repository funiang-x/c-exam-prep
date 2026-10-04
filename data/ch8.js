// 第8章 函数
window.QBANK = window.QBANK || [];
window.NOTES = window.NOTES || {};
window.NOTES[8] = {
  title: '第8章 函数',
  points: '<h3>📌 本章考点清单</h3>' +
    '<ul>' +
    '<li><b>函数定义</b>：<code>类型名 函数名(形参列表) { ... }</code>；每个形参都要单独写类型：<code>int max(int a,int b)</code> 对，<code>int max(a,b)</code> 错。</li>' +
    '<li><b>返回值</b>：无返回值用 void；return 只能带回一个值；执行 return 后函数立即结束。</li>' +
    '<li><b>声明与定义</b>：定义在使用之后必须先声明；声明末尾有分号、定义头部没有。</li>' +
    '<li><b>值传递</b>：形参是实参的副本，改变形参不影响实参（经典 swap 题）。</li>' +
    '<li><b>数组作参数</b>：传首地址，形参改变实参跟着变；元素个数另传：<code>int f(int a[],int n)</code>。</li>' +
    '<li><b>嵌套与递归</b>：不能嵌套定义、可以嵌套调用；递归 = 递推公式 + 终止条件。</li>' +
    '<li><b>变量作用域</b>：局部 / 全局；同名局部优先；static 局部变量只初始化一次、跨调用保留。</li>' +
    '</ul>' +
    '<h3>📖 核心讲解</h3>' +
    '<h4>1. 定义 vs 声明（常考对比）</h4>' +
    '<table><tr><th></th><th>声明（原型）</th><th>定义</th></tr>' +
    '<tr><td>写法</td><td><code>int max(int a,int b);</code></td><td><code>int max(int a,int b) { ... }</code></td></tr>' +
    '<tr><td>末尾分号</td><td><b>必须有</b></td><td><b>不能有</b></td></tr>' +
    '<tr><td>作用</td><td>告诉编译器"后面有这么个函数"</td><td>写出函数的真正代码</td></tr></table>' +
    '<p>规则：<b>被调函数定义在主调函数后面时，必须先声明再调用</b>；定义在前面则可以不声明。</p>' +
    '<h4>2. 形参、实参与值传递</h4>' +
    '<ul>' +
    '<li>实参与形参按位置对应：个数相同、类型一致；实参可以是常量、变量或表达式。</li>' +
    '<li>形参在调用前不占内存，调用时才分配，函数结束立即释放。</li>' +
    '</ul>' +
    '<pre>void swap(int x, int y)      /* x、y 只是 a、b 的副本 */\n{\n    int t; t = x; x = y; y = t;\n}\nint main()\n{\n    int a = 3, b = 5;\n    swap(a, b);\n    printf("%d,%d", a, b);   /* 输出 3,5 —— 交换失败！ */\n    return 0;\n}</pre>' +
    '<p>想真正交换必须传地址（指针一章的内容）；<b>数组是例外</b>——数组名本身就是地址，所以形参数组变了实参也变：</p>' +
    '<pre>int sum(int a[], int n)      /* 长度不写，用 n 传元素个数 */\n{\n    int i, s = 0;\n    for(i=0; i&lt;n; i++) s = s + a[i];\n    return s;\n}</pre>' +
    '<h4>3. 递归：两要素 + 展开过程（以 4! 为例）</h4>' +
    '<pre>long fact(int n)\n{\n    if(n &lt;= 1) return 1;        /* ① 终止条件 */\n    return n * fact(n - 1);     /* ② 递推公式 */\n}</pre>' +
    '<pre>fact(4) = 4 * fact(3)\n        = 4 * (3 * fact(2))\n        = 4 * (3 * (2 * fact(1)))\n        = 4 * (3 * (2 * 1)) = 24</pre>' +
    '<p>先一层层"递"下去直到终止条件，再一层层"归"回来算出结果。没有终止条件就会无限递归、程序崩溃。</p>' +
    '<h4>4. 变量作用域与生命周期</h4>' +
    '<table><tr><th>变量</th><th>作用域</th><th>生命周期 / 特点</th></tr>' +
    '<tr><td>局部 auto 变量</td><td>所在函数内部</td><td>每次调用重新分配、重新初始化，结束即丢</td></tr>' +
    '<tr><td>局部 static 变量</td><td>所在函数内部</td><td><b>只初始化一次</b>，值保留到下一次调用</td></tr>' +
    '<tr><td>全局变量</td><td>定义处 → 源文件结束</td><td>全程存在；与局部同名时<b>局部优先</b></td></tr></table>' +
    '<pre>void f()\n{\n    static int c = 0;    /* 只在第一次调用时执行这一句 */\n    c++;\n    printf("%d ", c);\n}\n/* 连续调用 3 次输出：1 2 3 */\n/* 去掉 static 则每次都输出：1 1 1 */</pre>' +
    '<h3>⚠️ 易错陷阱清单</h3>' +
    '<ul>' +
    '<li><b>形参漏写类型</b>：int max(a,b) 错；每个形参都要写类型 int max(int a,int b)。</li>' +
    '<li><b>声明忘分号 / 定义多分号</b>：int max(int a,int b); 是声明；定义头后面接函数体时不能带分号。</li>' +
    '<li><b>以为 swap 能交换</b>：值传递改的是副本，实参不变；数组传地址才有效。</li>' +
    '<li><b>递归无终止条件</b>：必须有出口，否则无限递归、程序崩溃。</li>' +
    '<li><b>static 想当然</b>：static int c=0; 只执行一次，别以为每次调用都置 0。</li>' +
    '<li><b>全局变量位置</b>：从定义处才生效，定义在文件末尾时前面的函数用不到。</li>' +
    '<li><b>return 只能带回一个值</b>：想"带回"多个结果要用数组参数（地址传递）。</li>' +
    '<li><b>数组参数忘了传长度</b>：形参 a[] 不知道元素个数，要另加参数 n。</li>' +
    '</ul>'
};
window.QBANK.push(
  { id: 'ch8-1', ch: 8, type: 'single', q: '下列函数定义中正确的是（　）。', opts: ['int max(a,int b)\n{\n    return a>b?a:b;\n}', 'int max(int a,int b)\n{\n    return a>b?a:b;\n}', 'int max(int a,b)\n{\n    return a>b?a:b;\n}', 'int max(int a,int b);\n{\n    return a>b?a:b;\n}'], ans: 1, exp: '每个形参都必须单独写类型，int max(int a,int b) 才对。D 的函数头末尾多了分号，那是声明形式，后面不能再跟函数体。' },
  { id: 'ch8-2', ch: 8, type: 'single', q: '函数不需要带回返回值时，定义时函数类型应写成（　）。', opts: ['int', 'float', 'void', '省略不写'], ans: 2, exp: 'void 表示"无类型"，即该函数没有返回值。声明成 int 却不返回值容易引起错误。' },
  { id: 'ch8-3', ch: 8, type: 'single', q: '关于 return 语句，下列说法中错误的是（　）。', opts: ['一个函数中只能有一个 return 语句', '执行 return 后，函数立即结束并返回调用处', 'return 后面的值可以是一个表达式', '无返回值的函数可以不写 return 语句'], ans: 0, exp: '一个函数里可以有多个 return（如在 if 的不同分支中各放一个），执行到哪个哪个起作用。' },
  { id: 'ch8-4', ch: 8, type: 'single', q: '若被调函数的定义出现在主调函数之后，则正确的做法是（　）。', opts: ['不用任何处理，直接调用即可', '只需在程序末尾再写一遍函数头', '把定义移到程序末尾', '在主调函数之前对被调函数作声明'], ans: 3, exp: 'C 语言要求先声明后使用。声明形如 int max(int a,int b);，写在主调函数之前。' },
  { id: 'ch8-5', ch: 8, type: 'single', q: '关于函数声明和函数定义，下列说法正确的是（　）。', opts: ['声明的末尾必须有分号，定义的函数头后面不能有分号', '声明的末尾不能有分号', '定义的函数头后面也应有分号', '声明和定义是一回事'], ans: 0, exp: '声明（原型）只是一句说明，末尾必须有分号；定义头后面直接跟函数体，不能加分号。' },
  { id: 'ch8-6', ch: 8, type: 'single', q: '关于形参和实参，下列说法中错误的是（　）。', opts: ['实参可以是常量、变量或表达式', '形参变量在函数未被调用时不占内存单元', '实参与形参按位置对应，个数应相同、类型应一致', '在值传递方式下，改变形参的值会同时改变实参的值'], ans: 3, exp: '值传递时形参只是实参的副本，形参变了实参不变——这是本章最大的陷阱。' },
  { id: 'ch8-7', ch: 8, type: 'single', q: '有以下程序：\n#include <stdio.h>\nvoid swap(int x, int y)\n{\n    int t;\n    t = x; x = y; y = t;\n}\nint main()\n{\n    int a=3, b=5;\n    swap(a, b);\n    printf("%d,%d\\n", a, b);\n    return 0;\n}\n程序运行后的输出结果是（　）。', opts: ['5,3', '3,5', '5,5', '3,3'], ans: 1, exp: '值传递：x、y 是 a、b 的副本，函数内交换的只是副本，a、b 仍保持 3,5 不变。' },
  { id: 'ch8-8', ch: 8, type: 'single', q: '数组名作函数实参时，传递给形参的是（　）。', opts: ['数组所有元素的值', '数组的长度', '数组的一个副本', '数组首元素的地址'], ans: 3, exp: '数组名代表首地址，形参数组与实参数组共用同一段内存，所以形参改变实参跟着变。' },
  { id: 'ch8-9', ch: 8, type: 'single', q: '定义 int f(int a[], int n) 时，形参数组 a 不指定长度，原因是（　）。', opts: ['C 语言会自动统计实参数组的长度', '形参数组必须指定长度，否则编译出错', '形参数组名代表地址，元素个数另通过参数 n 传进来', '形参数组的长度可以随便写一个'], ans: 2, exp: '传数组只传首地址，编译器不为形参数组开辟整个数组的空间，所以长度可省，但要另用参数 n 告诉函数元素个数。' },
  { id: 'ch8-10', ch: 8, type: 'single', q: '关于函数的嵌套，下列说法正确的是（　）。', opts: ['C 语言允许在函数内定义另一个函数', 'C 语言不允许嵌套定义函数，但允许嵌套调用函数', 'C 语言既允许嵌套定义也允许嵌套调用', 'C 语言不允许嵌套调用函数'], ans: 1, exp: '各函数的定义互相独立、不能套着写；但调用可以层层嵌套，如 main 调 f1，f1 又调 f2。' },
  { id: 'ch8-11', ch: 8, type: 'single', q: '设计递归函数必须包含的两个要素是（　）。', opts: ['递推公式（递归关系）和终止条件', '循环语句和全局变量', 'static 变量和 return 语句', '输入语句和输出语句'], ans: 0, exp: '递归 = 递推公式 + 终止条件。没有终止条件，递归会无限进行下去导致程序崩溃。' },
  { id: 'ch8-12', ch: 8, type: 'single', q: '在函数 f1 和 f2 中分别定义了同名变量 n，这两个 n（　）。', opts: ['是同一个变量', '编译出错', '互不相干，占用不同的内存单元', '共用同一个内存单元'], ans: 2, exp: '局部变量只属于它所在的函数，不同函数中的同名变量毫无关系。' },
  { id: 'ch8-13', ch: 8, type: 'single', q: '全局变量的作用范围是（　）。', opts: ['整个程序的所有文件', '所在函数的内部', 'main 函数内部', '从定义处到本源文件结束'], ans: 3, exp: '全局变量从定义的位置开始有效，定义点之前的函数不能使用它。' },
  { id: 'ch8-14', ch: 8, type: 'single', q: '全局变量与函数内的局部变量同名时，在该函数内引用这个变量名用的是（　）。', opts: ['局部变量', '全局变量', '随机取一个', '编译出错'], ans: 0, exp: '同名时局部变量"遮住"全局变量，就近优先。' },
  { id: 'ch8-15', ch: 8, type: 'single', q: '关于 static 局部变量，下列说法正确的是（　）。', opts: ['每次调用函数时都重新执行初始化语句', '不能在定义时赋初值', '只初始化一次，多次调用时保留上一次调用结束后的值', '函数结束后其值立即丢失'], ans: 2, exp: 'static 局部变量只赋一次初值，其值跨调用保留，常用来做计数器。' },
  { id: 'ch8-16', ch: 8, type: 'single', q: '关于普通的 auto 局部变量（auto 一般省略不写），下列说法正确的是（　）。', opts: ['每次调用时重新分配内存并重新初始化，函数结束后值不再保留', '其值在多次调用之间一直保留', '与 static 局部变量的行为完全相同', '作用域是整个源文件'], ans: 0, exp: 'auto 局部变量动态分配，每次进函数重新开始，这与 static 正相反。' },
  { id: 'ch8-17', ch: 8, type: 'judge', q: 'C 语言允许函数嵌套定义，即在一个函数体内再定义另一个函数。', opts: ['正确', '错误'], ans: 1, exp: '函数定义互相独立，不能嵌套定义；只能嵌套调用。' },
  { id: 'ch8-18', ch: 8, type: 'judge', q: '数组名作函数参数时，形参数组元素值的改变会使实参数组元素的值同时改变。', opts: ['正确', '错误'], ans: 0, exp: '数组传的是首地址，形参与实参共用同一段内存。' },
  { id: 'ch8-19', ch: 8, type: 'judge', q: '函数的形参在未发生函数调用时不占用内存单元，调用结束后所占内存被释放。', opts: ['正确', '错误'], ans: 0, exp: '形参只在函数调用期间存在，调用结束后副本被丢弃，这正是值传递不影响实参的原因。' },
  { id: 'ch8-20', ch: 8, type: 'judge', q: '全局变量与函数内的局部变量同名时，在该函数内起作用的是全局变量。', opts: ['正确', '错误'], ans: 1, exp: '同名时局部优先，全局变量被屏蔽。' },
  { id: 'ch8-21', ch: 8, type: 'blank', q: '程序功能：输入两个整数，输出其中较大的一个。请补全对 max 函数的调用。\n#include <stdio.h>\nint max(int x, int y);      /* 函数声明 */\nint main()\n{\n    int a, b, m;\n    scanf("%d%d", &a, &b);\n    m = ____;\n    printf("max=%d\\n", m);\n    return 0;\n}\nint max(int x, int y)\n{\n    return x>y ? x : y;\n}', opts: ['max(a,b)', 'max(int a,int b)', 'max(&a,&b)', 'max(a;b)'], ans: 0, exp: '调用时实参只写变量名或表达式，不带类型、用逗号分隔。max(&a,&b) 传的是地址，与 int 形参不匹配。' },
  { id: 'ch8-22', ch: 8, type: 'blank', q: '程序功能：用函数求数组元素之和。请补全 sum 函数中的累加语句。\n#include <stdio.h>\nint sum(int a[], int n)\n{\n    int i, s = 0;\n    for(i=0; i<n; i++)\n        s = s + ____;\n    return s;\n}\nint main()\n{\n    int x[5]={1,2,3,4,5};\n    printf("%d\\n", sum(x, 5));\n    return 0;\n}', opts: ['x[i]', 'a[n]', 'a[i]', 's[i]'], ans: 2, exp: '在 sum 函数内应使用形参数组名 a，下标 i 从 0 到 n-1，即 a[i]。x 是主函数里的数组名，在 sum 中不可见。' },
  { id: 'ch8-23', ch: 8, type: 'read', q: '写出下面程序的运行结果。\n#include <stdio.h>\nlong f(int n)\n{\n    if(n<=1)\n        return 1;\n    return n * f(n-1);\n}\nint main()\n{\n    printf("%ld\\n", f(5));\n    return 0;\n}', opts: ['24', '120', '5', '1'], ans: 1, exp: '递归求 5!：f(5)=5×f(4)=5×4×3×2×1=120。递归出口是 n<=1 时返回 1。24 是 4!，别漏乘 5。' },
  { id: 'ch8-24', ch: 8, type: 'read', q: '写出下面程序的运行结果。\n#include <stdio.h>\nint fun()\n{\n    static int c = 0;\n    c++;\n    return c;\n}\nint main()\n{\n    printf("%d", fun());\n    printf("%d", fun());\n    printf("%d\\n", fun());\n    return 0;\n}', opts: ['111', '333', '123', '012'], ans: 2, exp: 'static 变量只初始化一次，三次调用 c 依次为 1、2、3，输出 123。若把 static 去掉，每次调用都从 0 开始，输出 111。' },
  { id: 'ch8-25', ch: 8, type: 'code', q: '编写完整程序：编写函数 int isprime(int n) 判断 n 是否为素数（是则返回 1，不是返回 0），在 main 函数中输入一个整数并调用该函数，是素数输出 yes，否则输出 no。', sample: '#include <stdio.h>\nint isprime(int n)\n{\n    int i;\n    if(n < 2)\n        return 0;               /* 0、1、负数不是素数 */\n    for(i=2; i<=n-1; i++)\n        if(n % i == 0)          /* 能被整除，不是素数 */\n            return 0;\n    return 1;\n}\nint main()\n{\n    int n;\n    scanf("%d", &n);\n    if(isprime(n) == 1)\n        printf("yes\\n");\n    else\n        printf("no\\n");\n    return 0;\n}', exp: '思路：素数是只能被 1 和自身整除的数。用 2~n-1 逐个试除，遇到能整除的立即 return 0；全都除不尽返回 1。注意 n<2 要单独排除。试除上界也可写成 i<=n/2 或 i<=sqrt(n)。' },
  { id: 'ch8-26', ch: 8, type: 'code', q: '编写完整程序：编写递归函数 long fact(int n) 求 n!，在 main 函数中调用它输出 10!（输出用 %ld）。', sample: '#include <stdio.h>\nlong fact(int n)\n{\n    if(n <= 1)                  /* 终止条件 */\n        return 1;\n    return n * fact(n - 1);     /* 递推公式 n! = n*(n-1)! */\n}\nint main()\n{\n    printf("%ld\\n", fact(10));\n    return 0;\n}', exp: '思路：递归两要素——终止条件 n<=1 时返回 1，递推公式 n!=n*(n-1)!。10!=3628800，数值较大，函数类型用 long，输出格式对应用 %ld。' }
);
