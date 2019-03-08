# GTD2

# 前端使用 ionic3 + cordova + typescript
# 后端使用 springBoot + JPA + Security + redis + mysql
# 服务器 rabbitMQ消息队列 + 讯飞语音AIUI


## ionic3 
###### 启动前端服务
#### ionic serve
###### 创建新页面
##### ionic g page NewPage

###### 测试命令
##### ionic cordova run android -1 -c (真机在线调试)
##### ionic cordova build android 【debug版本，无需签名】
##### ionic cordova build android --release 【发布版，需要签名（要使用jarsigner签名必须用release版本）】
##### ionic cordova build android --release --prod => 优化启动速度，解决启动白屏

###### 安装 phonegap 插件
##### npm install -- global phonegap

###### 安装 plugman 插件
##### npm --registry https://registry.npm.taobao.org install -g plugman

###### <ionic3 调用原生方式>
##### ionic cordova platform add android/ios@<version>（添加android/ios平台@）
.
###### <ionic3 plugman安装>
##### npm install -g plugman
###### <ionic3 cordova安装>
##### npm install -g cordova@6.5.0
######<ionic3创建自定义插件>
##### plugman create --name <pluginName> --plugin_id <pluginID> --plugin_version <version> [--path <directory>] [--variable NAME=VALUE]
##### ionic cordova plugin add file_path (注册插件，file_path为插件所在目录)
##### ionic cordova plugin remove name (移除插件，name为插件id)
#####
###### <安装文件插件>
##### cordova plugin add cordova-plugin-file （注册插件)
##### npm install --save @ionic-native/file (ionic中使用)
#####
###### <安装系统通知栏插件>
##### ionic cordova plugin add cordova-plugin-local-notification
##### npm install --save @ionic-native/local-notifications
#####
###### <安装系统弹窗
##### ionic cordova plugin add cordova-plugin-dialogs
##### npm install --save @ionic-native/dialogs
#####
###### <安装系统声音插件>
##### ionic cordova plugin add cordova-plugin-nativeaudio
##### npm install --save @ionic-native/native-audio
#####
###### <安装系统震动插件>
##### ionic cordova plugin add cordova-plugin-vibration
##### npm install --save @ionic-native/vibration

## 后台服务

后台服务使用短应用™微服务架构提供服务<br>
https://xiaoji.guobaa.com/swu/[客户端-服务端接口文档]<br>
<br>
http://192.168.0.205:8082/svn/shortApp/zuulserver/[ZuulServer 微服务网关认证与授权拦截]<br>
http://192.168.0.205:8082/svn/shortApp/abd/abd/[ABD 授权]<br>
http://192.168.0.205:8082/svn/shortApp/aba/[ABA 认证]

### 客户端参数初始化

https://github.com/XJ-GTD/GTD2/tree/develop/Projects/ini[INI 源代码]

### 帐户注册与认证

https://github.com/XJ-GTD/GTD2/tree/develop/Projects/aup[AUP 源代码]

### 智能语音服务与讯飞语音AIUI

#### 智能语音服务
https://github.com/XJ-GTD/GTD2/tree/develop/Projects/ias[IAS 源代码]

#### 智能服务
http://192.168.0.205:8082/svn/shortApp/aah/[AAH 源代码]

##### 讯飞语音AIUI接入
https://github.com/XJ-GTD/GTD2/tree/develop/Projects/xfy[XFY 源代码]
##### 短信接入
https://github.com/XJ-GTD/GTD2/tree/develop/Projects/sms[SMS 源代码]
##### 数据清洗与转换接入
http://192.168.0.205:8082/svn/shortApp/acj/[ACJ 源代码]
##### 通知服务接入
https://github.com/XJ-GTD/GTD2/tree/develop/ann[ANN 源代码]

### 日程、计划与共享/分享

https://github.com/XJ-GTD/GTD2/tree/develop/Projects/agd[ADG 日程、计划与共享源代码]<br>
https://github.com/XJ-GTD/GTD2/tree/develop/Projects/sha[SHA 日程、计划分享源代码]

### 黑名单

https://github.com/XJ-GTD/GTD2/tree/develop/Projects/bla[BLA 源代码]

### 备份与恢复

https://github.com/XJ-GTD/GTD2/tree/develop/Projects/bac[BAC 源代码]

### 短信

