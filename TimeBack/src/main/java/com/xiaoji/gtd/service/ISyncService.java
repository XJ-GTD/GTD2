package com.xiaoji.gtd.service;

import com.xiaoji.gtd.dto.sync.SyncInDto;
import com.xiaoji.gtd.dto.sync.SyncOutDto;

/**
 * 同步类接口
 *
 * create by wzy on 2018/11/16.
 */
public interface ISyncService {

    /**
     * 初始化数据同步
     * @return
     */
    SyncOutDto initialSync();

    /**
     * 登陆同步
     * @param inDto
     * @return
     */
    SyncOutDto loginSync(SyncInDto inDto);

    /**
     * 定时同步
     * @param inDto
     * @return
     */
    SyncOutDto timingSync(SyncInDto inDto);
}
