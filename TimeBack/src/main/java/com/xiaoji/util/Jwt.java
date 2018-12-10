package com.xiaoji.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.xiaoji.gtd.dto.code.ResultCode;
import net.minidev.json.JSONObject;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.KeyLengthException;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.util.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Jwt {

    private static Logger logger = LogManager.getLogger(Jwt.class);

	/**
     * 秘钥
     */
    private static final String SECRET="c3b50bdc111774346e04147af1e42c20"; //gtja Md5
    
    /**
     * token过期(token失效了)
     */
    public static final Integer EXPIRED=-1; 
    
    /**
     * 校验失败（token不一致）
     */
//    public static final Integer FAIL=0;
    
    /**
     * 校验成功
     */
//    public static final Integer SUCCESS=1;
    
    /**
     * 代码抛异常（校验token时代码出错）
     */
//    public static final Integer EXCEPT=2;
    
    /**
     * 生成token，该方法只在用户登录成功后调用
     * @param  playLoad Map集合，主要存储用户id，设备id， token生成时间，token过期时间等
     * @return token字符串
     * @throws KeyLengthException 
     */
    public static String createToken(Map<String, Object> playLoad){
        ///B
        JSONObject userInfo = new JSONObject(playLoad);
        Payload payload = new Payload(userInfo);
        
        ///A
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        // 创建一个 JWS object
        JWSObject jwsObject = new JWSObject(header, payload);
         
        try {
        	//创建 HMAC signer
        	JWSSigner signer = new MACSigner(SECRET.getBytes());
            jwsObject.sign(signer);
        } catch (JOSEException e) {
            logger.error("签名失败" + e.getMessage());
            e.printStackTrace();
        }
        return jwsObject.serialize();
    }
    
    
    
    /**
     * 校验token是否合法，返回Map集合,集合中主要包含  isSuccess是否成功  status状态码   data鉴权成功后从token中提取的数据
     * 该方法在过滤器中调用，每次请求API时都校验
     * @param token
     * @return
     * @throws KeyLengthException
     */
    public static Map<String, Object> validToken(String token){
        Map<String, Object> resultMap=new HashMap<String, Object>();
        JWSObject jwsObject=null;
        Payload payload=null;
        try {
	        String[] tokenArr=token.split("\\.");
	        payload = new Payload(new Base64(tokenArr[1]).decodeToString());
	        ///A
	        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
	        // 创建一个 JWS object
	        jwsObject = new JWSObject(header, payload);
        
	        //创建 HMAC signer        
	        JWSSigner signer = new MACSigner(SECRET.getBytes());
            jwsObject.sign(signer);
        } catch (Exception e) {
        	e.printStackTrace();
            //异常
            resultMap.put("isSuccess", false);
            resultMap.put("status", ResultCode.ERROR_TOKEN.code);
            return resultMap;
        }
        
         
        if( jwsObject.serialize().equals(token)){
        	JSONObject jsonOBj= payload.toJSONObject();
            long extTime=(long) jsonOBj.get("ext");
            long curTime=new Date().getTime();
//            if(curTime>extTime){
//    	       	//过期了
//    	       	resultMap.put("isSuccess", false);
//    			resultMap.put("status", FAIL_TOKEN);
//    			logger.debug("token过期");
//            }else{
            	//没有过期  （业务需要，暂不做过期验证）
            	resultMap.put("isSuccess", true);
            	resultMap.put("status", ResultCode.SUCCESS.code);
            	resultMap.put("data", payload.toJSONObject());
                logger.debug("TOKEN校验成功");
//            }
        }else{
        	//校验失败
        	resultMap.put("isSuccess", false);
        	resultMap.put("status", ResultCode.FAIL_TOKEN.code);
            logger.debug("TOKEN校验失败");
        }
        
        return resultMap;
    }



}
