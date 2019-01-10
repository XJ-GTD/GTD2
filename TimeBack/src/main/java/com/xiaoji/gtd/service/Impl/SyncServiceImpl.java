package com.xiaoji.gtd.service.Impl;

import com.sun.org.apache.bcel.internal.generic.IF_ACMPEQ;
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
import java.util.List;

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
        List<SyncDataDto> dataList;

        String userId = inDto.getUserId();
        String deviceId = inDto.getDeviceId();
        String version = "";

        logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] ：开始获取数据");
        dataList = downLoad(userId, deviceId, version);

        if (dataList != null) {
            version = findLatestVersion(userId);
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

        String uploadVersion = BaseUtil.getVersion();
        logger.debug("服务器本次需要上传数据版本号:" + uploadVersion);
        String downloadSyncVersion = findLatestVersion(userId);
        logger.debug("服务器本次需要下载数据版本号:" + downloadSyncVersion);

        List<GtdSyncVersionEntity> syncVersionList = new ArrayList<>();

        if (syncDataList != null && syncDataList.size() > 0) {      //需要上传数据
            logger.debug("=========== 上传数据开始 ===========");

            List<GtdSyncVersionEntity> latestSyncData = upLoadData(syncDataList, userId, version, deviceId, uploadVersion);

            logger.debug("=========== 上传数据结束 ===========");
        } else {        //仅需要下载
            logger.debug("=========== 下载数据开始 ===========");

            logger.debug("用户[" + userId + "] | 设备[" + deviceId + "] ：开始获取数据");
            downLoadDataList = downLoad(userId, deviceId, downloadSyncVersion);

            if (downLoadDataList != null) {
                logger.debug("获取数据成功 version：["+ downloadSyncVersion + "] | data: size = " + downLoadDataList.size());
                outDto.setVersion(version);
                outDto.setUserDataList(downLoadDataList);
            } else {
                logger.debug("下载数据失败：服务器暂无该账号数据!");
                return null;
            }

            logger.debug("=========== 下载数据结束 ===========");
        }

        return outDto;
    }

    /**
     * 上传的数据
     * @param syncDataList
     * @param userId
     */
    private List<GtdSyncVersionEntity> upLoadData(List<SyncDataDto> syncDataList, String userId, String version, String deviceId, String uploadVersion) {

        List<GtdSyncVersionEntity> syncVersion = new ArrayList<>();
        List<GtdSyncVersionEntity> latestDataList = gtdSyncVersionRepository.compareToHighVersion(userId, version);

        String tableName = "";
        List<SyncTableData> dataList;

        for (SyncDataDto sdd : syncDataList) {

            tableName = sdd.getTableName();
            dataList = takeOutData(latestDataList, tableName, sdd.getDataList());
            switch (tableName) {
                case "GTD_B":       //联系人表
                    logger.debug("======== 联系人表上传更新开始 =======");
                    List<GtdPlayerEntity> tableDataList = new ArrayList<>();
                    List<GtdPlayerEntity> deleteDataList = new ArrayList<>();
                    for (SyncTableData std: dataList) {


                        GtdPlayerEntity playerEntity = SyncGetOrSetMethod.playerDtoToEntity(std);
                        if (isDelete(std.getAction())) deleteDataList.add(playerEntity);
                        else tableDataList.add(playerEntity);

                        GtdSyncVersionEntity syncVersionEntity = new GtdSyncVersionEntity();
                        syncVersionEntity.setTableId(std.getTableA());
                        syncVersionEntity.setTableName(tableName);
                        syncVersionEntity.setDeviceId(deviceId);
                        syncVersionEntity.setUserId(userId);
                        syncVersionEntity.setSyncAction(std.getAction());
                        syncVersionEntity.setCreateId(userId);
                        syncVersionEntity.setCreateDate(BaseUtil.getSqlDate());
                        syncVersionEntity.setVersion(uploadVersion);
                        syncVersion.add(syncVersionEntity);                 //填入入库版本表list

                    }
                    logger.debug("-------- 联系人表数据删除 " + deleteDataList.size() + " 条 -------");
                    gtdPlayerRepository.deleteAll(deleteDataList);
                    logger.debug("-------- 联系人表数据更新 " + tableDataList.size() + " 条  -------");
                    gtdPlayerRepository.saveAll(tableDataList);
                    logger.debug("======== 联系人表上传更新完成 =======");
                    break;
//                case "GTD_B_X":     //群组表
//                    logger.debug("======== 群组表上传更新开始 =======");
//                    List<GtdPlayerMemberEntity> memberEntityList = new ArrayList<>();
//                    for (SyncTableData std: dataList) {
//                        GtdPlayerMemberEntity playerMemberEntity = SyncGetOrSetMethod.memberDtoToEntity(std);
//                        memberEntityList.add(playerMemberEntity);
//
//                        GtdSyncVersionEntity syncVersionEntity = new GtdSyncVersionEntity();
//                        syncVersionEntity.setTableId(std.getTableA());
//                        syncVersionEntity.setTableName(tableName);
//                        syncVersionEntity.setDeviceId(deviceId);
//                        syncVersionEntity.setCreateId(userId);
//                        syncVersionEntity.setCreateDate(BaseUtil.getSqlDate());
//                        syncVersionEntity.setVersion(uploadVersion);
//                        syncVersion.add(syncVersionEntity);                 //填入入库版本表list
//                    }
//                    gtdPlayerMemberRepository.saveAll(memberEntityList);
//                    break;
//                case "GTD_C":       //日程表
//                    GtdScheduleEntity scheduleEntity = new GtdScheduleEntity();
//                    for (SyncTableData std: dataList) {
//
//                        scheduleEntity = new GtdScheduleEntity();
//                    }
//                    break;
//                case "GTD_D":       //日程参与人表
//                    GtdExecuteEntity executeEntity = new GtdExecuteEntity();
//                    for (SyncTableData std: dataList) {
//
//                        executeEntity = new GtdExecuteEntity();
//                    }
//                    break;
//                case "GTD_H":       //计划表
//                    GtdPlanEntity planEntity = new GtdPlanEntity();
//                    for (SyncTableData std: dataList) {
//
//                        planEntity = new GtdPlanEntity();
//                    }
//                    break;
//                case "":
//                    break;
            }

        }

        logger.debug("保存本次更新数据记录, 版本号["+ uploadVersion + "],共" + syncVersion.size() + "条");
        gtdSyncVersionRepository.saveAll(syncVersion);

        return syncVersion;
    }

    /**
     * 下载数据
     */
    private List<SyncDataDto> downLoad(String userId, String deviceId, String version) {
        List<SyncDataDto> syncDataList = new ArrayList<>();
        SyncDataDto syncData;
        List<SyncTableData> dataList;
        SyncTableData data;

        try {

            if (version != null && !version.equals("")) {

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
            e.printStackTrace();
            return null;
        }

        return syncDataList;
    }

    /**
     * 获取服务端最新更新版本号
     * @param userId
     * @return 库存版本号 ： 生成版本号
     */
    private String findLatestVersion(String userId) {
        Object obj = syncRepository.findLatestVersion(userId);
        return obj != null? String.valueOf(obj): BaseUtil.getVersion();
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
                if (gsve.getTableId().equals(std.getTableA()) && !isDelete(gsve.getSyncAction())) {
                    newDataList.remove(std);      //匹配到对应id且不为删除数据就跳过不更新取最高版本
                    logger.debug(tableName + "表 数据[ID: " + gsve.getTableId() + "] 以高版本未删除操作为优先不做更新");
                    break;
                }
            }
        }

        return newDataList;
    }

}
