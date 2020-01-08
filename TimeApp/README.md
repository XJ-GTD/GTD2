### :point_right: This starter repo has moved to the [ionic-team/starters](https://github.com/ionic-team/starters/tree/master/ionic-angular/official/tutorial) repo! :point_left:

#如果动态修改代码遭遇Error: read ECONNRESET问题
##删除node_modules/ws目录，然后在项目目录启动命令行，输入npm install ws@3.3.2


#安装手顺
##步骤1：
### cd TimeApp
### 运行 npm install
##步骤2：
### npm install -g ionic@4.1.2
### npm install -g plugman
### npm install -g cordova@6.5.0
### ionic cordova platform add android
##步骤3：
### idea 菜单 File -> settings -> plugins -> Browse repositorie -> 输入phonegap -> 选择PhoneGap/Cordova Plugins安装
### 新建服务器 phonegap ，选择命令serve启动

#SQLite插件安装手顺
## ionic cordova plugin add cordova-sqlite-storage
## npm install --save @ionic-native/sqlite

#插件安装
##ionic cordova plugin add cordova-plugin-statusbar
##ionic cordova plugin add uk.co.workingedge.cordova.plugin.sqliteporter
##ionic cordova plugin add cordova-sqlite-storage
##ionic cordova plugin add cordova-plugin-whitelist
##ionic cordova plugin add com.telerik.plugins.nativepagetransitions
##ionic cordova plugin add cordova-plugin-nativeaudio
##ionic cordova plugin add cordova-plugin-vibration
##ionic cordova plugin add cordova-plugin-file-transfer
##ionic cordova plugin add cordova-plugin-local-notification
##ionic cordova plugin add cordova-plugin-ionic-webview
##ionic cordova plugin add cordova-plugin-splashscreen
##ionic cordova plugin add ionic-plugin-keyboard
##ionic cordova plugin add cordova-plugin-device
##ionic cordova plugin add cordova-plugin-console
##ionic cordova plugin add cordova-plugin-file
##ionic cordova plugin add cordova-plugin-calendar
##ionic cordova plugin add cordova-plugin-advanced-http
##ionic cordova plugin add cordova-plugin-android-permissions
##ionic cordova plugin add cordova-plugin-background-mode
##ionic cordova plugin add ../BaiduSpeechAndTTS
##ionic cordova plugin add cordova-plugin-contacts
##ionic cordova plugin add cordova-plugin-network-information
##ionic cordova plugin add cordova-plugin-screen-orientation
##ionic cordova plugin add jpush-phonegap-plugin --variable APP_KEY=e8b1f201b4e0cc102f665238 --variable CHANNEL=cn.sh.com.xj.timeApp

##ionic cordova plugin rm com.telerik.plugins.nativepagetransitions cordova-clipboard cordova-plugin-advanced-http cordova-plugin-android-permissions  cordova-plugin-app-version  cordova-plugin-background-mode  cordova-plugin-badge  cordova-plugin-BaiduSpeechAndTTS  cordova-plugin-calendar  cordova-plugin-camera  cordova-plugin-chooser  cordova-plugin-console cordova-plugin-contacts  cordova-plugin-device  cordova-plugin-file  cordova-plugin-file-transfer  cordova-plugin-filepath  cordova-plugin-geolocation  cordova-plugin-inappbrowser  cordova-plugin-ionic-webview  cordova-plugin-jcore  cordova-plugin-local-notification  cordova-plugin-nativeaudio  cordova-plugin-network-information  cordova-plugin-rabbitmq  cordova-plugin-screen-orientation  cordova-plugin-splashscreen cordova-plugin-statusbar  cordova-plugin-vibration  cordova-plugin-whitelist  cordova-sqlite-storage es6-promise-plugin ionic-plugin-keyboard  jpush-phonegap-plugin  uk.co.workingedge.cordova.plugin.sqliteporter 




##ionic cordova plugin add ../BaiduSpeechAndTTS
##ionic cordova plugin add cordova-plugin-network-information cordova-plugin-app-version cordova-sqlite-storage cordova-plugin-inappbrowser cordova-plugin-camera@4.0.3 cordova-plugin-chooser cordova-plugin-statusbar uk.co.workingedge.cordova.plugin.sqliteporter cordova-sqlite-storage cordova-plugin-whitelist com.telerik.plugins.nativepagetransitions cordova-plugin-nativeaudio cordova-plugin-vibration cordova-plugin-file-transfer cordova-plugin-local-notification cordova-plugin-ionic-webview cordova-plugin-splashscreen ionic-plugin-keyboard cordova-plugin-device cordova-plugin-console cordova-plugin-file cordova-plugin-filepath cordova-plugin-calendar cordova-plugin-advanced-http cordova-plugin-android-permissions cordova-plugin-background-mode cordova-plugin-contacts cordova-clipboard cordova-plugin-network-information cordova-plugin-screen-orientation
##ionic cordova plugin add jpush-phonegap-plugin --variable APP_KEY=e8b1f201b4e0cc102f665238 --variable CHANNEL=cn.sh.com.xj.timeApp
##ionic cordova plugin add https://github.com/xiaoji-duan/cordova-plugin-rabbitmq.git
##ionic cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="使用定位以获得更准确的天气预报"
##ionic cordova plugin add cordova-plugin-file-opener2 cordova-plugin-filechooser

##唤醒 唤醒小冥，小冥小冥，小冥在吗

## release 打包命令 jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore mwxing-release.keystore -signedjar mwx.apk app-release-unsigned.apk mwxing-release
