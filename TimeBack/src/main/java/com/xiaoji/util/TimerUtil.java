package com.xiaoji.util;

import com.xiaoji.gtd.dto.code.TimerDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Timer;
import java.util.TimerTask;

/**
 * 定时器工具类
 *
 * create by wzy on 2018/11/21
 */
public class TimerUtil {

    private static Logger logger = LogManager.getLogger(SubMailUtil.class);
    private final static HashMap<String, TimerDto> cacheMap = new HashMap<>();

    public synchronized  static void putCache(String key, TimerDto value){
        cacheMap.put(key,value);
    }

    public synchronized  static void clearOnly(String key){
        cacheMap.remove(key);
    }

    public synchronized static TimerDto getCache(String key){
        return cacheMap.get(key);
    }

    static {
        Timer timer = new Timer();
        synchronized (cacheMap){
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    Iterator<TimerDto> iterator = cacheMap.values().iterator();
                    while(iterator.hasNext()){
                        TimerDto sms = (TimerDto)iterator.next();
                        if(sms != null && sms.getTimeOut()< System.currentTimeMillis()){
                            logger.info("[定时器运行]：删除" + sms.getKey()+"验证码："+sms.getValue()+"过期时间："+sms.getTimeOut() + "当前时间："+ System.currentTimeMillis());
                            iterator.remove();
                        }
                    }

                }
            },60*1000,60*1000);
        }
    }

}
