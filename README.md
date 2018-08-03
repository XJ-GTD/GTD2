# GTD2

# 前端使用 ionic + cordova + typescript
# 后端使用 springBoot + mybatis + mysql
# 服务器 rabbitMQ消息队列 + 讯飞语音AIUI


## ionic3 
#### ionic serve

##### ionic cordova run android -1 -c (真机在线调试)
##### ionic cordova build android 【debug版本，无需签名】
##### ionic cordova build android --release 【发布版，需要签名（要使用jarsigner签名必须用release版本）】
##### ionic cordova build android --release --prod => 优化启动速度，解决启动白屏



###### <ionic3 调用原生方式>
##### ionic cordova platform add android/ios（添加android/ios平台）
######<ionic3创建自定义插件>
##### plugman create --name <pluginName> --plugin_id <pluginID> --plugin_version <version> [--path <directory>] [--variable NAME=VALUE]
##### ionic cordova plugin add file_path (注册插件，file_path为插件所在目录)
##### ionic cordova plugin remove name (移除插件，name为插件id)
#####
###### <安装语音录入插件>
##### ionic cordova plugin add cordova-plugin-media (注册插件)
##### npm install --save @ionic-native/media (ionic中使用)
###### <安装文件上传插件>
##### cordova plugin add cordova-plugin-file-transfer (注册插件)
##### npm install --save @ionic-native/file-transfer (ionic中使用)
##### cordova plugin add cordova-plugin-file-opener2 (注册插件)
##### npm install --save @ionic-native/file-opener (ionic中使用)
#####
#####

## springboot


## rabbitMQ


## 讯飞AIUI
