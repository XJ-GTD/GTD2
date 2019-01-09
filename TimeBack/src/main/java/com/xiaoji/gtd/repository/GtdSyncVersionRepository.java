package com.xiaoji.gtd.repository;


import com.xiaoji.gtd.entity.GtdSyncVersionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Token表DAO层 继承类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
public interface GtdSyncVersionRepository extends JpaRepository<GtdSyncVersionEntity, Integer> {


    /**
     * 对比高于本地版本号的相同操作数据
     * @param version
     * @param userId
     * @return
     */
    @Query(value = "SELECT * FROM gtd_sync_version WHERE USER_ID = ?1 AND VERSION > ?2", nativeQuery = true)
    List<GtdSyncVersionEntity> compareToHighVersion(String version, String userId);

}
