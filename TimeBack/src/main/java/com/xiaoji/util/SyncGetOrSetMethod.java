package com.xiaoji.util;

import com.xiaoji.gtd.dto.sync.SyncTableData;
import com.xiaoji.gtd.entity.*;

/**
 * 同步方法用
 * entity 取值赋值统一方法
 */
public class SyncGetOrSetMethod {

    /**
     * 用户信息dto转entity
     * @param std
     * @return
     */
    public static GtdUserEntity userDtoToEntity(SyncTableData std) {
        GtdUserEntity userEntity = new GtdUserEntity();

        userEntity.setUserId(std.getTableA());                          //用户ID
        userEntity.setUserName(std.getTableB());                        //用户名
        userEntity.setHeadImg(std.getTableC());                         //用户头像
        userEntity.setBirthday(std.getTableD());                        //出生日期
        userEntity.setRealName(std.getTableE());                        //真实姓名
        userEntity.setIdCard(std.getTableF());                          //身份证
        if (std.getTableG() != null && !std.getTableG().equals(""))
            userEntity.setUserSex(Integer.valueOf(std.getTableG()));        //性别
        userEntity.setUserContact(std.getTableH());                     //联系方式
        if (std.getTableI() != null && !std.getTableI().equals(""))
            userEntity.setUserType(Integer.valueOf(std.getTableI()));       //用户类型
        userEntity.setUpdateId(std.getTableA());
        userEntity.setUpdateDate(BaseUtil.getSqlDate());

        return userEntity;
    }

