package com.xiaoji.aispeech.bean;

import com.xiaoji.aispeech.xf.aiuiData.Slot;

import java.util.List;

public class NlpOutDto{
    private int rc;
    private String text;
    private String answer;
    private String answerImg;
    private String answerUrl;
    private List<Slot> slots;
    private String intent;
    private String service;
    private Boolean shouldEndSession;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getAnswerImg() {
        return answerImg;
    }

    public void setAnswerImg(String answerImg) {
        this.answerImg = answerImg;
    }

    public String getAnswerUrl() {
        return answerUrl;
    }

    public void setAnswerUrl(String answerUrl) {
        this.answerUrl = answerUrl;
    }

    public List<Slot> getSlots() {
        return slots;
    }

    public void setSlots(List<Slot> slots) {
        this.slots = slots;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public Boolean getShouldEndSession() {
        return shouldEndSession;
    }

    public void setShouldEndSession(Boolean shouldEndSession) {
        this.shouldEndSession = shouldEndSession;
    }

    public int getRc() {
        return rc;
    }

    public void setRc(int rc) {
        this.rc = rc;
    }
}


