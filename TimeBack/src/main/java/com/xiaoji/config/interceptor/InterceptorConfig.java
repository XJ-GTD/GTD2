package com.xiaoji.config.interceptor;

import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.entity.GtdLoginEntity;
import com.xiaoji.gtd.repository.AuthRepository;
import com.xiaoji.gtd.repository.GtdLoginRepository;
import com.xiaoji.gtd.repository.GtdTokenRepository;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.Jwt;
import net.minidev.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.security.auth.message.AuthException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * 拦截器配置
 *
 * create by wzy on 2018/08/24
 */
@Component
public class InterceptorConfig implements HandlerInterceptor {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{

        logger.debug("拦截器 start：==================================");
        AuthCheck authCheck;
        if (handler instanceof HandlerMethod) {
            authCheck = ((HandlerMethod) handler).getMethodAnnotation(AuthCheck.class);
        } else {
            return true;
        }
        //这里处理一些业务逻辑，比如
        //有authCheck注解的方法需要进行登录校验
        String authToken = "";
        if (authCheck != null) {
            authToken = request.getHeader("Authorization");
            String visitPath = request.getServletPath();

            if (StringUtils.isBlank(authToken)) {
                //这里自定义的一个异常，与全局异常捕获配合
                throw new AuthException("无TOKEN 权限受限");
                //return false;
            } else {
                //这里查表
                try {
                    Map<String, Object> resultMap;
                    resultMap = Jwt.validToken(authToken);

                    int status = (int) resultMap.get("status");
                    boolean isSuccess = (boolean) resultMap.get("isSuccess");
                    String userId = "";
                    String accountMobile = "";
                    String authType = "";
                    JSONObject data;
                    if (status == ResultCode.SUCCESS.code && isSuccess) {
                        logger.debug("=====TOKEN 未过期======");
                        data = (JSONObject) resultMap.get("data");
                        userId = (String) data.get("userId");
                        accountMobile = (String) data.get("accountMobile");
                        authType = (String) data.get("authType");

                        if (authType.equals("user")) {
                            logger.debug("=====TOKEN 有效 类型[" + authType + "] 接受访问 ======");
                            return true;
                        }
                        if (authType.equals("visitor")) {
                            if (visitPath.equals("/parse/text") || visitPath.equals("/parse/audio") || visitPath.equals("/sync/initial_sync")) {
                                logger.debug("=====TOKEN 有效 类型[" + authType + "] 接受访问 ======");
                                return true;
                            } else {
                                logger.debug("=====TOKEN 类型[" + authType + "] 非用户权限 拒绝访问 ======");
                                return false;
                            }
                        }

                    } else {
                        logger.debug("=====TOKEN 无效 已过期 拒绝访问======");
                        return false;
                    }
                } catch (NullPointerException e) {
                    logger.error("[TOKEN 验证出错]：缺少必要参数，无效TOKEN 拒绝访问!");
                    throw new AuthException("无效TOKEN,权限受限");
                }

            }
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {

    }
}
