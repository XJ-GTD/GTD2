package com.manager.master.service.serviceImpl;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.GroupInDto;
import com.manager.master.entity.*;
import com.manager.master.repository.*;
import com.manager.master.service.IGroupService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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


    /**
     * 查询接口
     * @param inDto
     * @return
     */
    @Override
    public List<GtdGroupEntity> select(GroupInDto inDto) {
        String groupName=inDto.getGroupName();
        String labelName=inDto.getLabelName();
        String userName=inDto.getUserName();
        if(groupName!=null&&!"".equals(groupName)){
            return groupJpaRepository.findByGroupNameIsLike("%"+groupName+"%");
        }
        if(labelName!=null&&!"".equals(labelName)) {
            List<Integer> li = groupRepository.findByLabelLike(labelName);
            List<GtdGroupEntity> list = groupJpaRepository.findByGroupIdIn(li);
            return list;
        }
        if(userName!=null&&!"".equals(userName)) {
            List<GtdGroupMemberEntity> ids=groupMemberRepository.findByUserNameLike("%"+userName+"%");
            List<Integer> li=new ArrayList<>();
            for(int i=0;i<ids.size();i++){
                li.add(ids.get(i).getGroupId());
            }
            List<GtdGroupEntity> list = groupJpaRepository.findByGroupIdIn(li);
            return list;
        }
        return null;
    }



    @Override
    public int addGroup(GroupInDto inDto) {
        GtdGroupEntity group=new GtdGroupEntity();
        GtdGroupLabel groupLabel=new GtdGroupLabel();
        group.setGroupName(inDto.getGroupName());
        group.setCreateId(inDto.getCreateId());
        group.setUserId(inDto.getCreateId());
        //group.setCreateDate();
        groupJpaRepository.save(group);

        int groupId=groupJpaRepository.saveAndFlush(group).getGroupId();

//        groupLabel.setGroupId(groupId);
//        groupLabel.setLabelId(2);
//        groupLabel.setCreateId(inDto.getCreateId());
       List<Integer> labelId=inDto.getLabelId();
        for(int i=0;i<labelId.size();i++){
            groupLabel.setGroupId(groupId);
            int id=labelId.get(i);
            groupLabel.setLabelId(id);
//            //groupLabel.setUserId();
//            //groupLabel.setCreateDate();
        groupLabelJpa.save(groupLabel);
        }
        return 0;
    }

    @Override
    public int addLabel(GroupInDto inDto) {
        GtdGroupLabel groupLabel=new GtdGroupLabel();
        List<Integer> ids=inDto.getLabelId();
        int  count=0;
        for(int i=0;i<ids.size();i++) {
            groupLabel.setGroupId(inDto.getGroupId());
            groupLabel.setLabelId(ids.get(i));
            groupLabel.setCreateId(inDto.getCreateId());
            groupLabelJpa.save(groupLabel);
            count++;
        }
        return count;

    }

    @Override
    public void delGroup(GroupInDto inDto) {
        int id=inDto.getGroupId();
        groupJpaRepository.deleteById(id);
    }

    @Override
    public void updateGname(GroupInDto inDto) {
        groupRepository.updateGroup(inDto);
    }

    @Override
    public void delLabel(GroupInDto inDto) {
        List<Integer> labelIds=inDto.getLabelId();
        int groupId=inDto.getGroupId();
        for(int i=0;i<labelIds.size();i++){
            //判断是否为权限标签
            if(labelIds.get(i)!=1){
                List<GtdGroupLabel> groupLabel=groupLabelJpa.findByLabelIdAndAndGroupId(labelIds.get(i),groupId);
                groupLabelJpa.deleteAll(groupLabel);
            }
        }
    }

    @Override
    public String member(GroupInDto inDto) {
        List<Integer> userIds=inDto.getUserId();
        String str="删除成功";
        for(int i=0;i<userIds.size();i++){
            List<GtdGroupMemberEntity> groupMembers=groupMemberRepository.findByUserIdAndGroupId(userIds.get(i),inDto.getGroupId());
            if(groupMembers.size()!=0){
                for(GtdGroupMemberEntity gtdGroupMember:groupMembers) {
                    groupMemberRepository.delete(gtdGroupMember);
                }
            }else{
                GtdGroupMemberEntity groupMember=new GtdGroupMemberEntity();
                groupMember.setGroupId(inDto.getGroupId());
                groupMember.setUserId(userIds.get(i));
                groupMemberRepository.save(groupMember);
                str="添加成功";
            }
        }
        return str;
    }
}
