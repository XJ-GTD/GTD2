package com.manager.master.service.serviceImpl;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.entity.*;
import com.manager.master.repository.*;
import com.manager.master.service.IGroupService;
import com.manager.util.CommonMethods;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.util.*;

/**
 * 群组Service实现类
 *
 * create by wzy on 2018/08/24
 */
@Service
@Transactional
public class GroupServicelmpl implements IGroupService {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Resource
    private GroupJpaRepository groupJpaRepository;

    @Resource
    private GroupRepository groupRepository;

    @Resource
    private GroupLabelJpaRepository groupLabelJpa;

    @Resource
    private GroupMemberRepository groupMemberRepository;

    @Resource
    private LabelJpaRespository labelJpaRespository;

    @Resource
    private CenterGroupScheduleRepository groupScheduleJpaRepository;

    @Resource
    private SchedulePlayersRepository schedulePlayersJpaRepository;


    @Resource
    private RemindJpaRepository remindJpaRepository;


    @Override
    public List<GroupOutDto> selectAll(GroupFindInDto inDto) {
        int userId = inDto.getUserId();
        int typeId = inDto.getFindType();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (typeId == 0 || "".equals(typeId)) throw new ServiceException("类型ID不能为空");

        List<GtdGroupEntity> list = null;
        try {
            GtdLabelEntity labels=labelJpaRespository.findLabelById(8);
            if(typeId==1) {
                list = groupJpaRepository.findByLabel(labels);//查询个人
            }else if(typeId==2){
                list= groupJpaRepository.findDistinctByLabelNot(labels);//查询非个人群组
            }else if (typeId == 3) {

            } else {
                throw new ServiceException("请输入正确的查询类型");
            }
        } catch (Exception e) {
            throw new ServiceException("语法错误");
        }

        List<GtdGroupEntity>  res=new ArrayList<>();
        for(GtdGroupEntity g : list){
            List<Integer> ints=groupMemberRepository.findAllUserIdByGroupId(g.getGroupId());
            if(ints.indexOf(userId)!=-1){
                res.add(g); //把当前用户所属群组添加
            }
        }
        System.out.println(res.size());

//        for(GtdGroupEntity g:res){
//            System.out.println(g.getGroupName());
//        }

        List<GroupOutDto> result = new ArrayList<>();
        for (GtdGroupEntity g : res) {
            GroupOutDto group = new GroupOutDto();
            //添加群组信息
            group.setGroupId(g.getGroupId());
            group.setGroupName(g.getGroupName());
            group.setGroupHeadImg(g.getGroupHeadimgUrl());
            group.setGroupCreateId(g.getUserId());          //创建人

            Set<GtdUserEntity> users = g.getUser();
            List<GroupMemberDto> memberDtos = new ArrayList<>();
            for (GtdUserEntity user : users) {
                GroupMemberDto memberDto = new GroupMemberDto();
                //添加群组用户信息
                memberDto.setUserId(user.getUserId());
                memberDto.setUserName(user.getUserName());
                memberDto.setUserContact(user.getUserContact());
                int status;
                try {
                    status = groupRepository.findMemberStatus(user.getUserId(), g.getGroupId());
                } catch (Exception e) {
                    throw new ServiceException("查询群成员状态出错");
                }
                if (status != 2 && status != 3) { //用户状态不为拒绝或未接受才显示
                    memberDtos.add(memberDto);
                }
            }
            group.setGtdGroupMember(memberDtos);
            Set<GtdLabelEntity> set = g.getLabel();
            List<LabelOutDto> labelOut = new ArrayList<LabelOutDto>();

            for (GtdLabelEntity label : set) {
                //添加群组标签信息
                LabelOutDto l = new LabelOutDto();
                l.setLabelId(label.getLabelId());
                l.setLabelName(label.getLabelName());
                labelOut.add(l);
            }
            group.setGroupLabel(labelOut);
            result.add(group);
        }
            return result;
    }


