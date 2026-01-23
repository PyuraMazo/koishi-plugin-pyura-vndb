
# koishi-plugin-pyura-vndb  
  
    
  
[![npm](https://img.shields.io/npm/v/koishi-plugin-pyura-vndb?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-pyura-vndb)  
# VNDB 查询插件  
  
## 介绍  
Koishi.js的插件，调用了VNDB的API，实现了通过Gal名、厂商名和角色名查找相关信息的功能。  
  
## 查询指令  
  
### 查询作品 - `vndb.vn`（别名`vndb.v`/`vn`）  
-  `vn <作品名>`  
### 查询角色 - `vndb.character`（别名`vndb.c`/`character`）  
-  `vndb.c <角色名>`  
### 查询作者 - `vndb.producer`（别名`vndb.p`/`producer`）  
-  `producer <公司名/作者名>`  
### 以VNDB唯一ID查询 - `vndb.id`（别名`vndb.i`/`id`）  
-  `id <VNDB唯一ID>`  
### 查询某天的发布作品和角色生日 - `vndb.event`（别名`vndb.e`/`event`）  
-  查询当天 ：`event`  
-  查询某月某日：`event <mm-dd>`    

## 版本历史

### Ver 2.1.0
- 重构了2.0.0以来的项目和代码结构，完善了功能并优化了性能。
- 不再从外部链接下载必要资源，而是跟npm包一同发布。
- 修复了多个BUG。
- 多个前版本的功能被暂时移除，后面的版本会优化后更新。



## 问题反馈  
如果你遇到任何问题或者有任何改进建议，请通过以下方式联系我：  
-  邮箱：pyuramazo@vip.qq.com
- Github： [Issues](https://github.com/PyuraMazo/koishi-plugin-pyura-vndb/issues)