# 冥王星开发日志

## 2019/11/5 天气晴
张金洋增加了scenejs, 没有提交package.json, 导致自动打包失败

## 2019/11/6 天气晴
开始处理iOS自动打包处理, 由于jpush会自动加上Push Notification权限确认，所以，自动打包会失败
解决方案就是，通过github把jpush工程fork到自己的帐号，然后，修改plugin.xml文件，去掉iOS的Push Notification权限配置

## 2019/11/7 天气阴
增加cordova-plugin-rabbitmq的第三方包引用
<framework src="libs/ios/CocoaAsyncSocket.framework" custom="true" />
<framework src="libs/ios/JKVValue.framework" custom="true" />
<framework src="libs/ios/RMQClient.framework" custom="true" />

## 2019/12/31 天气晴
对外服务全部使用阿里云反向代理
