package com.manager.master.service;

import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.repository.GroupJpaRepository;

import java.util.List;

/**
 * 群组Service
 *
 * create by wzy on 2018/08/24
 */
public interface IGroupService {
    List<GtdGroupEntity> findAll();
    List<GtdGroupEntity> findByName(String name);
}
