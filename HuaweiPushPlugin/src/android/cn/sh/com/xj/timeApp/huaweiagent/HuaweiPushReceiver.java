package cn.sh.com.xj.timeApp.huaweiagent;


import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import cn.jiguang.cordova.push.JPushPlugin;
import com.baidu.tts.MyTts;
import com.huawei.android.hms.agent.HMSAgent;
import com.huawei.android.hms.agent.push.handler.DeleteTokenHandler;
import com.huawei.hms.support.api.push.PushReceiver;
import com.xj.ionic.speechandtts.listener.XjTtsListener;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class HuaweiPushReceiver extends PushReceiver {
    private static final String TAG = "HuaweiPushReceiver";
    public HuaweiPushReceiver() {
    }
    @Override
    public void onToken(Context context, String token, Bundle extras) {

        String belongId = extras.getString("belongId");
        Log.i(TAG, "belongId:" + belongId);
        Log.i(TAG, "Token:" + token);
        //开发者自行实现token保存逻辑。
    }
    @Override
    public void onPushMsg(Context context, byte[] msg, String token) {
//
//        try {
//            //开发者可以自己解析消息内容，然后做相应的处理
//            tts = new MyTts(context, new XjTtsListener(null), appId, appKey, secretKey);
//            String content = new String(msg, "UTF-8");
//            Log.i(TAG, "收到PUSH透传消息,消息内容为:" + content);
//            tts.speak(content);
//            Map<String,Object> extra = new HashMap<>();
//            JPushPlugin.transmitNotificationReceive("","",extra);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
    }

    public void onEvent(Context context, Event event, Bundle extras) {
        Log.i(TAG, "收到通知栏消息点击事件,notifyId:11111");
        //        String message = extras.getString(BOUND_KEY.pushMsgKey);
//        JSONObject data = getMessageObject(message, extras);
//        String format = "window.plugins.jPushPlugin.receiveMessageInAndroidCallback(%s);";
//        final String js = String.format(format, data.toString());
//
//        context..runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//                instance.webView.loadUrl("javascript:" + js);
//            }
//        });

//        Intent intent = new Intent();
//        intent.setAction(ACTION_UPDATEUI);

        int notifyId = 0;
        if (Event.NOTIFICATION_OPENED.equals(event) || Event.NOTIFICATION_CLICK_BTN.equals(event)) {
            notifyId = extras.getInt(BOUND_KEY.pushNotifyId, 0);
            if (0 != notifyId) {
                NotificationManager manager = (NotificationManager) context
                        .getSystemService(Context.NOTIFICATION_SERVICE);
                manager.cancel(notifyId);
            }
        }

        String message = extras.getString(BOUND_KEY.pushMsgKey);
//        intent.putExtra("log", "Received event,notifyId:" + notifyId + " msg:" + message);
//        callBack(intent);
        super.onEvent(context, event, extras);
    }


    /**
     * 删除token | delete push token
     */

    public void deleteToken(String token, DeleteTokenHandler handler){
        HMSAgent.Push.deleteToken(token, new DeleteTokenHandler() {
            @Override
            public void onResult(int rst) {
            }
        });
    }

}
