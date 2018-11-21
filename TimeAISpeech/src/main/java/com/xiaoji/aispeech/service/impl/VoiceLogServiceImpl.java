package com.xiaoji.aispeech.service.impl;

import com.alibaba.fastjson.JSON;
import com.xiaoji.aispeech.bean.VoiceInBean;
import com.xiaoji.aispeech.dao.LogRepository;
import com.xiaoji.aispeech.entity.VoiceLogEntity;
import com.xiaoji.aispeech.service.IVoiceLogrService;
import com.xiaoji.aispeech.util.AiUiUtil;
import com.xiaoji.aispeech.xf.aiuiData.AiUiResponse;
import com.xiaoji.aispeech.xf.aiuiData.AiuiSub;
import com.xiaoji.aispeech.xf.aiuiData.Semantic;
import com.xiaoji.aispeech.xf.aiuiData.Slot;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

/**
 * 语音助手接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
@Transactional
public class VoiceLogServiceImpl implements IVoiceLogrService {
    private Logger logger = LogManager.getLogger(this.getClass());
    @Resource
    private LogRepository logRepository;

    @Override
    public VoiceLogEntity saveLog4XF(AiUiResponse response, VoiceInBean inbean,String resOriginal) {

        //访问数据插入数据库
        VoiceLogEntity log = new VoiceLogEntity();
        //设置日志时间
        log.setCreateDate(new Timestamp(new Date().getTime()));

        log.setReqUserid(inbean.getUserId());

        log.setReqService("AIUI");

        log.setReqDeviceId(inbean.getDeviceId());

        log.setResCode(response.getCode());

        log.setResSid(response.getSid());

        log.setResError(response.getDesc());

        log.setResOriginal(resOriginal);

        log.setCreateDate(new Timestamp(new Date().getTime()));

        List<AiuiSub> ls =response.getData();

        String reqText = "[";
        String resAnswer = "[";
        String resService = "[";
        String resSlot = "[";
        for (AiuiSub sub:ls){
            if ("iat".equals(sub.getSub())){
                reqText = reqText+ "{result_id:" + sub.getResult_id() + ",text:" + sub.getText() + "},";

            }else if("nlp".equals(sub.getSub())){
                if (sub.getIntent() == null ) continue;
                if (sub.getIntent().getAnswer() == null ) continue;
                resAnswer = resAnswer+ "{result_id:" + sub.getResult_id() + ",answer:" + sub.getIntent().getAnswer().getText()+ "},";
                resService = resService+ "{result_id:" + sub.getResult_id() + ",service:" + sub.getIntent().getService() + "},";
                List<Semantic> semantics = sub.getIntent().getSemantic();
                resSlot = resSlot + "[{result_id: + sub.getResult_id() + ,semantic:[";
                for (Semantic semantic : semantics){
                    resSlot = resSlot+ "{intent:" + semantic.getIntent() + ",slots:[";
                    List<Slot> slots = semantic.getSlots();
                    for (Slot slot : slots){
                        resSlot = resSlot+ "{name:" + slot.getName() + ",NormValue:" + slot.getNormValue() + ",value:" + slot.getValue() + "},";
                    }
                    resSlot = resSlot + "]}";
                }
                resSlot = resSlot + "]}";
            }
        }
        reqText = reqText + "]";
        resAnswer = resAnswer + "]";
        resService = resService + "]";
        resSlot = resSlot + "]";

        log.setReqText(reqText);
        log.setResAnswer(resAnswer);
        log.setResService(resService);
        log.setResSlot(resSlot);

        log = logRepository.save(log);

        return log;

    }
}
