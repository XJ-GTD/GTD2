package cn.sh.com.xj.timeApp;

import android.app.Application;
import android.content.Context;
import com.huawei.android.hms.agent.HMSAgent;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class TimeApplication extends Application {
    @Override
    public void onCreate() {

        super.onCreate();

        if (OSHelper.isEmui()){
            System.out.println("huawei init");
            HMSAgent.init(this);
        }

    }

}
