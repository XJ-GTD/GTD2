package com.manager.master.service;

import com.manager.master.dto.*;
import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.repository.GroupJpaRepository;

import java.util.List;
import java.util.Set;

/**
 * 群组Service
 *
 * create by wzy on 2018/08/24
 */
public interface IGroupService {

    //该用户所有群组
    List<GroupOutDto> selectAll(GroupFindInDto inDto);

    //群组参与人详情
    GroupOutDto selectMessage(GroupFindInDto inDto);

    //按条件模糊查询群组
    List<GroupOutDto> getListGroupByMessage(GroupInDto inDto);

    //查詢群成員
    List<GroupMemberOutDto> findMember(GroupFindInDto inDto);

    //添加群组
    int addGroup(GroupInDto inDto);

    //删除群组
    int delGroup(GroupInDto inDto);

    //退出群组
    int exitGroup(GroupInDto inDto);

    //编辑群组
    int updateGname(GroupMemberInDto inDto);

    //删除/添加群成员
    //int addOrDelMember(GroupMemberInDto inDto);

    //编辑群成员
    //int member(GroupInDto inDto);

    //群成员状态改变
    int updateStatus(InformInDto inDto);

    /**
     * 创建编辑日程添加参与人用
     * @param inDto
     * @return
     */
    List<GroupOutDto> createSchedule(GroupFindInDto inDto);
}
