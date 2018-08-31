package com.manager.master.service;

import com.manager.master.dto.GroupInDto;
import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.repository.GroupJpaRepository;

import java.util.List;

/**
 * 群组Service
 *
 * create by wzy on 2018/08/24
 */
public interface IGroupService {



    List<GtdGroupEntity> select(GroupInDto inDto);

    int addGroup(GroupInDto inDto);

    int addLabel(GroupInDto inDto);

    void delGroup(GroupInDto inDto);

    void updateGname(GroupInDto inDto);

    void delLabel(GroupInDto inDto);

    String member(GroupInDto inDto);
}
