package com.manager.util;

import java.util.regex.Pattern;

/**
 * create by wzy on 2018/04/26.
 */
public class BaseUtil {

    /*
     * 判断是否为整数
     * @param str 传入的字符串
     * @return 是整数返回true,否则返回false
     */

    public static boolean isInteger(String str) {
        Pattern pattern = Pattern.compile("[0-9]*");
        return pattern.matcher(str).matches();
    }


}
