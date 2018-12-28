package com.xiaoji.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 基础工具类
 *
 * create by wzy on 2018/04/26.
 */
public class BaseUtil {

    private static Logger logger = LogManager.getLogger(Jwt.class);

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

    //获取表数据时间
    public static Timestamp getSqlDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        return CommonMethods.dateToStamp(sdf.format(new Date()));
    }

    //获取更新版本号
    public static String getVersion() {
        String res = "";
        Date date = new Date();
        // 指定日期格式
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        res = sdf.format(date);
        return res;
    }
    /**
     * 获取Token
     * @param deviceId
     * @param userId
     * @return
     */
    public static String getToken(String userId, String deviceId, String authType)
    {
        Date date = new Date();
        Map<String, Object> payload = new HashMap<String, Object>();
        payload.put("userId", userId);// 用户id
        payload.put("deviceId", deviceId);// 用户名
        payload.put("authType", authType);// 用户类型
        payload.put("iat", date.getTime());// 生成时间
        payload.put("ext", date.getTime() + 1000 * 60 * 60 * 24 * 180L);// 过期时间6个月
        return Jwt.createToken(payload);
    }

    //交换机命名规则
    public static String getExchangeName(String userId) {
        return "gtd" + userId;
    }

    //队列命名规则
    public static String getQueueName(String userId, String deviceId) {
        return userId + "." + deviceId;
    }

    //昵称命名规则
    public static String getUserName(String accountMobile) {
        return "时间旅行者" + accountMobile;
    }

    //账户名命名规则
    public static String getAccountName(String accountMobile) {
        return "gtd" + accountMobile;
    }

    //游客用：动态创建queue
    public static void visitorCreateQueue(RabbitTemplate rabbitTemplate, String queueName, String exchangeName) throws IOException {
        //创建队列
        rabbitTemplate.getConnectionFactory().createConnection().createChannel(false).queueDeclare(queueName, true, false, false, null);
        //绑定队列到对应的交换机
        rabbitTemplate.getConnectionFactory().createConnection().createChannel(false).queueBind(queueName, exchangeName, queueName);
    }

    //动态创建queue
    public static void createQueue(RabbitTemplate rabbitTemplate, String userId, String deviceId, String exchangeName) throws IOException {
        String queueName = getQueueName(userId, deviceId);
        String queueGlob = userId + ".#";
        //创建队列
        rabbitTemplate.getConnectionFactory().createConnection().createChannel(false).queueDeclare(queueName, true, false, false, null);
        //绑定队列【点对点routing_key】到对应的交换机
        rabbitTemplate.getConnectionFactory().createConnection().createChannel(false).queueBind(queueName, exchangeName, queueName);
        //绑定队列【广播routing_key】到对应的交换机
        rabbitTemplate.getConnectionFactory().createConnection().createChannel(false).queueBind(queueName, exchangeName, queueGlob);
    }

    //动态创建exchange
    public static void createExchange(RabbitTemplate rabbitTemplate, String exchangeName, String exchangeType) throws IOException {
        rabbitTemplate.getConnectionFactory().createConnection().createChannel(false).exchangeDeclare(exchangeName, exchangeType,true);
    }

    //绑定交换机
    public static void bindExchange(RabbitTemplate rabbitTemplate, String queueName, String exchangeName) throws IOException {
        rabbitTemplate.getConnectionFactory().createConnection().createChannel(false).queueBind(queueName, exchangeName, queueName);
    }
}
