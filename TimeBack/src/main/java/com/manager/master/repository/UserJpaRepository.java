package com.manager.master.repository;

import com.manager.master.entity.GtdUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户实现类
 *
 * create by wzy on 2018/08/22
 */
@Transactional
public interface UserJpaRepository extends JpaRepository<GtdUserEntity, Integer> {

}
