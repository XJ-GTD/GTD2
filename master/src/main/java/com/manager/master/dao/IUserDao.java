package com.manager.master.dao;

import com.manager.master.bean.UserAccountBean;
import com.manager.master.dto.UserInfoOutDto;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Date;

/**
 * create by wzy on 2018/04/24.
 * 用户管理
 */
@Mapper
public interface IUserDao {

    /**
     * 根据电话号码查询用户信息
     * @return
     */
    @Select(" SELECT A.USER_ID,B.ACCOUNT_ID FROM GTD_USER A " +
            " INNER JOIN GTD_ACCOUNT B ON A.ACCOUNT_ID = B.ACCOUNT_ID " +
            " WHERE B.ACCOUNT_MOBILE = #{mobile}")
    UserInfoOutDto findUser(@Param("mobile") String mobile);

    /**
     * 根据用户ID查询用户号码
     * @param userId
     * @return
     */
    @Select("select ACCOUNT_MOBILE from GTD_ACCOUNT where USER_ID = #{userId}")
    String findMobileById(@Param("userId") int userId);

//    /**
//     * 查询用户信息
//     * @return
//     */
//    @Select("select * from GTD_USER where USER_ID = ( select USER_ID from GTD_ACCOUNT where ACCOUNT_MOBILE = #{mobile} and ACCOUNT_PASSWORD= #{passWord} )")
//    UserInfoBean loginUser(@Param("mobile") String mobile,@Param("passWord") String passWord);
    /**
     *用户登录
     * @return
     */
    @Select(" SELECT B.ACCOUNT_ID,A.ACCOUNT_NAME,A.ACCOUNT_MOBILE," +
            " B.USER_ID,B.USER_SEX,B.USER_NAME,B.USER_HEAD,B.EMAIL " +
            " FROM GTD_ACCOUNT A " +
            " INNER JOIN GTD_USER B ON A.ACCOUNT_ID = B.ACCOUNT_ID " +
            " WHERE A.ACCOUNT_MOBILE = #{mobile} AND A.ACCOUNT_PASSWORD = #{password}")
    UserAccountBean loginUser(@Param("mobile") String mobile, @Param("password")String password);
    /**
     *获取上次添加用户ID
     */
    @Select("SELECT LAST_INSERT_ID()")
    int  selectPKId();

    /**
     * 用户注册（账户表入库）
     * @return
     */
    @Insert("insert into GTD_ACCOUNT (ACCOUNT_NAME,ACCOUNT_PASSWORD,ACCOUNT_MOBILE) " +
            "values(#{accountName},#{accountPassword},#{accountMobile})")
    void createAccount(@Param("accountName") String accountName,
                     @Param("accountPassword") String accountPassword,
                     @Param("accountMobile") String accountMobile
                     );
    /**
     * 用户注册（用户表入库）
     * @return
     */
    @Insert("insert into GTD_USER (ACCOUNT_ID,USER_NAME,USER_SEX,USER_BIRTHDAY,EMAIL,REAL_NAME,ID_NUMBER,USER_HEAD) " +
            "values(#{accountId},#{userName},#{userSex},#{userBirthday},#{email},#{realName},#{idNumber},#{userHead})")
    void createUser( @Param("accountId") Integer accountId,
                     @Param("userName") String userName,
                     @Param("userSex") Integer userSex,
                    @Param("userBirthday") Date userBirthday,
                    @Param("email") String email,
                    @Param("realName") String realName,
                    @Param("idNumber") String idNumber,
                     @Param("userHead") String userHead);



}
