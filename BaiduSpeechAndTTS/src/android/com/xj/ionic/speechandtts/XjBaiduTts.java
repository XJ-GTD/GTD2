package com.xj.ionic.speechandtts;

import android.Manifest;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import com.baidu.tts.MyTts;
import com.xj.ionic.speechandtts.listener.XjTtsListener;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

/**
 * 合成demo。含在线和离线，没有纯离线功能。
 * 根据网络状况优先走在线，在线时访问服务器失败后转为离线。
 */
public class XjBaiduTts extends CordovaPlugin {

    // ================== 初始化参数设置开始 ==========================
    /**
     * 发布时请替换成自己申请的appId appKey 和 secretKey。注意如果需要离线合成功能,请在您申请的应用中填写包名。
     * 本demo的包名是com.baidu.tts.sample，定义在build.gradle中。
     *
     *     <meta-data android:name="com.baidu.speech.APP_ID" android:value="14502702" />
     *             <meta-data android:name="com.baidu.speech.API_KEY" android:value="6YvlNRGZ5I4CkA715XnVyoSm" />
     *             <meta-data android:name="com.baidu.speech.SECRET_KEY" android:value="9oHZPMLgc0BM9a4m3DhpHUhGSqYvsrAF" />
     */
    protected String appId = "14502702";

    protected String appKey = "6YvlNRGZ5I4CkA715XnVyoSm";

    protected String secretKey = "9oHZPMLgc0BM9a4m3DhpHUhGSqYvsrAF";


    @Override
    protected void pluginInitialize() {

        super.pluginInitialize();

        initPermission();

        try {
            ApplicationInfo info = this.cordova.getActivity().getPackageManager().getApplicationInfo(this.cordova.getActivity().getPackageName(),
                    PackageManager.GET_META_DATA);
            String  API_KEY =   info.metaData.getString("com.baidu.speech.API_KEY");
            String  SECRET_KEY = info.metaData.getString("com.baidu.speech.SECRET_KEY");
            String APP_ID  =  info.metaData.getString("com.baidu.speech.APP_ID");
            if (SECRET_KEY != null) this.secretKey = SECRET_KEY;
            if (API_KEY != null) this.appKey = API_KEY;
            if (APP_ID != null) this.appId = APP_ID;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {


        MyTts tts = new MyTts(cordova.getActivity(), new XjTtsListener(callbackContext),appId,appKey,secretKey);

        if (action.equals("speak")) {
            tts.speak(args.getString(0));
            return true;
        }else if (action.equals("stop")) {
            tts.stop();
            return true;
        }
        return false;
    }

    /**
     * android 6.0 以上需要动态申请权限
     */
    private void initPermission() {
        String[] permissions = {
                Manifest.permission.INTERNET,
                Manifest.permission.ACCESS_NETWORK_STATE,
                Manifest.permission.MODIFY_AUDIO_SETTINGS,
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_SETTINGS,
                Manifest.permission.READ_PHONE_STATE,
                Manifest.permission.ACCESS_WIFI_STATE,
                Manifest.permission.CHANGE_WIFI_STATE
        };

        ArrayList<String> toApplyList = new ArrayList<String>();

        for (String perm : permissions) {
            if (PackageManager.PERMISSION_GRANTED != ContextCompat.checkSelfPermission(this.cordova.getActivity(), perm)) {
                toApplyList.add(perm);
                // 进入到这里代表没有权限.
            }
        }
        String[] tmpList = new String[toApplyList.size()];
        if (!toApplyList.isEmpty()) {
            ActivityCompat.requestPermissions(this.cordova.getActivity(), toApplyList.toArray(tmpList), 123);
        }

    }

}
