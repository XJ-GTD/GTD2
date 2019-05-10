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




## ionic cordova plugin add cordova-sqlite-storage cordova-plugin-statusbar uk.co.workingedge.cordova.plugin.sqliteporter cordova-sqlite-storage cordova-plugin-whitelist com.telerik.plugins.nativepagetransitions cordova-plugin-nativeaudio cordova-plugin-vibration cordova-plugin-file-transfer cordova-plugin-local-notification cordova-plugin-ionic-webview cordova-plugin-splashscreen ionic-plugin-keyboard cordova-plugin-device cordova-plugin-console cordova-plugin-file cordova-plugin-calendar cordova-plugin-advanced-http cordova-plugin-android-permissions cordova-plugin-background-mode ../BaiduSpeechAndTTS cordova-plugin-contacts cordova-plugin-network-information cordova-plugin-screen-orientation

## release 打包命令 jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore mwxing-release.keystore -signedjar mwx.apk app-release-unsigned.apk mwxing-release
