# Java 学习实验室

围绕**《Java 2实用教程（第6版）》**（耿祥义、张跃平，清华大学出版社，2021）15 章设计的个人复习网站。

**当前是可扩展的教学骨架，不是教材内容电子化项目。** 章节页保留知识点填写位；客观题与编程题 JSON 默认留空，只有少量原创 Demo 供验证功能。Demo 不属于教材原题。

## 已实现

- 15 章章节页面与知识框架；VitePress 本地搜索
- 客观题：单选、多选、判断、填空、读代码写输出；浏览器即时判题
- 编程题：代码草稿、参考答案、测试样例、人工标记对错；**没有 Java 编译器**
- 闪卡：翻面后自评
- 错题本：记录错题，采用答错立即复习、答对后 1/3/7/15 天间隔
- 模拟考试：按各章节已录入客观题占比抽题，计时和本地自动评分
- 学习进度：浏览器 localStorage 保存，JSON 导入/导出，不设账号或云数据库
- GitHub Actions 自动构建发布 GitHub Pages

## 开发与预览

需要 Node.js 20+。

~~~bash
npm install
npm run docs:dev
~~~

本地打开终端显示的地址。生产构建：

~~~bash
npm run docs:build
npm run docs:preview
~~~

## 线上发布（只需设置一次）

打开仓库 Settings → Pages → Build and deployment，把 Source 选择为 **GitHub Actions**。

之后每次推送 main 都触发工作流 .github/workflows/deploy.yml。默认网址预计为：

https://07stardust.github.io/java-learning/

在 GitHub Pages 设置与工作流完成之前，**不要认为该地址已上线**。

Cloudflare Pages 也可从 GitHub 导入，构建命令为 npm run docs:build，输出目录 docs/.vitepress/dist。但目前 VitePress base 设为 /java-learning/，切换 Cloudflare 根域名时请一并改为 /，重新部署。

## 添加知识与题目

- 章节知识：docs/java/chXX-*/index.md
- 章节客观题：docs/java/chXX-*/questions.json
- 章节编程题：docs/java/chXX-*/coding/*.json
- 章节闪卡：docs/java/chXX-*/flashcards.json
- 题库字段说明：docs/java/QUESTION_SCHEMA.md

推荐先参考以下原创示例：

- 选择/多选/判断/填空：docs/java/ch02-types-arrays/questions.json
- 读代码写输出：docs/java/ch03-expressions/questions.json
- 编程自评：docs/java/ch01-intro/coding/demo-hello.json、docs/java/ch04-classes/coding/demo-class.json
- 闪卡：docs/java/ch02-types-arrays/flashcards.json

**题目 id 必须全站唯一且保持稳定**，否则旧学习记录会无法与新题目匹配。

## 数据备份说明

答题、复习和成绩保存在当前浏览器 localStorage，清除浏览数据可能丢失。使用“学习进度 → 导出 JSON”备份，换浏览器使用“导入 JSON”恢复（导入覆盖旧进度）。代码草稿和进行中的考试不会保存。GitHub 仓库不接收个人作答数据。

## 内容与版权

不直接收录教材正文或习题全文。若使用教材原题，请确认有相应公开传播许可；个人私用内容不要提交到公开仓库。
