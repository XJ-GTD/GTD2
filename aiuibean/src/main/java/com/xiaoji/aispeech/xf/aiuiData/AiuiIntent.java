package com.xiaoji.aispeech.xf.aiuiData;

import java.util.List;

public class AiuiIntent{

    private int rc	;//int	是	应答码(response code)
    private Object error		;//Object	否	错误信息
    private String text		;//String	是	用户的输入，可能和请求中的原始text不完全一致，因服务器可能会对text进行语言纠错
    private String vendor		;//String	否	技能提供者，不存在时默认表示为IFLYTEK提供的开放技能
    private String service		;//String	是	技能的全局唯一名称，一般为vendor.name，vendor不存在时默认为IFLYTEK提供的开放技能。
    private List<Semantic> semantic		;//Object	否	本次语义（包括历史继承过来的语义）结构化表示，各技能自定义
    private Object data		;//Object	否	数据结构化表示，各技能自定义
    private Answer answer		;//Object	否	对结果内容的最简化文本/图片描述，各技能自定义
    private String dialog_stat		;//String	否	用于客户端判断是否使用信源返回数据
    private List<AiuiIntent> moreResults		;//Object	否	在存在多个候选结果时，用于提供更多的结果描述


    public int getRc() {
        return rc;
    }

    public void setRc(int rc) {
        this.rc = rc;
    }

    public Object getError() {
        return error;
    }

    public void setError(Object error) {
        this.error = error;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public List<Semantic> getSemantic() {
        return semantic;
    }

    public void setSemantic(List<Semantic> semantic) {
        this.semantic = semantic;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Answer getAnswer() {
        return answer;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    public String getDialog_stat() {
        return dialog_stat;
    }

    public void setDialog_stat(String dialog_stat) {
        this.dialog_stat = dialog_stat;
    }

    public List<AiuiIntent> getMoreResults() {
        return moreResults;
    }

    public void setMoreResults(List<AiuiIntent> moreResults) {
        this.moreResults = moreResults;
    }
}