    /**
     * 用户信息entity转化Dto
     * @param gue
     * @return
     */
    public static SyncTableData userEntityToDto(GtdUserEntity gue) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gue.getUserId());                        //用户ID
        data.setTableB(gue.getUserName());                      //用户名
        data.setTableC(gue.getHeadImg());                       //用户头像
        data.setTableD(gue.getBirthday());                      //出生日期
        data.setTableE(gue.getRealName());                      //真实姓名
        data.setTableF(gue.getIdCard());                        //身份证
        if (gue.getUserSex() != null)
            data.setTableG(String.valueOf(gue.getUserSex()));       //性别
        data.setTableH(gue.getUserContact());                   //联系方式
        data.setTableI(String.valueOf(gue.getUserType()));      //用户类型

        return data;
    }

    /**
     * 联系人Dto转化entity
     * @param std
     * @return
     */
    public static GtdPlayerEntity playerDtoToEntity(SyncTableData std) {
        GtdPlayerEntity playerEntity = new GtdPlayerEntity();

        playerEntity.setId(std.getTableA());                    //主键
        playerEntity.setPlayerAnotherName(std.getTableB());     //别称
        playerEntity.setPyOhterName(std.getTableC());           //别称拼音
        playerEntity.setPlayerId(std.getTableD());              //联系人用户ID
        playerEntity.setPlayerHeadimg(std.getTableE());         //联系人头像
        playerEntity.setPlayerName(std.getTableF());            //联系人昵称
        playerEntity.setPyPlayerName(std.getTableG());          //联系人昵称拼音
        playerEntity.setPlayerContact(std.getTableH());         //联系人手机号
        if (std.getTableI() != null && !std.getTableI().equals(""))
            playerEntity.setPlayerFlag(Integer.valueOf(std.getTableI()));   //授权联系人标识
        if (std.getTableJ() != null && !std.getTableJ().equals(""))
            playerEntity.setPlayerType(Integer.valueOf(std.getTableJ()));   //联系人类型
        playerEntity.setUserId(std.getTableK());                //联系人数据归属
        playerEntity.setCreateId(std.getTableK());
        playerEntity.setCreateDate(BaseUtil.getSqlDate());

        return playerEntity;
    }

    /**
     * 联系人entity转化Dto
     * @param gpe
     * @return
     */
    public static SyncTableData playerEntityToDto(GtdPlayerEntity gpe) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gpe.getId());                                //主键
        data.setTableB(gpe.getPlayerAnotherName());                 //别称
        data.setTableC(gpe.getPyOhterName());                       //别称拼音
        data.setTableD(gpe.getPlayerId());                          //联系人用户ID
        data.setTableE(gpe.getPlayerHeadimg());                     //联系人头像
        data.setTableF(gpe.getPlayerName());                        //联系人昵称
        data.setTableG(gpe.getPyPlayerName());                      //联系人昵称拼音
        data.setTableH(gpe.getPlayerContact());                     //联系人手机号
        if (gpe.getPlayerFlag() != null)
            data.setTableI(String.valueOf(gpe.getPlayerFlag()));        //授权联系人标识
        if (gpe.getPlayerType() != null)
            data.setTableJ(String.valueOf(gpe.getPlayerType()));        //联系人类型
        data.setTableK(gpe.getUserId());                            //联系人数据归属

        return data;
    }

    /**
     * 联系群组Dto转化entity
     * @param std
     * @return
     */
    public static GtdPlayerMemberEntity memberDtoToEntity(SyncTableData std, String userId) {
        GtdPlayerMemberEntity memberEntity = new GtdPlayerMemberEntity();

        memberEntity.setId(std.getTableA());                    //主键
        memberEntity.setPlayerId(std.getTableB());              //群组主键ID
        memberEntity.setMemberId(std.getTableC());              //群成员主键ID
        memberEntity.setCreateId(userId);
        memberEntity.setCreateDate(BaseUtil.getSqlDate());

        return memberEntity;
    }

    /**
     * 联系群组entity转化Dto
     * @param gpme
     * @return
     */
    public static SyncTableData memberEntityToDto(GtdPlayerMemberEntity gpme) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gpme.getId());                                //主键
        data.setTableB(gpme.getPlayerId());                          //群组主键ID
        data.setTableC(gpme.getMemberId());                          //群成员主键ID

        return data;
    }

    /**
     * 日程主表dto转entity
     * @param std
     * @return
     */
    public static GtdScheduleEntity scheduleDtoToEntity(SyncTableData std) {
        GtdScheduleEntity scheduleEntity = new GtdScheduleEntity();

        scheduleEntity.setScheduleId(std.getTableA());                          //日程事件ID
        scheduleEntity.setScheduleName(std.getTableB());                        //日程事件名称
        if (std.getTableC() != null && !std.getTableC().equals(""))
            scheduleEntity.setLabelId(Integer.valueOf(std.getTableC()));            //标签ID
        scheduleEntity.setUserId(std.getTableD());                              //创建者
        scheduleEntity.setPlanId(std.getTableE());                              //计划ID
        scheduleEntity.setStartDate(CommonMethods.dateToStamp(std.getTableF()));//开始时间
        scheduleEntity.setEndDate(CommonMethods.dateToStamp(std.getTableG()));  //结束时间
        scheduleEntity.setCreateId(std.getTableD());
        scheduleEntity.setCreateDate(BaseUtil.getSqlDate());

        return scheduleEntity;
    }

    /**
     * 日程主表entity转化Dto
     * @param gse
     * @return
     */
    public static SyncTableData scheduleEntityToDto(GtdScheduleEntity gse) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gse.getScheduleId());                        //日程事件ID
        data.setTableB(gse.getScheduleName());                      //日程事件名称
        if (gse.getLabelId() != null)
            data.setTableC(String.valueOf(gse.getLabelId()));           //标签ID
        data.setTableD(gse.getUserId());                            //创建者
        data.setTableE(gse.getPlanId());                            //计划ID
        data.setTableF(CommonMethods.stampToDate(gse.getStartDate()));         //开始时间
        data.setTableG(CommonMethods.stampToDate(gse.getEndDate()));           //结束时间

        return data;
    }

    /**
     * 日程参与人表dto转entity
     * @param std
     * @return
     */
    public static GtdExecuteEntity executeDtoToEntity(SyncTableData std, String userId) {
        GtdExecuteEntity executeEntity = new GtdExecuteEntity();

        executeEntity.setExecuteId(std.getTableA());                          //日程参与人表ID
        executeEntity.setScheduleId(std.getTableB());                         //日程事件ID
        executeEntity.setScheduleOtherName(std.getTableC());                  //日程主题备注
        if (std.getTableD() != null && !std.getTableD().equals(""))
            executeEntity.setScheduleAuth(Integer.valueOf(std.getTableD()));      //修改权限
        if (std.getTableE() != null && !std.getTableE().equals(""))
            executeEntity.setExecuteStatus(Integer.valueOf(std.getTableE()));     //参与状态
        executeEntity.setUserId(std.getTableF());                             //参与人用户ID
        executeEntity.setId(std.getTableG());                                 //授权表ID
        executeEntity.setCreateId(userId);
        executeEntity.setCreateDate(BaseUtil.getSqlDate());

        return executeEntity;
    }

    /**
     * 日程参与人表entity转化Dto
     * @param gee
     * @return
     */
    public static SyncTableData executeEntityToDto(GtdExecuteEntity gee) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gee.getExecuteId());                         //日程参与人表ID
        data.setTableB(gee.getScheduleId());                        //日程事件ID
        data.setTableC(gee.getScheduleOtherName());                 //日程主题备注
        if (gee.getScheduleAuth() != null)
            data.setTableD(String.valueOf(gee.getScheduleAuth()));      //修改权限
        if (gee.getExecuteStatus() != null)
            data.setTableE(String.valueOf(gee.getExecuteStatus()));     //参与状态
        data.setTableF(gee.getUserId());                            //参与人用户ID
        data.setTableG(gee.getId());                                //授权表ID

        return data;
    }

    /**
     * 日程子表（日程）dto转entity
     * @param std
     * @return
     */
    public static GtdScheduleAEntity scheduleADtoToEntity(SyncTableData std) {
        GtdScheduleAEntity scheduleAEntity = new GtdScheduleAEntity();

        scheduleAEntity.setId(std.getTableA());                                     //日程子表ID
        scheduleAEntity.setScheduleId(std.getTableB());                             //日程事件ID
        scheduleAEntity.setComment(std.getTableC());                                //备注
        scheduleAEntity.setRepeatType(std.getTableD());                             //重复类型
        scheduleAEntity.setRemindType(std.getTableE());                             //提醒方式
        scheduleAEntity.setRemindTime(CommonMethods.dateToStamp(std.getTableF()));  //提醒时间

        return scheduleAEntity;
    }

    /**
     * 日程子表（日程）entity转化Dto
     * @param gsae
     * @return
     */
    public static SyncTableData scheduleAEntityToDto(GtdScheduleAEntity gsae) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gsae.getId());                                    //日程子表ID
        data.setTableB(gsae.getScheduleId());                            //日程事件ID
        data.setTableC(gsae.getComment());                               //备注
        data.setTableD(gsae.getRepeatType());                            //重复类型
        data.setTableE(gsae.getRemindType());                            //提醒方式
        data.setTableF(CommonMethods.stampToDate(gsae.getRemindTime())); //提醒时间

        return data;
    }

    /**
     * 日程子表（日常生活）dto转entity
     * @param std
     * @return
     */
    public static GtdScheduleBEntity scheduleBDtoToEntity(SyncTableData std) {
        GtdScheduleBEntity scheduleBEntity = new GtdScheduleBEntity();

        scheduleBEntity.setId(std.getTableA());                                         //日程子表ID
        scheduleBEntity.setScheduleId(std.getTableB());                                 //日程事件ID
        scheduleBEntity.setRemindType(std.getTableE());                                //提醒方式
        scheduleBEntity.setRemindTime(CommonMethods.dateToStamp(std.getTableF()));     //提醒时间

        return scheduleBEntity;
    }

    /**
     * 日程子表（日常生活）entity转化Dto
     * @param gsbe
     * @return
     */
    public static SyncTableData scheduleBEntityToDto(GtdScheduleBEntity gsbe) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gsbe.getId());                                    //日程子表ID
        data.setTableB(gsbe.getScheduleId());                            //日程事件ID
        data.setTableE(gsbe.getRemindType());                               //提醒方式
        data.setTableF(CommonMethods.stampToDate(gsbe.getRemindTime()));    //提醒时间

        return data;
    }

    /**
     * 日程子表（任务）dto转entity
     * @param std
     * @return
     */
    public static GtdScheduleCEntity scheduleCDtoToEntity(SyncTableData std) {
        GtdScheduleCEntity scheduleCEntity = new GtdScheduleCEntity();

        scheduleCEntity.setId(std.getTableA());                                     //日程子表ID
        scheduleCEntity.setScheduleId(std.getTableB());                             //日程事件ID
        scheduleCEntity.setComment(std.getTableC());                                //备注
        scheduleCEntity.setRemindType(std.getTableE());                             //提醒方式
        scheduleCEntity.setRemindTime(CommonMethods.dateToStamp(std.getTableF()));  //提醒时间
        if (std.getTableG() != null && !std.getTableG().equals(""))
            scheduleCEntity.setFinishStatus(Integer.valueOf(std.getTableG()));          //完成状态
        scheduleCEntity.setFinishTime(CommonMethods.dateToStamp(std.getTableH()));  //完成时间

        return scheduleCEntity;
    }

    /**
     * 日程子表（任务）entity转化Dto
     * @param gsce
     * @return
     */
    public static SyncTableData scheduleCEntityToDto(GtdScheduleCEntity gsce) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gsce.getId());                                    //日程子表ID
        data.setTableB(gsce.getScheduleId());                            //日程事件ID
        data.setTableC(gsce.getComment());                               //备注
        data.setTableE(gsce.getRemindType());                            //提醒方式
        data.setTableF(CommonMethods.stampToDate(gsce.getRemindTime())); //提醒时间
        if (gsce.getFinishStatus() != null)
            data.setTableG(String.valueOf(gsce.getFinishStatus()));          //完成状态
        data.setTableH(CommonMethods.stampToDate(gsce.getFinishTime())); //完成时间

        return data;
    }

    /**
     * 日程子表（纪念日）dto转entity
     * @param std
     * @return
     */
    public static GtdScheduleDEntity scheduleDDtoToEntity(SyncTableData std) {
        GtdScheduleDEntity scheduleDEntity = new GtdScheduleDEntity();

        scheduleDEntity.setId(std.getTableA());                                     //日程子表ID
        scheduleDEntity.setScheduleId(std.getTableB());                             //日程事件ID
        scheduleDEntity.setRepeatType(std.getTableD());                             //重复类型
        scheduleDEntity.setRemindType(std.getTableE());                             //提醒方式
        scheduleDEntity.setRemindTime(CommonMethods.dateToStamp(std.getTableF()));  //提醒时间

        return scheduleDEntity;
    }

    /**
     * 日程子表（纪念日）entity转化Dto
     * @param gsde
     * @return
     */
    public static SyncTableData scheduleDEntityToDto(GtdScheduleDEntity gsde) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gsde.getId());                                    //日程子表ID
        data.setTableB(gsde.getScheduleId());                            //日程事件ID
        data.setTableD(gsde.getRepeatType());                            //重复类型
        data.setTableE(gsde.getRemindType());                            //提醒方式
        data.setTableF(CommonMethods.stampToDate(gsde.getRemindTime())); //提醒时间

        return data;
    }

    /**
     * 日程子表（备忘录）dto转entity
     * @param std
     * @return
     */
    public static GtdScheduleEEntity scheduleEDtoToEntity(SyncTableData std) {
        GtdScheduleEEntity scheduleEEntity = new GtdScheduleEEntity();

        scheduleEEntity.setId(std.getTableA());                                     //日程子表ID
        scheduleEEntity.setScheduleId(std.getTableB());                             //日程事件ID
        scheduleEEntity.setComment(std.getTableC());                                //备注

        return scheduleEEntity;
    }

    /**
     * 日程子表（备忘录）entity转化Dto
     * @param gsee
     * @return
     */
    public static SyncTableData scheduleEEntityToDto(GtdScheduleEEntity gsee) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gsee.getId());                                    //日程子表ID
        data.setTableB(gsee.getScheduleId());                            //日程事件ID
        data.setTableC(gsee.getComment());                               //备注

        return data;
    }

    /**
     * 计划表dto转entity
     * @param std
     * @return
     */
    public static GtdPlanEntity planDtoToEntity(SyncTableData std) {
        GtdPlanEntity planEntity = new GtdPlanEntity();

        planEntity.setPlanId(std.getTableA());                          //计划ID
        planEntity.setPlanName(std.getTableB());                        //计划名称
        planEntity.setPlanContent(std.getTableC());                     //计划内容
        planEntity.setUserId(std.getTableD());                          //创建者

        return planEntity;
    }

    /**
     * 计划主表entity转化Dto
     * @param gpe
     * @return
     */
    public static SyncTableData planEntityToDto(GtdPlanEntity gpe) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gpe.getPlanId());                        //计划ID
        data.setTableB(gpe.getPlanName());                      //计划名称
        data.setTableC(gpe.getPlanContent());                   //计划内容
        data.setTableD(gpe.getUserId());                        //创建者

        return data;
    }
}
