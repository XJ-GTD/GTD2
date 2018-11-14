package com.xiaoji.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
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
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
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
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        try{
            simpleDateFormat.parse(str);
        }catch (Exception e){
            convertSuccess = false;
        }
        return convertSuccess;
    }

    /**
     * 判断是否为日期格式
     * @param str
     * @return 日期格式返回true
     */
    public static boolean checkIsDate2(String str) {
        boolean convertSuccess = true;
        // 指定日期格式
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
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
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
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
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
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
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
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

    /**
     *  获取 日程标签
     * @param list
     * @return 4：一般； 5：重要； 6：紧急
     */
    public static Integer getscheduleLabel(List<Integer> list){
        Integer scheduleLabel = 4;
        for(Integer label : list){
            if(label == 5){
                scheduleLabel = 5;
            } else if(label == 6){
                scheduleLabel = 6;
            }
        }
        return scheduleLabel;
    }

    /**
     * 获取某个时间之前的时间
     * @param dateStr   目标时间
     * @param times     提前时间（ms）
     * @return
     */
    public static String getBeforeTime(String dateStr,Long times){
        String aDateStr = null;
        try{
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            Date date = sdf.parse(dateStr);
            date.setTime(date.getTime()-times);
            aDateStr = sdf.format(date);
        } catch (ParseException e){
            e.printStackTrace();
        }
        return aDateStr;
    }

    /**
     *  将 sourceList 中与 targetList 中不相同的元素添加进 targetList 中
     * @param targetList
     * @param sourceList
     * @return
     */
    public static List<Integer> addNoRepetitionToList(List<Integer> targetList,List<Integer> sourceList){
        List<Integer> list = new ArrayList<>();
        list = targetList;
        for(int i=0; i<sourceList.size(); i++){
            if(!list.contains(sourceList.get(i))){
                list.add(sourceList.get(i));
            }
        }
        return list;
    }

    public static boolean checkIsPhoneNumber(String str){
        if(isInteger(str)) {
            if (str.length() ==11) {
                return true;
            } else {
                return false;
            }
        }else {
            return false;
        }
    }

    /**
     * 获取两个日期之间的日期
     * @param startS 开始日期
     * @param endS   结束日期
     * @return  日起集合
     */
    public static List<String> getBetweenDates(String startS,String endS){
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date start = null;
        Date end = null;
        try {
            start = format.parse(startS);
            end = format.parse(endS);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        List<String> result = new ArrayList<>();

        Calendar dd = Calendar.getInstance();   // 定义日期实力
        dd.setTime(start);
        while (dd.getTime().getTime() <= end.getTime()){
            String str = format.format(dd.getTime());
            result.add(str);
            dd.add(Calendar.DAY_OF_MONTH,1);    // 进行当前日期月份加1
        }
        return result;
    }
}
