export const chapters = [
  {
    "number": "01",
    "slug": "ch01-intro",
    "title": "Java 入门",
    "topics": [
      "Java 的特点与运行机制",
      "JDK、JRE、JVM 的关系",
      "源程序编译与运行流程",
      "main 方法和基本程序结构"
    ]
  },
  {
    "number": "02",
    "slug": "ch02-types-arrays",
    "title": "基本数据类型与数组",
    "topics": [
      "基本数据类型与变量",
      "类型转换与运算规则",
      "一维数组和多维数组",
      "数组遍历及常见错误"
    ]
  },
  {
    "number": "03",
    "slug": "ch03-expressions",
    "title": "运算符、表达式和语句",
    "topics": [
      "运算符优先级与结合性",
      "条件语句与分支结构",
      "循环控制语句",
      "表达式求值与短路逻辑"
    ]
  },
  {
    "number": "04",
    "slug": "ch04-classes",
    "title": "类与对象",
    "topics": [
      "类、对象和构造方法",
      "成员变量和局部变量",
      "实例成员与 static 成员",
      "方法重载、this 和访问控制"
    ]
  },
  {
    "number": "05",
    "slug": "ch05-inheritance",
    "title": "子类与继承",
    "topics": [
      "extends 与继承关系",
      "方法重写与 super",
      "多态、向上转型和动态绑定",
      "final 和抽象类"
    ]
  },
  {
    "number": "06",
    "slug": "ch06-interfaces",
    "title": "接口与实现",
    "topics": [
      "接口的定义与实现",
      "接口引用与多态",
      "默认方法和静态方法",
      "接口与抽象类的区别"
    ]
  },
  {
    "number": "07",
    "slug": "ch07-inner-exceptions",
    "title": "内部类与异常类",
    "topics": [
      "成员内部类与匿名内部类",
      "异常分类与传播",
      "try / catch / finally",
      "throws 与自定义异常"
    ]
  },
  {
    "number": "08",
    "slug": "ch08-utilities",
    "title": "常用实用类",
    "topics": [
      "String 与 StringBuilder",
      "包装类和常用数学方法",
      "日期时间与格式化",
      "常用工具类的使用"
    ]
  },
  {
    "number": "09",
    "slug": "ch09-events",
    "title": "组件及事件处理",
    "topics": [
      "GUI 容器与组件",
      "事件源、事件对象和监听器",
      "布局管理",
      "事件回调与线程约束"
    ]
  },
  {
    "number": "10",
    "slug": "ch10-io",
    "title": "输入和输出流",
    "topics": [
      "字节流与字符流",
      "文件读写与缓冲",
      "编码与资源关闭",
      "异常处理及 try-with-resources"
    ]
  },
  {
    "number": "11",
    "slug": "ch11-jdbc",
    "title": "JDBC 与 MySQL 数据库",
    "topics": [
      "JDBC 的连接流程",
      "Statement 与 PreparedStatement",
      "查询结果 ResultSet",
      "事务与资源释放"
    ]
  },
  {
    "number": "12",
    "slug": "ch12-threads",
    "title": "Java 多线程机制",
    "topics": [
      "线程创建与生命周期",
      "同步、锁和共享变量",
      "线程通信",
      "竞态条件和死锁"
    ]
  },
  {
    "number": "13",
    "slug": "ch13-network",
    "title": "Java 网络编程",
    "topics": [
      "IP、端口及网络协议",
      "Socket 通信",
      "客户端和服务器端",
      "网络 I/O 与异常"
    ]
  },
  {
    "number": "14",
    "slug": "ch14-media",
    "title": "图形、图像与音频",
    "topics": [
      "绘图坐标系与图形接口",
      "图像加载和绘制",
      "重绘机制",
      "音频相关 API"
    ]
  },
  {
    "number": "15",
    "slug": "ch15-generics",
    "title": "泛型与集合框架",
    "topics": [
      "泛型类、泛型方法及边界",
      "List、Set 与 Map",
      "集合遍历与迭代器",
      "比较器和泛型通配符"
    ]
  }
]

const questionModules = import.meta.glob('../../java/ch*/questions.json', { eager: true, import: 'default' })
const codingModules = import.meta.glob('../../java/ch*/coding/*.json', { eager: true, import: 'default' })
const flashcardModules = import.meta.glob('../../java/ch*/flashcards.json', { eager: true, import: 'default' })

const gather = (modules) => Object.values(modules).flatMap(value => Array.isArray(value) ? value : [value])
export const questions = gather(questionModules).filter(item => item && item.id)
export const codingProblems = gather(codingModules).filter(item => item && item.id)
export const flashcards = gather(flashcardModules).filter(item => item && item.id)
export const chapterTitle = (number) => chapters.find(ch => ch.number === String(number).padStart(2, '0'))?.title || '未知章节'
