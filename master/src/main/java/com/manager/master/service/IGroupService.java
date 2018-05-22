package com.manager.master.service;

import com.manager.master.dto.GroupDto;

import java.util.List;

/**
 * 组群
 */
public interface IGroupService {


    /**
     * 查询个人组群信息
     * @return
     */
    List<GroupDto> findGroup(int userId);


    /**
     * 组群创建
     * @param
     */
    void  createGroup(String groupId,String groupName,int userId,int roleId);
}
