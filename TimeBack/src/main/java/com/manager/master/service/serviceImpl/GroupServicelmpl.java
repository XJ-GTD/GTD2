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
    private UserJpaRepository userJpaRepository;


    @Override
    public List<GroupOutDto> selectAll( GroupFindInDto inDto) {
        int userId=inDto.getUserId();
        int typeId=inDto.getFindType();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (typeId == 0 || "".equals(typeId)) throw new ServiceException("类型ID不能为空");
        List<GtdGroupEntity> list=null;
        try {
            list = groupJpaRepository.findByUserId(userId);
        }catch (Exception e){
            throw new ServiceException("语法错误");
        }

        List<GroupOutDto> result = new ArrayList<>();
        List<GroupOutDto> results = new ArrayList<>();
        for (GtdGroupEntity g : list) {
            GroupOutDto group = new GroupOutDto();
            group.setGroupId(g.getGroupId());
            group.setGroupName(g.getGroupName());
            group.setGroupHeadImg(g.getGroupHeadimgUrl());
            group.setGroupCreateId(g.getCreateId());
            Set<GtdUserEntity> users=g.getUser();
            List<GroupMemberDto> memberDtos=new ArrayList<>();
            for(GtdUserEntity user:users){
                GroupMemberDto memberDto=new GroupMemberDto();
                memberDto.setUserId(user.getUserId());
                memberDto.setUserName(user.getUserName());
                memberDto.setUserContact(user.getUserContact());
                memberDtos.add(memberDto);
            }
            group.setGtdGroupMember(memberDtos);

            Set<GtdLabelEntity> set = g.getLabel();
            List<LabelDto> labelOut = new ArrayList<LabelDto>();

            boolean flag=false;
            for (GtdLabelEntity label : set) {
                if(set.size()==1&&label.getLabelId()==8){
                    //单人
                    flag=true;
                }
                LabelDto l = new LabelDto();
                l.setLabelId(label.getLabelId());
                l.setLabelName(label.getLabelName());
                labelOut.add(l);
            }
            group.setGroupLabel(labelOut);
            if(flag) {
                result.add(group);
            }
            if(!flag){
                results.add(group);
            }
        }
        if(typeId==1) {
            return result;
        }else{
            return results;
        }
    }

    @Override
    public GroupOutDto selectMessage(GroupFindInDto inDto) {
        int userId=inDto.getUserId();
        int groupId=inDto.getGroupId();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
        List<GtdGroupMemberEntity> g=null;
        try {
             g=groupMemberRepository.findAllByGroupId(groupId);
        }catch (Exception e){
            throw new ServiceException("语法错误");
        }

//        for(GtdGroupMemberEntity d:g) {
//            System.out.println(d.getUserName());
//        }
        GtdGroupEntity groupEntity=null;
        try {
            groupEntity=groupJpaRepository.findByGroupId(groupId);
        }catch (Exception e){
            throw new ServiceException("语法错误");
        }

        GroupOutDto group = new GroupOutDto();
            group.setGroupId(groupId);
            group.setGroupName(groupEntity.getGroupName());
            Set<GtdLabelEntity> set = groupEntity.getLabel();
            List<LabelDto> labelOut = new ArrayList<LabelDto>();
            for (GtdLabelEntity label : set) {
                LabelDto l = new LabelDto();
                l.setLabelId(label.getLabelId());
                l.setLabelName(label.getLabelName());
                labelOut.add(l);
            }
            group.setGroupLabel(labelOut);
            List<GroupMemberDto> members=new ArrayList<>();
            for(GtdGroupMemberEntity member:g){
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
     * @param inDto
     * @return
     */
    @Override
    public List<GtdGroupEntity> select(GroupInDto inDto) {
        String groupName=inDto.getGroupName();
        String labelName=inDto.getLabelName();
       // String userName=inDto.getUserName();
        if(groupName!=null&&!"".equals(groupName)){
            return groupJpaRepository.findByGroupNameIsLike("%"+groupName+"%");
        }
        if(labelName!=null&&!"".equals(labelName)) {
            List<Integer> li = groupRepository.findByLabelLike(labelName);
            List<GtdGroupEntity> list = groupJpaRepository.findByGroupIdIn(li);
            return list;
        }
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



    @Override
    public int addGroup(GroupInDto inDto) {
        int userId=inDto.getUserId();
        List<Integer> labelId=inDto.getLabelId();
        String groupName=inDto.getGroupName();
        String groupHeadImgUrl=inDto.getGroupHeadImgUrl();
        List<GroupMemberDto> member=inDto.getMember();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (labelId.size() == 0 || labelId==null) throw new ServiceException("标签不能为空");
        if (groupName == null || "".equals(groupName)) throw new ServiceException("群组名不能为空");
        if (groupHeadImgUrl == null || "".equals(groupHeadImgUrl)) throw new ServiceException("群头像不能为空");
        if (member.size() == 0 || member==null) throw new ServiceException("群员不能为空");
        Date date=new Date();
        List<GtdGroupMemberEntity> groupMembers=new ArrayList<>();
        List<GtdGroupLabel> groupLabels=new ArrayList<>();
        if(labelId.size()==1&&labelId.get(0)==8){
            GtdGroupEntity group=new GtdGroupEntity();
            group.setGroupName(groupName);
            group.setGroupHeadimgUrl(groupHeadImgUrl);
            group.setCreateId(userId);
            group.setUserId(userId);
            group.setCreateDate(new Timestamp(date.getTime()));
            int groupId=groupJpaRepository.saveAndFlush(group).getGroupId();
            if(groupId==0) throw new ServiceException("群组Id为空");
            for(Integer i:labelId) {
                GtdGroupLabel groupLabel = new GtdGroupLabel();
                groupLabel.setLabelId(i);
                groupLabel.setGroupId(groupId);
                groupLabel.setCreateId(userId);
                groupLabel.setCreateDate(new Timestamp(date.getTime()));
                groupLabelJpa.saveAndFlush(groupLabel);
            }

            for(GroupMemberDto g:member){
                GtdGroupMemberEntity groupMember=new GtdGroupMemberEntity();
                groupMember.setUserId(groupRepository.findUserId(g.getUserContact()));
                groupMember.setGroupId(groupId);
                groupMember.setUserName(g.getUserName());
                groupMember.setUserContact(g.getUserContact());
                groupMember.setCreateId(userId);
                groupMember.setCreateDate(new Timestamp(date.getTime()));
                groupMemberRepository.saveAndFlush(groupMember);
            }
        }else{
            GtdGroupEntity group=new GtdGroupEntity();
            group.setGroupName(groupName);
            group.setGroupHeadimgUrl(groupHeadImgUrl);
            group.setCreateId(userId);
            group.setUserId(userId);
            group.setCreateDate(new Timestamp(date.getTime()));
            boolean flag=true;
            for(Integer i:labelId){
                if(i==1){//判断是否含有权限标签
                    flag=false;
                }
            }


                GtdGroupEntity groupEntity=groupJpaRepository.saveAndFlush(group);
                int groupId=groupEntity.getGroupId();
                if(groupId==0) throw new ServiceException("群组Id为空");

                for(Integer i:labelId) {
                    GtdGroupLabel groupLabel = new GtdGroupLabel();
                    groupLabel.setLabelId(i);
                    groupLabel.setGroupId(groupId);
                    groupLabel.setCreateId(userId);
                    groupLabel.setCreateDate(new Timestamp(date.getTime()));
                    groupLabelJpa.save(groupLabel);
                }

                for(GroupMemberDto g:member){
                    GtdGroupMemberEntity groupMember=new GtdGroupMemberEntity();
                    int id=groupRepository.findUserId(g.getUserContact());
                    groupMember.setUserId(id);
                    groupMember.setGroupId(groupId);
                    groupMember.setUserName(g.getUserName());
                    groupMember.setUserContact(g.getUserContact());
                    groupMember.setCreateId(userId);
                    groupMember.setCreateDate(new Timestamp(date.getTime()));
                    if(!flag){ //权限群组 群成员默认状态为未接受 2
                        groupMember.setGroupMemberStatus(2);
                    }else{//本地群组
                        groupMember.setGroupMemberStatus(0);
                    }
                    groupMemberRepository.save(groupMember);
                }

        }
        return 0;
    }

    @Override
    public int addLabel(GroupInDto inDto) {
        GtdGroupLabel groupLabel=new GtdGroupLabel();

        int  count=0;

        return count;

    }

    @Override
    public void delGroup(GroupInDto inDto) {
        int id=inDto.getGroupId();
        groupJpaRepository.deleteById(id);
    }


    @Override
    public int updateGname(GroupInDto inDto) {
        int userId=inDto.getUserId();
        int groupId=inDto.getGroupId();
        List<Integer> labelId=inDto.getLabelId();
        String groupName=inDto.getGroupName();
        String groupHeadImgUrl=inDto.getGroupHeadImgUrl();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
        if (labelId.size() == 0 || labelId==null) throw new ServiceException("标签不能为空");
        if (groupName == null || "".equals(groupName)) throw new ServiceException("群组名不能为空");
        if (groupHeadImgUrl == null || "".equals(groupHeadImgUrl)) throw new ServiceException("群头像不能为空");
        GtdGroupEntity group= groupJpaRepository.findByGroupId(groupId);
        //GtdGroupLabel groupLabel=
        int createId=group.getCreateId();
        Set<GtdLabelEntity> labels=group.getLabel();//群组原标签
        if(createId==userId){
            boolean flag=true;
            int type=0;//本地群
            for(GtdLabelEntity g:labels){
                if(g.getLabelId()==1){ //判断群组标签中是否含有权限标签
                     flag=false;
                     type=1;//权限群
                    for(int i=0;i<labelId.size();i++){
                        if(labelId.get(i)==g.getLabelId()){ //判断原权限标签是否存在
                            flag=true; //存在
                        }
                    }
                    if(!flag){
                        throw new ServiceException("权限标签不能删除");
                    }
                }
            }
            group.setGroupName(groupName);
            group.setGroupHeadimgUrl(groupHeadImgUrl);
            Set<GtdLabelEntity> set=new HashSet<>();
            boolean status=false;
            for(Integer i:labelId) {
                GtdLabelEntity labelEntity=labelJpaRespository.findByLabelId(i);
                set.add(labelEntity);
                if(i==1){//判断新增有没有权限标签
                    status=true;
                }
            }
            Date date=new Date();
            group.setLabel(set);
            group.setUpdateId(userId);
            group.setUpdateDate(new Timestamp(date.getTime()));
            if(type==0){//本地群
                if(!status) {//不加权限标签
                    groupJpaRepository.save(group);
                }else {//添加权限标签
                    //变为权限群组 给群员发通知 组成员状态默认为未接受(2)
                    groupJpaRepository.save(group);
                    List<GtdGroupMemberEntity> list=groupMemberRepository.findAllByGroupId(groupId);
                    for(GtdGroupMemberEntity g:list){
                        g.setGroupMemberStatus(2);
                    }
                    groupMemberRepository.saveAll(list);
                }
            }else {//权限群
                if(!status) {//不加权限标签
                    groupJpaRepository.save(group);
                }else {//添加权限标签
                    //发送通知
                    groupJpaRepository.save(group);
                }
            }
        }else{
            throw new ServiceException("权限不足");
        }
        return 0;
    }

    @Override
    public void delLabel(GroupInDto inDto) {
//        List<Integer> labelIds=inDto.getLabelId();
//        int groupId=inDto.getGroupId();
//        for(int i=0;i<labelIds.size();i++){
//            //判断是否为权限标签
//            if(labelIds.get(i)!=1){
//                List<GtdGroupLabel> groupLabel=groupLabelJpa.findByLabelIdAndAndGroupId(labelIds.get(i),groupId);
//                groupLabelJpa.deleteAll(groupLabel);
//            }
//        }
    }

    @Override
    public String member(GroupInDto inDto) {
//        List<Integer> userIds=inDto.getUserId();
//        String str="删除成功";
//        for(int i=0;i<userIds.size();i++){
//            List<GtdGroupMemberEntity> groupMembers=groupMemberRepository.findByUserIdAndGroupId(userIds.get(i),inDto.getGroupId());
//            if(groupMembers.size()!=0){
//                for(GtdGroupMemberEntity gtdGroupMember:groupMembers) {
//                    groupMemberRepository.delete(gtdGroupMember);
//                }
//            }else{
//                GtdGroupMemberEntity groupMember=new GtdGroupMemberEntity();
//                groupMember.setGroupId(inDto.getGroupId());
//                groupMember.setUserId(userIds.get(i));
//                groupMemberRepository.save(groupMember);
//                str="添加成功";
//            }
//        }
        return null;
    }
}
