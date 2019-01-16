package com.xiaoji.gtd.dto.mq;

import com.xiaoji.gtd.dto.BaseOut;
import com.xiaoji.gtd.dto.code.ResultCode;

/**
 * MQ消息推送类
 *
 * create by wzy on 2018/11/22
 */
public class WebSocketOutDto extends BaseOut {

    private String vs;      //version
    private String ut;      //userText
    private String at;      //answerText;
    private String au;      //answerUrl;
    private String ai;      //answerImg;
    private int ss;         //status;
    private String sk;      //skillType;
    private Boolean ses;     //shouldEndSession
    private WebSocketSourceDto src;     //source;
    private WebSocketResultDto res;     //result;

    public String getVs() {
        return vs;
    }

    public void setVs(String vs) {
        this.vs = vs;
    }

    public String getAt() {
        return at;
    }

    public void setAt(String at) {
        this.at = at;
    }

    public String getAu() {
        return au;
    }

    public void setAu(String au) {
        this.au = au;
    }

    public String getAi() {
        return ai;
    }

    public void setAi(String ai) {
        this.ai = ai;
    }

    public int getSs() {
        return ss;
    }

    public void setSs(int ss) {
        this.ss = ss;
    }

    public String getSk() {
        return sk;
    }

    public void setSk(String sk) {
        this.sk = sk;
    }

    public WebSocketSourceDto getSrc() {
        return src;
    }

    public void setSrc(WebSocketSourceDto src) {
        this.src = src;
    }

    public WebSocketResultDto getRes() {
        return res;
    }

    public void setRes(WebSocketResultDto res) {
        this.res = res;
    }

    public void setSs(ResultCode status) {
        this.ss = status.code;
    }

    public String getUt() {
        return ut;
    }

    public void setUt(String ut) {
        this.ut = ut;
    }

    public Boolean getSes() {
        return ses;
    }

    public void setSes(Boolean ses) {
        this.ses = ses;
    }
}
