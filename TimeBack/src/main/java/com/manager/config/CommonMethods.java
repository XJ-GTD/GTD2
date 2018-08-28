package com.manager.config;

import com.manager.config.exception.ServiceException;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CommonMethods {
    /*
     * 将时间转换为时间戳
     */
    public static Timestamp dateToStamp(String str) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Date date = simpleDateFormat.parse(str);
            if (date != null){
                Timestamp time = new Timestamp(date.getTime());
                return time;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    /*
     * 将时间戳转换为时间
     */
    public static String stampToDate(String s){
        String res;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        long lt = new Long(s);
        Date date = new Date(lt);
        res = simpleDateFormat.format(date);
        return res;
    }
}
