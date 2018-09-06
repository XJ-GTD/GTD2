package com.manager.master.controller;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.BaseOutDto;
import com.manager.master.dto.GroupFindInDto;
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
     * @param inDto 用户ID&类型
     */
    @RequestMapping(value = "/find_all",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findAll(@RequestBody GroupFindInDto inDto){
        BaseOutDto outDto=new BaseOutDto();
        Map<String,List<GroupOutDto>> map=new HashMap<String, List<GroupOutDto>>();
        try {
            List<GroupOutDto> list= IGroupService.selectAll(inDto);
            for(GroupOutDto g:list){
                System.out.println(g.toString());
            }
            if(list!=null) {
                map.put("groupList", list);
                outDto.setData(map);
            }else outDto.setCode(ResultCode.REPEAT).setMessage("信息查询失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return outDto;
    }

    /**
     * 查询参与人详情
     * @param inDto
     * @return
     */
    @RequestMapping(value ="/find_single",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findMessage(@RequestBody GroupFindInDto inDto){
        BaseOutDto outDto=new BaseOutDto();
        Map<String,GroupOutDto> map=new HashMap<String, GroupOutDto>();
        try{
            GroupOutDto list= IGroupService.selectMessage(inDto);
            if(list!=null) {
                map.put("group", list);
                outDto.setData(map);
            }else outDto.setCode(ResultCode.REPEAT).setMessage("信息查询失败");
        }catch (Exception e){
            throw new ServiceException(e.getMessage());
        }
        return outDto;
    }


    /**
     * 群组创建
     * @param inDto
     *   GroupName群组名称 CreateId UserId
     */
    @RequestMapping(value = "/add_group",method = RequestMethod.POST)
    @ResponseBody

    public BaseOutDto add(@RequestBody GroupInDto inDto){
        BaseOutDto outDto = new BaseOutDto();
        try {
            int code = IGroupService.addGroup(inDto);
            if (code == 0) {
                outDto.setCode(ResultCode.SUCCESS).setMessage("群组创建成功");
            } else {
                outDto.setCode(ResultCode.REPEAT).setMessage("群组创建失败");
            }
        }catch (Exception e){
            throw new ServiceException(e.getMessage());
        }
        return outDto;
    }

    /**
     * 群组编辑
     * @param inDto 群组ID，群组名称/标签ID
     * @return
     */
    @RequestMapping(value = "/update_group",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateGname(@RequestBody GroupInDto inDto){
        BaseOutDto outDto = new BaseOutDto();
        try{
        int code=IGroupService.updateGname(inDto);
        if (code == 0) {
            outDto.setCode(ResultCode.REPEAT).setMessage("修改成功");
        } else {
            outDto.setCode(ResultCode.SUCCESS).setMessage("修改失败");
        }
    }catch (Exception e){
        throw new ServiceException(e.getMessage());
    }
        return outDto;
    }


    /**
     * 删除群组
     * @param inDto
     * @retur
     */
    @RequestMapping(value = "/delete_group",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto delete(@RequestBody GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();

        return outBean;
    }

    /**
     * 退出群组
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/exit_group",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto exit(@RequestBody GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();

        return outBean;
    }

    /**
     * 添加群成员
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/add_member",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto addMember(@RequestBody GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();

        return outBean;
    }

    /**
     * 删除群成员
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/delete_member",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto delMember(@RequestBody GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();

        return outBean;
    }


    /**
     * 群成员编辑
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/update_groupmember",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateMember(@RequestBody GroupInDto inDto){
        BaseOutDto outBean = new BaseOutDto();

        return outBean;
    }
}

