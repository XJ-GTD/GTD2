package com.manager.master.repository;

import com.manager.master.entity.GtdUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户实现类
 *
 * create by wzy on 2018/08/22
 */
@Transactional
public interface UserRepository extends JpaRepository<GtdUserEntity, Integer> {

}
