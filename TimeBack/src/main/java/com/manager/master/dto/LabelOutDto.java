package com.manager.master.dto;

/**
 * 标签列表
 *
 * CREATE BY WZY ON 2018/09/07
 */
public class LabelOutDto {

    private int labelId;
    private String labelName;

    public int getLabelId() {
        return labelId;
    }

    public void setLabelId(int labelId) {
        this.labelId = labelId;
    }

    public String getLabelName() {
        return labelName;
    }

    public void setLabelName(String labelName) {
        this.labelName = labelName;
    }
}
