# 第 2 章 · 基本数据类型与数组

> **本次只完善第 2 章。** 内容按耿祥义、张跃平《Java 2实用教程》（第 6 版，清华大学出版社，2021，ISBN 9787302575443）公开目录的 **2.1—2.8** 编排。所有讲解、表格和代码均为本站独立编写，不是书中原文。暂未获得该版可逐页核对的正文，因此书中**实际印刷页码、例题编号均标为“待核实”**，不使用第 5 版或其他书的页码。

本章的核心路线是：

**给变量起名字 → 用基本类型描述数据 → 理解转换和精度 → 接收与输出数据 → 用数组存储多个同类型的值 → 理解数组引用及其共享。**

建议先把 **2.2 的 8 种基本类型**和 **2.3 类型转换**理解透彻，再学 **2.5 数组的引用**。不少初学者“会写数组，却说不清数组赋值后为什么一起变化”，原因恰好在“值”和“引用”的差别。

| 小节 | 学完应能回答的问题 |
| --- | --- |
| [2.1 标识符与关键字](#_2-1-标识符与关键字) | 变量怎样命名？Unicode 和标识符有什么关系？ |
| [2.2 基本数据类型](#_2-2-基本数据类型) | 各类型占几位、存储什么、字面量怎样写？ |
| [2.3 类型转换运算](#_2-3-类型转换运算) | 哪些转换自动进行？哪些会丢失数据？ |
| [2.4 输入与输出数据](#_2-4-输入与输出数据) | Scanner 如何读取数据，printf 怎样格式化？ |
| [2.5 数组](#_2-5-数组) | 声明、创建、索引、初始化、引用共享分别是什么？ |
| [2.6 应用举例](#_2-6-应用举例) | 如何把多项知识组合解决实际问题？ |
| [2.7 小结](#_2-7-小结) | 怎样避免本章最典型的错误？ |
| [2.8 课外读物](#_2-8-课外读物) | 如何验证语言规则？ |

---

## 2.1 标识符与关键字

### 2.1.1 标识符

**标识符（identifier）**是程序员用来命名变量、方法、类、接口等程序实体的名称。例如 \`age\`、\`studentCount\`、\`Student\`。先分清几个词：

- **变量**：存储或关联一个可以在执行过程中变化的值。
- **变量名**：程序员通过标识符来引用变量。
- **类型**：规定变量可以持有哪些类别的值，以及能够进行哪些操作。
- **赋值**：把右边表达式求得的值赋给左边变量，而不是数学上的“定义相等”。

例如：

~~~java
int age = 20;          // int：类型；age：变量名；20：整数值
age = 21;              // 赋值后变量 age 保存 21
System.out.println(age);  // 输出 21
~~~

**语法规则**（不仅限于 ASCII 字母）：

1. 第一个字符必须是合法的 Java 标识符首字符；字母、下划线 \`_\`、美元符号 \`$\` 和很多 Unicode 字母都可能合法，**不能以数字开头**。
2. 后续字符可以包含数字以及符合 Java 规则的其他字符。
3. **严格区分大小写**：\`total\` 和 \`Total\` 是两个名称。
4. 不能使用 Java 的关键字；\`true\`、\`false\`、\`null\` 虽然不是普通关键字，也不能作为标识符。
5. **语法合法不等于命名恰当**：\`$a\` 虽可合法但不推荐，\`scoreOfStudent\` 通常比 \`x1\` 易读。

~~~java
int count2 = 3;      // 合法
int _index = 0;      // 合法，不建议在公共 API 里滥用
int $tmp = 4;        // 合法，日常业务代码不建议
int Count = 7;       // 合法，与 count 不同

// int 2count = 3;   // 非法：数字不能开头
// int class = 1;    // 非法：class 是关键字
// int my-score = 8; // 非法：- 是运算符
~~~

**命名习惯**（属于约定，不是语法强制）：

| 用途 | 常见风格 | 示例 |
| --- | --- | --- |
| 变量、方法 | lowerCamelCase | \`studentAge\`、\`getScore\` |
| 类、接口 | UpperCamelCase | \`StudentRecord\` |
| 常量 | UPPER_SNAKE_CASE | \`MAX_SIZE\` |
| 包 | 小写，按组织域名反写 | \`com.example.study\` |

**区别语法错误与风格问题**：\`int StudentScore = 90;\` 虽然不像推荐的变量命名风格，但语法合法。

### 2.1.2 Unicode 字符集

Java 源码能使用 Unicode 字符，这意味着标识符不一定只能由英文字符组成。例如在合适的源文件编码和语言规则下，\`int 总数 = 3;\` 是合法的。但实际团队项目一般优先使用有含义的英文标识符，以提高工具兼容性和协作可读性。

**必须分清四个层次：**

1. **字符**：人类理解的文字单位，例如“中”。
2. **Unicode 码点（code point）**：为抽象字符分配的编号，例如 U+4E2D。
3. **编码方案**：UTF-8 和 UTF-16 等规定如何用字节或编码单元表示码点。
4. **Java 的 \`char\`**：一个 **16 位 UTF-16 编码单元**，不保证恰好代表一个完整 Unicode 字符。

常见 BMP（基本多文种平面）字符可由一个 char 表示，超出 BMP 的字符（如部分 emoji）需要 **一对 UTF-16 代理项（surrogate pair）**。因此“\`char\` 永远能存一个任意 Unicode 字符”是错误的。

~~~java
char ch = '中';
System.out.println((int) ch);   // 20013，即 U+4E2D

String word = "😀";
System.out.println(word.length());            // 2：UTF-16 编码单元数量
System.out.println(word.codePointCount(0, word.length())); // 1：码点数量
~~~

注意：Java 源文件内部可写 Unicode 转义，如 \`'\u0041'\` 表示字符 A；编译器对 Unicode 转义的处理发生得很早，甚至可影响后续的词法分析，因此不能机械地把它等同于运行时字符串转义。

**易错点**：

- \`'A'\` 是 **char 字面量**（单引号）；\`"A"\` 是 **String 字符串字面量**（双引号）。
- \`"汉字".length()\` 返回的是 UTF-16 编码单元数，不是 UTF-8 字节数。
- Unicode 与 UTF-8 不同：前者是字符编码标准体系，后者是具体编码方式之一。

### 2.1.3 关键字

Java 关键字是具有语法功能的单词，如 \`class\`、\`public\`、\`static\`、\`int\`、\`if\`、\`new\`、\`return\`，不得作为普通变量名。

按**作用**理解关键字，少靠死记：

- **类型与声明**：\`boolean\`、\`byte\`、\`short\`、\`int\`、\`long\`、\`char\`、\`float\`、\`double\`、\`class\`。
- **访问和类关系**：\`public\`、\`private\`、\`protected\`、\`extends\`、\`implements\`。
- **控制流程**：\`if\`、\`else\`、\`switch\`、\`for\`、\`while\`、\`do\`、\`break\`、\`continue\`。
- **异常相关**：\`try\`、\`catch\`、\`finally\`、\`throw\`、\`throws\`。
- **对象与其他修饰**：\`new\`、\`this\`、\`super\`、\`static\`、\`final\`、\`abstract\`。

\`true\`、\`false\` 和 \`null\` 是**保留的字面量**，并非普通标识符，也不应混淆为 int 值。某些词（如 \`var\`）在特定语法上下文有特殊含义，但 \`var\` 并非普通的全局保留关键字；第 6 版使用的 JDK 14 已支持局部变量类型推断。

~~~java
var count = 3;     // 编译器推断本地变量类型为 int（JDK 10+）
// var unknown;    // 错：无初始化器，编译器无法推断
~~~

**自检**：\`age\`、\`Age\`、\`_age\`、\`9age\`、\`class\` 中哪些可以作为变量名？为什么？

---

## 2.2 基本数据类型

**基本数据类型（primitive type）**不是对象类型。它们直接规定了值的种类和运算语义，Java 有且只有 **8 种基本数据类型**：\`boolean\`、\`byte\`、\`short\`、\`int\`、\`long\`、\`char\`、\`float\`、\`double\`。

先看整体表：

| 类型 | 位数 | 主要范围或取值 | 示例字面量 |
| --- | ---: | --- | --- |
| \`boolean\` | JVM 表示方式依实现而异 | \`true\` / \`false\` | \`true\` |
| \`byte\` | 8 | -128 ～ 127 | \`12\`（默认 int 字面量，若在范围内可赋给 byte） |
| \`short\` | 16 | -32768 ～ 32767 | \`1200\` |
| \`int\` | 32 | -2³¹ ～ 2³¹−1 | \`100\` |
| \`long\` | 64 | -2⁶³ ～ 2⁶³−1 | \`100L\` |
| \`char\` | 16 | 0 ～ 65535（UTF-16 编码单元） | \`'A'\` |
| \`float\` | 32 | IEEE 754 单精度浮点 | \`3.14F\` |
| \`double\` | 64 | IEEE 754 双精度浮点 | \`3.14\` |

**表格中的位数是语言的值表示规范，不等于“每个变量总占多少堆内存”。** 对象字段、数组元素、对齐和 JVM 实现会影响实际内存布局；不要由表格直接推算对象总大小。

### 2.2.1 逻辑类型

\`boolean\` 只表示**真 / 假**两个值，用于判断条件、标志位等。

~~~java
boolean passed = true;
boolean finished = false;
System.out.println(passed);    // true

// boolean flag = 1;           // 编译错误：整数不是 boolean
// int n = true;               // 编译错误：boolean 不能自动转为 int
~~~

Java 和 C 的重要差别：在 Java 中，**不能用整数 0、1 代替 false、true**。条件表达式必须提供 boolean 结果。

~~~java
int score = 80;
boolean excellent = score >= 90; // false
~~~

\`boolean\` 的“占几字节”不能简单说死为 1 字节。Java 语言规范只规定真假取值，实际在 JVM 数据结构中的表示依场景和实现决定。

### 2.2.2 整数类型

整数类型用于存储**没有小数部分**的值。四种有符号整数类型：byte、short、int、long。

核心思想：使用固定数量的二进制位表示整数。以 8 位 byte 为例，8 位一共能形成 256 种不同的位模式；在有符号的二进制补码解释下，对应 **-128 ～ 127**。

**重要：整型常量默认是什么类型？**

~~~java
int a = 100;                  // 100 默认是 int 字面量
long b = 100L;                // L 表明它是 long 字面量
long c = 100;                 // int 值可自动转换为 long
long d = 3_000_000_000L;      // 必须加 L：超出 int 字面量表示范围
~~~

整数字面量支持不同进制：

~~~java
int a = 26;       // 十进制
int b = 0x1A;     // 十六进制
int c = 0b11010;  // 二进制
int d = 032;      // 八进制：以 0 开头（这里也是 26）
System.out.println(a == b && b == c && c == d); // true
~~~

\`_\` 可用于分隔数字提高可读性，如 \`1_000_000\`；但不能随意放在数字开头、末尾或紧贴小数点/进制前缀位置。

**整数溢出（非常重要）**

~~~java
int x = 2_147_483_647; // int 最大值
int y = x + 1;
System.out.println(y);  // -2147483648
~~~

为什么不是 2147483648？因为 int 只用 32 位表达有符号整数，运算发生溢出时，低 32 位保留并按有符号数解释，结果绕回最小值。**普通 int 加法默认不会抛出溢出异常**。

如果需要明确检查，可以使用 \`Math.addExact(x, 1)\`，溢出时会抛出 ArithmeticException。

**常见误区**：

- \`byte + byte\` 的结果类型不是 byte，整数算术运算通常至少提升到 **int**。
- \`long big = 2147483647 + 1;\` **先发生 int 溢出，再转 long**，不会因为左侧变量是 long 就扩大右侧运算精度。
- 正确做法是先让某个操作数参与 long 运算：\`long big = 2147483647L + 1;\`。

### 2.2.3 字符类型

\`char\` 表示一个 16 位 UTF-16 编码单元，写法使用**单引号**：

~~~java
char a = 'A';
char digit = '7';
char newline = '\n';
char tab = '\t';
char quote = '\'';
char slash = '\\';
char han = '\u4E2D';   // '中'
~~~

字符字面量与整数之间存在数值联系：

~~~java
char a = 'A';
System.out.println((int) a); // 65
System.out.println(a + 1);   // 66：char 运算提升为 int
System.out.println((char) (a + 1)); // B
~~~

\`'7'\` 表示字符“7”，对应的码值为 55，**不是整数 7**。

~~~java
System.out.println('7' - '0'); // 7
~~~

这里通过字符码值相减计算一个 ASCII 数字字符对应的数值。它不是通用 Unicode 数字解析方法。

**字符与字符串**：

| 表达式 | 类型 | 解释 |
| --- | --- | --- |
| \`'A'\` | char | 一个 UTF-16 编码单元 |
| \`"A"\` | String | 长度为 1 的字符串对象 |
| \`'\n'\` | char | 换行控制字符 |
| \`""\` | String | 空字符串 |
| \`''\` | 非法 | Java 不存在“空 char 字面量” |

### 2.2.4 浮点类型

\`float\` 和 \`double\` 存储带有小数的近似数，使用 IEEE 754 二进制浮点语义。

~~~java
double pi = 3.14159; // 小数字面量默认是 double
float approx = 3.14F; // F 后缀指定 float
double scientific = 1.2e3; // 1200.0
~~~

**浮点数并不是“把十进制小数原样保存”。** 它们通过符号位、指数和有效数字编码二进制数。像十进制 0.1 这样的数，二进制一般无法有限位精确表示，实际保存的是最接近的可表示值。

~~~java
System.out.println(0.1 + 0.2); // 常见输出 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3); // false
~~~

因此，金额等需要严格十进制精确性的计算，应考虑 BigDecimal，而不是直接使用 double。

**float 与 double 的选择**：double 有更高精度和更大范围，是大多数一般浮点计算的默认选择。float 常用于特定内存/性能或 API 需求场景。典型有效十进制精度：float 约 6～7 位，double 约 15～16 位；“位数”不是固定可精确表示的小数位数。

**NaN 与无穷大**：

~~~java
System.out.println(1.0 / 0.0);  // Infinity
System.out.println(0.0 / 0.0);  // NaN
// System.out.println(1 / 0);  // 整数除以零，运行时会出错
~~~

普通整数除 0 与浮点除 0 的规则不同：整数运算会抛出 ArithmeticException；浮点运算可产生 Infinity 或 NaN。NaN 与包括自身在内的任何浮点值用 \`==\` 比较结果都是 false，可用 \`Double.isNaN()\` 判断。

---

## 2.3 类型转换运算

不同类型的值要一起运算或赋值，必须明确**值是如何转换的**。重点不仅是语法，更是“何时转换”和“是否可能丢失信息”。

### 2.3.1 自动类型转换：由较窄表示转换到较宽表示

部分数值类型可以自动进行**扩宽基本类型转换（widening primitive conversion）**：

~~~text
byte ──→ short ──→ int ──→ long ──→ float ──→ double
                     ↑
char ────────────────┘
（图为常见链路；char 也能直接转 long/float/double，
 但 char 不会隐式转换为 short。）
~~~

\`boolean\` 不参加数值类型转换。

~~~java
int count = 12;
long total = count;     // 自动转换
double result = count;  // 自动转换
~~~

**一个关键陷阱**：“扩宽”不等于“绝对精确”。例如整数 long 转换为 float 可能丢失有效数字，即使不会因目标范围较窄而简单报错。

~~~java
int a = 16_777_217; // 比 2^24 多 1
float b = a;
System.out.println(b); // 1.6777216E7，对应 16777216
~~~

### 2.3.2 强制类型转换：程序员显式承担数据损失

当目标类型可能无法表示原始值时，需要显式转换：

~~~java
double x = 9.8;
int y = (int) x;
System.out.println(y); // 9：向 0 截断，不是四舍五入

int n = 130;
byte small = (byte) n;
System.out.println(small); // -126：仅保留低 8 位并按有符号补码解释
~~~

**注意**：浮点到整数的强制转换除了截断，还要考虑 NaN、超出整数范围时的专门规则；不要笼统说“所有转换都只是丢掉小数”。

### 2.3.3 表达式中的自动提升，比赋值更容易错

~~~java
byte a = 10;
byte b = 20;
// byte sum = a + b; // 编译错误：a + b 的结果为 int
int sum = a + b;     // 正确
byte c = (byte) (a + b); // 正确，但转回 byte 可能溢出
~~~

**运算步骤**：

1. \`a\` 与 \`b\` 虽然均声明为 byte；
2. 使用二元 \`+\` 时，它们进行二元数值提升，得到 int 参与计算；
3. \`a + b\` 的表达式类型是 int；
4. 将 int 赋给 byte 变量通常需要显式转换。

还要区分**编译期常量赋值特例**：

~~~java
byte x = 100;     // 合法：100 是常量表达式，落在 byte 范围内
// byte y = 128;  // 错：超出范围
byte z = 10 + 20; // 合法：编译期可确定的 int 常量表达式，值在范围内
~~~

这不等于“所有 int 都能自动赋给 byte”。

**右边先计算，左边后接收**：

~~~java
int a = 5;
int b = 2;
double r1 = a / b;         // 2.0：整数除法先算出 2
double r2 = (double) a / b;// 2.5：转换其中一个操作数后执行浮点除法
~~~

**复合赋值的额外规则**（延伸到第 3 章）：

~~~java
byte count = 120;
count += 10; // 能编译，内部隐含了向 byte 的转换
System.out.println(count); // -126
// count = count + 10;      // 编译错误：右侧是 int
~~~

因此“\`+=\` 和 \`= x +\` 永远完全等价”是错误的。

### 2.3.4 如何按正确顺序分析计算题

遇到混合类型表达式，按以下步骤：

1. **确认每个字面量类型**：\`10\` 默认 int，\`10L\` 是 long，\`1.0\` 是 double。
2. **看运算发生前是否提升类型**：byte/short/char 常提升为 int。
3. **确定运算本身执行的类型**：int 除法与 double 除法完全不同。
4. **检查是否发生溢出/舍入/截断**。
5. **最后**才看赋值目标是否允许接收该表达式结果。

**原创自检**：

~~~java
long x = 2_147_483_647 + 1;
long y = 2_147_483_647L + 1;
System.out.println(x); // -2147483648
System.out.println(y); // 2147483648
~~~

如果把两个结果都写成 2147483648，说明混淆了**运算时的类型**和**最终存储的变量类型**。

---

## 2.4 输入与输出数据

在命令行程序中，输入和输出把程序与使用者连接起来：程序从标准输入读取文本，经解析得到数据，再输出计算结果。

### 2.4.1 输入基本型数据

Java 的 \`System.in\` 表示标准输入字节流。初学阶段通常使用 \`java.util.Scanner\` 把输入的字符转换为整数、浮点数等。

原创示例：

~~~java
import java.util.Scanner;

public class ReadData {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("请输入姓名和年龄：");
        String name = scanner.next();
        int age = scanner.nextInt();

        System.out.println("姓名：" + name);
        System.out.println("年龄：" + age);
        // 此处为了方便演示未关闭 System.in
    }
}
~~~

例如输入：

~~~text
小明 20
~~~

程序会按空白分隔 token：\`next()\` 得到 \`"小明"\`，\`nextInt()\` 解析成 \`20\`。

**必须掌握 Scanner 的两种读取方式**：

- \`nextInt()\`、\`nextDouble()\`、\`next()\`：以分隔符（默认空白）为边界读取 token，并按目标类型解析。
- \`nextLine()\`：读取该行剩余文本，直到换行符为止，不把换行符包含在返回字符串中。

混用时的典型坑：

~~~java
int age = scanner.nextInt();
String line = scanner.nextLine(); // 很可能只读到当前行剩下的空内容
~~~

\`nextInt()\` 留下的换行符可能被紧接着的 \`nextLine()\` 消费。常见解决方法是在适当位置先额外读取一次 \`nextLine()\`，消耗本行剩余内容；或者统一使用 \`nextLine()\` 再手动解析。

~~~java
int age = Integer.parseInt(scanner.nextLine().trim());
String name = scanner.nextLine();
~~~

**不要忽略异常场景**：输入“二十”给 \`nextInt()\` 通常会抛出 InputMismatchException；输入提前结束也会失败。真实交互程序需要检查输入或捕获异常。

**资源关闭补充**：Scanner 实现 AutoCloseable，关闭 Scanner(System.in) 往往连同底层标准输入一起关闭。教程里的短小主程序可以不手动关闭，但**长时间运行并需要重复读标准输入的程序**要注意关闭时机。

### 2.4.2 输出基本型数据

\`System.out.print\`、\`println\`、\`printf\` 是常用的标准输出方式：

~~~java
int count = 4;
double price = 12.5;

System.out.print("数量：");       // 不主动换行
System.out.println(count);       // 输出后换行
System.out.printf("单价：%.2f%n", price); // 格式化输出
~~~

\`printf\` 里 \`%.2f\` 表示按浮点格式保留两位小数进行输出，\`%n\` 表示平台适用的换行符；常用占位符：

| 格式 | 目的 | 示例 |
| --- | --- | --- |
| \`%d\` | 十进制整数 | \`printf("%d", 12)\` |
| \`%f\` | 十进制浮点数 | \`printf("%.1f", 1.25)\` |
| \`%s\` | 字符串形式 | \`printf("%s", "Hi")\` |
| \`%c\` | 字符 | \`printf("%c", 'A')\` |
| \`%n\` | 平台换行 | \`printf("OK%n")\` |

实际小数点符号可能受默认 Locale 影响；需要与测试平台输出严格一致时，可使用 \`System.out.printf(java.util.Locale.US, ...)\`。

**字符串连接与算术计算的区别**：

~~~java
System.out.println("结果：" + 1 + 2);   // 结果：12
System.out.println("结果：" + (1 + 2)); // 结果：3
~~~

第一个表达式从左至右遇到 String，后续 + 执行字符串连接；第二个先在括号中进行整数相加。

---

## 2.5 数组

数组的核心价值：**使用一个变量引用一组按索引组织、元素类型固定、长度固定的数据**。

例如一名学生的三个成绩，如果用三个变量：

~~~java
int math = 90;
int java = 95;
int english = 88;
~~~

数据多时不易管理。数组提供统一组织方式：

~~~java
int[] scores = {90, 95, 88};
~~~

**请牢记“数组变量保存的是引用，而非三个元素本身”。** 这条规律会贯穿 2.5 的每个小节。

### 2.5.1 声明数组

**声明数组变量**只是在类型系统中声明“这个变量将来可以引用哪种数组”，不等于已创建数组对象。

~~~java
int[] scores;   // 推荐：[] 放在元素类型后
int scores2[];  // 语法合法，但可读性稍差
~~~

这两者都表示“int 数组类型”。为了阅读代码的一致性，建议优先 \`int[] name\`。

与基本类型变量的对比：

~~~java
int n = 3;       // n 保存整数值 3
int[] arr = null;// arr 是引用变量，当前没有指向数组对象
~~~

\`null\` 表示没有引用某个对象；它不是一个空数组。

~~~java
int[] empty = new int[0]; // 真正创建了长度为 0 的数组
System.out.println(empty.length); // 0
// System.out.println(arr.length); // 若 arr 为 null，会抛出 NullPointerException
~~~

**三种状态必须区分：声明了变量、变量值为 null、变量指向真实数组对象。**

### 2.5.2 为数组分配元素

数组对象一般通过 \`new\` 创建：

~~~java
int[] scores = new int[3];
~~~

按前向执行过程理解：

1. 读到 \`new int[3]\`：创建一个长度为 3 的 int 数组对象。
2. 数组对象具有连续的 **索引编号** 0、1、2，所有元素都是 int。
3. 新创建的 int 数组的元素自动初始化为 0。
4. 赋值使引用变量 \`scores\` 指向这个数组。

~~~text
scores ─────────────┐
                    ▼
             int[3] 数组对象
          ┌──────┬──────┬──────┐
索引      │  0   │  1   │  2   │
          ├──────┼──────┼──────┤
默认值    │  0   │  0   │  0   │
          └──────┴──────┴──────┘
~~~

Java 对新建数组元素的默认值作了规定：

| 元素类型 | 初始值 |
| --- | --- |
| 整数类（byte/short/int/long） | 0 |
| 浮点类（float/double） | 0.0 |
| char | \`'\u0000'\` |
| boolean | false |
| 引用类型（如 String） | null |

**非常重要**：数组对象的元素有默认值，**方法内部尚未赋值的局部变量**却不能随意直接读取。

~~~java
int[] numbers = new int[2];
System.out.println(numbers[0]); // 0：合法

int a;
// System.out.println(a); // 编译错误：局部变量尚未初始化
~~~

数组长度是创建时确定的，允许 0，但不能是负值：

~~~java
int[] zero = new int[0];  // 合法
// int[] bad = new int[-1]; // 运行时抛 NegativeArraySizeException
~~~

### 2.5.3 数组元素的使用

通过 \`数组名[下标]\` 访问元素，**下标从 0 开始**。

~~~java
int[] score = new int[3];
score[0] = 86;
score[1] = 91;
score[2] = 75;

System.out.println(score[1]);     // 91
System.out.println(score[0] + score[2]); // 161
~~~

合法下标范围为 **0 到 length - 1**。

~~~java
int[] arr = {10, 20, 30};
// System.out.println(arr[3]); // 运行时 ArrayIndexOutOfBoundsException
// System.out.println(arr[-1]); // 同样越界
~~~

**声明类型决定允许存放什么：**

~~~java
int[] values = new int[2];
values[0] = 4;
// values[1] = "hello"; // 编译错误：String 不能赋给 int
~~~

**数组遍历（提前引入第 3 章的循环）**：

~~~java
int[] scores = {86, 91, 75};
int sum = 0;
for (int i = 0; i < scores.length; i++) {
    sum += scores[i];
}
System.out.println(sum); // 252
~~~

解析：初始化 i=0 → 检查 i<3 → 读取 scores[i] → 累加 → i++ → 重复。当 i=3，条件不成立，不执行 scores[3]，因此避免越界。

也可以使用增强 for：

~~~java
for (int value : scores) {
    System.out.println(value);
}
~~~

这里 \`value\` 接收每轮元素值；它不是原数组元素的引用位置，给 \`value\` 重新赋值不会修改原数组中的 int 元素。

### 2.5.4 length 的使用

**\`length\` 是数组的字段（属性），不是方法。**

~~~java
int[] data = new int[5];
System.out.println(data.length);   // 5
// System.out.println(data.length()); // 编译错误
~~~

而 String 使用方法 \`length()\`：

~~~java
String text = "Java";
System.out.println(text.length()); // 4
~~~

注意：两个表达式形式很像，但属于不同类型的 API。数组的 \`length\` 在创建后固定，**不能赋值修改**：

~~~java
int[] values = new int[3];
// values.length = 5; // 编译错误
~~~

要增加“容量”，通常需要创建一个更长的新数组，复制原来的数据。数组不能像 ArrayList 那样动态增减长度。

### 2.5.5 数组的初始化

“初始化”是给数组各元素提供起始值。主要方法有三种：

**方式一：创建后自动填默认值**

~~~java
int[] scores = new int[3]; // {0, 0, 0}
~~~

**方式二：逐个指定元素**

~~~java
int[] scores = new int[3];
scores[0] = 90;
scores[1] = 85;
scores[2] = 98;
~~~

**方式三：用初始化列表直接给出元素**

~~~java
int[] scores = {90, 85, 98};
int[] same = new int[] {90, 85, 98};
~~~

注意两种写法所处语法位置并不完全相同：

~~~java
int[] a = {1, 2, 3}; // 声明时可以直接用 {}
int[] b;
b = new int[] {1, 2, 3}; // 赋值时使用 new int[]
// b = {1, 2, 3};  // 编译错误：不能单独把数组初始化器当作普通表达式
~~~

补充：数组可存放引用类型，例如 \`String[] words = new String[2];\`，此时两个元素都初始化为 null，并没有自动创建两个 String 对象。

**二维数组（扩展：帮助理解数组的数组）**

Java 的“二维数组”本质是 **数组的数组**：

~~~java
int[][] table = {
    {1, 2, 3},
    {4, 5}
};
System.out.println(table.length);     // 2：有两行
System.out.println(table[0].length);  // 3
System.out.println(table[1].length);  // 2
System.out.println(table[1][0]);     // 4
~~~

每一行长度可以不同，这种形式称为不规则数组（jagged array）。因此**不要默认所有行长度相同**。Java 不要求二维数组对应一整块规则矩形内存。

### 2.5.6 数组的引用

**这是第二章最需要理解的概念之一。** 数组是对象，数组变量保存该对象的**引用**。让两个数组变量相互赋值，默认**复制的是引用值，不是复制所有元素**。

~~~java
int[] a = {10, 20, 30};
int[] b = a;
b[0] = 99;

System.out.println(a[0]); // 99
System.out.println(b[0]); // 99
~~~

内存关系示意：

~~~text
a ────┐
      ├────────→  一个数组对象 [99, 20, 30]
b ────┘
~~~

执行分解：

1. \`new\` 或数组初始化器创建一个数组对象。
2. \`a\` 保存该对象的引用值。
3. \`b = a\` 将**引用值**从 a 复制给 b，因此两个变量指向同一数组。
4. 通过 b 修改数组里的数据，a 当然也会看到变化，因为对象只有一个。

但如果只是把 b 指向另一个数组：

~~~java
int[] a = {10, 20};
int[] b = a;
b = new int[] {7, 8};
System.out.println(a[0]); // 10
System.out.println(b[0]); // 7
~~~

这次 b 的**引用变量本身**变了，却没有改动原数组对象。

**真正复制元素：**

~~~java
int[] a = {10, 20, 30};
int[] b = a.clone();      // 创建新的 int[] 对象，复制各元素
b[0] = 99;
System.out.println(a[0]); // 10
System.out.println(b[0]); // 99
~~~

对一维基本类型数组，clone 复制每个基本类型元素的值，因此副本修改不影响原数组。对“对象引用数组”或“二维数组”，clone 通常是**浅拷贝**，内层对象/子数组的引用仍可能共享：

~~~java
int[][] a = {{1, 2}, {3, 4}};
int[][] b = a.clone();
b[0][0] = 99;
System.out.println(a[0][0]); // 99：内层数组仍共享
~~~

如何进一步独立复制内层数组：

~~~java
int[][] b = new int[a.length][];
for (int i = 0; i < a.length; i++) {
    b[i] = a[i].clone();
}
~~~

这段仅适用于内层数组均非 null 的情况。真正的“深拷贝”还必须理解元素若是引用对象，是否要继续复制对象本身。

**比较数组**：

~~~java
int[] x = {1, 2};
int[] y = {1, 2};
System.out.println(x == y); // false：两个不同数组对象
System.out.println(java.util.Arrays.equals(x, y)); // true：比较一维元素
~~~

对于多维数组，可以使用 \`Arrays.deepEquals\` 递归比较嵌套数组的内容。

**数组作为参数（为后续学习类与方法铺路）**：Java 只有**按值传递（pass-by-value）**，但传递的值可以是对象引用的副本。方法若通过该引用修改同一数组的元素，调用方可观察到；若方法仅给自己的形参重新赋另一数组，调用方的数组变量不受影响。说“Java 把数组按引用传递”容易误导。

**易错点总结**：

- \`int[] a = new int[3];\` 和 \`int[] b = a;\` 不是创建两个数组对象。
- \`new int[0]\` 和 \`null\` 完全不同。
- \`a == b\` 比较是否引用同一个数组对象，不是逐元素比较。
- \`a.clone()\` 对二维数组只复制最外层数组，不会自动递归克隆内层数组。

---

## 2.6 应用举例

本节提供**原创整合示例**，用于串联本章知识，不复制教材 §2.6 的原代码。涉及 for 的部分会在第 3 章正式展开。

### 实例 A：输入成绩，求平均数、最高分

要求：读入学生人数 n 与 n 个整型分数，输出平均数（两位小数）和最大值。

~~~java
import java.util.Scanner;

public class ScoreSummary {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        if (n <= 0) {
            System.out.println("人数必须大于 0");
            return;
        }

        int[] scores = new int[n];
        long sum = 0; // 防止大数据量下 int 求和溢出
        int max = Integer.MIN_VALUE;

        for (int i = 0; i < scores.length; i++) {
            scores[i] = in.nextInt();
            sum += scores[i];
            if (scores[i] > max) max = scores[i];
        }

        double average = (double) sum / scores.length;
        System.out.printf(java.util.Locale.US,
                "平均分：%.2f，最高分：%d%n", average, max);
    }
}
~~~

输入：

~~~text
3
80 90 100
~~~

输出：

~~~text
平均分：90.00，最高分：100
~~~

**前向执行逻辑**：

1. \`n = 3\`，创建 \`int[3]\`，各元素初始值为 0。
2. 读入三项数据并写到 \`scores[0]\`、\`scores[1]\`、\`scores[2]\`。
3. \`sum\` 是 long，累计值变化为 80 → 170 → 270；\`max\` 最终是 100。
4. \`(double) sum\` 使除法按 double 进行，而非整数除法。
5. \`%.2f\` 把显示结果格式化为两位小数。

**为什么把 max 初始化为 \`Integer.MIN_VALUE\`？** 若所有成绩都是负数，把 max 初始化成 0 会得出错误结果；把它设为整数最小值或直接用第一个输入值更通用。这是一项泛化的算法习惯。

### 实例 B：复制数组后修改，观察两个数组

~~~java
public class ArrayCopyDemo {
    public static void main(String[] args) {
        int[] original = {3, 6, 9};
        int[] alias = original;
        int[] copy = original.clone();

        alias[0] = 100;
        copy[1] = 200;

        System.out.println(java.util.Arrays.toString(original)); // [100, 6, 9]
        System.out.println(java.util.Arrays.toString(alias));    // [100, 6, 9]
        System.out.println(java.util.Arrays.toString(copy));     // [3, 200, 9]
    }
}
~~~

**请不要只背输出。** 先在纸上画三个变量各自指向哪个数组，再判断修改语句的目标。理解之后，数组引用、浅复制、方法参数这些问题会一起变得清楚。

---

## 2.7 小结

本章不是几条零散语法，而是围绕 **数据如何表示、计算、存储** 的完整知识链。

**知识点一：名字与类型。** 标识符用来命名实体；关键字不能直接作为标识符。类型决定能表示的值及合法操作。

**知识点二：值的表示。** 整数类型的范围受位数限制；浮点数是二进制近似值；char 是 UTF-16 编码单元；boolean 不能当整数 0/1 使用。

**知识点三：计算中的转换。** 先确定表达式每个操作数类型，再看数值提升与运算，最后看赋值或强制转换。不要因为左边声明 double/long，就认为右侧表达式天然会以 double/long 计算。

**知识点四：数组是引用类型。** 数组对象创建后长度固定、有默认值、下标从零开始；数组变量可引用同一对象，普通赋值不会深复制元素。

### 高频易错速查

| 容易答错的说法 | 正确理解 |
| --- | --- |
| “Java 中 byte+byte 结果是 byte” | 通常提升为 int |
| “long 接收结果不会发生 int 溢出” | 右侧如果先按 int 运算，仍会溢出 |
| “浮点数 0.1 存储精确” | 二进制浮点一般不能精确表示 0.1 |
| “(int) 9.8 会四舍五入得到 10” | 转为 9，向零截断 |
| “char 是一个任意 Unicode 字符” | char 是一个 UTF-16 编码单元 |
| “新建数组元素没有初始值” | 数组元素有默认值；未初始化的局部变量没有 |
| “数组长度可以直接增加” | 创建后固定；要更长通常新建数组 |
| “两个数组变量赋值后是两个独立数组” | 默认复制引用，可指向同一对象 |
| “数组 a==b 是逐项比较” | 比较引用身份；逐项比较用 Arrays.equals |
| “Scanner 的 nextInt 后立刻 nextLine 一定读到下一行内容” | 常先读到当前行剩余内容，包括空字符串 |

### 本章原创理解题（非书中习题）

先独立作答，再展开下一段的答案：

1. \`int x = 2_147_483_647; long y = x + 1;\` 中 y 为多少？如何让它等于 2147483648？
2. \`byte a = 3, b = 4; byte c = a + b;\` 为什么不能编译？
3. \`double r = 5 / 2;\` 的结果是多少？怎样得到 2.5？
4. \`String s = "😀"; s.length()\` 是多少？为什么？
5. \`int[] a = {1, 2}; int[] b = a; b[0] = 9;\` 那么 a[0] 等于多少？
6. 对同样元素的两个独立数组，\`a == b\` 一定成立吗？

**答案与解析**：

1. y 为 -2147483648，因为右侧先进行 int 加法溢出；改为 \`long y = (long) x + 1;\`。
2. byte 两个操作数进行二元数值提升，结果类型 int，不能隐式赋给 byte 变量（常量表达式特例除外）。
3. 结果 2.0；使用 \`(double)5 / 2\` 或 \`5.0 / 2\` 得到 2.5。
4. 2，因为这个码点在 UTF-16 中用两个编码单元存储。
5. 9。a 与 b 指向同一个数组对象。
6. 不一定，若为不同对象则 false；可用 \`Arrays.equals\` 按元素比较一维基本类型数组。

---

## 2.8 课外读物

为验证规则，优先参考语言规范而非搜索片段的经验性结论：

- [Java SE 14 语言规范：类型、值与变量](https://docs.oracle.com/javase/specs/jls/se14/html/jls-4.html)
- [Java SE 14 语言规范：转换与上下文](https://docs.oracle.com/javase/specs/jls/se14/html/jls-5.html)
- [Java SE 14 语言规范：数组](https://docs.oracle.com/javase/specs/jls/se14/html/jls-10.html)
- [Java SE 14 语言规范：整数与浮点运算](https://docs.oracle.com/javase/specs/jls/se14/html/jls-15.html)

**建议验证顺序**：先在纸上写输出与原因，再用本机 JDK 运行原创例子；若结果不同，回到规则分析隐式转换和对象引用，不要只修改答案。

---

## 教材原代码与题目定位（待第 6 版原页核实）

**注意**：下面标记的是“按已核实的第 6 版目录定位到哪一节”，并非声称该小节一定有独立编号的原书程序或题目。实际印刷页码与编号需要取得第 6 版正文后逐页核对。**未核实前不填数字，更不会用第 5 版的页码。**

| 原书内容类别 | 对应章节位置 | 第 6 版印刷页码 | 教材原始编号 | 原代码 / 原题 |
| --- | --- | --- | --- | --- |
| 变量、标识符、字符示例（若有） | §2.1 | 待核实 | 待核实 | 留白 |
| 基本类型与范围演示（若有） | §2.2 | 待核实 | 待核实 | 留白 |
| 类型转换程序（若有） | §2.3 | 待核实 | 待核实 | 留白 |
| 数据输入/输出代码（若有） | §2.4 | 待核实 | 待核实 | 留白 |
| 数组声明与创建程序（若有） | §2.5.1—§2.5.2 | 待核实 | 待核实 | 留白 |
| 数组下标、length、初始化程序（若有） | §2.5.3—§2.5.5 | 待核实 | 待核实 | 留白 |
| 数组引用程序（若有） | §2.5.6 | 待核实 | 待核实 | 留白 |
| 应用举例的原始程序（若有） | §2.6 | 待核实 | 待核实 | 留白 |
| 第二章章末习题 | 习题 2 | 待核实 | 待核实 | 留白 |

**独立原创代码与教材原代码不是一回事**：本文能直接运行的示例均为教学演示，不能据此反推出教材的示例编号、源码或页码。

[前往学习控制台练习本章原创 Demo](/java/) · [返回第 1 章](/java/ch01-intro/)。
