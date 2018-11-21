package com.xiaoji.aispeech.xf.aiuiData;

public class Slot{
    private int begin;
    private int end;
    private String name;
    private String normValue;
    private  String value;

    public int getBegin() {
        return begin;
    }

    public void setBegin(int begin) {
        this.begin = begin;
    }

    public int getEnd() {
        return end;
    }

    public void setEnd(int end) {
        this.end = end;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNormValue() {
        return normValue;
    }

    public void setNormValue(String normValue) {
        this.normValue = normValue;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}

