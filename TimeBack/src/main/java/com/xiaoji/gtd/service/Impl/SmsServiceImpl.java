package com.xiaoji.gtd.service.Impl;

import com.xiaoji.gtd.service.ISmsService;
import com.xiaoji.util.SubMailUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 短信接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
@Transactional
public class SmsServiceImpl implements ISmsService {

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 获取验证码
     * @param mobile
     * @return
     */
    @Override
    public int getAuthCode(String mobile) {

        try {
            SubMailUtil.getAuthCode(mobile);
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("短信验证接口请求失败");
            return 1;
        }

        return 0;
    }
}
