package com.manager.master.service.serviceImpl;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.entity.*;
import com.manager.master.repository.*;
import com.manager.master.service.IGroupService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
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

            Set<GtdLabelEntity> set = g.getLabel();
            List<LabelDto> labelOut = new ArrayList<LabelDto>();
            List<LabelDto> labelOuts = new ArrayList<LabelDto>();
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
        }else if (typeId == 2){
            return results;
        } else if (typeId == 3) {
            results.addAll(result);
            return results;
        }
        return null;
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
        GtdGroupEntity group=new GtdGroupEntity();
        GtdGroupLabel groupLabel=new GtdGroupLabel();
        GtdGroupMemberEntity groupMember=new GtdGroupMemberEntity();
        int userId=inDto.getUserId();
        List<Integer> labels=inDto.getLabelId();
        String groupName=inDto.getGroupName();
        String groupHeadImgUrl=inDto.getGroupHeadimgUrl();
        List<GroupMemberDto> groupMembers=inDto.getMember();
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (labels.size() == 0 || labels==null) throw new ServiceException("标签不能为空");
        if (groupName == null || "".equals(groupName)) throw new ServiceException("群组名不能为空");
        if (groupHeadImgUrl == null || "".equals(groupHeadImgUrl)) throw new ServiceException("群头像不能为空");
        if (groupMembers.size() == 0 || groupMembers==null) throw new ServiceException("群员不能为空");
        if(labels.size()==1&&labels.get(0)==8){
            group.setGroupName(groupName);
            group.setGroupHeadimgUrl(groupHeadImgUrl);
            group.setCreateId(userId);
            group.setUserId(userId);
            group.setCreateDate((Timestamp) new Date());
            groupJpaRepository.save(group);
            int groupId=groupJpaRepository.saveAndFlush(group).getGroupId();
            if(groupId==0) throw new ServiceException("群组Id为空");
            groupLabel.setLabelId(labels.get(0));
            groupLabel.setGroupId(groupId);
            groupLabel.setCreateId(userId);
            groupLabel.setCreateDate((Timestamp) new Date());
            groupLabelJpa.save(groupLabel);
            groupMember.setUserId(userId);
            groupMember.setGroupId(groupId);
            for(GroupMemberDto g:groupMembers){
                groupMember.setUserName(g.getUserName());
                groupMember.setUserContact(g.getUserContact());
                groupMemberRepository.save(groupMember);
            }
        }else{
            group.setGroupName(groupName);
            group.setGroupHeadimgUrl(groupHeadImgUrl);
            group.setCreateId(userId);
            group.setUserId(userId);
            group.setCreateDate((Timestamp) new Date());
            boolean flag=true;
            for(Integer i:labels){
                if(i==1){
                    flag=false;
                }
            }
            if(flag){
                groupJpaRepository.save(group);
            }else{
                //发送通知确认之后添加
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
        int code=groupRepository.updateGroup(inDto);
        GtdGroupLabel groupLabel=new GtdGroupLabel();
     //   List<Integer> ids=inDto.getLabelId();
        int  count=0;
//        for(int i=0;i<ids.size();i++) {
//            groupLabel.setGroupId(inDto.getGroupId());
//            groupLabel.setLabelId(ids.get(i));
//            groupLabel.setCreateId(inDto.getCreateId());
//            groupLabelJpa.save(groupLabel);
//            count++;
//        }
        return code;
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
