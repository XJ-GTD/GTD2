#!/bin/bash -v

if [ $TRAVIS_OS_NAME = 'osx' ]; then
    # fir on macOS
    ls -la $TRAVIS_BUILD_DIR/build/debug
    cat $TRAVIS_BUILD_DIR/build/debug/DistributionSummary.plist
    cat $TRAVIS_BUILD_DIR/build/debug/ExportOptions.plist
    #cat $TRAVIS_BUILD_DIR/build/debug/Packaging.log
    #fir publish $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.ipa -T $FIR_TOKEN
    cp $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.ipa $TRAVIS_BUILD_DIR/build/debug/app-$TRAVIS_BRANCH.ipa
    if [ $TRAVIS_BRANCH = 'cassiscornuta' ]; then
      if [ -f "$TRAVIS_BUILD_DIR/build/debug/app-$TRAVIS_BRANCH.ipa" ]; then
        echo "upload to appstore"
        #ls "/Applications"
        #ls "/Applications/Xcode.app/Contents/Applications"
        #ls "/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks"
        #ls "/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support"
        cd "/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support"
        #ls -la
        ./altool --validate-app -f $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.ipa -t ios -u $APPSTORE_USERNAME -p $APPSTORE_PASSWORD

        if [ $? = 0 ]; then
          echo "AppStore validate-app passed."
          ./altool --upload-app -f $TRAVIS_BUILD_DIR/build/debug/$IOS_APP_NAME.ipa -t ios -u $APPSTORE_USERNAME -p $APPSTORE_PASSWORD
        fi
      fi

      if [ -f "$TRAVIS_BUILD_DIR/build/fir/$IOS_APP_NAME.ipa" ]; then
        echo "upload to fir.im"
        fir publish $TRAVIS_BUILD_DIR/build/fir/$IOS_APP_NAME.ipa -T $FIR_TOKEN_CASSISCORNUTA -c "唐冠螺 (iOS): ${TRAVIS_COMMIT_MESSAGE}" -V --switch_to_qiniu
      fi
    else
      fir publish $TRAVIS_BUILD_DIR/build/debug/app-$TRAVIS_BRANCH.ipa -T $FIR_TOKEN -c "${TRAVIS_BRANCH}: ${TRAVIS_COMMIT_MESSAGE}"
    fi
fi

if [ $TRAVIS_OS_NAME = 'linux' ]; then
  if [ $TRAVIS_JOB_NAME = 'unittest' ]; then
    if [ $TRAVIS_BRANCH = 'cassiscornuta' ]; then
      echo "Upload mwxing initial parameters"
      sshpass -e scp -r stricthostkeychecking=no $TRAVIS_BUILD_DIR/config/duan/ini/mwxing/cn.sh.com.xj.timeApp/* root@www.guobaa.com:/opt/duan/ini/mwxing/cn.sh.com.xj.timeApp/

      echo "Uploading browser files"
      ls -la $TRAVIS_BUILD_DIR/TimeApp/platforms/browser/www
      sshpass -e scp -r stricthostkeychecking=no $TRAVIS_BUILD_DIR/TimeApp/platforms/browser/www/* root@www.guobaa.com:/var/www/html/mwx/
    fi
  else
    # debug fir on Linux
    if [ -f "$TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk" ] then
      cp $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-$TRAVIS_BRANCH.apk
      if [ $TRAVIS_BRANCH = 'cassiscornuta' ]; then
        fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-$TRAVIS_BRANCH.apk -T $FIR_TOKEN_CASSISCORNUTA -c "唐冠螺 (Android): ${TRAVIS_COMMIT_MESSAGE}" --switch_to_qiniu
      else
        fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-$TRAVIS_BRANCH.apk -T $FIR_TOKEN -c "${TRAVIS_BRANCH}: ${TRAVIS_COMMIT_MESSAGE}"
      fi
    fi

    # release fir on Linux
    if [ -f "$TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/release/app-release.apk" ] then
      cp $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/release/app-release.apk $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-$TRAVIS_BRANCH.apk
      if [ $TRAVIS_BRANCH = 'cassiscornuta' ]; then
        fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-$TRAVIS_BRANCH.apk -T $FIR_TOKEN_CASSISCORNUTA -c "唐冠螺 (Android): ${TRAVIS_COMMIT_MESSAGE}" --switch_to_qiniu
      else
        fir p $TRAVIS_BUILD_DIR/TimeApp/platforms/android/app/build/outputs/apk/debug/app-$TRAVIS_BRANCH.apk -T $FIR_TOKEN -c "${TRAVIS_BRANCH}: ${TRAVIS_COMMIT_MESSAGE}"
      fi
    fi
  fi
fi
