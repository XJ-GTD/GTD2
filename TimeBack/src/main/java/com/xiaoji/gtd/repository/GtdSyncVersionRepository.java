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
    List<GtdSyncVersionEntity> compareToHighVersion(String userId, String version);

    /**
     * 获取版本差异间更新数据
     * @param userId
     * @param localVersion
     * @param latestVersion
     * @return
     */
    /*
    * SELECT TB.* FROM  (SELECT MAX(VERSION) VERSION, TABLE_ID, TABLE_NAME FROM gtd_sync_version Ta
                WHERE Ta.USER_ID = "FE507A6BD8F1AED12FD3174343AE3AFE"
                  AND Ta.VERSION > "20190108155550"
                  AND Ta.VERSION < "20190112155550"
                GROUP BY Ta.TABLE_ID, Ta.TABLE_NAME) MA
INNER JOIN gtd_sync_version TB
   ON MA.TABLE_ID = TB.TABLE_ID AND TB.VERSION = MA.VERSION;
   */
    @Query(value = "SELECT TC.* FROM (" +
            "SELECT MAX(TA.VERSION) VERSION, TA.TABLE_NAME, TA.TABLE_ID FROM gtd_sync_version TA " +
            "WHERE TA.USER_ID = ?1 AND TA.VERSION > ?2 AND TA.VERSION < ?3 " +
            "GROUP BY TA.TABLE_NAME, TA.TABLE_ID) TB " +
            "INNER JOIN gtd_sync_version TC ON TC.TABLE_ID = TB.TABLE_ID AND TC.TABLE_NAME = TB.TABLE_NAME", nativeQuery = true)
    List<GtdSyncVersionEntity> downLoadSyncData(String userId, String localVersion, String latestVersion);
}
