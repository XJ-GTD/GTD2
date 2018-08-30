package com.manager.config.exception;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.manager.config.WebAppConfig;
import com.manager.master.dto.BaseOutDto;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@ControllerAdvice
public class GlobalExceptionResolver {
    private final static Logger LOGGER =  LogManager.getLogger(WebAppConfig.class.getName());
    /**
     * 业务异常的处理
     */
    @ExceptionHandler(value = ServiceException.class)
    public void serviceExceptionHandler(HttpServletResponse response, ServiceException e) {
        e.printStackTrace();
        BaseOutDto baseOutDto= new BaseOutDto();
        baseOutDto.setCode(ResultCode.FAIL).setMessage(e.getMessage());
        LOGGER.info("--------ServiceException--------");
        responseResult(response, baseOutDto);
    }

    /**
     * 其他异常统一处理
     */

    @ExceptionHandler(value = Exception.class)
    public void exceptionHandler(HttpServletResponse response, Exception e) {
        e.printStackTrace();
        if (e instanceof JSONException || e instanceof HttpMessageNotReadableException){
            BaseOutDto baseOutDto= new BaseOutDto();
            baseOutDto.setCode(ResultCode.FAIL).setMessage("请求参数错误，请检查后重新输入");
            LOGGER.info("--------JSONException--------");
            responseResult(response, baseOutDto);
        }else {
            BaseOutDto baseOutDto = new BaseOutDto();
            baseOutDto.setCode(ResultCode.INTERNAL_SERVER_ERROR).setMessage("服务器打酱油了，请稍后再试~");
            LOGGER.info("--------Exception--------");
            LOGGER.error(e.getMessage(), e);
            responseResult(response, baseOutDto);
        }
    }
    /**
     * @param response
     * @param baseOutDto
     * @Title: responseResult
     * @Description: 响应结果
     * @Reutrn void
     */
    private void responseResult(HttpServletResponse response,BaseOutDto baseOutDto) {
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-type", "application/json;charset=UTF-8");
        response.setStatus(200);
        try {
            response.getWriter().write(JSON.toJSONString(baseOutDto, SerializerFeature.WriteMapNullValue));
        } catch (IOException ex) {
            LOGGER.error(ex.getMessage());
        }
    }
}
