package com.manager.util;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CommonMethods {

    /**
     * 检查是否包含MySql保留字
     * @param str
     * @return true 包含
     */
    public static boolean checkMySqlReservedWords(String str){
        String regEx = "[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]";
        Pattern p = Pattern.compile(regEx);
        Matcher m = p.matcher(str);
        return m.find();
    }

    /**
     * 判断是否为整数
     * @param str
     * @return true 整数
     */
    public static boolean isInteger(String str){
        Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*$");
        return pattern.matcher(str).matches();
    }

    /**
     * 将 str 去除前、后空格(全角、半角)空格，将文字中间多空格转为一个空格
     * @param str
     * @return
     */
    public static String trimAllBlanks(String str){

        String result = "";
        result = str.replaceAll("^[　*| *| *|\\s*]*", "").replaceAll("[　*| *| *|\\s*]*$", "");   // 去两边全角半角空格
        result = result.replaceAll("[\\s\\p{Zs}]"," "); // 将中间全角空格转为" "
        result = result.replaceAll("\\s+"," ");         // 将中间多个" " 转为一个 " "

        return result;
    }

    /**
     * 判断数字num是否在数字arr里面
     * @param arr     一维数组
     * @param num        整数
     * @return 在则返回true,否则返回false
     */
    public static boolean isInArray(int[] arr, int num) {
        if (null == arr) {
            return false;
        }

        for (int index = 0; index < arr.length; index++) {
            if (arr[index] == num) {
                return true;
            }
        }
        return false;
    }

    /**
     * 日期比较大小
     * @param str1 起始日期
     * @param str2 结束日期
     * @return true 起始日期(2018-08-29 17:43:00) 结束日期(2018-09-29 17:43:00)
     */
    public static boolean compareDate(String str1,String str2) {
        // 指定日期格式
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try{
            Date date1 = simpleDateFormat.parse(str1);
            Date date2 = simpleDateFormat.parse(str2);
            if (date1.getTime() > date2.getTime()){
                return false;
            }else return true;
        }catch (Exception e){
           e.printStackTrace();
        }
        return true;
    }

    /**
     * 判断是否为日期格式
     * @param str
     * @return 日期格式返回true
     */
    public static boolean checkIsDate(String str) {
        boolean convertSuccess = true;
        // 指定日期格式
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try{
            simpleDateFormat.parse(str);
        }catch (Exception e){
            convertSuccess = false;
        }
        return convertSuccess;
    }

    /*
     * 将时间转换为时间戳
     */
    public static Timestamp dateToStamp(String str) {
        // 指定日期格式
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
    public static String stampToDate(Timestamp str){
        String res = "";
        // 指定日期格式
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        if (str != null){
            res = simpleDateFormat.format(str);
            return res;
        }
        return res;
    }

    /**
     * 判断距当前日期差
     * @param date 数据库时间 createDate 请求时间
     * @return 日期格式返回true
     */
    public static boolean getPastTime(String date,String createDate) {
        // 指定日期格式
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try{
            Date date1 = simpleDateFormat.parse(date);   // 数据库时间
            Date date2 = simpleDateFormat.parse(createDate);    // 系统时间
            if (date2.getTime()-date1.getTime() <= 60000*5  && 0 <= date2.getTime()-date1.getTime() ){
                return true;
            }
            else return false;
        }catch (Exception e){
            return false;
        }
    }
}
