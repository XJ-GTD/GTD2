package com.manager.master.dto;


import java.util.List;
import java.util.Map;

/**
 * 讯飞语音json解析类
 *
 * create by wzy on 2018/11/1
 */
public class AiUiDto {

    private String code;            //语音解析状态值  0:成功
    private int rc;                 //应答码 0：操作成功 4：技能不理解 1-3：异常
    private String service;         //技能名
    private String intent;          //意图名
    private List<AiUiSlotsDto> slots;   //用户语料参数
    private String template;        //对应语料

    private String text;             //语音答案

    private Map<String, String> result;   //结构化数据

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getRc() {
        return rc;
    }

    public void setRc(int rc) {
        this.rc = rc;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public List<AiUiSlotsDto> getSlots() {
        return slots;
    }

    public void setSlots(List<AiUiSlotsDto> slots) {
        this.slots = slots;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Map<String, String> getResult() {
        return result;
    }

    public void setResult(Map<String, String> result) {
        this.result = result;
    }

}
