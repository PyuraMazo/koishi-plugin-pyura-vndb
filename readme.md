
# koishi-plugin-pyura-vndb  
  
    
  
[![npm](https://img.shields.io/npm/v/koishi-plugin-pyura-vndb?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-pyura-vndb)  
# VNDB 查询插件  
  
## 介绍  
Koishi.js的插件，调用了VNDB的API，实现了通过Gal名、厂商名和角色名查找相关信息的功能。  
  
## 搜索指令  

|名称|别名|参数|作用|
|:------:|:------:|:------:|:------:|
| `vndb.vn`|`vndb.v`、`vn`|作品名称|查询作品|
| `vndb.character`|`vndb.c`、`character`|角色名称|查询角色|
| `vndb.producer`|`vndb.p`、`producer`|厂商名称|查询厂商|
| `vndb.id`|`vndb.i`、`id`|VNDB ID|查询ID对应内容|
| `vndb.event`|`vndb.e`、`event`|可选：日期<br>格式：mm-dd<br>默认：今天|查询这一天的发布作品和角色生日|

## 管理指令  
|名称|别名|参数|作用|权限|
|:------:|:------:|:------:|:------:|:------:|
| `vndb.queue`|`vndb.q`、`queue`|无|查看本群聊任务队列|不需要|

## 指令选项
选项使用方法：  
形式：`<指令名>[空格]<选项和对应参数>[空格]<指令参数>`
例如：`vn -r 素晴日`
效果：清空【Gal-素晴日】的本地缓存，并执行搜索指令。此指令常用于结果中有图片下载失败时，重新生成结果图。

|选项|全称|参数|作用|
|:------:|:------:|:------:|:------:|
| `-r`|`--refresh`|无|清空本地缓存并重新执行命令|

## 版本历史

### Ver 2.1.0 -> Ver 2.1.1
- 修复了event指令在某些平台上无法运行的问题。
- 增加了queue查询队列指令。
- 增加了一个刷新缓存的选项。



## 问题反馈  
如果你遇到任何问题或者有任何改进建议，请通过以下方式联系我：  
-  邮箱：pyuramazo@vip.qq.com
- Github： [Issues](https://github.com/PyuraMazo/koishi-plugin-pyura-vndb/issues)