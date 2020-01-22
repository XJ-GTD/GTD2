#!/bin/bash

if [ $TRAVIS_OS_NAME = 'osx' ]; then
    # Build on macOS
    cordova platform remove ios
    cordova platform add ios
    #ls $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/cordova
    #cat $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/cordova/build.xcconfig
else
  if [ $TRAVIS_JOB_NAME = 'unittest' ]; then
    # Build browser for web publish
    cordova platform remove browser
    cordova platform add browser
  else
    # Build on Linux
    cordova platform remove android
    cordova platform add android@7.1.4
    #cordova platform add https://github.com/xiaoji-duan/cordova-android.git  --no-resources
    echo "android platform added"
  fi
fi

cp -rf $TRAVIS_BUILD_DIR/TimeAppPatch/platforms/* $TRAVIS_BUILD_DIR/TimeApp/platforms
if [ $TRAVIS_OS_NAME = 'linux' ]; then
  cp -f $TRAVIS_BUILD_DIR/config/gradle.properties $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/gradle.properties
  ls -la $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/
fi

if [ $TRAVIS_OS_NAME = 'osx' ]; then
  #ionic cordova build ios --buildConfig $TRAVIS_BUILD_DIR/travis/profiles/cordova/build.json
  cp -f $TRAVIS_BUILD_DIR/travis/profiles/cordova/build.json $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/build.json
  ionic cordova build ios --prod --buildConfig
  echo "Display ios information"
  cat $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/Images.xcassets/AppIcon.appiconset/Contents.json
  cat $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/$IOS_APP_NAME-info.plist
  echo "Display CDVViewController.m"
  cat $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/CordovaLib/Classes/Public/CDVViewController.m
  cp -f $TRAVIS_BUILD_DIR/TimeAppPatch/info.plist $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/$IOS_APP_NAME-info.plist
  echo "Recover ios Images.xcassets sign"
  rm -Rf $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/Images.xcassets
  cd $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME
  tar -zxf $TRAVIS_BUILD_DIR/TimeAppPatch/images.tar.gz
  ls -la
  cd $TRAVIS_BUILD_DIR/TimeApp/platforms/ios
  ls -la
  ls -la $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/Plugins/cordova-plugin-BaiduSpeechAndTTS
  echo "Upload config.xml and package.json to aliyun"
  sshpass -e scp -o stricthostkeychecking=no $TRAVIS_BUILD_DIR/TimeApp/config.xml root@www.guobaa.com:/opt/dev/exchanges/
  sshpass -e scp -o stricthostkeychecking=no $TRAVIS_BUILD_DIR/TimeApp/package.json root@www.guobaa.com:/opt/dev/exchanges/

  echo "Prepare for ios archive and export"
  mkdir -p $TRAVIS_BUILD_DIR/build/debug
  xcodebuild archive -archivePath $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.xcarchive -workspace $IOS_APP_NAME.xcworkspace -scheme $IOS_APP_NAME build -sdk iphoneos12.2 -arch armv7 -arch arm64 -configuration Release IPHONEOS_DEPLOYMENT_TARGET="9.0" TARGETED_DEVICE_FAMILY="1" SWIFT_VERSION="4" CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' CODE_SIGN_IDENTITY="${IOS_DEVELOPER_NAME}" PROVISIONING_PROFILE="${IOS_PROFILE_NAME}" ONLY_ACTIVE_ARCH=NO | xcpretty
  ls $TRAVIS_BUILD_DIR/build/debug
  xcodebuild -exportArchive -archivePath $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.xcarchive -configuration Release CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' CODE_SIGN_IDENTITY="${IOS_DEVELOPER_NAME}" PROVISIONING_PROFILE="${IOS_PROFILE_NAME}" -exportPath $TRAVIS_BUILD_DIR/build/debug -exportOptionsPlist $TRAVIS_BUILD_DIR/travis/profiles/ios/exportAppStore.plist

  echo "Prepare for ios adhoc archive and export"
  mkdir -p $TRAVIS_BUILD_DIR/build/fir
  xcodebuild archive -archivePath $TRAVIS_BUILD_DIR/build/fir/$IOS_APP_NAME.xcarchive -workspace $IOS_APP_NAME.xcworkspace -scheme $IOS_APP_NAME build -sdk iphoneos12.2 -arch armv7 -arch arm64 -configuration Release IPHONEOS_DEPLOYMENT_TARGET="9.0" TARGETED_DEVICE_FAMILY="1" SWIFT_VERSION="4" CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' CODE_SIGN_IDENTITY="${IOS_DEVELOPER_NAME}" PROVISIONING_PROFILE="${IOS_PROFILE_NAME_FIR}"
  xcodebuild -exportArchive -archivePath $TRAVIS_BUILD_DIR/build/fir/$IOS_APP_NAME.xcarchive -configuration Release CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' CODE_SIGN_IDENTITY="${IOS_DEVELOPER_NAME}" PROVISIONING_PROFILE="${IOS_PROFILE_NAME}" -exportPath $TRAVIS_BUILD_DIR/build/fir -exportOptionsPlist $TRAVIS_BUILD_DIR/travis/profiles/ios/exportOptions.plist
else
  ls $TRAVIS_BUILD_DIR/TimeApp/
  if [ $TRAVIS_JOB_NAME = 'unittest' ]; then
    # Package browser version
    echo "Package for browser"
    ionic cordova build browser --prod
  else
    echo "start build android production"
    ionic cordova build android --prod --verbose --stacktrace --buildConfig $TRAVIS_BUILD_DIR/travis/profiles/cordova/build.json
    cat $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build.gradle
    cat $TRAVIS_BUILD_DIR/TimeApp/platforms/android/CordovaLib/cordova.gradle
    ls $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/src/main/
    cat $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/src/main/AndroidManifest.xml
  fi
fi
