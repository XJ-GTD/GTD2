package com.manager.master.service;

import com.manager.master.dto.GroupInDto;
import com.manager.master.dto.GroupOutDto;
import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.repository.GroupJpaRepository;

import java.util.List;

/**
 * 群组Service
 *
 * create by wzy on 2018/08/24
 */
public interface IGroupService {

    //该用户所有群组
    List<GroupOutDto> selectAll(int userId);

    //查询群组
    List<GtdGroupEntity> select(GroupInDto inDto);

    //添加群组
    int addGroup(GroupInDto inDto);

    //添加标签
    int addLabel(GroupInDto inDto);

    //删除群组
    void delGroup(GroupInDto inDto);

    //编辑群组
    int updateGname(GroupInDto inDto);

    //删除标签，权限标签不能删除
    void delLabel(GroupInDto inDto);

    //编辑群成员
    String member(GroupInDto inDto);
}
