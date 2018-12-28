package com.xiaoji.gtd.service.Impl;

import com.xiaoji.config.exception.ServiceException;
import com.xiaoji.gtd.dto.sync.*;
import com.xiaoji.gtd.entity.GtdDictionaryDataEntity;
import com.xiaoji.gtd.entity.GtdDictionaryEntity;
import com.xiaoji.gtd.entity.GtdLabelEntity;
import com.xiaoji.gtd.repository.GtdDictionaryDataRepository;
import com.xiaoji.gtd.repository.GtdDictionaryRepository;
import com.xiaoji.gtd.repository.GtdLabelRepository;
import com.xiaoji.gtd.service.ISyncService;
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
    private GtdLabelRepository labelRepository;

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
        return null;
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

        String tableName = "";
        List<SyncTableData> dataList;

        if (syncDataList != null && syncDataList.size() > 0) { //需要上传数据
            for (SyncDataDto sdd: syncDataList) {
                tableName = sdd.getTableName();
                dataList = sdd.getDataList();
                upLoadData(tableName, dataList);
            }
        } else { //仅需要下载更新
        }

        return null;
    }

    //处理需要上传的数据
    private void upLoadData(String tableName, List<SyncTableData> dataList) {

        switch (tableName) {
            case "GTD_B":       //联系人表
                break;
            case "GTD_B_X":     //群组表
                break;
            case "GTD_C":       //日程表
                break;
            case "GTD_D":       //日程参与人表
                break;
            case "GTD_H":       //计划表
                break;
            case "GTD_C_A":     //本地日历表
                break;
        }
    }
}
