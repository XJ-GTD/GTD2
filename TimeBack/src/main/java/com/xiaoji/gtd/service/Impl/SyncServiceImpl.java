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
        String version = "";

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

        List<SyncDataDto> syncDataList = inDto.getSyncDataList();
        String userId = inDto.getUserId();
        String deviceId = inDto.getDeviceId();
        String version = inDto.getVersion();
        String uploadVersion = BaseUtil.getVersion();

        String downloadSyncVersion = findLatestVersion(userId);
        logger.debug("服务器最新数据版本号:" + downloadSyncVersion);

        String tableName = "";
        List<SyncTableData> dataList;
        List<GtdSyncVersionEntity> syncVersionList = new ArrayList<>();

        if (syncDataList != null && syncDataList.size() > 0) { //需要上传数据
            logger.debug("=========== 上传数据开始 ===========");
            for (SyncDataDto sdd: syncDataList) {
                tableName = sdd.getTableName();
                dataList = sdd.getDataList();
                logger.debug("上传"+ tableName + "表数据， 数据大小：" + dataList.size());

                List<GtdSyncVersionEntity> latestSyncData = upLoadData(tableName, dataList, userId, version, deviceId, uploadVersion);
                syncVersionList.addAll(latestSyncData);
            }
            logger.debug("保存本次更新数据记录, 版本号["+ uploadVersion + "],共" + syncVersionList.size() + "条");
            gtdSyncVersionRepository.saveAll(syncVersionList);

            logger.debug("=========== 上传数据结束 ===========");
        } else { //仅需要下载更新
            logger.debug("=========== 下载数据开始 ===========");
            logger.debug("=========== 下载数据结束 ===========");
        }

        return null;
    }

    /**
     * 上传的数据
     * @param tableName
     * @param dataList
     */
    private List<GtdSyncVersionEntity> upLoadData(String tableName, List<SyncTableData> dataList, String userId, String version, String deviceId, String uploadVersion) {

        List<GtdSyncVersionEntity> syncVersion = new ArrayList<>();

        switch (tableName) {
            case "GTD_B":       //联系人表
                List<GtdPlayerEntity> tableDataList = new ArrayList<>();
                List<String> ids = new ArrayList<>();
                GtdPlayerEntity playerEntity = new GtdPlayerEntity();
                for (SyncTableData std: dataList) {
                    ids.add(std.getTableA());
                    playerEntity = SyncGetOrSetMethod.dtoToEntity(std);

                    tableDataList.add(playerEntity);
                }

                List<String> sqlIds = syncRepository.compareToHighVersion(version, userId, ids);
                List<GtdPlayerEntity> syncDataList = new ArrayList<>();
                for (GtdPlayerEntity gpe: tableDataList) {
                    for (String sqlId : sqlIds) {
                        if (gpe.getId().equals(sqlId)) {            //匹配到对应id就跳过不更新
                            tableDataList.remove(gpe);
                            break;
                        }
                    }
                    GtdSyncVersionEntity syncVersionEntity = new GtdSyncVersionEntity();
                    syncVersionEntity.setTableId(gpe.getId());
                    syncVersionEntity.setTableName(tableName);
                    syncVersionEntity.setDeviceId(deviceId);
                    syncVersionEntity.setCreateId(userId);
                    syncVersionEntity.setCreateDate(BaseUtil.getSqlDate());
                    syncVersionEntity.setVersion(uploadVersion);
                    syncVersion.add(syncVersionEntity);                 //填入入库版本表list

                    syncDataList.add(gpe);                              //填入入库联系人list
                }
                gtdPlayerRepository.saveAll(syncDataList);
                break;
            case "GTD_B_X":     //群组表
                GtdPlayerMemberEntity playerMemberEntity = new GtdPlayerMemberEntity();
                for (SyncTableData std: dataList) {

                    playerMemberEntity = new GtdPlayerMemberEntity();
                }
                break;
            case "GTD_C":       //日程表
                GtdScheduleEntity scheduleEntity = new GtdScheduleEntity();
                for (SyncTableData std: dataList) {

                    scheduleEntity = new GtdScheduleEntity();
                }
                break;
            case "GTD_D":       //日程参与人表
                GtdExecuteEntity executeEntity = new GtdExecuteEntity();
                for (SyncTableData std: dataList) {

                    executeEntity = new GtdExecuteEntity();
                }
                break;
            case "GTD_H":       //计划表
                GtdPlanEntity planEntity = new GtdPlanEntity();
                for (SyncTableData std: dataList) {

                    planEntity = new GtdPlanEntity();
                }
                break;
            case "GTD_C_A":     //本地日历表
                GtdLocalScheduleEntity localScheduleEntity = new GtdLocalScheduleEntity();
                for (SyncTableData std: dataList) {

                    localScheduleEntity = new GtdLocalScheduleEntity();
                }
                break;
        }

        return syncVersion;
    }

    /**
     * 下载数据
     */
    private List<SyncDataDto> downLoad(String userId, String deviceId, String version) {
        List<SyncDataDto> syncDataList = new ArrayList<>();
        SyncDataDto syncData = new SyncDataDto();
        List<SyncTableData> dataList = new ArrayList<>();
        SyncTableData data;

        try {

            if (version != null && !version.equals("")) {

            } else  {
                List<GtdPlayerEntity> playerEntityList = gtdPlayerRepository.findAllByUserId(userId);   //联系人数据
                logger.debug("获取联系人表数据，需要转化数据量为 " + playerEntityList.size() + "条");
                for (GtdPlayerEntity gpe: playerEntityList) {
                    data = SyncGetOrSetMethod.entityToDto(gpe);

                    dataList.add(data);
                }
                syncData.setTableName(SyncTableNameEnum.PLAYER.tableName);
                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("联系人表数据赋值完成");

                syncData = new SyncDataDto();
                List<GtdPlayerMemberEntity> playerMemberEntityList = gtdPlayerMemberRepository.findAllByUserId(userId);
                logger.debug("获取联系人群组表数据，需要转化数据量为 " + playerMemberEntityList.size() + "条");
                syncData.setTableName(SyncTableNameEnum.PLAYER_MEMBER.tableName);

                syncData.setDataList(dataList);
                syncDataList.add(syncData);
                logger.debug("联系人群组表数据赋值完成");
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
        Object[] obj = (Object[]) syncRepository.findLatestVersion(userId);
        return obj != null? String.valueOf(obj[0]): BaseUtil.getVersion();
    }

}