    /**
     * 查询参与人详情
     *
     * @param inDto
     * @return
     */
    @Override
    public GroupOutDto selectMessage(GroupFindInDto inDto) {
        int userId = inDto.getUserId();
        int groupId = inDto.getGroupId();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
        List<GtdGroupMemberEntity> g = null;
        try {
            g = groupMemberRepository.findMemberByGroupId(groupId); //获取该群组所有群成员
        } catch (Exception e) {
            throw new ServiceException("语法错误");
        }

//        for(GtdGroupMemberEntity d:g) {
//            System.out.println(d.getUserName());
//        }
        GtdGroupEntity groupEntity = null;
        try {
            groupEntity = groupJpaRepository.findGroupById(groupId);//获取当前群组
        } catch (Exception e) {
            throw new ServiceException("语法错误");
        }

        GroupOutDto group = new GroupOutDto();
        group.setGroupId(groupId);
        group.setGroupName(groupEntity.getGroupName());
        Set<GtdLabelEntity> set = groupEntity.getLabel();
        List<LabelOutDto> labelOut = new ArrayList<LabelOutDto>();
        for (GtdLabelEntity label : set) { //标签信息
            LabelOutDto l = new LabelOutDto();
            l.setLabelId(label.getLabelId());
            l.setLabelName(label.getLabelName());
            labelOut.add(l);
        }
        group.setGroupLabel(labelOut);
        List<GroupMemberDto> members = new ArrayList<>();
        for (GtdGroupMemberEntity member : g) { //群成员信息
            GroupMemberDto groupMember = new GroupMemberDto();
            groupMember.setUserId(member.getUserId());
            groupMember.setUserName(member.getUserName());
            groupMember.setUserContact(member.getUserContact());
            members.add(groupMember);
        }
        group.setGtdGroupMember(members);
        return group;
    }


    /**
     * 查询接口
     *
     * @param inDto
     * @return
     */
    @Override
    public List<GtdGroupEntity> select(GroupInDto inDto) {
        String groupName = inDto.getGroupName();
        String labelName = inDto.getLabelName();
        // String userName=inDto.getUserName();
//        if (groupName != null && !"".equals(groupName)) {
//            return groupJpaRepository.findByGroupNameIsLike("%" + groupName + "%");
//        }
//        if (labelName != null && !"".equals(labelName)) {
//            List<Integer> li = groupRepository.findByLabelLike(labelName);
//            List<GtdGroupEntity> list = groupJpaRepository.findByGroupIdIn(li);
//            return list;
//        }
//        if(userName!=null&&!"".equals(userName)) {
//            List<GtdGroupMemberEntity> ids=groupMemberRepository.findByUserNameLike("%"+userName+"%");
//            List<Integer> li=new ArrayList<>();
//            for(int i=0;i<ids.size();i++){
//                li.add(ids.get(i).getGroupId());
//            }
//            List<GtdGroupEntity> list = groupJpaRepository.findByGroupIdIn(li);
//            return list;
//        }
        return null;
    }


