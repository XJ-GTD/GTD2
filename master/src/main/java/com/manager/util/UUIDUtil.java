package com.manager.util;

import java.util.UUID;

/**
 * create zy 2018/5/7
 */
public class UUIDUtil {

    public static String getUUID(){
        String uuid = UUID.randomUUID().toString();
        //去掉“-”符号
        return uuid.replaceAll("-", "");
    }
}
