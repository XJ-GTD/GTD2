package com.manager.master.repository;

import com.manager.master.entity.GtdUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

/**
 * 用户实现类
 *
 * create by wzy on 2018/08/22
 */
@Transactional
public interface UserJpaRepository extends JpaRepository<GtdUserEntity, Integer> {

    /**
     * 查询用户的消息队列
     * @param userId
     * @return
     */
    @Query(value = " SELECT ACCOUNT_QUEUE FROM gtd_account WHERE USER_ID = ?1 ", nativeQuery = true)
    String findAccountQueue(int userId);

    /**
     * 修改用户密码
     * @param userId
     * @param newPassword
     */
    @Modifying
    @Query(value = "update gtd_account set ACCOUNT_PASSWORD = ?2,UPDATE_ID = ?3,UPDATE_DATE = ?4 where USER_ID = ?1",nativeQuery = true)
    void updatePassword(Integer userId, String newPassword, Integer updateId, Timestamp updateDt);

    /**
     *  更新用户资料
     * @param userName
     * @param heanImg
     * @param birthday
     * @param sex
     * @param contact
     * @param updateId
     * @param updateDt
     * @param userId
     */
    @Modifying
    @Query(value = "update gtd_user set USER_NAME = ?1,HEADIMG_URL = ?2,BRITHDAY = ?3,USER_SEX = ?4,USER_CONTACT = ?5,UPDATE_ID = ?6,UPDATE_DATE = ?7 where USER_ID = ?8",nativeQuery = true)
    void updateUserInfo(String userName,String heanImg,String birthday,String sex,String contact,Integer updateId,Timestamp updateDt,Integer userId);

}