    /**
     * 添加群组
     *
     * @param inDto
     * @return
     */
    @Override
    public int addGroup(GroupInDto inDto) {
        int userId = inDto.getUserId();
        List<Integer> labelId = inDto.getLabelId();
        String groupName = inDto.getGroupName();
        String groupHeadImgUrl = inDto.getGroupHeadImgUrl();
        List<GroupMemberDto> member = inDto.getMember();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (labelId.size() == 0 || labelId == null) throw new ServiceException("标签不能为空");
        if (groupName == null || "".equals(groupName)) throw new ServiceException("群组名不能为空");
        if (groupHeadImgUrl == null || "".equals(groupHeadImgUrl)) throw new ServiceException("群头像不能为空");
        if (member.size() == 0 || member == null) throw new ServiceException("群员不能为空");
        Date date = new Date();
        List<GtdGroupMemberEntity> groupMembers = new ArrayList<>();
        List<GtdGroupLabel> groupLabels = new ArrayList<>();

        for(Integer i:labelId){
            if(labelId.size()!=1&&i==8){
                throw new ServiceException("群组不能添加单人标签");
            }
        }

        if (labelId.size() == 1 && labelId.get(0) == 8) {
            //创建单人
            GtdGroupEntity group = new GtdGroupEntity();
            group.setGroupName(groupName);
            group.setGroupHeadimgUrl(groupHeadImgUrl);
            group.setCreateId(userId);
            group.setUserId(userId);
            group.setCreateDate(new Timestamp(date.getTime()));
            //获取新建群组的主键id
            int groupId = groupJpaRepository.saveAndFlush(group).getGroupId();
            if (groupId == 0) throw new ServiceException("群组Id为空");
            for (Integer i : labelId) {
                //添加群组标签
                GtdGroupLabel groupLabel = new GtdGroupLabel();
                groupLabel.setLabelId(i);
                groupLabel.setGroupId(groupId);
                groupLabel.setCreateId(userId);
                groupLabel.setCreateDate(new Timestamp(date.getTime()));
                groupLabelJpa.saveAndFlush(groupLabel);
            }

            for (GroupMemberDto g : member) {
                //添加群成员信息
                GtdGroupMemberEntity groupMember = new GtdGroupMemberEntity();
                groupMember.setUserId(groupRepository.findUserId(g.getUserContact()));
                groupMember.setGroupId(groupId);
                groupMember.setUserName(g.getUserName());
                groupMember.setUserContact(g.getUserContact());
                groupMember.setCreateId(userId);
                groupMember.setCreateDate(new Timestamp(date.getTime()));
                groupMemberRepository.saveAndFlush(groupMember);
            }
        } else {
            //创建群组
            GtdGroupEntity group = new GtdGroupEntity();
            group.setGroupName(groupName);
            group.setGroupHeadimgUrl(groupHeadImgUrl);
            group.setCreateId(userId);
            group.setUserId(userId);
            group.setCreateDate(new Timestamp(date.getTime()));
            boolean flag = true;
            for (Integer i : labelId) {
                if (i == 1) {//判断是否含有权限标签
                    flag = false;
                }
            }


            GtdGroupEntity groupEntity = groupJpaRepository.saveAndFlush(group);
            int groupId = groupEntity.getGroupId();
            if (groupId == 0) throw new ServiceException("群组Id为空");

            for (Integer i : labelId) {
                GtdGroupLabel groupLabel = new GtdGroupLabel();
                groupLabel.setLabelId(i);
                groupLabel.setGroupId(groupId);
                groupLabel.setCreateId(userId);
                groupLabel.setCreateDate(new Timestamp(date.getTime()));
                groupLabelJpa.save(groupLabel);
            }

            for (GroupMemberDto g : member) {
                GtdGroupMemberEntity groupMember = new GtdGroupMemberEntity();
                int id = groupRepository.findUserId(g.getUserContact());
                groupMember.setUserId(id);
                groupMember.setGroupId(groupId);
                groupMember.setUserName(g.getUserName());
                groupMember.setUserContact(g.getUserContact());
                groupMember.setCreateId(userId);
                groupMember.setCreateDate(new Timestamp(date.getTime()));
                if (!flag) { //权限群组 群成员默认状态为未接受 2
                    groupMember.setGroupMemberStatus(2);
                } else {//本地群组
                    groupMember.setGroupMemberStatus(0);
                }
                groupMemberRepository.save(groupMember);
            }

        }
        return 0;
    }


    /**
     * 删除群组
     *
     * @param inDto
     * @return
     */
    @Override
    public int delGroup(GroupInDto inDto) {
        int userId = inDto.getUserId();
        int groupId = inDto.getGroupId();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
        GtdGroupEntity group = null;
        try {
            group = groupJpaRepository.findGroupById(groupId);
        } catch (Exception e) {
            throw new ServiceException("群组不存在");
        }
        int createId=group.getCreateId();
        if(userId==createId) {//判断是否为群组创建人
            boolean flag = false; //判断是否为权限群组
            Set<GtdLabelEntity> labels = group.getLabel();
            for (GtdLabelEntity label : labels) {
                if (label.getLabelId() == 1) {
                    flag = true;
                }
            }
            if (flag) {//TODO 权限群组发送通知 删除群组
                //根据群组ID获得该群组的日程
                List<GtdGroupScheduleEntity> groupSchedules=groupScheduleJpaRepository.findGroupSchedulesByGroupId(groupId);
                for(GtdGroupScheduleEntity g:groupSchedules){
                    int scheduleId=g.getScheduleId();//获取日程ID

                    boolean boo=true;
                    //根据日程ID获取有该日程的所有群组 判断这些群组中有没有此用户
                    List<GtdGroupScheduleEntity> groups=groupScheduleJpaRepository.findGroupSchedulesByGroupId(scheduleId);
                    for(GtdGroupScheduleEntity gs:groups){
                        if(gs.getGroupId()!=groupId){
                            List<GtdGroupMemberEntity> groupMembers=groupMemberRepository.findMemberByGroupId(gs.getGroupId());
                            for(GtdGroupMemberEntity member:groupMembers){
                                if(member.getUserId()==userId){
                                    boo=false;
                                }
                            }
                        }
                    }

                    //在其他此日程群组不存在就删除
                    if(boo) {
                        List<Integer> playerIds = schedulePlayersJpaRepository.findAllPlayersId(scheduleId);
                        for(Integer i:playerIds) {
                            remindJpaRepository.deleteAllByPlayersId(i);//删除提醒时间表
                        }
                        schedulePlayersJpaRepository.deleteConnectionByScheduleId(scheduleId);//删除参与人表
                    }
                }
               groupRepository.deleteByGroupId(groupId);//删除群组、群组标签、群成员、群组日程
            } else {
                //本地群组直接删除
                groupRepository.deleteByGroupId(groupId);//删除群组、群组标签、群成员、群组日程

            }
        }else {
            throw new ServiceException("没有删除权限");
        }
        return 0;
    }

