package com.xiaoji.gtd.service.Impl;

import com.xiaoji.config.exception.ServiceException;
import com.xiaoji.gtd.dto.sync.*;
import com.xiaoji.gtd.entity.*;
import com.xiaoji.gtd.repository.*;
import com.xiaoji.gtd.service.ISyncService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.SyncGetOrSetMethod;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 同步接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
@Transactional
public class SyncServiceImpl implements ISyncService {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Value("${sync.init.type}")
    private String SYNC_INIT;
    @Value("${sync.datalist.label}")
    private String SYNC_TYPE_LABEL;
    @Value("${sync.datalist.dictionary}")
    private String SYNC_TYPE_DICTIONARY;
    @Value("${sync.datalist.dictionary.data}")
    private String SYNC_TYPE_DICTIONARY_DATA;
    @Value("${sync.timing.action.create}")
    private String SYNC_ACTION_CREATE;
    @Value("${sync.timing.action.update}")
    private String SYNC_ACTION_UPDATE;
    @Value("${sync.timing.action.delete}")
    private String SYNC_ACTION_DELETE;

    @Resource
    private GtdDictionaryRepository dictionaryRepository;
    @Resource
    private GtdDictionaryDataRepository dictionaryDataRepository;
    @Resource
    private GtdSyncVersionRepository gtdSyncVersionRepository;
    @Resource
    private GtdPlayerRepository gtdPlayerRepository;
    @Resource
    private GtdPlayerMemberRepository gtdPlayerMemberRepository;
    @Resource
    private GtdPlanRepository gtdPlanRepository;
    @Resource
    private GtdUserRepository gtdUserRepository;
    @Resource
    private GtdScheduleRepository gtdScheduleRepository;
    @Resource
    private GtdExecuteRepository gtdExecuteRepository;
    @Resource
    private GtdScheduleARepository gtdScheduleARepository;
    @Resource
    private GtdScheduleBRepository gtdScheduleBRepository;
    @Resource
    private GtdScheduleCRepository gtdScheduleCRepository;
    @Resource
    private GtdScheduleDRepository gtdScheduleDRepository;
    @Resource
    private GtdScheduleERepository gtdScheduleERepository;
    @Resource
    private GtdLabelRepository labelRepository;
    @Resource
    private SyncRepository syncRepository;

    /**
     * 初始化数据同步
     *
     * @return
     */
    @Override
    public SyncOutDto initialSync() {
        SyncOutDto out = new SyncOutDto();
        List<SyncInitDataDto> syncDataList = new ArrayList<>();

        List<SyncInitData> labelList = new ArrayList<>();
        List<SyncInitData> dictionaryList = new ArrayList<>();
        List<SyncInitData> dictionaryDataList = new ArrayList<>();

        List<GtdLabelEntity> labelEntityList;
        List<GtdDictionaryEntity> dictionaryEntityList;
        List<GtdDictionaryDataEntity> dictionaryDataEntityList;

        try {

            //字典表
            dictionaryEntityList = dictionaryRepository.findAllByDictType(SYNC_INIT);
            List<Integer> dictValues = new ArrayList<>();
            SyncInitDataDto syncDataA = new SyncInitDataDto();
            for (GtdDictionaryEntity gde: dictionaryEntityList) {
                dictValues.add(gde.getDictValue());

                SyncInitData sd = new SyncInitData();
                sd.setKey(String.valueOf(gde.getDictValue()));
                sd.setValue(gde.getDictName());
                sd.setType(gde.getDictType());
                dictionaryList.add(sd);
            }
            syncDataA.setType(SYNC_TYPE_DICTIONARY);
            syncDataA.setDataList(dictionaryList);
            syncDataList.add(syncDataA);
            logger.debug("[字典表]查询添加完成");

            //字典数据表
            dictionaryDataEntityList = dictionaryDataRepository.findAllByDictValueIn(dictValues);
            SyncInitDataDto syncDataB = new SyncInitDataDto();
            for (GtdDictionaryDataEntity gdde: dictionaryDataEntityList) {
                SyncInitData sd = new SyncInitData();

                sd.setKey(gdde.getDictdataValue());
                sd.setValue(gdde.getDictdataName());
                sd.setType(String.valueOf(gdde.getDictValue()));
                sd.setId(gdde.getId());
                dictionaryDataList.add(sd);
            }
            syncDataB.setType(SYNC_TYPE_DICTIONARY_DATA);
            syncDataB.setDataList(dictionaryDataList);
            syncDataList.add(syncDataB);
            logger.debug("[字典数据表]查询添加完成");

            //标签表
            labelEntityList = labelRepository.findAll();
            SyncInitDataDto syncDataC = new SyncInitDataDto();
            for (GtdLabelEntity gle: labelEntityList) {
                SyncInitData sd = new SyncInitData();

                sd.setKey(gle.getLabelColor());
                sd.setType(gle.getLabelType());
                sd.setValue(gle.getLabelName());
                sd.setId(gle.getId());
                labelList.add(sd);
            }
            syncDataC.setType(SYNC_TYPE_LABEL);
            syncDataC.setDataList(labelList);
            syncDataList.add(syncDataC);
            logger.debug("[标签表]查询添加完成");

        } catch (Exception e) {
            e.printStackTrace();
            logger.error("初始化数据查询失败");
            throw new ServiceException("初始化数据查询失败");
        }

        out.setSyncDataList(syncDataList);
        return out;
    }

