package com.xiaoji.config.exception;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.xiaoji.config.WebAppConfig;
import com.xiaoji.gtd.dto.Out;
import com.xiaoji.gtd.dto.code.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.security.auth.message.AuthException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@ControllerAdvice
public class GlobalExceptionResolver {
    private final static Logger LOGGER =  LogManager.getLogger(WebAppConfig.class.getName());

    /**
     * token异常处理
     * @param response
     * @param e
     */
    @ExceptionHandler(value = AuthException.class)
    public void authExceptionHandler(HttpServletResponse response, AuthException e) {
        e.printStackTrace();
        Out out= new Out();
        out.setCode(ResultCode.UN_AUTH_TOKEN);
        out.setMessage(e.getMessage());
        if (e.getMessage() == null || "".equals(e.getMessage()))  out.setMessage("没有TOKEN权限");
        LOGGER.info("--------AuthException--------");
        responseResult(response, out);
    }

    /**
     * 业务异常的处理
     */
    @ExceptionHandler(value = ServiceException.class)
    public void serviceExceptionHandler(HttpServletResponse response, ServiceException e) {
        e.printStackTrace();
        Out out= new Out();
        out.setCode(ResultCode.FAIL_BUSIC);
        out.setMessage(e.getMessage());
        if (e.getMessage() == null || "".equals(e.getMessage()))  out.setMessage("请求异常，请检查后重新请求");
        LOGGER.info("--------ServiceException--------");
        responseResult(response, out);
    }

    /**
     * 其他异常统一处理
     */

    @ExceptionHandler(value = Exception.class)
    public void exceptionHandler(HttpServletResponse response, Exception e) {
        e.printStackTrace();
        if (e instanceof JSONException || e instanceof HttpMessageNotReadableException){
            Out out= new Out();
            out.setCode(ResultCode.FAIL_BUSIC);
            out.setMessage("请求参数错误，请检查后重新输入");
            LOGGER.info("--------JSONException--------");
            responseResult(response, out);
        }else {
            Out out = new Out();
            out.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            out.setMessage("服务器打酱油了，请稍后再试~");
            LOGGER.info("--------Exception--------");
            LOGGER.error(e.getMessage(), e);
            responseResult(response, out);
        }
    }
    /**
     * @param response
     * @param out
     * @Title: responseResult
     * @Description: 响应结果
     * @Reutrn void
     */
    private void responseResult(HttpServletResponse response,Out out) {
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-type", "application/json;charset=UTF-8");
        response.setStatus(200);
        try {
            response.getWriter().write(JSON.toJSONString(out, SerializerFeature.WriteMapNullValue));
        } catch (IOException ex) {
            LOGGER.error(ex.getMessage());
        }
    }
}
