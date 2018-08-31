package com.manager.master.controller;

import com.manager.master.dto.BaseOutDto;
import com.manager.master.dto.GroupInDto;
import com.manager.master.dto.GroupOutDto;
import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.service.IGroupService;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

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
     * 查询群组
     * @param userId 用户ID
     */
    @RequestMapping(value = "/selectAll",method = RequestMethod.POST)
    @ResponseBody
    public GroupOutDto seleteAll(int userId){
        GroupOutDto outDto=new GroupOutDto();
        List<GtdGroupEntity> list=IGroupService.selectAll(userId);
        Map<String,Object> map=new HashMap<String,Object>();
        map.put("data",list);
        outDto.setData(map);
        return outDto;
    }


    /**
     * 查询群组
     * @param inDto
     *  标签名 labelName/群组ID groupId/群组名 groupName
     */
    @RequestMapping(value = "/select",method = RequestMethod.POST)
    @ResponseBody
    public GroupOutDto selectG(GroupInDto inDto){
        GroupOutDto outDto=new GroupOutDto();
        List<GtdGroupEntity> list=IGroupService.select(inDto);
        Map<String,Object> map=new HashMap<String,Object>();
        map.put("data",list);
        outDto.setData(map);
        return outDto;
    }




    /**
     * 群组创建
     * @param inDto
     *   GroupName群组名称 CreateId UserId
     */
    @RequestMapping(value = "/addgroup",method = RequestMethod.POST)
    @ResponseBody
    public GroupOutDto add(GroupInDto inDto){
        GroupOutDto outBean = new GroupOutDto();
        int code=IGroupService.addGroup(inDto);
        outBean.setCode(code);
        return outBean;
    }

    /**
     * 群组编辑 修改群名称/增删标签
     * @param inDto 群组ID，群组名称/标签ID
     * @return
     */
    @RequestMapping(value = "/updatename",method = RequestMethod.POST)
    @ResponseBody
    public GroupOutDto updateGname(GroupInDto inDto){
        GroupOutDto outBean = new GroupOutDto();
        IGroupService.updateGname(inDto);
        return outBean;
    }


    /**
     * 删除/添加群成员
     * @param inDto 删除/添加群成员的ID userId
     * @retur
     */
    @RequestMapping(value = "/upmember",method = RequestMethod.POST)
    @ResponseBody
    public GroupOutDto member(GroupInDto inDto){
        GroupOutDto outBean = new GroupOutDto();
        String message=IGroupService.member(inDto);
        outBean.setMessage(message);
        return outBean;
    }

}

