# 题库填写规范

这里的 JSON 文件都是**空白骨架或原创 Demo**，不包含教材原题。自行填写题目时，建议使用你有权发布的内容；只用于个人使用的题目不要提交到公开仓库。

## 客观题：每章 questions.json

必须是 JSON 数组，类型包括：

- single：单选；options 数组 + 字符串 answer
- multiple：多选；options 数组 + 字符串数组 answer
- truefalse：判断；布尔 answer
- blank：填空；字符串或接受的答案字符串数组
- output：代码输出；code 字符串 + answer 字符串（按行比较）

公共字段：id（全站唯一）、chapter（两位字符串）、type、prompt、explanation、tags（可选）。

演示文件：ch02-types-arrays/questions.json，ch03-expressions/questions.json。

## 编程题：每章 coding/*.json

参考 ch04-classes/coding/demo-class.json：id、chapter、title、description、starterCode、referenceCode、explanation、testCases。

**不会在浏览器内运行代码**。练习者自行用 JDK 编译运行，再对照参考答案，选择“做对”或“做错”。

## 闪卡：每章 flashcards.json

JSON 数组，字段 id、chapter、front、back。示例见 ch02-types-arrays/flashcards.json。

修改文件后推送到 main，GitHub Actions 会自动重新构建。进度数据由浏览器保存，不随网站源码上传。
