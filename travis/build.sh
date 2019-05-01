#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
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

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
  #ionic cordova build ios --buildConfig $TRAVIS_BUILD_DIR/travis/profiles/cordova/build.json
  ionic cordova build ios
  cat $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/$IOS_APP_NAME/Images.xcassets/AppIcon.appiconset/Contents.json
  cd $TRAVIS_BUILD_DIR/TimeApp/platforms/ios
  # CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' OBJROOT=$PWD/build SYMROOT=$PWD/build ONLY_ACTIVE_ARCH=NO
  ls -la
  mkdir -p $TRAVIS_BUILD_DIR/build/debug
  xcodebuild archive -archivePath $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.xcarchive -workspace $IOS_APP_NAME.xcworkspace -scheme $IOS_APP_NAME build -sdk iphoneos -configuration Debug CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' CODE_SIGN_IDENTITY="${IOS_DEVELOPER_NAME}" PROVISIONING_PROFILE="${IOS_PROFILE_NAME}" ONLY_ACTIVE_ARCH=NO | xcpretty
  ls $TRAVIS_BUILD_DIR/build/debug
  xcodebuild -exportArchive -archivePath $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.xcarchive -exportPath $TRAVIS_BUILD_DIR/build/debug -exportOptionsPlist $TRAVIS_BUILD_DIR/travis/profiles/ios/exportOptions.plist
else
  ionic cordova build android --buildConfig $TRAVIS_BUILD_DIR/travis/profiles/cordova/build.json
fi
