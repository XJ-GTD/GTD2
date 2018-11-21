package com.xiaoji.aispeech.xf.aiuiData;

import java.util.List;

public class AiuiLat {

    private int sn;    //sentence	number	第几句
    private boolean ls;    //last sentence	boolean	是否最后一句
    private int bg;    //begin	number	开始
    private int ed;    //end	number	结束
    private List<String> ws;    //words	array	词
    private List<String> cw;    //chinese word	array	中文分词
    private String w;    //word	string	单字
    private int sc;  //score	number	分数
    private String text; //返回翻译文字


    public int getSn() {
        return sn;
    }

    public void setSn(int sn) {
        this.sn = sn;
    }

    public boolean isLs() {
        return ls;
    }

    public void setLs(boolean ls) {
        this.ls = ls;
    }

    public int getBg() {
        return bg;
    }

    public void setBg(int bg) {
        this.bg = bg;
    }

    public int getEd() {
        return ed;
    }

    public void setEd(int ed) {
        this.ed = ed;
    }

    public List<String> getWs() {
        return ws;
    }

    public void setWs(List<String> ws) {
        this.ws = ws;
    }

    public List<String> getCw() {
        return cw;
    }

    public void setCw(List<String> cw) {
        this.cw = cw;
    }

    public String getW() {
        return w;
    }

    public void setW(String w) {
        this.w = w;
    }

    public int getSc() {
        return sc;
    }

    public void setSc(int sc) {
        this.sc = sc;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
