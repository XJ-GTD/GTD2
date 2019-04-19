#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    # fir on macOS
    #fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/app/build/outputs/apk/debug/app-debug.apk -T $FIR_TOKEN
    ls $TRAVIS_BUILD_DIR/TimeApp/platforms/ios
else
    # fir on Linux
    fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk -T $FIR_TOKEN
fi
