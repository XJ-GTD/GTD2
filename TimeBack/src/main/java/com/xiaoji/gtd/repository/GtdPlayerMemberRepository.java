package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdPlayerMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 联系人群组表DAO层 继承类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
public interface GtdPlayerMemberRepository extends JpaRepository<GtdPlayerMemberEntity, Integer> {

    /**
     * 查询用户下全部联系人群组数据
     * @return
     */
    List<GtdPlayerMemberEntity> findAllByUserId(String userId);
}
