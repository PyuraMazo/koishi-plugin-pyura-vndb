# koishi-plugin-pyura-vndb

  

[![npm](https://img.shields.io/npm/v/koishi-plugin-pyura-vndb?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-pyura-vndb)
## 介绍
Koishi.js的插件，调用了VNDB的API，实现了通过Gal名、厂商名和角色名查找相关信息的功能。

## 使用
### 视觉小说/旮旯给木（默认）
`/vndb 名称1 名称2 ...`
### 会社/厂商
`/vndb -m producer 名称1 名称2 ...`
### 角色
`/vndb -m character 名字1 名字2 ...`
***
### 模糊搜索
以上的指令只会对每个内容输出一条最匹配的结果，但如果想要输出更多符合条件的内容或者模糊搜索的内容，只需要再添加一个选项 **-f**，以下三种效果一样：
- `/vndb -m producer -f AUGUST`
- `/vndb -f -m producer AUGUST`
- `/vndb -fm producer AUGUST`
#### 错误演示：选项m与选项m的参数没有毗邻，如:
- `/vndb -m -f producer AUGUST`
- `/vndb -mf producer AUGUST`
## 反馈
本人第一次制作插件，
如有建议和批评请发送至邮箱1605025385@qq.com，
感谢支持！