    /**
     * 退出群组
     * @param inDto
     * @return
     */
    @Override
    public int exitGroup(GroupInDto inDto) {
        int userId = inDto.getUserId();
        int groupId = inDto.getGroupId();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
        GtdGroupEntity group = null;
        try {
            group = groupJpaRepository.findGroupById(groupId);
        } catch (Exception e) {
            throw new ServiceException("群组不存在");
        }
        int createId=group.getCreateId();
        if(userId!=createId) {
            //不是群组创建人
            List<GtdGroupScheduleEntity> groupSchedules=groupScheduleJpaRepository.findGroupSchedulesByGroupId(groupId);
            for(GtdGroupScheduleEntity g:groupSchedules) {
                int scheduleId = g.getScheduleId();
                List<Integer> playerIds = schedulePlayersJpaRepository.findAllPlayersId(scheduleId);
                for (Integer i : playerIds) {
                    remindJpaRepository.deleteAllByPlayersId(i);//删除提醒时间表
                }
                schedulePlayersJpaRepository.deleteConnectionByScheduleId(scheduleId);//删除参与人表
            }
        }else{
            //删除群组
            boolean flag = false; //判断是否为权限群组
            Set<GtdLabelEntity> labels = group.getLabel();
            for (GtdLabelEntity label : labels) {
                if (label.getLabelId() == 1) {
                    flag = true;
                }
            }
            if (flag) {//TODO 权限群组发送通知 删除群组
                //根据群组ID获得该群组的日程
                List<GtdGroupScheduleEntity> groupSchedules=groupScheduleJpaRepository.findGroupSchedulesByGroupId(groupId);
                for(GtdGroupScheduleEntity g:groupSchedules){
                    int scheduleId=g.getScheduleId();//获取日程ID

                    boolean boo=true;
                    //根据日程ID获取有该日程的所有群组 判断这些群组中有没有此用户
                    List<GtdGroupScheduleEntity> groups=groupScheduleJpaRepository.findGroupSchedulesByGroupId(scheduleId);
                    for(GtdGroupScheduleEntity gs:groups){
                        if(gs.getGroupId()!=groupId){
                            List<GtdGroupMemberEntity> groupMembers=groupMemberRepository.findMemberByGroupId(gs.getGroupId());
                            for(GtdGroupMemberEntity member:groupMembers){
                                if(member.getUserId()==userId){
                                    boo=false;
                                }
                            }
                        }
                    }

                    //在其他此日程群组不存在就删除
                    if(boo) {
                        List<Integer> playerIds = schedulePlayersJpaRepository.findAllPlayersId(scheduleId);
                        for(Integer i:playerIds) {
                            remindJpaRepository.deleteAllByPlayersId(i);//删除提醒时间表
                        }
                        schedulePlayersJpaRepository.deleteConnectionByScheduleId(scheduleId);//删除参与人表
                    }
                }
                groupRepository.deleteByGroupId(groupId);//删除群组、群组标签、群成员、群组日程
            } else {
                //本地群组直接删除
                groupRepository.deleteByGroupId(groupId);//删除群组、群组标签、群成员、群组日程

            }
        }
        return 0;
    }


