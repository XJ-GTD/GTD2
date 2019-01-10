package com.xiaoji.gtd.controller;

import com.xiaoji.config.interceptor.AuthCheck;
import com.xiaoji.gtd.dto.BaseInDto;
import com.xiaoji.gtd.dto.Out;
import com.xiaoji.gtd.dto.TestPlayerInDto;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.dto.sync.SyncInDto;
import com.xiaoji.gtd.dto.sync.SyncOutDto;
import com.xiaoji.gtd.service.IPersonService;
import com.xiaoji.gtd.service.ISyncService;
import com.xiaoji.util.CommonMethods;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 同步数据类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/sync")
public class SyncController {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final ISyncService syncService;
    private final IPersonService personService;

    @Autowired
    public SyncController(ISyncService syncService, IPersonService personService) {
        this.syncService = syncService;
        this.personService = personService;
    }

    /**
     * app初始化同步
     * @return
     */
    @RequestMapping(value = "/initial_sync", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out initialSync(@RequestBody SyncInDto inDto) {
        Out outDto = new Out();
        SyncOutDto data;

        try {

            data = syncService.initialSync();
            if (data != null) {
                outDto.setData(data);
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("初始化成功");
            } else {
                outDto.setCode(ResultCode.FAIL_INIT);
                logger.debug("初始化成功");
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("初始化数据失败：服务器繁忙");
        }

        return outDto;
    }

    /**
     * 登陆同步
     * @return
     */
    @RequestMapping(value = "/login_sync", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out loginSync(@RequestBody SyncInDto inDto) {
        Out outDto = new Out();
        SyncOutDto data;

        //入参检测
        //非空检测
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_UUID);
            logger.debug("[同步失败]：用户ID不可为空");
            return outDto;
        }
        if(inDto.getDeviceId() == null || "".equals(inDto.getDeviceId())){
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[同步失败]：设备ID不可为空");
            return outDto;
        }
        //入参正确性检测
        if (CommonMethods.checkMySqlReservedWords(inDto.getUserId())) {
            outDto.setCode(ResultCode.ERROR_UUID);
            logger.debug("[同步失败]：用户ID类型或格式错误");
            return outDto;
        }

        //业务逻辑
        try {

            data = syncService.loginSync(inDto);

            if (data != null) {
                outDto.setData(data);
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("[同步成功]");
            } else {
                outDto.setCode(ResultCode.FAIL_SYNC);
                logger.debug("[同步失败]：没有该用户数据");
            }

        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("[同步失败]：服务器繁忙");
        }

        return outDto;
    }

    /**
     * 定时同步
     * @return
     */
    @RequestMapping(value = "/timing_sync", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out timingSync(@RequestBody SyncInDto inDto) {
        Out outDto = new Out();
        SyncOutDto data;

        //入参检测
        //非空检测
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_UUID);
            logger.debug("[定时同步失败]：用户ID不可为空");
            return outDto;
        }
        if(inDto.getDeviceId() == null || "".equals(inDto.getDeviceId())){
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[定时同步失败]：设备ID不可为空");
            return outDto;
        }
        if(inDto.getVersion() == null || "".equals(inDto.getVersion())){
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[定时同步失败]：版本号不可为空");
            return outDto;
        }
        //入参正确性检测
        if (CommonMethods.checkMySqlReservedWords(inDto.getUserId())) {
            outDto.setCode(ResultCode.ERROR_UUID);
            logger.debug("[定时同步失败]：用户ID类型或格式错误");
            return outDto;
        }

        //业务逻辑
        try {
            data = syncService.timingSync(inDto);

            if (data != null) {
                outDto.setData(data);
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("[定时同步成功]");
            } else {
                outDto.setCode(ResultCode.NOT_SYNC);
                logger.debug("[定时同步成功]：暂无可更新数据");
            }

        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("[定时同步失败]：服务器繁忙");
        }

        return outDto;
    }

    /**
     * 定时同步(上传)
     * @return
     */
    @RequestMapping(value = "/timing_upload", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out timingUpload(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

    /**
     * 定时同步(下载)
     * @return
     */
    @RequestMapping(value = "/timing_download", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out timingDownload(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

    /**
     * 参与人数据上传
     *  ！！ 同步方法完成后删除！！！
     * @return
     */
    @RequestMapping(value = "/temporary", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out temporaryPlayer(@RequestBody TestPlayerInDto inDto) {
        Out outDto = new Out();

        if(inDto.getAccountMobile() == null || "".equals(inDto.getAccountMobile())){
            outDto.setCode(ResultCode.FAIL_BUSIC);
            logger.debug("[上传数据失败]");
            return outDto;
        }
        if(inDto.getId() == null || "".equals(inDto.getId())){
            outDto.setCode(ResultCode.FAIL_BUSIC);
            logger.debug("[上传数据失败]");
            return outDto;
        }
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.FAIL_BUSIC);
            logger.debug("[上传数据失败]");
            return outDto;
        }if(inDto.getPlayerId() == null || "".equals(inDto.getPlayerId())){
            outDto.setCode(ResultCode.FAIL_BUSIC);
            logger.debug("[上传数据失败]");
            return outDto;
        }
        if(inDto.getPlayerName() == null || "".equals(inDto.getPlayerName())){
            outDto.setCode(ResultCode.FAIL_BUSIC);
            logger.debug("[上传数据失败]");
            return outDto;
        }

        //业务逻辑
        try {
            int flag = personService.temporaryPlayer(inDto);
            if (flag == 0) {
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("参与人上传数据库成功");
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("参与人上传服务器数据库失败：服务器错误");
        }

        return outDto;
    }
}
