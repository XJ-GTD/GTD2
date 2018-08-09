package com.manager.master.controller;

import com.manager.master.dto.BaseOutDto;
import com.manager.master.dto.FocusInDto;
import com.manager.master.dto.ScheduleOutDto;
import com.manager.master.service.IFocusService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * create by zy on 2018/05/10.
 * 个人关注
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/focus")
public class FocusController {


    private Logger logger = LogManager.getLogger(this.getClass());
    @Autowired
    IFocusService focusService;
    /**
     * 单条日程查询
     * @param InDto
     * @return
     */
    @RequestMapping(value = "/createFocus", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto createFocus(@RequestBody FocusInDto InDto){

        BaseOutDto outBean = new BaseOutDto();
        Map<String, FocusInDto> data = new HashMap<>();
        focusService.createFocus(InDto);


        outBean.setData(data);
        outBean.setCode("0");
        outBean.setMessage("[添加成功]");
        logger.info("[添加成功]"+ data);


        return outBean;
    }

}
