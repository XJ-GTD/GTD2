#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    # fir on macOS
    #fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/app/build/outputs/apk/debug/app-debug.apk -T $FIR_TOKEN
    ls -la $TRAVIS_BUILD_DIR/build/debug
    fir publish $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.ipa -T $FIR_TOKEN
else
    # fir on Linux
    fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk -T $FIR_TOKEN
fi
