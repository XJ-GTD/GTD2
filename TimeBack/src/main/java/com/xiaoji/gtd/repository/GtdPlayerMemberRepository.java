package com.xiaoji.gtd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.entity.GtdPlayerMemberEntity;

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
    @Query(value = "SELECT * FROM gtd_player_member TA INNER JOIN gtd_player TB ON TB.PLAYER_ID = TA.PLAYER_ID WHERE TB.USER_ID = ?1", nativeQuery = true)
    List<GtdPlayerMemberEntity> findAllByUserId(String userId);

    /**
     * 根据主键查询详细数据
     * @param id
     * @return
     */
    GtdPlayerMemberEntity findById(String id);

    @Query(value = "SELECT * FROM gtd_player_member WHERE ID IN ?1", nativeQuery = true)
    List<GtdPlayerMemberEntity> findByIds(List<String> ids);
}
