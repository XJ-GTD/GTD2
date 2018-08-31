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
     */
    @RequestMapping(value = "/select")
    @ResponseBody
    public GroupOutDto selectG(GroupInDto inDto){
        GroupOutDto outDto=new GroupOutDto();
        List<GtdGroupEntity> list=IGroupService.select(inDto);
        Map<String,Object> map=new HashMap<String,Object>();
        for(GtdGroupEntity g : list){
            map.put("groupId",g.getGroupId());
            map.put("groupName",g.getGroupName());
            map.put("user",g.getGroupUser());
            map.put("label",g.getLabel());

        }
        outDto.setData(map);
        return outDto;
    }




    /**
     * 添加群组
     */
    @RequestMapping(value = "/addgroup",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto add(GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();
        int code=IGroupService.addGroup(inDto);
        outBean.setCode(code);
        return outBean;
    }

    /**
     * 修改群名称
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/updatename",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateGname(GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();
        IGroupService.updateGname(inDto);
        return outBean;
    }

    /**
     *增加群组标签
     */
    @RequestMapping(value = "/addlabel",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto addlabel(GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();
        IGroupService.addLabel(inDto);
        return outBean;
    }

    /**
     * 删除群组标签，权限标签无法删除
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/dellabel",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto delLabel(GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();
        IGroupService.delLabel(inDto);
        return outBean;
    }

    /**
     * 根据群组ID删除群组
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/delgroup",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto delGroup(GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();
        IGroupService.delGroup(inDto);
        return outBean;
    }

    /**
     * 删除/添加群成员
     * @param inDto
     * @return
     */
    public BaseOutDto member(GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();
        String message=IGroupService.member(inDto);
        outBean.setMessage(message);
        return outBean;
    }

}

