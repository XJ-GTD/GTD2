package com.manager.master.dto;

/**
 * 标签类
 *
 * create by wzy on 2018/09/06
 */
public class LabelInDto {

    private Integer userId;
    private Integer findType;       //查询类型，0是日程，1是参与人


    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getFindType() {
        return findType;
    }

    public void setFindType(Integer findType) {
        this.findType = findType;
    }
}