    /**
     * 登陆同步
     *
     * @param inDto
     * @return
     */
    @Override
    public SyncOutDto loginSync(SyncInDto inDto) {
        SyncOutDto outData = new SyncOutDto();
        List<SyncDataDto> dataList = new ArrayList<>();

        String userId = inDto.getUserId();
        String deviceId = inDto.getDeviceId();
        String version = findLatestVersion(userId);

        if (!version.equals("")) {
            logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] ：开始获取数据");
            dataList = downLoad(userId, deviceId, null, null);
            List<SyncDataDto> dataDtoList = downLoad(userId, deviceId, "0", version);
            if (dataDtoList != null && dataDtoList.size() > 0) {
                dataList.addAll(dataDtoList);
            }
        } else {
            logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] ：暂无数据，无需同步");
            version = BaseUtil.getVersion();
        }


        if (dataList != null && dataList.size() > 0) {
            outData.setVersion(version);
            outData.setUserDataList(dataList);
            logger.debug("获取数据成功 version：["+ version + "] | data: size = " + dataList.size());
            return outData;
        } else {
            logger.debug("服务器暂无该账号数据!");
            return null;
        }
    }

    /**
     * 定时同步
     *
     * @param inDto
     * @return
     */
    @Override
    public SyncOutDto timingSync(SyncInDto inDto) {

        SyncOutDto outDto = new SyncOutDto();
        List<SyncDataDto> syncDataList = inDto.getSyncDataList();
        List<SyncDataDto> downLoadDataList;

        String userId = inDto.getUserId();
        String deviceId = inDto.getDeviceId();
        String version = inDto.getVersion();
        logger.debug("本次数据版本号:" + version);
        String uploadVersion = BaseUtil.getVersion();
        logger.debug("服务器本次需要上传数据版本号:" + uploadVersion);

        if (syncDataList != null && syncDataList.size() > 0) {      //需要上传数据
            logger.debug("=========== 上传数据开始 ===========");
//            logger.debug("=========== 上传数据量为：" + syncDataList.size() + " ===========");
            logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] | 本次上传版本号[" + uploadVersion + "]：开始上传数据");

            upLoadData(syncDataList, userId, version, deviceId, uploadVersion);

            logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] 上传数据成功 ");
            logger.debug("=========== 上传数据结束 ===========");
        } else {
            logger.debug("=========== [本次无需上传更新] ===========");
        }

        String downloadSyncVersion = findLatestVersion(userId);
        logger.debug("服务器本次需要下载数据版本号:" + downloadSyncVersion);

        if (!downloadSyncVersion.equals("") && !version.equals(downloadSyncVersion)) {
            logger.debug("=========== 下载数据开始 ===========");

            logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] ：开始获取数据");

            downLoadDataList = downLoad(userId, deviceId, version, downloadSyncVersion);

            if (downLoadDataList != null) {
                logger.debug("获取数据成功 version：["+ downloadSyncVersion + "] | data: size = " + downLoadDataList.size());
                outDto.setVersion(downloadSyncVersion);
                outDto.setUserDataList(downLoadDataList);
            } else {
                logger.debug("下载数据失败：服务器暂无该账号数据!");
                return null;
            }

            logger.debug("=========== 下载数据结束 ===========");
        } else {
            logger.debug("=========== [本次无需下载更新] ===========");
        }

        return outDto;
    }

    /**
     * 同步上传
     *
     * @param inDto
     * @return
     */
    @Override
    public int upload(SyncInDto inDto) {

        List<SyncDataDto> syncDataList = inDto.getSyncDataList();
        String userId = inDto.getUserId();
        String deviceId = inDto.getDeviceId();
        String version = inDto.getVersion();
        String uploadVersion = BaseUtil.getVersion();
        logger.debug("本次上传数据版本 [" + version + "] | 本次更新版本库数据版本 [" + uploadVersion + "]");

        if (syncDataList != null && syncDataList.size() > 0) {      //上传数据
            logger.debug("=========== 上传数据开始 ===========");
            logger.debug("=========== 上传数据量为：" + syncDataList.size() + " ===========");
            logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] | 更新版本号[" + uploadVersion + "]：开始上传数据");

            upLoadData(syncDataList, userId, version, deviceId, uploadVersion);

            logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] 上传数据成功 ");
            logger.debug("=========== 上传数据结束 ===========");
        } else {
            logger.debug("=========== [本次无上传更新] ===========");
            return 1;
        }

        return 0;
    }

    /**
     * 同步下载
     *
     * @param inDto
     * @return
     */
    @Override
    public SyncOutDto download(SyncInDto inDto) {
        SyncOutDto outDto = new SyncOutDto();
        List<SyncDataDto> downLoadDataList;

        String userId = inDto.getUserId();
        String deviceId = inDto.getDeviceId();
        String version = inDto.getVersion();
        String downloadSyncVersion = findLatestVersion(userId);
        logger.debug("本地数据版本号:[" + version + "] | 服务端版本库最新版本号:[" + downloadSyncVersion + "]");

        if (!downloadSyncVersion.equals("") && !version.equals(downloadSyncVersion)) {
            logger.debug("=========== 下载数据开始 ===========");

            logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] ：开始获取数据");

            downLoadDataList = downLoad(userId, deviceId, version, downloadSyncVersion);

            if (downLoadDataList != null) {
                logger.debug("获取最新数据 最新版本号：["+ downloadSyncVersion + "] | 本次更新数据量 = " + downLoadDataList.size());
                outDto.setVersion(downloadSyncVersion);
                outDto.setUserDataList(downLoadDataList);
            } else {
                logger.debug("下载数据失败：服务器暂无该账号数据!");
                return null;
            }

            logger.debug("=========== 下载数据结束 ===========");
        } else {
            logger.debug("=========== [本地数据无需下载更新] ===========");
        }

        return outDto;
    }

    /**
     * 上传的数据
     * @param syncDataList
     * @param userId
     */
    private List<GtdSyncVersionEntity> upLoadData(List<SyncDataDto> syncDataList, String userId, String version, String deviceId, String uploadVersion) {

        logger.debug("DEBUG++ version : " + version + ", uploadversion : " + uploadVersion); // 席理加增加
        List<GtdSyncVersionEntity> syncVersion = new ArrayList<>();
        List<GtdSyncVersionEntity> latestDataList = gtdSyncVersionRepository.compareToHighVersion(userId, version);

        int count = 0;
        String tableName = "";
        List<SyncTableData> dataList;

        for (SyncDataDto sdd : syncDataList) {

            tableName = sdd.getTableName();
            dataList = takeOutData(latestDataList, tableName, sdd.getDataList());
            count += dataList.size();
            switch (tableName) {
                case "GTD_B":       //联系人表
                    logger.debug("======== 联系人表上传更新开始 =======");
                    List<GtdPlayerEntity> tablePlayerList = new ArrayList<>();
                    List<GtdPlayerEntity> deletePlayerList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdPlayerEntity playerEntity = SyncGetOrSetMethod.playerDtoToEntity(std);                   //提取对应数据
                        if (isDelete(std.getAction())) deletePlayerList.add(playerEntity);                      //删除操作
                        else tablePlayerList.add(playerEntity);                                                 //创建或更新操作

                        if (playerEntity != null) { // 席理加增加
                        	logger.debug("DEBUG++ " + playerEntity.getCreateId() + " -> " + playerEntity.getPlayerId() + " : " + playerEntity.getPlayerAnotherName() + " <-> " + playerEntity.getPlayerFlag());
                        }

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));          //填入入库版本表list

                    }
                    logger.debug("-------- 联系人表数据删除 " + deletePlayerList.size() + " 条 -------");
                    gtdPlayerRepository.deleteAll(deletePlayerList);
                    logger.debug("-------- 联系人表数据更新 " + tablePlayerList.size() + " 条  -------");
                    gtdPlayerRepository.saveAll(tablePlayerList);
                    logger.debug("======== 联系人表上传更新完成 =======");
                    break;
                case "GTD_B_X":     //群组表
                    logger.debug("======== 群组表上传更新开始 =======");
                    List<GtdPlayerMemberEntity> tableMemberList = new ArrayList<>();
                    List<GtdPlayerMemberEntity> deleteMemberList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdPlayerMemberEntity memberEntity = SyncGetOrSetMethod.memberDtoToEntity(std, userId);
                        if (isDelete(std.getAction())) deleteMemberList.add(memberEntity);
                        else tableMemberList.add(memberEntity);

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 群组表数据删除 " + deleteMemberList.size() + " 条 -------");
                    gtdPlayerMemberRepository.deleteAll(deleteMemberList);
                    logger.debug("-------- 群组表数据更新 " + tableMemberList.size() + " 条  -------");
                    gtdPlayerMemberRepository.saveAll(tableMemberList);
                    logger.debug("======== 群组表上传更新完成 =======");
                    break;
                case "GTD_C":       //日程表
                    logger.debug("======== 日程表上传更新开始 =======");
                    List<GtdScheduleEntity> tableScheduleList = new ArrayList<>();
                    List<GtdScheduleEntity> deleteScheduleList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        if (userId.equals(std.getTableD())) {
                            GtdScheduleEntity scheduleEntity = SyncGetOrSetMethod.scheduleDtoToEntity(std);
                            if (isDelete(std.getAction())) deleteScheduleList.add(scheduleEntity);
                            else tableScheduleList.add(scheduleEntity);
                        }

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 群组表数据删除 " + deleteScheduleList.size() + " 条 -------");
                    gtdScheduleRepository.deleteAll(deleteScheduleList);
                    logger.debug("-------- 群组表数据更新 " + tableScheduleList.size() + " 条  -------");
                    gtdScheduleRepository.saveAll(tableScheduleList);
                    logger.debug("======== 日程表上传更新完成 =======");
                    break;
                case "GTD_D":       //日程参与人表
                    logger.debug("======== 日程参与人表上传更新开始 =======");
                    List<GtdExecuteEntity> tableExecuteList = new ArrayList<>();
                    List<GtdExecuteEntity> deleteExecuteList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdExecuteEntity executeEntity = SyncGetOrSetMethod.executeDtoToEntity(std, userId);
                        if (isDelete(std.getAction())) deleteExecuteList.add(executeEntity);
                        else tableExecuteList.add(executeEntity);

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 日程参与人表数据删除 " + deleteExecuteList.size() + " 条 -------");
                    gtdExecuteRepository.deleteAll(deleteExecuteList);
                    logger.debug("-------- 日程参与人表数据更新 " + tableExecuteList.size() + " 条  -------");
                    gtdExecuteRepository.saveAll(tableExecuteList);
                    logger.debug("======== 日程参与人表上传更新完成 =======");
                    break;
                case "GTD_H":       //计划表
                    logger.debug("======== 计划表上传更新开始 =======");
                    List<GtdPlanEntity> tablePlanList = new ArrayList<>();
                    List<GtdPlanEntity> deletePlanList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdPlanEntity planEntity = SyncGetOrSetMethod.planDtoToEntity(std);
                        if (isDelete(std.getAction())) deletePlanList.add(planEntity);
                        else tablePlanList.add(planEntity);

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 计划表数据删除 " + deletePlanList.size() + " 条 -------");
                    gtdPlanRepository.deleteAll(deletePlanList);
                    logger.debug("-------- 计划表数据更新 " + tablePlanList.size() + " 条  -------");
                    gtdPlanRepository.saveAll(tablePlanList);
                    logger.debug("======== 计划表上传更新完成 =======");
                    break;
                case "GTD_C_RC":        //日程子表（日程）
                    logger.debug("======== 日程子表（日程）上传更新开始 =======");
                    List<GtdScheduleAEntity> tableScheduleAList = new ArrayList<>();
                    List<GtdScheduleAEntity> deleteScheduleAList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdScheduleAEntity scheduleAEntity = SyncGetOrSetMethod.scheduleADtoToEntity(std);
                        if (isDelete(std.getAction())) deleteScheduleAList.add(scheduleAEntity);
                        else tableScheduleAList.add(scheduleAEntity);

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 日程子表（日程）数据删除 " + deleteScheduleAList.size() + " 条 -------");
                    gtdScheduleARepository.deleteAll(deleteScheduleAList);
                    logger.debug("-------- 日程子表（日程）数据更新 " + tableScheduleAList.size() + " 条  -------");
                    gtdScheduleARepository.saveAll(tableScheduleAList);
                    logger.debug("======== 日程子表（日程）上传更新完成 =======");
                    break;
                case "GTD_C_C":        //日程子表（日常生活）
                    logger.debug("======== 日程子表（日常生活）上传更新开始 =======");
                    List<GtdScheduleBEntity> tableScheduleBList = new ArrayList<>();
                    List<GtdScheduleBEntity> deleteScheduleBList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdScheduleBEntity scheduleBEntity = SyncGetOrSetMethod.scheduleBDtoToEntity(std);
                        if (isDelete(std.getAction())) deleteScheduleBList.add(scheduleBEntity);
                        else tableScheduleBList.add(scheduleBEntity);

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 日程子表（日常生活）数据删除 " + deleteScheduleBList.size() + " 条 -------");
                    gtdScheduleBRepository.deleteAll(deleteScheduleBList);
                    logger.debug("-------- 日程子表（日常生活）数据更新 " + tableScheduleBList.size() + " 条  -------");
                    gtdScheduleBRepository.saveAll(tableScheduleBList);
                    logger.debug("======== 日程子表（日常生活）上传更新完成 =======");
                    break;
                case "GTD_C_BO":        //日程子表（任务）
                    logger.debug("======== 日程子表（任务）上传更新开始 =======");
                    List<GtdScheduleCEntity> tableScheduleCList = new ArrayList<>();
                    List<GtdScheduleCEntity> deleteScheduleCList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdScheduleCEntity scheduleCEntity = SyncGetOrSetMethod.scheduleCDtoToEntity(std);
                        if (isDelete(std.getAction())) deleteScheduleCList.add(scheduleCEntity);
                        else tableScheduleCList.add(scheduleCEntity);

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 日程子表（任务）数据删除 " + deleteScheduleCList.size() + " 条 -------");
                    gtdScheduleCRepository.deleteAll(deleteScheduleCList);
                    logger.debug("-------- 日程子表（任务）数据更新 " + tableScheduleCList.size() + " 条  -------");
                    gtdScheduleCRepository.saveAll(tableScheduleCList);
                    logger.debug("======== 日程子表（任务）上传更新完成 =======");
                    break;
                case "GTD_C_JN":         //日程子表（纪念日）
                    logger.debug("======== 日程子表（纪念日）上传更新开始 =======");
                    List<GtdScheduleDEntity> tableScheduleDList = new ArrayList<>();
                    List<GtdScheduleDEntity> deleteScheduleDList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdScheduleDEntity scheduleDEntity = SyncGetOrSetMethod.scheduleDDtoToEntity(std);
                        if (isDelete(std.getAction())) deleteScheduleDList.add(scheduleDEntity);
                        else tableScheduleDList.add(scheduleDEntity);

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 日程子表（纪念日）数据删除 " + deleteScheduleDList.size() + " 条 -------");
                    gtdScheduleDRepository.deleteAll(deleteScheduleDList);
                    logger.debug("-------- 日程子表（纪念日）数据更新 " + tableScheduleDList.size() + " 条  -------");
                    gtdScheduleDRepository.saveAll(tableScheduleDList);
                    logger.debug("======== 日程子表（纪念日）上传更新完成 =======");
                    break;
                case "GTD_C_MO":        //日程子表（备忘录）
                    logger.debug("======== 日程子表（备忘录）上传更新开始 =======");
                    List<GtdScheduleEEntity> tableScheduleEList = new ArrayList<>();
                    List<GtdScheduleEEntity> deleteScheduleEList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdScheduleEEntity scheduleEEntity = SyncGetOrSetMethod.scheduleEDtoToEntity(std);
                        if (isDelete(std.getAction())) deleteScheduleEList.add(scheduleEEntity);
                        else tableScheduleEList.add(scheduleEEntity);

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 日程子表（备忘录）数据删除 " + deleteScheduleEList.size() + " 条 -------");
                    gtdScheduleERepository.deleteAll(deleteScheduleEList);
                    logger.debug("-------- 日程子表（备忘录）数据更新 " + tableScheduleEList.size() + " 条  -------");
                    gtdScheduleERepository.saveAll(tableScheduleEList);
                    logger.debug("======== 日程子表（备忘录）上传更新完成 =======");
                    break;
                case "GTD_A":         //用户表
                    logger.debug("======== 用户表上传更新开始 =======");
                    List<GtdUserEntity> tableUserList = new ArrayList<>();
                    List<GtdUserEntity> deleteUserList = new ArrayList<>();
                    for (SyncTableData std: dataList) {

                        GtdUserEntity userEntity = SyncGetOrSetMethod.userDtoToEntity(std);
                        if (isDelete(std.getAction())) deleteUserList.add(userEntity);
                        else tableUserList.add(userEntity);

                        syncVersion.add(getSyncData(std, userId, version, deviceId, uploadVersion, tableName));                 //填入入库版本表list

                    }
                    logger.debug("-------- 用户表数据删除 " + deleteUserList.size() + " 条 -------");
                    gtdUserRepository.deleteAll(deleteUserList);
                    logger.debug("-------- 用户表数据更新 " + tableUserList.size() + " 条  -------");
                    gtdUserRepository.saveAll(tableUserList);
                    logger.debug("======== 用户表上传更新完成 =======");
                    break;
            }

        }

        logger.debug("保存本次更新数据记录, 版本号["+ uploadVersion + "],共" + count + "条");
        gtdSyncVersionRepository.saveAll(syncVersion);

        return syncVersion;
    }

    /**
     * 下载数据
     */
    private List<SyncDataDto> downLoad(String userId, String deviceId, String version, String downloadSyncVersion) {
        long start = System.currentTimeMillis();

        List<SyncDataDto> syncDataList = new ArrayList<>();
        SyncDataDto syncData;
        List<SyncTableData> dataList;
        SyncTableData data;

        try {

            if (version != null && !version.equals("")) {

                List<GtdSyncVersionEntity> latestDataList = gtdSyncVersionRepository.downLoadSyncData(userId, version, downloadSyncVersion);
                logger.debug("获取本次需要更新数据量为 " + latestDataList.size() + "条");

                List<SyncTableData> playerList = new ArrayList<>();
                List<SyncTableData> memberList = new ArrayList<>();
                List<SyncTableData> scheduleList = new ArrayList<>();
                List<SyncTableData> executeList = new ArrayList<>();
                List<SyncTableData> scheduleAList = new ArrayList<>();
                List<SyncTableData> scheduleBList = new ArrayList<>();
                List<SyncTableData> scheduleCList = new ArrayList<>();
                List<SyncTableData> scheduleDList = new ArrayList<>();
                List<SyncTableData> scheduleEList = new ArrayList<>();
                List<SyncTableData> planList = new ArrayList<>();
                List<SyncTableData> userList = new ArrayList<>();

                List<String> playerIdList = new ArrayList<>();
                List<String> memberIdList = new ArrayList<>();
                List<String> scheduleIdList = new ArrayList<>();
                List<String> executeIdList = new ArrayList<>();
                List<String> scheduleAIdList = new ArrayList<>();
                List<String> scheduleBIdList = new ArrayList<>();
                List<String> scheduleCIdList = new ArrayList<>();
                List<String> scheduleDIdList = new ArrayList<>();
                List<String> scheduleEIdList = new ArrayList<>();
                List<String> planIdList = new ArrayList<>();
                List<String> userIdList = new ArrayList<>();
                
                Map<String, String> playerActionList = new HashMap<>();
                Map<String, String> memberActionList = new HashMap<>();
                Map<String, String> scheduleActionList = new HashMap<>();
                Map<String, String> executeActionList = new HashMap<>();
                Map<String, String> scheduleAActionList = new HashMap<>();
                Map<String, String> scheduleBActionList = new HashMap<>();
                Map<String, String> scheduleCActionList = new HashMap<>();
                Map<String, String> scheduleDActionList = new HashMap<>();
                Map<String, String> scheduleEActionList = new HashMap<>();
                Map<String, String> planActionList = new HashMap<>();
                Map<String, String> userActionList = new HashMap<>();

                for (GtdSyncVersionEntity gsve : latestDataList) {
                    switch (gsve.getTableName()) {
                        case "GTD_B":       //联系人表
                            logger.debug("======== 联系人表下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                playerList.add(data);
                            } else {
                            	playerIdList.add(gsve.getTableId());
                            	playerActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdPlayerEntity playerEntity = gtdPlayerRepository.findById(gsve.getTableId());
//                                if (playerEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.playerEntityToDto(playerEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    playerList.add(data);
//                                }
                            }
                            break;
                        case "GTD_B_X":     //群组表
                            logger.debug("======== 群组表下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                memberList.add(data);
                            } else {
                                memberIdList.add(gsve.getTableId());
                                memberActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdPlayerMemberEntity memberEntity = gtdPlayerMemberRepository.findById(gsve.getTableId());
//                                if (memberEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.memberEntityToDto(memberEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    memberList.add(data);
//                                }
                            }
                            break;
                        case "GTD_C":       //日程表
                            logger.debug("======== 日程表下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                scheduleList.add(data);
                            } else {
                            	scheduleIdList.add(gsve.getTableId());
                            	scheduleActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdScheduleEntity scheduleEntity = gtdScheduleRepository.findByScheduleId(gsve.getTableId());
//                                if (scheduleEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.scheduleEntityToDto(scheduleEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    scheduleList.add(data);
//                                }
                            }
                            break;
                        case "GTD_D":       //日程参与人表
                            logger.debug("======== 日程参与人表下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                executeList.add(data);
                            } else {
                            	executeIdList.add(gsve.getTableId());
                            	executeActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdExecuteEntity executeEntity = gtdExecuteRepository.findByExecuteId(gsve.getTableId());
//                                if (executeEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.executeEntityToDto(executeEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    executeList.add(data);
//                                }
                            }
                            break;
                        case "GTD_J_H":       //计划表
                            logger.debug("======== 计划表下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                planList.add(data);
                            } else {
                            	planIdList.add(gsve.getTableId());
                            	planActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdPlanEntity planEntity = gtdPlanRepository.findByPlanId(gsve.getTableId());
//                                if (planEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.planEntityToDto(planEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    planList.add(data);
//                                }
                            }
                            break;
                        case "GTD_C_RC":        //日程子表（日程）
                            logger.debug("======== 日程子表（日程）下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                scheduleAList.add(data);
                            } else {
                            	scheduleAIdList.add(gsve.getTableId());
                            	scheduleAActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdScheduleAEntity scheduleAEntity = gtdScheduleARepository.findById(gsve.getTableId());
//                                if (scheduleAEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.scheduleAEntityToDto(scheduleAEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    scheduleAList.add(data);
//                                }
                            }
                            break;
                        case "GTD_C_C":        //日程子表（日常生活）
                            logger.debug("======== 日程子表（日常生活）下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                scheduleBList.add(data);
                            } else {
                            	scheduleBIdList.add(gsve.getTableId());
                            	scheduleBActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdScheduleBEntity scheduleBEntity = gtdScheduleBRepository.findById(gsve.getTableId());
//                                if (scheduleBEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.scheduleBEntityToDto(scheduleBEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    scheduleBList.add(data);
//                                }
                            }
                            break;
                        case "GTD_C_BO":        //日程子表（任务）
                            logger.debug("======== 日程子表（任务）下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                scheduleCList.add(data);
                            } else {
                            	scheduleCIdList.add(gsve.getTableId());
                            	scheduleCActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdScheduleCEntity scheduleCEntity = gtdScheduleCRepository.findById(gsve.getTableId());
//                                if (scheduleCEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.scheduleCEntityToDto(scheduleCEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    scheduleCList.add(data);
//                                }
                            }
                            break;
                        case "GTD_C_JN":         //日程子表（纪念日）
                            logger.debug("======== 日程子表（纪念日）下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                scheduleDList.add(data);
                            } else {
                            	scheduleDIdList.add(gsve.getTableId());
                            	scheduleDActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdScheduleDEntity scheduleDEntity = gtdScheduleDRepository.findById(gsve.getTableId());
//                                if (scheduleDEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.scheduleDEntityToDto(scheduleDEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    scheduleDList.add(data);
//                                }
                            }
                            break;
                        case "GTD_C_MO":        //日程子表（备忘录）
                            logger.debug("======== 日程子表（备忘录）下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                scheduleEList.add(data);
                            } else {
                            	scheduleEIdList.add(gsve.getTableId());
                            	scheduleEActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdScheduleEEntity scheduleEEntity = gtdScheduleERepository.findById(gsve.getTableId());
//                                if (scheduleEEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.scheduleEEntityToDto(scheduleEEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    scheduleEList.add(data);
//                                }
                            }
                            break;
                        case "GTD_A":         //用户表
                            logger.debug("======== 用户表 下载数据 ID[" + gsve.getTableId() + "] =======");
                            data = new SyncTableData();
                            if (gsve.getSyncAction().equals(SYNC_ACTION_DELETE)) {
                                data.setTableA(gsve.getTableId());
                                data.setAction(gsve.getSyncAction());
                                userList.add(data);
                            } else {
                            	userIdList.add(gsve.getTableId());
                            	userActionList.put(gsve.getTableId(), gsve.getSyncAction());
//                                GtdUserEntity userEntity = gtdUserRepository.findByUserId(gsve.getTableId());
//                                if (userEntity != null) { // 席理加增加
//                                    data = SyncGetOrSetMethod.userEntityToDto(userEntity);
//                                    data.setAction(gsve.getSyncAction());
//                                    userList.add(data);
//                                }
                            }
                            break;
                    }
                }
                

                if (playerIdList != null && !playerIdList.isEmpty()) {
	                List<GtdPlayerEntity> playerEntitylist = gtdPlayerRepository.findByIds(playerIdList);
	                if (playerEntitylist != null && !playerEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdPlayerEntity playerEntity : playerEntitylist) {
	                        data = SyncGetOrSetMethod.playerEntityToDto(playerEntity);
	                        data.setAction(playerActionList.get(playerEntity.getId()));
	                        playerList.add(data);
	                    }
	                }
                }
                
                if (memberIdList != null && !memberIdList.isEmpty()) {
	                List<GtdPlayerMemberEntity> memberEntitylist = gtdPlayerMemberRepository.findByIds(memberIdList);
	                if (memberEntitylist != null && !memberEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdPlayerMemberEntity memberEntity : memberEntitylist) {
	                        data = SyncGetOrSetMethod.memberEntityToDto(memberEntity);
	                        data.setAction(memberActionList.get(memberEntity.getId()));
	                        memberList.add(data);
	                    }
	                }
                }
                
                if (scheduleIdList != null && !scheduleIdList.isEmpty()) {
	                List<GtdScheduleEntity> scheduleEntitylist = gtdScheduleRepository.findByScheduleIds(scheduleIdList);
	                if (scheduleEntitylist != null && !scheduleEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdScheduleEntity scheduleEntity : scheduleEntitylist) {
	                        data = SyncGetOrSetMethod.scheduleEntityToDto(scheduleEntity);
	                        data.setAction(scheduleActionList.get(scheduleEntity.getScheduleId()));
	                        scheduleList.add(data);
	                    }
	                }
                }

                if (executeIdList != null && !executeIdList.isEmpty()) {
	                List<GtdExecuteEntity> executeEntitylist = gtdExecuteRepository.findByExecuteIds(executeIdList);
	                if (executeEntitylist != null && !executeEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdExecuteEntity executeEntity : executeEntitylist) {
	                        data = SyncGetOrSetMethod.executeEntityToDto(executeEntity);
	                        data.setAction(executeActionList.get(executeEntity.getExecuteId()));
	                        executeList.add(data);
	                    }
	                }
                }

                if (planIdList != null && !planIdList.isEmpty()) {
	                List<GtdPlanEntity> planEntitylist = gtdPlanRepository.findByPlanIds(planIdList);
	                if (planEntitylist != null && !planEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdPlanEntity planEntity : planEntitylist) {
	                        data = SyncGetOrSetMethod.planEntityToDto(planEntity);
	                        data.setAction(planActionList.get(planEntity.getPlanId()));
	                        executeList.add(data);
	                    }
	                }
                }

                if (scheduleAIdList != null && !scheduleAIdList.isEmpty()) {
	                List<GtdScheduleAEntity> scheduleAEntitylist = gtdScheduleARepository.findByIds(scheduleAIdList);
	                if (scheduleAEntitylist != null && !scheduleAEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdScheduleAEntity scheduleAEntity : scheduleAEntitylist) {
	                        data = SyncGetOrSetMethod.scheduleAEntityToDto(scheduleAEntity);
	                        data.setAction(scheduleAActionList.get(scheduleAEntity.getId()));
	                        scheduleAList.add(data);
	                    }
	                }
                }

                if (scheduleBIdList != null && !scheduleBIdList.isEmpty()) {
	                List<GtdScheduleBEntity> scheduleBEntitylist = gtdScheduleBRepository.findByIds(scheduleBIdList);
	                if (scheduleBEntitylist != null && !scheduleBEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdScheduleBEntity scheduleBEntity : scheduleBEntitylist) {
	                        data = SyncGetOrSetMethod.scheduleBEntityToDto(scheduleBEntity);
	                        data.setAction(scheduleBActionList.get(scheduleBEntity.getId()));
	                        scheduleBList.add(data);
	                    }
	                }
                }

                if (scheduleCIdList != null && !scheduleCIdList.isEmpty()) {
	                List<GtdScheduleCEntity> scheduleCEntitylist = gtdScheduleCRepository.findByIds(scheduleCIdList);
	                if (scheduleCEntitylist != null && !scheduleCEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdScheduleCEntity scheduleCEntity : scheduleCEntitylist) {
	                        data = SyncGetOrSetMethod.scheduleCEntityToDto(scheduleCEntity);
	                        data.setAction(scheduleCActionList.get(scheduleCEntity.getId()));
	                        scheduleCList.add(data);
	                    }
	                }
                }

                if (scheduleDIdList != null && !scheduleDIdList.isEmpty()) {
	                List<GtdScheduleDEntity> scheduleDEntitylist = gtdScheduleDRepository.findByIds(scheduleDIdList);
	                if (scheduleDEntitylist != null && !scheduleDEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdScheduleDEntity scheduleDEntity : scheduleDEntitylist) {
	                        data = SyncGetOrSetMethod.scheduleDEntityToDto(scheduleDEntity);
	                        data.setAction(scheduleDActionList.get(scheduleDEntity.getId()));
	                        scheduleDList.add(data);
	                    }
	                }
                }

                if (scheduleEIdList != null && !scheduleEIdList.isEmpty()) {
	                List<GtdScheduleEEntity> scheduleEEntitylist = gtdScheduleERepository.findByIds(scheduleEIdList);
	                if (scheduleEEntitylist != null && !scheduleEEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdScheduleEEntity scheduleEEntity : scheduleEEntitylist) {
	                        data = SyncGetOrSetMethod.scheduleEEntityToDto(scheduleEEntity);
	                        data.setAction(scheduleEActionList.get(scheduleEEntity.getId()));
	                        scheduleDList.add(data);
	                    }
	                }
                }

                if (userIdList != null && !userIdList.isEmpty()) {
	                List<GtdUserEntity> userEntitylist = gtdUserRepository.findByUserIds(userIdList);
	                if (userEntitylist != null && !userEntitylist.isEmpty()) { // 席理加增加
	                    for (GtdUserEntity userEntity : userEntitylist) {
	                        data = SyncGetOrSetMethod.userEntityToDto(userEntity);
	                        data.setAction(userActionList.get(userEntity.getUserId()));
	                        userList.add(data);
	                    }
	                }
                }

                logger.debug("======== [查询下载完成 开始整合] =======");
                logger.debug("-------- 添加联系人表数据 数据量:" + playerList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.PLAYER.tableName);
                syncData.setDataList(playerList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加联系人群组表数据 数据量:" + memberList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.PLAYER_MEMBER.tableName);
                syncData.setDataList(memberList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加日程表数据 数据量:" + scheduleList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.SCHEDULE.tableName);
                syncData.setDataList(scheduleList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加日程参与人表数据 数据量:" + executeList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.EXECUTE.tableName);
                syncData.setDataList(executeList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加日程子表（日程）数据 数据量:" + scheduleAList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_A.tableName);
                syncData.setDataList(scheduleAList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加日程子表（日常生活）数据 数据量:" + scheduleBList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_B.tableName);
                syncData.setDataList(scheduleBList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加日程子表（任务）数据 数据量:" + scheduleCList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_C.tableName);
                syncData.setDataList(scheduleCList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加日程子表（纪念日）数据 数据量:" + scheduleDList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_D.tableName);
                syncData.setDataList(scheduleDList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加日程子表（备忘录）数据 数据量:" + scheduleEList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_E.tableName);
                syncData.setDataList(scheduleEList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加计划表数据 数据量:" + planList.size() + " -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.PLAN.tableName);
                syncData.setDataList(planList);
                syncDataList.add(syncData);

                logger.debug("-------- 添加用户表数据 -------");
                syncData = new SyncDataDto();
                syncData.setTableName(SyncTableNameEnum.USER.tableName);
                syncData.setDataList(userList);
                syncDataList.add(syncData);

            } else  {
                logger.debug("======== [开始下载 " + userId + " 全部数据] =======");

                //联系人表
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdPlayerEntity> playerEntityList = gtdPlayerRepository.findAllByUserId(userId);   //联系人数据
                logger.debug("获取联系人表数据，需要转化数据量为 " + playerEntityList.size() + "条");
                for (GtdPlayerEntity gpe: playerEntityList) {
                    data = SyncGetOrSetMethod.playerEntityToDto(gpe);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.PLAYER.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("联系人表数据赋值完成");

                //联系人群组表
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdPlayerMemberEntity> playerMemberEntityList = gtdPlayerMemberRepository.findAllByUserId(userId);
                logger.debug("获取联系人群组表数据，需要转化数据量为 " + playerMemberEntityList.size() + "条");
                for (GtdPlayerMemberEntity gpme: playerMemberEntityList) {
                    data = SyncGetOrSetMethod.memberEntityToDto(gpme);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.PLAYER_MEMBER.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("联系人群组表数据赋值完成");

                //日程表
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdScheduleEntity> scheduleEntityList = gtdScheduleRepository.findAllByUserId(userId);
                logger.debug("获取日程表数据，需要转化数据量为 " + playerMemberEntityList.size() + "条");
                for (GtdScheduleEntity gse: scheduleEntityList) {
                    data = SyncGetOrSetMethod.scheduleEntityToDto(gse);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.SCHEDULE.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("日程表数据赋值完成");

                //日程参与人表
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdExecuteEntity> executeEntityList = gtdExecuteRepository.findAllByUserId(userId);
                logger.debug("获取日程参与人表数据，需要转化数据量为 " + executeEntityList.size() + "条");
                for (GtdExecuteEntity gee: executeEntityList) {
                    data = SyncGetOrSetMethod.executeEntityToDto(gee);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.EXECUTE.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("日程参与人表数据赋值完成");

                //日程子表（日程）
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdScheduleAEntity> scheduleAEntityList = gtdScheduleARepository.findAllByUserId(userId);
                logger.debug("获取日程子表（日程）数据，需要转化数据量为 " + scheduleAEntityList.size() + "条");
                for (GtdScheduleAEntity gsaa: scheduleAEntityList) {
                    data = SyncGetOrSetMethod.scheduleAEntityToDto(gsaa);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_A.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("日程子表（日程）数据赋值完成");

                //日程子表（日常生活）
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdScheduleBEntity> scheduleBEntityList = gtdScheduleBRepository.findAllByUserId(userId);
                logger.debug("获取日程子表（日常生活）数据，需要转化数据量为 " + scheduleBEntityList.size() + "条");
                for (GtdScheduleBEntity gsbe: scheduleBEntityList) {
                    data = SyncGetOrSetMethod.scheduleBEntityToDto(gsbe);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_B.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("日程子表（日常生活）数据赋值完成");

                //日程子表（任务）
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdScheduleCEntity> scheduleCEntityList = gtdScheduleCRepository.findAllByUserId(userId);
                logger.debug("获取日程子表（任务）数据，需要转化数据量为 " + scheduleCEntityList.size() + "条");
                for (GtdScheduleCEntity gsce: scheduleCEntityList) {
                    data = SyncGetOrSetMethod.scheduleCEntityToDto(gsce);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_C.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("日程子表（任务）数据赋值完成");

                //日程子表（纪念日）
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdScheduleDEntity> scheduleDEntityList = gtdScheduleDRepository.findAllByUserId(userId);
                logger.debug("获取日程子表（纪念日）数据，需要转化数据量为 " + scheduleDEntityList.size() + "条");
                for (GtdScheduleDEntity gsde: scheduleDEntityList) {
                    data = SyncGetOrSetMethod.scheduleDEntityToDto(gsde);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_D.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("日程子表（纪念日）数据赋值完成");

                //日程子表（备忘录）
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdScheduleEEntity> scheduleEEntityList = gtdScheduleERepository.findAllByUserId(userId);
                logger.debug("获取日程子表（备忘录）数据，需要转化数据量为 " + scheduleEEntityList.size() + "条");
                for (GtdScheduleEEntity gsee: scheduleEEntityList) {
                    data = SyncGetOrSetMethod.scheduleEEntityToDto(gsee);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.SCHEDULE_E.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("日程子表（备忘录）数据赋值完成");

                //计划表
                syncData = new SyncDataDto();
                dataList = new ArrayList<>();
                List<GtdPlanEntity> planEntityList = gtdPlanRepository.findAllByUserId(userId);
                logger.debug("获取计划表数据，需要转化数据量为 " + planEntityList.size() + "条");
                for (GtdPlanEntity gpe: planEntityList) {
                    data = SyncGetOrSetMethod.planEntityToDto(gpe);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.PLAN.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("计划表数据赋值完成");

                logger.debug("======== [用户" + userId + " 全部数据下载完成] =======");
            }

        } catch (Exception e) {
            logger.error("查询下载数据异常", e); // 席理加修改
            return null;
        }
        long cost = System.currentTimeMillis() - start;
        logger.debug("DEBUG++ download cost time " + cost / 1000);
        
        return syncDataList;
    }

    /**
     * 获取服务端最新更新版本号
     * @param userId
     * @return 库存版本号 ： 生成版本号
     */
    private String findLatestVersion(String userId) {
        Object obj = syncRepository.findLatestVersion(userId);
        return obj != null? String.valueOf(obj): "";
    }

    /**
     * 判断是否为删除操作
     * @param action
     * @return
     */
    private boolean isDelete(String action) {
        return action.equals("2");
    }

    /**
     * 判断是否为更新操作
     * @param action
     * @return
     */
    private boolean isUpdate(String action) {
        return action.equals("1");
    }

    /**
     * 分类取版本更新数据
     * @param latestDataList
     * @param tableName
     * @return
     */
    private List<SyncTableData> takeOutData(List<GtdSyncVersionEntity> latestDataList, String tableName, List<SyncTableData> dataList) {
        List<SyncTableData> newDataList = new ArrayList<>();
        newDataList.addAll(dataList);

        List<GtdSyncVersionEntity> dataCompare = new ArrayList<>();
        for (GtdSyncVersionEntity gsve : latestDataList) {
            if (tableName.equals(gsve.getTableName())) dataCompare.add(gsve);
        }
        logger.debug(tableName + "表更新数据有 " + dataCompare.size() + "条");

        for (SyncTableData std: dataList) {
            for (GtdSyncVersionEntity gsve : dataCompare) {
                logger.debug(gsve.getTableId() + " ?= " + std.getTableA() + " and " + gsve.getSyncAction() + " is delete?"); // 席理加增加
                if (gsve.getTableId().equals(std.getTableA()) && !isDelete(gsve.getSyncAction()) && !isUpdate(gsve.getSyncAction())) { // 席理加修改
                    newDataList.remove(std);      //匹配到对应id且不为删除数据就跳过不更新取最高版本
                    logger.debug(tableName + "表 数据[ID: " + gsve.getTableId() + "] 以高版本未删除操作为优先不做更新");
                    break;
                }
            }
        }

        return newDataList;
    }

    /**
     * 获取同步数据
     * @return
     */
    private GtdSyncVersionEntity getSyncData(SyncTableData std, String userId, String version, String deviceId, String uploadVersion, String tableName) {
        GtdSyncVersionEntity syncVersionEntity = new GtdSyncVersionEntity();

        syncVersionEntity.setTableId(std.getTableA());
        syncVersionEntity.setTableName(tableName);
        syncVersionEntity.setDeviceId(deviceId);
        syncVersionEntity.setUserId(userId);
        syncVersionEntity.setSyncAction(std.getAction());
        syncVersionEntity.setCreateId(userId);
        syncVersionEntity.setCreateDate(BaseUtil.getSqlDate());
        syncVersionEntity.setVersion(uploadVersion);

        return syncVersionEntity;
    }
}
