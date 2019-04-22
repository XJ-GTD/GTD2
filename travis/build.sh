#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    # Build on macOS
    cordova platform remove ios
    cordova platform add ios
    ls $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/cordova
    cat $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/cordova/build.xcconfig
else
    # Build on Linux
    cordova platform remove android
    cordova platform add android@7.1.4
fi

cp -rf $TRAVIS_BUILD_DIR/TimeAppPatch/platforms/* $TRAVIS_BUILD_DIR/TimeApp/platforms

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
  ionic cordova build ios
  cd $TRAVIS_BUILD_DIR/TimeApp/platforms/ios
  # CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' OBJROOT=$PWD/build SYMROOT=$PWD/build ONLY_ACTIVE_ARCH=NO
  xcodebuild build -workspace $IOS_APP_NAME.xcworkspace -scheme $IOS_APP_NAME -sdk iphoneos -configuration Debug CODE_SIGN_RESOURCE_RULES_PATH='$(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist' CODE_SIGN_IDENTITY="$IOS_DEVELOPER_NAME" PROVISIONING_PROFILE="FAFF23B4FAEF7383978A664364DC47F8F7D8238B" ONLY_ACTIVE_ARCH=NO
else
  ionic cordova build android
fi
