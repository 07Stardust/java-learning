import { defineConfig } from 'vitepress'
const chapters = [{"number":"01","slug":"ch01-intro","title":"Java 入门"},{"number":"02","slug":"ch02-types-arrays","title":"基本数据类型与数组"},{"number":"03","slug":"ch03-expressions","title":"运算符、表达式和语句"},{"number":"04","slug":"ch04-classes","title":"类与对象"},{"number":"05","slug":"ch05-inheritance","title":"子类与继承"},{"number":"06","slug":"ch06-interfaces","title":"接口与实现"},{"number":"07","slug":"ch07-inner-exceptions","title":"内部类与异常类"},{"number":"08","slug":"ch08-utilities","title":"常用实用类"},{"number":"09","slug":"ch09-events","title":"组件及事件处理"},{"number":"10","slug":"ch10-io","title":"输入和输出流"},{"number":"11","slug":"ch11-jdbc","title":"JDBC 与 MySQL 数据库"},{"number":"12","slug":"ch12-threads","title":"Java 多线程机制"},{"number":"13","slug":"ch13-network","title":"Java 网络编程"},{"number":"14","slug":"ch14-media","title":"图形、图像与音频"},{"number":"15","slug":"ch15-generics","title":"泛型与集合框架"}]

export default defineConfig({
  lang: 'zh-CN',
  title: 'Java 学习实验室',
  description: '依照《Java 2实用教程（第6版）》15章体系设计的学习实验室',
  base: '/java-learning/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'Java 学习实验室',
    nav: [
      { text: '首页', link: '/' },
      { text: '学习控制台', link: '/java/' },
      { text: '第一章', link: '/java/ch01-intro/' }
    ],
    sidebar: {
      '/java/': [
        { text: '学习控制台', link: '/java/' },
        { text: '教材章节', items: chapters.map(ch => ({ text: ch.number + ' · ' + ch.title, link: '/java/' + ch.slug + '/' })) }
      ]
    },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/07Stardust/java-learning' }],
    footer: {
      message: '独立学习网站 · 示例题均为原创演示，非教材原题',
      copyright: '本地学习数据由你自己保管'
    }
  }
})