    /**
     * 编辑群组
     *
     * @param inDto
     * @return
     */
    @Override
    public int updateGname(GroupInDto inDto) {
        int userId = inDto.getUserId();
        int groupId = inDto.getGroupId();
        List<Integer> labelId = inDto.getLabelId();
        String groupName = inDto.getGroupName();
        String groupHeadImgUrl = inDto.getGroupHeadImgUrl();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
        if (labelId.size() == 0 || labelId == null) throw new ServiceException("标签不能为空");
        if (groupName == null || "".equals(groupName)) throw new ServiceException("群组名不能为空");
        if (groupHeadImgUrl == null || "".equals(groupHeadImgUrl)) throw new ServiceException("群头像不能为空");
        GtdGroupEntity group = groupJpaRepository.findGroupById(groupId);
        //GtdGroupLabel groupLabel=
        int createId = group.getCreateId();
        Set<GtdLabelEntity> labels = group.getLabel();//群组原标签
        if (createId == userId) {
            boolean flag = true;
            int type = 0;//本地群
            for (GtdLabelEntity g : labels) {
                if (g.getLabelId() == 1) { //判断群组标签中是否含有权限标签
                    flag = false;
                    type = 1;//权限群
                    for (int i = 0; i < labelId.size(); i++) {
                        if (labelId.get(i) == g.getLabelId()) { //判断原权限标签是否存在
                            flag = true; //存在
                        }
                    }
                    if (!flag) {
                        throw new ServiceException("权限标签不能删除");
                    }
                }
            }
            group.setGroupName(groupName);
            group.setGroupHeadimgUrl(groupHeadImgUrl);
            Set<GtdLabelEntity> set = new HashSet<>();
            boolean status = false;
            for (Integer i : labelId) {
                GtdLabelEntity labelEntity = labelJpaRespository.findLabelById(i);
                set.add(labelEntity);
                if (i == 1) {//判断新增有没有权限标签
                    status = true;
                }
            }
            Date date = new Date();
            group.setLabel(set);
            group.setUpdateId(userId);
            group.setUpdateDate(new Timestamp(date.getTime()));
            if (type == 0) {//本地群
                if (!status) {//不加权限标签
                    groupJpaRepository.save(group);
                } else {//添加权限标签
                    // TODO 变为权限群组 给群员发通知 组成员状态默认为未接受(2)
                    groupJpaRepository.save(group);
                    List<GtdGroupMemberEntity> list = groupMemberRepository.findMemberByGroupId(groupId);
                    for (GtdGroupMemberEntity g : list) {
                        g.setGroupMemberStatus(2);
                    }
                    groupMemberRepository.saveAll(list);
                }
            } else {//权限群
                if (!status) {//不加权限标签
                    groupJpaRepository.save(group);
                } else {//添加权限标签
                    // TODO 发送通知
                    groupJpaRepository.save(group);
                }
            }
        } else {
            throw new ServiceException("权限不足");
        }
        return 0;
    }

    /**
     * 添加/删除群成员
     *
     * @param inDto
     * @return
     */
    @Override
    public int addOrDelMember(GroupInDto inDto) {
        int userId = inDto.getUserId();
        int groupId = inDto.getGroupId();
        List<GroupMemberDto> member = inDto.getMember();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
        if (member.size() == 0 || member == null) throw new ServiceException("群员不能为空");
        GtdGroupEntity group = groupJpaRepository.findGroupById(groupId);

        boolean flag = false; //判断是否为权限群组
        Set<GtdLabelEntity> labels = group.getLabel();
        for (GtdLabelEntity label : labels) {
            if (label.getLabelId() == 1) {
                flag = true;
            }
        }

        for (GroupMemberDto g : member) {
            int uId = g.getUserId();
            String name = g.getUserName();
            String contact = g.getUserContact();
            GtdGroupMemberEntity groupMember = groupMemberRepository.findMemberByGroupIdAndUserId(groupId, uId);
            if (groupMember != null) {
                if (flag) {
                    // TODO 权限群组 发送通知后删除群成员
                    groupMemberRepository.delete(groupMember);
                } else {
                    //直接删除群成员
                    groupMemberRepository.delete(groupMember);
                }
            } else {
                //群成员不存在 添加
                if (name == null || "".equals(name)) throw new ServiceException("群员姓名不能为空");
                if (contact == null || "".equals(contact)) throw new ServiceException("群员联系方式不能为空");
                GtdGroupMemberEntity ggm = new GtdGroupMemberEntity();
                ggm.setUserId(groupRepository.findUserId(contact));
                ggm.setUserName(name);
                ggm.setGroupId(groupId);
                ggm.setUserContact(contact);
                ggm.setCreateId(userId);
                ggm.setCreateDate(new Timestamp(new Date().getTime()));
                if(flag) {
                    ggm.setGroupMemberStatus(2);
                    //TODO 发通知 修改状态
                }else{
                    ggm.setGroupMemberStatus(0);
                }
                groupMemberRepository.save(ggm);
            }
        }

        return 0;
    }


