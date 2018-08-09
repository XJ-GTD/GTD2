package com.manager.master.dao;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;




@Mapper
public interface IFocusDao {

    /**
     * 添加个人关联表
     * @return
     */
    @Insert("INSERT INTO gtd.GTD_FOCUS (`FOCUS_ALL_ID`, `FOCUS_TYPE`, `USER_ID`) " +
            "VALUES ( #{focusAllId}, #{focusType}, #{userId})")
    void createFocus(@Param("focusAllId") int focusAllId,
                     @Param("focusType") int focusType,
                     @Param("userId") int userId);


}
