package com.manager.master.controller;

import com.manager.master.dto.BaseOutDto;
import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.service.IGroupService;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 群组Controller
 *
 * create by wzy on 2018/08/24
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/group")
public class GroupController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    IGroupService IGroupService;

    /**
     * 查询所有群组
     */
    @RequestMapping(value = "/findall")
    @ResponseBody
    public BaseOutDto findAll(){
        BaseOutDto outBean = new BaseOutDto();
        Map<String,List<GtdGroupEntity>> map=new HashMap<>();
        List<GtdGroupEntity> list=IGroupService.findAll();
        map.put("1",list);
        if(list.size()!=0){
            outBean.setCode(list.size());
            outBean.setMessage("查询成功");
            outBean.setData(map);
        }else{
            outBean.setCode(400);
            outBean.setMessage("null");
        }
        return outBean;
    }

    /**
     * 根据群组名字查询
     */
    @RequestMapping(value = "/findbygname")
    @ResponseBody
    public BaseOutDto findByGroupName(String name){
        BaseOutDto outBean = new BaseOutDto();
        Map<String,List<GtdGroupEntity>> map=new HashMap<>();
        List<GtdGroupEntity> list=IGroupService.findByName(name);
        map.put(String.valueOf(list.size()),list);
        if(list.size()!=0){
            outBean.setCode(list.size());
            outBean.setMessage("查询成功");
            outBean.setData(map);
        }else{
            outBean.setCode(400);
            outBean.setMessage("null");
        }
        return outBean;
    }


}

