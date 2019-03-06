package com.xiaoji.sms.dto;

/**
 * 定时器类
 *
 * create by wzy on 2018/11/21
 */
public class TimerDto {

    /**
     * 键
     */
    private String key;
    /**
     * 值
     */
    private Object value;
    /**
     * 过期时间
     */
    private long timeOut;

    public TimerDto(String key, Object value, long timeOut) {
        this.key = key;
        this.value = value;
        this.timeOut = timeOut;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public long getTimeOut() {
        return timeOut;
    }

    public void setTimeOut(long timeOut) {
        this.timeOut = timeOut;
    }
}
