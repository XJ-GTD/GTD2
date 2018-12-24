package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.*;

import java.util.List;

/**
 * 用户类接口
 *
 * create by wzy on 2018/11/15.
 */
public interface IPersonService {

    /**
     * 验证手机号重复性
     * @param mobile
     * @return
     */
    boolean isRepeatMobile(String mobile);

    /**
     * 验证uuid重复性
     * @param uuid
     * @return
     */
    boolean isRepeatUuid(String uuid);

    /**
     * 用户注册
     * @param inDto
     */
    int signUp(SignUpInDto inDto);

    /**
     * 用户密码修改
     * @param inDto
     * @return
     */
    int updatePassword(UpdatePWDInDto inDto);

    /**
     * 查询密码是否正确
     * @param userId
     * @param password
     * @return
     */
    boolean isPasswordTrue(String userId, String password);

    /**
     * 发送添加邀请
     * @param inDto
     * @return
     */
    int addPlayer(PlayerInDto inDto);

    /**
     * 查询联系人
     * @param inDto
     * @return
     */
    PlayerOutDto searchPlayer(PlayerInDto inDto);

    /**
     * 用户是否接受推送
     * @param inDto
     */
    List<PlayerDataDto> isAgree(String userId, List<PlayerDataDto> inDto);

    /**
     * 传入的参与人姓名/备注转化成拼音返回
     * @param inDto
     * @return
     */
    String conversionPinyin(SearchInDto inDto);
}
