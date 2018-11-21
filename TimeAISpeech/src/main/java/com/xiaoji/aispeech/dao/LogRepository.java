package com.xiaoji.aispeech.dao;

import com.xiaoji.aispeech.entity.VoiceLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 *日志类记录访问接口的详细信息
 */
@Transactional
public interface LogRepository extends JpaRepository<VoiceLogEntity,Long> {

    @Query(value ="SELECT * FROM GTD_GROUP WHERE REQ_USERID=?1" ,nativeQuery = true)
    List<VoiceLogEntity> findByUserId(String userId);

}

