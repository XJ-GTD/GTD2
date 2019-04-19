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
  xctool -workspace $IOS_APP_NAME.xcworkspace -scheme $IOS_APP_NAME-dev -sdk iphoneos -configuration Debug CODE_SIGN_RESOURCE_RULES_PATH='$(SDKROOT)/ResourceRules.plist' OBJROOT=$PWD/build SYMROOT=$PWD/build ONLY_ACTIVE_ARCH=NO
else
  ionic cordova build android
fi