    /**
     * 编辑群成员
     *
     * @param inDto
     * @return
     */
    @Override
    public int member(GroupInDto inDto) {
        int userId = inDto.getUserId();
        int groupId = inDto.getGroupId();
        List<GroupMemberDto> member = inDto.getMember();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
        if (member.size() == 0 || member == null) throw new ServiceException("群员不能为空");

        GtdGroupEntity group = groupJpaRepository.findGroupById(groupId);
        boolean flag = false; //判断是否为权限群组
        Set<GtdLabelEntity> labels = group.getLabel();
        for (GtdLabelEntity label : labels) {
            if (label.getLabelId() == 1) {
                flag = true;
            }
        }

        if (!flag) {
            for (GroupMemberDto gmDto : member) {
                if (gmDto.getUserId() == 0 || "".equals(gmDto.getUserId())) throw new ServiceException("群员ID不能为空");
                if (gmDto.getUserContact() == null || "".equals(gmDto.getUserContact()))
                    throw new ServiceException("群员联系方式不能为空");
                if (gmDto.getUserName() == null || "".equals(gmDto.getUserName()))
                    throw new ServiceException("群员姓名不能为空");
                GtdGroupMemberEntity groupMember = groupMemberRepository.findMemberByGroupIdAndUserId(groupId, gmDto.getUserId());
                //GtdGroupMemberEntity groupMember =new GtdGroupMemberEntity();
                groupMember.setUserId(gmDto.getUserId());
                groupMember.setUserName(gmDto.getUserName());
                groupMember.setUserContact(gmDto.getUserContact());
                groupMember.setCreateId(userId);
                groupMember.setUpdateDate(new Timestamp(new Date().getTime()));
                groupMemberRepository.save(groupMember);
            }
        } else {
            throw new ServiceException("权限群不可编辑");
        }
        return 0;
    }

    /**
     * 修改群成员状态
     * @param inDto
     * @return
     */
    @Override
    public int updateStatus(GroupInDto inDto) {
        int userId = inDto.getUserId();
        int groupId = inDto.getGroupId();
        List<GroupMemberDto> member = inDto.getMember();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
        if (member.size() == 0 || member == null) throw new ServiceException("群员不能为空");
        GtdGroupEntity group = groupJpaRepository.findGroupById(groupId);
        boolean flag = false; //判断是否为权限群组
        Set<GtdLabelEntity> labels = group.getLabel();
        for (GtdLabelEntity label : labels) {
            if (label.getLabelId() == 1) {
                flag = true;
            }
        }
        if (flag) {
            for (GroupMemberDto gmDto : member) {
                if (gmDto.getUserId() == 0 || "".equals(gmDto.getUserId())) throw new ServiceException("群员ID不能为空");
                if (gmDto.getUserContact() == null || "".equals(gmDto.getUserContact())) throw new ServiceException("群员联系方式不能为空");
                if (gmDto.getUserName() == null || "".equals(gmDto.getUserName())) throw new ServiceException("群员姓名不能为空");
                GtdGroupMemberEntity groupMember = groupMemberRepository.findMemberByGroupIdAndUserId(groupId, gmDto.getUserId());
                //GtdGroupMemberEntity groupMember =new GtdGroupMemberEntity();
                //修改群成员状态
                //TODO 获取群成员状态
                groupMember.setGroupMemberStatus(3);
                groupMember.setUpdateId(userId);
                groupMember.setUpdateDate(new Timestamp(new Date().getTime()));
                groupMemberRepository.save(groupMember);
            }
        } else {
            throw new ServiceException("本地群成员无法修改");
        }
        return 0;
    }

    /**
     * 创建/编辑日程添加参与人用
     * @param inDto
     * @return
     */
    public List<GroupOutDto> createSchedule(GroupFindInDto inDto) {
        int userId = inDto.getUserId();
        int typeId = inDto.getFindType();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (typeId == 0 || "".equals(typeId)) throw new ServiceException("类型ID不能为空");
        if (typeId != 3)throw new ServiceException("类型ID参数错误");
        List<Map> allList = groupJpaRepository.findAllPlayers(userId);
        if (allList != null && allList.size() != 0){
            List<GroupOutDto> list = new ArrayList<>();
            for (Map gle: allList) {
                GroupOutDto outDto = new GroupOutDto();
                outDto.setGroupId((Integer) gle.get("GROUP_ID"));
                outDto.setGroupName((String) gle.get("GROUP_NAME"));
                outDto.setGroupCreateId((Integer) gle.get("USER_ID"));
                list.add(outDto);
            }
            return list;
        } else {
            throw new ServiceException("未查询到参与人数据");
        }


    }
}