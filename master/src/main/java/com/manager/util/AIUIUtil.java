package com.manager.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;

/**AIUI智能交互
 * @Author: tzx ;
 * @Date: Created in 14:49 2018/4/26
 */
public class AIUIUtil {
    private static Logger logger = LoggerFactory.getLogger(AIUIUtil.class);

    private final static String[] hexDigits = { "0", "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" };

    public static void main(String[] args) {
        //讯飞开放平台注册申请应用的应用ID(APPID)
        String xAppid = "5acdb89c";
        System.out.println("X-Appid:" + xAppid);
        long time = System.currentTimeMillis() / 1000;
        //得到当前UTC时间戳
        String curTime = String.valueOf(time);
        System.out.println("X-CurTime:" + curTime);
        //标准JSON格式参数
//        String xParam = "{\"auf\":\"16k\",\"aue\":\"raw\",\"scene\":\"main\"}";//语音识别
//		String xParam = "{\"scene\":\"main\",\"userid\":\"user_0001\"}";//文本语义
		String xParam = "{\"auf\":\"16k\",\"aue\":\"raw\",\"scene\":\"main\",\"userid\":\"user_0001\"}";//语音语义
        String xParamBase64 = getBase64(xParam);
        System.out.println("X-Param:" + xParamBase64);

        /***********语音语义（音频文件）***********/
		//音频文件
		File file = new File("D:/test.pcm");
		String fileData = null;
		try {
			InputStream is = new FileInputStream(file);
			byte[] bytes = IOUtils.toByteArray(is);
			//Base64编码
			fileData = Base64.encodeBase64String(bytes);
		} catch (Exception e) {
			e.printStackTrace();
		}
		fileData = "data=" + fileData;

        /***********语音识别（音频文件）***********/
        //音频文件
        /*File file = new File("D:/FinalAudio.wav");
        String fileData = null;
        try {
            InputStream is = new FileInputStream(file);
            byte[] bytes = IOUtils.toByteArray(is);
            //Base64编码
            fileData = Base64.encodeBase64String(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        }
        fileData = "data=" + fileData;*/

        /***********文本语义*************/
		/*String fileData = null;
		String text = "明天";
		byte[] bytes = text.getBytes();
		//Base64编码
		fileData = Base64.encodeBase64String(bytes);
		fileData = "text=" + fileData;*/

        //ApiKey创建应用时自动生成
        String apiKey = "750d9fa0b99c477493daa2fd2de044a7";
        String token = apiKey + curTime + xParamBase64 + fileData;
        //md5得到X-CheckSum
        String xCheckSum = md5Encode(token);
        System.out.println("X-CheckSum:" + xCheckSum);
        String resBody = "";
        PrintWriter out = null;
        BufferedReader in = null;
        try {
            //http://api.xfyun.cn/v1/aiui/v1/iat   语音识别
            //http://api.xfyun.cn/v1/aiui/v1/text_semantic   文本语义
            //http://api.xfyun.cn/v1/aiui/v1/voice_semantic  语音语义
            String url = "http://api.xfyun.cn/v1/aiui/v1/voice_semantic";
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            HttpURLConnection conn = (HttpURLConnection) realUrl
                    .openConnection();
            conn.setReadTimeout(2000);
            conn.setConnectTimeout(1000);
            conn.setRequestMethod("POST");
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setRequestProperty("X-Appid", xAppid);
            conn.setRequestProperty("X-CurTime", curTime);
            conn.setRequestProperty("X-Param", xParamBase64);
            conn.setRequestProperty("X-CheckSum", xCheckSum);
            conn.setRequestProperty("Connection", "keep-alive");
            conn.setRequestProperty("Content-type",
                    "application/x-www-form-urlencoded; charset=utf-8");
            // 获取URLConnection对象对应的输出流
            out = new PrintWriter(conn.getOutputStream());
            // 发送请求参数
            out.print(fileData);
            // flush输出流的缓冲
            out.flush();
            // 定义BufferedReader输入流来读取URL的响应
            // 将返回的输入流转换成字符串
            InputStream inputStream = conn.getInputStream();
            InputStreamReader inputStreamReader = new InputStreamReader(
                    inputStream, "utf-8");
            in = new BufferedReader(inputStreamReader);
            String line;
            while ((line = in.readLine()) != null) {
                resBody += line;
            }
            System.out.println("result body :" + resBody);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
                if (in != null) {
                    in.close();
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }

    }

    /**
     * Base64加密
     * @param str	加密字符串
     * @return
     */
    public static String getBase64(String str) {
        if (str == null || "".equals(str)) {
            return "";
        }
        try {
            byte[] encodeBase64 = Base64.encodeBase64(str.getBytes("UTF-8"));
            str = new String(encodeBase64);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return str;
    }

    /**
     * md5加密
     * @param source	加密字符串
     * @return
     */
    public static String md5Encode(String source) {
        String result = null;
        try {
            result = source;
            // 获得MD5摘要对象
            MessageDigest messageDigest = MessageDigest.getInstance("MD5");
            // 使用指定的字节数组更新摘要信息
            messageDigest.update(result.getBytes("utf-8"));
            // messageDigest.digest()获得16位长度
            result = byteArrayToHexString(messageDigest.digest());
        } catch (Exception e) {
            logger.error("Md5 Exception!", e);
        }
        return result;
    }

    private static String byteArrayToHexString(byte[] bytes) {
        StringBuilder stringBuilder = new StringBuilder();
        for (byte tem : bytes) {
            stringBuilder.append(byteToHexString(tem));
        }
        return stringBuilder.toString();
    }

    private static String byteToHexString(byte b) {
        int n = b;
        if (n < 0) {
            n = 256 + n;
        }
        int d1 = n / 16;
        int d2 = n % 16;
        return hexDigits[d1] + hexDigits[d2];
    }
}
