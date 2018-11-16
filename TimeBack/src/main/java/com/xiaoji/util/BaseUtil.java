package com.xiaoji.util;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
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

    /**
     * 字符串加密
     * @param str
     * @return
     */
    public static String encryption(String str){
//        String strKey="";
        try {
            String deadlineStr ="25201231";//截至时间
            //设置时间格式
            DateFormat dFormat = new SimpleDateFormat("yyyyMMdd");
            Date deadline = dFormat.parse(deadlineStr);
            str =Encoder.e(str,str,deadline);//这里str加密的字符串
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return str;
    }

    /**
     * 实体类转化Map
     * @param bean
     * @return
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     * @throws IntrospectionException
     */
    public static Map<String,Object> convertBeanToMap(Object bean) throws IllegalAccessException, InvocationTargetException, IntrospectionException {

        Class type = bean.getClass();
        Map<String,Object> returnMap = new HashMap<String, Object>();
        BeanInfo beanInfo = Introspector.getBeanInfo(type);
        PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
        for (int i = 0; i < propertyDescriptors.length; i++) {
            PropertyDescriptor descriptor = propertyDescriptors[i];
            String propertyName = descriptor.getName();
            if (!propertyName.equals("class")) {
                Method readMethod = descriptor.getReadMethod();
                Object result = readMethod.invoke(bean, new Object[0]);
                    if (result != null) {
                        returnMap.put(propertyName, result);
                    } else {
                        returnMap.put(propertyName, "");
                    }
                }
            }
        return returnMap;
    }

    //队列命名规则
    public static String createQueueName(Integer userId, String deviceId) {
        return userId + "." + deviceId;
    }

    //交换机命名规则
    public static String createExchangeName(Integer userId) {
        return "gtd" + userId;
    }

    //用户名命名规则
    public static String createUserName(String accountMobile) {
        return "用户" + accountMobile;
    }

    //账户名命名规则
    public static String createAccountName(String accountMobile) {
        return "gtd" + accountMobile;
    }

}
