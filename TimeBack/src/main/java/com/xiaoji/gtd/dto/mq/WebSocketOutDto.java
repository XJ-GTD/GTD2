package com.xiaoji.gtd.dto.mq;

import com.xiaoji.gtd.dto.BaseOut;
import com.xiaoji.gtd.dto.code.ResultCode;

/**
 * MQ消息推送类
 *
 * create by wzy on 2018/11/22
 */
public class WebSocketOutDto extends BaseOut {

    private String version;
    private String answerText;
    private String answerUrl;
    private String answerImg;
    private ResultCode status;
    private String skillType;
    private WebSocketSource source;
    private WebSocketResult result;


    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public String getAnswerUrl() {
        return answerUrl;
    }

    public void setAnswerUrl(String answerUrl) {
        this.answerUrl = answerUrl;
    }

    public String getSkillType() {
        return skillType;
    }

    public void setSkillType(String skillType) {
        this.skillType = skillType;
    }

    public WebSocketSource getSource() {
        return source;
    }

    public void setSource(WebSocketSource source) {
        this.source = source;
    }

    public WebSocketResult getResult() {
        return result;
    }

    public void setResult(WebSocketResult result) {
        this.result = result;
    }

    public String getAnswerImg() {
        return answerImg;
    }

    public void setAnswerImg(String answerImg) {
        this.answerImg = answerImg;
    }

    public ResultCode getStatus() {
        return status;
    }

    public void setStatus(ResultCode status) {
        this.status = status;
    }
}
