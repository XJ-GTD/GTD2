package com.manager.master.service.serviceImpl;

import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.repository.GroupJpaRepository;
import com.manager.master.service.IGroupService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * 群组Service实现类
 *
 * create by wzy on 2018/08/24
 */
@Service
@Transactional
public class GroupServicelmpl implements IGroupService {
    @Resource
    private GroupJpaRepository groupJpaRepository;


    @Override
    public List<GtdGroupEntity> findAll() {
        return groupJpaRepository.findAll();
    }

    @Override
    public List<GtdGroupEntity> findByName(String name) {
        return groupJpaRepository.findByGroupName(name);
    }
}
