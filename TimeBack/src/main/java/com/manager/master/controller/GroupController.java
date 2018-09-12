package com.manager.master.controller;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.service.IGroupService;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.omg.PortableInterceptor.INACTIVE;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

    private final IGroupService groupService;

    @Autowired
    public GroupController(IGroupService groupService) {
        this.groupService = groupService;
    }


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
            List<GroupOutDto> list= groupService.selectAll(inDto);
            for(GroupOutDto g:list){
                System.out.println(g.toString());
            }
            if(list!=null) {
                map.put("groupList", list);
                outDto.setData(map);
                outDto.setCode(ResultCode.SUCCESS).setMessage("查询参与人列表成功");
                logger.info("查询参与人列表成功：" + list.toString());
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
            GroupOutDto list= groupService.selectMessage(inDto);
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
     * 群成员查询
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/find_group_member",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findGroupMember(@RequestBody GroupFindInDto inDto){
        BaseOutDto outDto=new BaseOutDto();
        Map<String,List<GroupMemberOutDto>> map=new HashMap<String,List<GroupMemberOutDto>>();
        try{
            List<GroupMemberOutDto> list= groupService.findMember(inDto);
            if(list!=null) {
                map.put("groupMemberList", list);
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
            int code = groupService.addGroup(inDto);
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
        int code=groupService.updateGname(inDto);
        if (code == 0) {
            outDto.setCode(ResultCode.SUCCESS).setMessage("修改成功");
        } else {
            outDto.setCode(ResultCode.REPEAT).setMessage("修改失败");
        }
    }catch (Exception e){
        throw new ServiceException(e.getMessage());
    }
        return outDto;
    }

    /**
     * 修改群成员状态
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/update_member_status",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto update_memberstatus(@RequestBody InformInDto inDto){
        BaseOutDto outDto = new BaseOutDto();
        try{
            int code=groupService.updateStatus(inDto);
            if (code == 0) {
                outDto.setCode(ResultCode.SUCCESS).setMessage("修改成功");
            } else {
                outDto.setCode(ResultCode.REPEAT).setMessage("修改失败");
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
        BaseOutDto outDto = new BaseOutDto();
        try{
            int code=groupService.delGroup(inDto);
            if (code == 0) {
                outDto.setCode(ResultCode.SUCCESS).setMessage("删除成功");
            } else {
                outDto.setCode(ResultCode.REPEAT).setMessage("删除失败");
            }
        }catch (Exception e){
            throw new ServiceException(e.getMessage());
        }
        return outDto;
    }

    /**
     * 退出群组
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/exit_group",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto exit(@RequestBody GroupInDto inDto){
        BaseOutDto outDto = new BaseOutDto();
        try{
            int code=groupService.exitGroup(inDto);
            if (code == 0) {
                outDto.setCode(ResultCode.SUCCESS).setMessage("退出成功");
            } else {
                outDto.setCode(ResultCode.REPEAT).setMessage("退出失败");
            }
        }catch (Exception e){
            throw new ServiceException(e.getMessage());
        }
        return outDto;
    }

    /**
     * 添加/删除群成员
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/add_del_member",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto addMember(@RequestBody GroupMemberInDto inDto){
        BaseOutDto outDto = new BaseOutDto();
        try{
            int code=groupService.addOrDelMember(inDto);
            if (code == 0) {
                outDto.setCode(ResultCode.SUCCESS).setMessage("操作成功");
            } else {
                outDto.setCode(ResultCode.REPEAT).setMessage("操作失败");
            }
        }catch (Exception e){
            throw new ServiceException(e.getMessage());
        }
        return outDto;
    }



    /**
     * 群成员编辑
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/update_groupmember",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateMember(@RequestBody GroupInDto inDto){
        BaseOutDto outDto = new BaseOutDto();
        try{
            int code=groupService.member(inDto);
            if (code == 0) {
                outDto.setCode(ResultCode.SUCCESS).setMessage("修改成功");
            } else {
                outDto.setCode(ResultCode.REPEAT).setMessage("修改失败");
            }
        }catch (Exception e){
            throw new ServiceException(e.getMessage());
        }
        return outDto;
    }

    /**
     * 临时： 创建/编辑日程时添加参与人用
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/find_all_players",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findAllPlayers(@RequestBody GroupFindInDto inDto){
        BaseOutDto outDto = new BaseOutDto();
        Map<String, List<GroupOutDto>> data = new TreeMap<>();
        try{
            List<GroupOutDto> groupList = groupService.createSchedule(inDto);
            if (groupList != null) {
                data.put("groupList", groupList);
                outDto.setData(data);
                outDto.setCode(ResultCode.SUCCESS).setMessage("查询成功");
            } else {
                outDto.setCode(ResultCode.REPEAT).setMessage("查询失败");
            }
        }catch (Exception e){
            outDto.setCode(ResultCode.FAIL).setMessage(e.getMessage());
            throw new ServiceException(e.getMessage());
        }
        return outDto;

    }


}

