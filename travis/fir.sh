#!/bin/bash

if (( $TRAVIS_OS_NAME == 'osx' )); then
    # fir on macOS
    #fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/ios/app/build/outputs/apk/debug/app-debug.apk -T $FIR_TOKEN
    ls -la $TRAVIS_BUILD_DIR/build/debug
    cat $TRAVIS_BUILD_DIR/build/debug/DistributionSummary.plist
    cat $TRAVIS_BUILD_DIR/build/debug/ExportOptions.plist
    cat $TRAVIS_BUILD_DIR/build/debug/Packaging.log
    #fir publish $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.ipa -T $FIR_TOKEN
    cp $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.ipa $TRAVIS_BUILD_DIR/build/debug/app-$TRAVIS_BRANCH.ipa
    if (( $TRAVIS_BRANCH = 'cassiscornuta' )); then
      fir publish $TRAVIS_BUILD_DIR/build/debug/app-$TRAVIS_BRANCH.ipa -T $FIR_TOKEN_CASSISCORNUTA
    else
      fir publish $TRAVIS_BUILD_DIR/build/debug/app-$TRAVIS_BRANCH.ipa -T $FIR_TOKEN
    fi
else
    # fir on Linux
    #fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk -T $FIR_TOKEN
    cp $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-$TRAVIS_BRANCH.apk
    if (( $TRAVIS_BRANCH = 'cassiscornuta' )); then
      fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-$TRAVIS_BRANCH.apk -T $FIR_TOKEN_CASSISCORNUTA
    else
      fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-$TRAVIS_BRANCH.apk -T $FIR_TOKEN
    fi
fi
