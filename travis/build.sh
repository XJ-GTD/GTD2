#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    # Build on macOS
    cordova platform remove ios
    cordova platform add ios
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
  xcodebuild build -workspace $IOS_APP_NAME.xcworkspace -scheme $IOS_APP_NAME -sdk iphoneos -configuration Debug ONLY_ACTIVE_ARCH=NO
else
  ionic cordova build android
fi
