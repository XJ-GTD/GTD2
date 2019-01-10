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
    *
    *
SELECT TC.* FROM
  gtd_sync_version TC
    INNER JOIN (
    SELECT MAX(TA.VERSION) VERSION, TA.TABLE_NAME, TA.TABLE_ID
    FROM gtd_sync_version TA
    WHERE TA.USER_ID = "FE507A6BD8F1AED12FD3174343AE3AFE"
      AND TA.VERSION > "20190108155550"
      AND TA.VERSION < "20190110144437"
    GROUP BY TA.TABLE_NAME, TA.TABLE_ID
  ) TB
    ON TC.TABLE_ID = TB.TABLE_ID AND TC.VERSION = TB.VERSION AND TB.TABLE_NAME = TC.TABLE_NAME;
   */
    @Query(value = "SELECT TC.* FROM gtd_sync_version TC " +
            " INNER JOIN (" +
            " SELECT MAX(TA.VERSION) VERSION, TA.TABLE_NAME, TA.TABLE_ID FROM gtd_sync_version TA " +
            " WHERE TA.USER_ID = ?1 AND TA.VERSION > ?2 AND TA.VERSION < ?3 " +
            " GROUP BY TA.TABLE_NAME, TA.TABLE_ID) TB " +
            " ON TC.TABLE_ID = TB.TABLE_ID AND TC.TABLE_NAME = TB.TABLE_NAME AND TC.VERSION = TB.VERSION", nativeQuery = true)
    List<GtdSyncVersionEntity> downLoadSyncData(String userId, String localVersion, String latestVersion);
}
