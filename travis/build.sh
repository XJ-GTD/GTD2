#!/bin/bash

if [ $TRAVIS_OS_NAME = 'osx' ]; then
    # Build on macOS
    cordova platform remove ios
    cordova platform add ios
    #ls $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/cordova
    #cat $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/cordova/build.xcconfig
else
    # Build on Linux
    cordova platform remove android
    cordova platform add android@7.1.4
fi

cp -rf $TRAVIS_BUILD_DIR/TimeAppPatch/platforms/* $TRAVIS_BUILD_DIR/TimeApp/platforms
if [ $TRAVIS_OS_NAME = 'linux' ]; then
  cp -f $TRAVIS_BUILD_DIR/config/gradle.properties $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/gradle.properties
  ls -la $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/
fi

if [ $TRAVIS_OS_NAME = 'osx' ]; then
  #ionic cordova build ios --buildConfig $TRAVIS_BUILD_DIR/travis/profiles/cordova/build.json
  ionic cordova build ios
  echo "Display ios information"
  cat $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/Images.xcassets/AppIcon.appiconset/Contents.json
  cat $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/$IOS_APP_NAME-info.plist
  cp -f $TRAVIS_BUILD_DIR/TimeAppPatch/info.plist $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/$IOS_APP_NAME-info.plist
  echo "Recover ios Images.xcassets"
  rm -Rf $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/Images.xcassets
  cd $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME
  tar -zxf $TRAVIS_BUILD_DIR/TimeAppPatch/images.tar.gz
  ls -la
  tar -zcf $TRAVIS_BUILD_DIR/app.tar.gz $TRAVIS_BUILD_DIR/TimeApp/platforms/ios
  sshpass -e scp  -o stricthostkeychecking=no $TRAVIS_BUILD_DIR/app.tar.gz root@www.guobaa.com:/opt/dev/largefiles/app.$TRAVIS_BUILD_NUMBER.tar.gz

  cd $TRAVIS_BUILD_DIR/TimeApp/platforms/ios
  ls -la
  ls -la $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/Plugins/cordova-plugin-BaiduSpeechAndTTS
  echo "Prepare for ios archive and export"
  mkdir -p $TRAVIS_BUILD_DIR/build/debug
  xcodebuild archive -archivePath $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.xcarchive -workspace $IOS_APP_NAME.xcworkspace -scheme $IOS_APP_NAME build -sdk iphoneos12.2 -configuration Release IPHONEOS_DEPLOYMENT_TARGET="9.0" TARGETED_DEVICE_FAMILY="1" SWIFT_VERSION="4" CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' CODE_SIGN_IDENTITY="${IOS_DEVELOPER_NAME}" PROVISIONING_PROFILE="${IOS_PROFILE_NAME}" ONLY_ACTIVE_ARCH=NO | xcpretty
  ls $TRAVIS_BUILD_DIR/build/debug
  xcodebuild -exportArchive -archivePath $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.xcarchive -configuration Release CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' CODE_SIGN_IDENTITY="${IOS_DEVELOPER_NAME}" PROVISIONING_PROFILE="${IOS_PROFILE_NAME}" -exportPath $TRAVIS_BUILD_DIR/build/debug -exportOptionsPlist $TRAVIS_BUILD_DIR/travis/profiles/ios/exportAppStore.plist
else
  ls $TRAVIS_BUILD_DIR/TimeApp/
  ionic cordova build android --verbose --stacktrace --buildConfig $TRAVIS_BUILD_DIR/travis/profiles/cordova/build.json
  cat $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build.gradle
  cat $TRAVIS_BUILD_DIR/TimeApp/platforms/android/CordovaLib/cordova.gradle
  ls $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/src/main/
  cat $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/src/main/AndroidManifest.xml
fi
