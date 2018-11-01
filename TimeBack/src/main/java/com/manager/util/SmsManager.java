package com.manager.util;

import com.manager.master.entity.Sms;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Timer;
import java.util.TimerTask;

public class SmsManager {
    private static Logger logger = LogManager.getLogger(SmsManager.class.getClass());

    private final static HashMap cacheMap = new HashMap();

    private SmsManager(){
        super();
    }

    public synchronized  static void putCache(String key, Sms value){
        cacheMap.put(key,value);
    }

    public synchronized  static void clearOnly(String key){
        cacheMap.remove(key);
    }

    public synchronized static Sms getCache(String key){
        Sms sms = (Sms) cacheMap.get(key);
        if(sms != null && System.currentTimeMillis() > sms.getTimeOut()){
            cacheMap.remove(key);
            return null;
        }
        return sms;
    }

    static {
        Timer timer = new Timer();
        synchronized (cacheMap){
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    Iterator<Sms> iterator = cacheMap.values().iterator();
                    while(iterator.hasNext()){
                        Sms sms = (Sms)iterator.next();
                        if(sms != null && sms.getTimeOut()< System.currentTimeMillis()){
                            logger.info("[定时器运行]：删除" + sms.getKey()+"验证码："+sms.getValue()+"过期时间："+sms.getTimeOut() + "当前时间："+ System.currentTimeMillis());
                            iterator.remove();
                        }
                    }

                }
            },15*60*1000,15*60*1000);
        }
    }

}
