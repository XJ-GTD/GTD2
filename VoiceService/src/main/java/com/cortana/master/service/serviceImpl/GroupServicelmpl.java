//package com.xiaoji.master.service.serviceImpl;
//
//import com.xiaoji.config.exception.ServiceException;
//import com.xiaoji.master.service.IGroupService;
//import com.xiaoji.master.service.IWebSocketService;
//import com.xiaoji.util.CommonMethods;
//import com.xiaoji.master.dto.*;
//import com.xiaoji.master.entity.*;
//import com.xiaoji.master.repository.*;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import javax.annotation.Resource;
//import java.sql.Timestamp;
//import java.util.*;
//
///**
// * 群组Service实现类
// *
// * create by wzy on 2018/08/24
// */
//@Service
//@Transactional
//public class GroupServicelmpl implements IGroupService {
//
//    private static final String PUSH_MESSAGE_GROUP_CREATE = "请注意加入该群后将会自动同意群主的日程邀请";       //权限群 添加群成员 推送
//    private static final String PUSH_MESSAGE_GROUP_DELETE = "当前用户群已被群主删除";       //删除权限群 推送
//    private static final String PUSH_MESSAGE_GROUP_ADD = "当前群组添加新的权限标签";       //权限群添加新的权限标签 推送
//    private Logger logger = LogManager.getLogger(this.getClass());
//
//    private static int FIND_GROUP_LABELTYPE = 8;    //查询参与人类型：个人
//    @Resource
//    private GroupJpaRepository groupJpaRepository;
//
//    @Resource
//    private GroupRepository groupRepository;
//
//    @Resource
//    private GroupLabelJpaRepository groupLabelJpa;
//
//    @Resource
//    private GroupMemberRepository groupMemberRepository;
//
//    @Resource
//    private LabelJpaRespository labelJpaRespository;
//
//    @Resource
//    private LabelRuleJpaRepository labelRuleJpaRepository;
//
//    @Resource
//    private CenterGroupScheduleRepository groupScheduleJpaRepository;
//
//    @Resource
//    private SchedulePlayersRepository schedulePlayersJpaRepository;
//
//    @Resource
//    private RemindJpaRepository remindJpaRepository;
//
//    @Resource
//    private IWebSocketService iWebSocketService;
//
//
//    /**
//     * 参与人列表查询
//     * @param inDto
//     * @return
//     */
//    @Override
//    public List<GroupOutDto> selectAll(GroupFindInDto inDto) {
//
//        int userId = inDto.getUserId();
//        int typeId = inDto.getFindType();
//        logger.info("参与人列表查询 用户Id " + userId + "查询类型 findType :" + typeId);
//        if (userId == 0) throw new ServiceException("用户ID不能为空");
//        if (typeId == 0) throw new ServiceException("类型ID不能为空");
//
//        List<GtdGroupEntity> list = null;
////            GtdLabelEntity gle = labelJpaRespository.findByLabelId(FIND_GROUP_LABELTYPE);
//            if(typeId==1) {
//                try {
//                    list = groupJpaRepository.findAllSingle(userId,FIND_GROUP_LABELTYPE);//查询个人
//                }catch (Exception e) {
//                    throw new ServiceException("查询失败");
//                }
//            }else if(typeId==2){
//                try {
//                    list = groupJpaRepository.findAllGroup(userId,FIND_GROUP_LABELTYPE);//查询群组
//                }catch (Exception e) {
//                    throw new ServiceException("查询失败");
//                }
//            }else if (typeId == 3) {
//                return null;
//            } else {
//                throw new ServiceException("请输入正确的查询类型");
//            }
////            if (list == null || list.size() == 0 ) {
////               return null;
////            }
//
//        List<GtdGroupEntity>  res=new ArrayList<>();
//        for(GtdGroupEntity g : list){
//          //  List<Integer> ints=groupMemberRepository.findAllUserIdByGroupId(g.getGroupId());
//            List<Integer> ints = groupJpaRepository.findAllUserIdByGroupId(g.getGroupId());
////            if(ints.indexOf(userId)!=-1){
////                res.add(g); //把当前用户所属群组添加
////            }
//            for(int i=0;i<ints.size();i++){//判断当前用户存不存在g群组
//
//                if (ints.get(i)!=null&&ints.get(i) == userId) {
//                        res.add(g); //把当前用户所属群组添加
//                }
//            }
//        }
//        System.out.println(res.size());
//
////        for(GtdGroupEntity g:res){
////            System.out.println(g.getGroupName());
////        }
//
//        List<GroupOutDto> result = new ArrayList<>();
//        for (GtdGroupEntity g : res) {
//            GroupOutDto group = new GroupOutDto();
//            //添加群组信息
//            group.setGroupId(g.getGroupId());
//            group.setGroupName(g.getGroupName());
//            group.setGroupHeadImg(g.getGroupHeadimgUrl());
//            group.setGroupCreateId(g.getUserId());          //创建人
//
//            Set<GtdGroupMemberEntity> users = g.getGroupMember();
//            List<GroupMemberDto> memberDtos = new ArrayList<>();
//            for (GtdGroupMemberEntity user : users) {
//                GroupMemberDto memberDto = new GroupMemberDto();
//                //添加群组用户信息
//                if(user.getUserId()!=null) {
//                    memberDto.setUserId(user.getUserId());
//                }
//                memberDto.setUserName(user.getUserName());
//                memberDto.setUserContact(user.getUserContact());
//                int status=user.getGroupMemberStatus();
//                logger.info("群组成员状态："+user.getUserName()+","+status);
//                if (status != 2 && status != 3) { //用户状态不为拒绝或未接受才显示
//                    memberDtos.add(memberDto);
//                }
//
//            }
//            group.setGroupMembers(memberDtos);
//            Set<GtdLabelEntity> set = g.getLabel();
//            List<LabelOutDto> labelOut = new ArrayList<LabelOutDto>();
//
//            for (GtdLabelEntity label : set) {
//                //添加群组标签信息
//                LabelOutDto l = new LabelOutDto();
//                l.setLabelId(label.getLabelId());
//                l.setLabelName(label.getLabelName());
//                labelOut.add(l);
//            }
//            group.setLabelList(labelOut);
//            result.add(group);
//        }
//        logger.info("参与人列表："+result);
//            return result;
//    }
//
//
//    /**
//     * 查询参与人详情
//     *
//     * @param inDto
//     * @return
//     */
//    @Override
//    public GroupOutDto selectMessage(GroupFindInDto inDto) {
//        int userId = inDto.getUserId();
//        int groupId = inDto
//                .getGroupId();
//        logger.info("参与人详情查询 用户Id " + userId + "群组ID :" + groupId);
//        if (userId == 0) throw new ServiceException("用户ID不能为空");
//        if (groupId == 0) throw new ServiceException("群组ID不能为空");
//
//        GtdGroupEntity groupEntity=null;
//        try {
//            groupEntity = groupJpaRepository.getOne(groupId);//获取当前群组
//        }catch (Exception e){
//            throw new ServiceException("该群组不存在");
//        }
//
//        List<GtdGroupMemberEntity> g = groupMemberRepository.findMemberByGroupId(groupId); //获取该群组所有群成员
//            if(g==null||g.size()==0){
//                throw new ServiceException("该群组下没有成员");
//            }
//
////        for(GtdGroupMemberEntity d:g) {
////            System.out.println(d.getUserName());
////        }
//
//        GroupOutDto group = new GroupOutDto();
//        group.setGroupId(groupId);
//        group.setGroupName(groupEntity.getGroupName());
//        Set<GtdLabelEntity> set = groupEntity.getLabel();
//        List<LabelOutDto> labelOut = new ArrayList<LabelOutDto>();
//        for (GtdLabelEntity label : set) { //标签信息
//            LabelOutDto l = new LabelOutDto();
//            l.setLabelId(label.getLabelId());
//            l.setLabelName(label.getLabelName());
//            labelOut.add(l);
//        }
//        group.setLabelList(labelOut);
//        List<GroupMemberDto> members = new ArrayList<>();
//        for (GtdGroupMemberEntity member : g) { //群成员信息
//            GroupMemberDto groupMember = new GroupMemberDto();
//            groupMember.setUserId(member.getUserId());
//            groupMember.setUserName(member.getUserName());
//            groupMember.setUserContact(member.getUserContact());
//            members.add(groupMember);
//        }
//        group.setGroupMembers(members);
//        return group;
//    }
//
//
//    /**
//     * 根据条件模糊查询群组
//     *
//     * @param inDto
//     * @return
//     */
//    @Override
//    public List<GroupOutDto> getListGroupByMessage(GroupInDto inDto) {
//        Integer labelId=inDto.getLabelId();
//        String groupName=inDto.getGroupName();
//        logger.info("根据条件查询 labelId:"+labelId+"groupName:"+groupName);
//        if(labelId==null){
//            if(groupName==null||"".equals(groupName)) {
//                throw new ServiceException("请传入查询参数");
//            }
//        }else{
//            if(!(groupName==null||"".equals(groupName))){
//                throw new ServiceException("不能传入多个参数");
//            }
//        }
//
//        if(groupName != null && !"".equals(groupName)){
//            if (CommonMethods.checkMySqlReservedWords(groupName)){
//                throw new ServiceException("群组名称包含关键字");
//            }
//            if(groupName.length()>10){
//                throw new ServiceException("群名称过长");
//            }
//        }
//
//        //接收返回结果
//        List<GroupOutDto> groupOutDtos=new ArrayList<>();
//        //查询群组ID集合
//        List<Integer> groupIds=null;
//        if(labelId==null) {
//             groupIds = groupJpaRepository.getGroupIdsForGroupName(groupName);
//        }else {
//             groupIds = groupJpaRepository.getGroupIdsForLabelId(labelId);
//        }
//        if(groupIds.size()==0){
//            return null;
//        }
//        //遍历所有群组
//        for(Integer i:groupIds){
//            GtdGroupEntity groupEntity=groupJpaRepository.getOne(i);
//            GroupOutDto group = new GroupOutDto();
//            group.setGroupId(i);
//            group.setGroupName(groupEntity.getGroupName());
//            group.setGroupHeadImg(groupEntity.getGroupHeadimgUrl());
//            group.setGroupCreateId(groupEntity.getCreateId());
//            Set<GtdLabelEntity> set = groupEntity.getLabel();
//            //群组标签
//            List<LabelOutDto> labelOut = new ArrayList<LabelOutDto>();
//            for (GtdLabelEntity label : set) {
//                LabelOutDto l = new LabelOutDto();
//                l.setLabelId(label.getLabelId());
//                l.setLabelName(label.getLabelName());
//                labelOut.add(l);
//            }
//            group.setLabelList(labelOut);//添加群组标签
//            //群组成员
//            List<GroupMemberDto> members = new ArrayList<>();
//            for (GtdGroupMemberEntity member : groupEntity.getGroupMember()) { //群成员信息
//                GroupMemberDto groupMember = new GroupMemberDto();
//                groupMember.setUserId(member.getUserId());
//                groupMember.setUserName(member.getUserName());
//                groupMember.setUserContact(member.getUserContact());
//                members.add(groupMember);
//            }
//            group.setGroupMembers(members);//添加群成员
//            //接收结果
//            groupOutDtos.add(group);
//        }
//        return groupOutDtos;
//    }
//
//    /**
//     * 查询群成员
//     * @param inDto
//     * @return
//     */
//    @Override
//    public List<GroupMemberDto> findMember(GroupFindInDto inDto) {
//        int userId = inDto.getUserId();
//        int groupId = inDto.getGroupId();
//        int findType=inDto.getFindType();
//        logger.info("查询群成员 用户ID:"+userId+"，群组ID:"+groupId+"，查询类型:"+findType);
//        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
//        if (findType == 0 || "".equals(findType)) throw new ServiceException("类型不能为空");
//        if(findType==2){
//            if (groupId == 0 || "".equals(groupId)) throw new ServiceException("群组ID不能为空");
//        }
//        if(findType==1){
//            if (groupId != 0 && !("".equals(groupId))) throw new ServiceException("参数错误");
//        }
//
//        List<Integer> groupIds=groupJpaRepository.findGroupIdByUserId(userId);//获取用户下所有群组ID
//        if(groupIds==null||groupIds.size()==0) throw new ServiceException("该用户下没有群组");
//
//        List<GtdGroupMemberEntity> groupMemberEntities=null;
//        if(findType==2) {
//            //获取该群组下所有群成员
//            groupMemberEntities = groupMemberRepository.findMemberByGroupId(groupId);
//            if (groupMemberEntities == null || groupMemberEntities.size() == 0 ) {
//                findType=1;
//            }
//        }
//
//        List<GroupMemberDto> list=new ArrayList<>();
//
//        for(Integer index:groupIds){
//            //获取每个群组下面全部群成员
//            List<GtdGroupMemberEntity> groupMembers=groupMemberRepository.findMemberByGroupId(index);
//
//            for(GtdGroupMemberEntity groupMember:groupMembers){
//                if(groupMember.getGroupMemberStatus()!=2||groupMember.getGroupMemberStatus()!=3) {
//                    GroupMemberDto outDto = new GroupMemberDto();
//                    outDto.setUserId(groupMember.getUserId());
//                    outDto.setUserName(groupMember.getUserName());
//                    outDto.setUserContact(groupMember.getUserContact());
//                    if(findType==1){
//                        outDto.setUserStatus(0);
//                        boolean flag=true;
//                        for(int i=0;i<list.size();i++){
//                            if(list.get(i).getUserId()==groupMember.getUserId()){
//                                flag=false;
//                            }
//                        }
//                        if(flag){
//                            list.add(outDto);
//                        }
//                    }else if(findType==2){
//                        //if(groupMemberEntities.indexOf(groupMember)==-1){
//                        if(groupMemberRepository.findMemberByGroupIdAndUserId(groupId,groupMember.getUserId())==null){
//                            outDto.setUserStatus(0);
//                        }else{
//                            outDto.setUserStatus(1);
//                        }
//                        System.out.println(groupMemberEntities.indexOf(groupMember));
//                        boolean flag=true;
//                        for(int i=0;i<list.size();i++){
//                            if(list.get(i).getUserId()==groupMember.getUserId()){
//                                flag=false;
//                            }
//                        }
//                        if(flag){
//                            list.add(outDto);
//                        }
//                    }else{
//                        throw new ServiceException("请输入正确的查询类型");
//                    }
//                }
//            }
//        }
//        return list;
//    }
//
//
//    /**
//     * 添加群组
//     *
//     * @param inDto
//     * @return
//     */
//    @Override
//    public int addGroup(GroupInDto inDto) {
//        int userId = 0;
//        List<Integer> labelIds = null;
//        String groupName = null;
//        String groupHeadImg = null;
//        List<GroupMemberDto> groupMembers = null;
//        try {
//            userId = inDto.getUserId();
//            labelIds = inDto.getLabelIds();
//            groupName = inDto.getGroupName();
//            groupHeadImg = inDto.getGroupHeadImg();
//            groupMembers = inDto.getGroupMembers();
//        } catch (Exception e) {
//            throw new ServiceException("参数错误");
//        }
//        logger.info("添加群组 用户ID"+userId+"标签ID"+ labelIds +"群头像"+groupHeadImg+"群名"+groupName+"群成员"+groupMembers);
//        if (userId == 0) throw new ServiceException("用户ID不能为空");
//        if (labelIds ==null||labelIds.size() == 0) throw new ServiceException("标签不能为空");
//        if (groupName == null || "".equals(groupName)) throw new ServiceException("群组名不能为空");
//        if (groupHeadImg == null || "".equals(groupHeadImg)) throw new ServiceException("群头像不能为空");
//        if(!("".equals(groupName))){
//            if (CommonMethods.checkMySqlReservedWords(groupName)){
//                throw new ServiceException("群组名称包含关键字");
//            }
//        }
//
//        if(groupMembers != null) {
//            for (GroupMemberDto g : groupMembers) {
//                if (CommonMethods.checkMySqlReservedWords(g.getUserName())) {
//                    throw new ServiceException("群成员姓名包含关键字");
//                }
//                if (!CommonMethods.checkIsPhoneNumber(g.getUserContact())) {
//                    throw new ServiceException("群成员联系方式格式错误");
//                }
//            }
//        }
//
//        Date date = new Date();
//        for(Integer i:labelIds){
//            if(labelIds.size()!=1&&i== FIND_GROUP_LABELTYPE){
//                throw new ServiceException("群组不能添加单人标签");
//            }
//            if(labelRuleJpaRepository.getIdByLabel(i)!=null){
//                if (groupMembers.size()==0) throw new ServiceException("权限群组需添加群成员");
//            }
//        }
//
//        if (labelIds.size() == 1 && labelIds.get(0) == FIND_GROUP_LABELTYPE) {
//            //创建单人
//            GtdGroupEntity group = new GtdGroupEntity();
//            group.setGroupName(groupName);
//            group.setGroupHeadimgUrl(groupHeadImg);
//            group.setCreateId(userId);
//            group.setUserId(userId);
//            group.setCreateDate(new Timestamp(date.getTime()));
//            //获取新建群组的主键id
//            int groupId = groupJpaRepository.saveAndFlush(group).getGroupId();
//            if (groupId == 0) throw new ServiceException("群组Id为空");
//            for (Integer i : labelIds) {
//                //添加群组标签
//                GtdGroupLabel groupLabel = new GtdGroupLabel();
//                groupLabel.setLabelId(i);
//                groupLabel.setGroupId(groupId);
//                groupLabel.setCreateId(userId);
//                groupLabel.setCreateDate(new Timestamp(date.getTime()));
//                groupLabelJpa.saveAndFlush(groupLabel);
//            }
//
//            if(groupMembers!=null) {
//                for (GroupMemberDto g : groupMembers) {
//                    //添加群成员信息
//                    GtdGroupMemberEntity groupMember = new GtdGroupMemberEntity();
//                    Integer id = groupRepository.findUserId(g.getUserContact());
//                    groupMember.setUserId(id);
//                    groupMember.setGroupId(groupId);
//                    groupMember.setUserName(g.getUserName());
//                    groupMember.setUserContact(g.getUserContact());
//                    groupMember.setGroupMemberStatus(0);
//                    groupMember.setCreateId(userId);
//                    groupMember.setCreateDate(new Timestamp(date.getTime()));
//                    groupMemberRepository.saveAndFlush(groupMember);
//                }
//            }
//        } else {
//            //创建群组
//            GtdGroupEntity group = new GtdGroupEntity();
//            group.setGroupName(groupName);
//            group.setGroupHeadimgUrl(groupHeadImg);
//            group.setCreateId(userId);
//            group.setUserId(userId);
//            group.setCreateDate(new Timestamp(date.getTime()));
//            boolean flag = true;
//            for (Integer i : labelIds) {
//                if (labelRuleJpaRepository.getIdByLabel(i)!=null) {//判断是否含有权限标签
//                    flag = false;
//                }
//            }
//
//
//            GtdGroupEntity groupEntity = groupJpaRepository.saveAndFlush(group);
//            int groupId = groupEntity.getGroupId();
//            if (groupId == 0) throw new ServiceException("群组Id为空");
//
//            for (Integer i : labelIds) {
//                GtdGroupLabel groupLabel = new GtdGroupLabel();
//                groupLabel.setLabelId(i);
//                groupLabel.setGroupId(groupId);
//                groupLabel.setCreateId(userId);
//                groupLabel.setCreateDate(new Timestamp(date.getTime()));
//                groupLabelJpa.save(groupLabel);
//            }
//
//            List<Integer> memberUserId=new ArrayList<>();
//            if(groupMembers!=null) {
//                for (GroupMemberDto g : groupMembers) {
//                    GtdGroupMemberEntity groupMember = new GtdGroupMemberEntity();
//                    Integer id = groupRepository.findUserId(g.getUserContact());
//                    groupMember.setUserId(id);
//                    groupMember.setGroupId(groupId);
//                    groupMember.setUserName(g.getUserName());
//                    groupMember.setUserContact(g.getUserContact());
//                    groupMember.setCreateId(userId);
//                    groupMember.setCreateDate(new Timestamp(date.getTime()));
//                    if (!flag) {
//                        //权限群组 群成员默认状态为未接受 2
//                        groupMember.setGroupMemberStatus(2);
//                    } else {//本地群组
//                        groupMember.setGroupMemberStatus(0);
//                    }
//                    memberUserId.add(id);
//                    groupMemberRepository.save(groupMember);
//                }
//            }
//
//            if(!flag) {//为权限群组
//                //TODO 发送通知
//                PushInDto pushInDto = new PushInDto();
//                pushInDto.setUserId(userId);
//                pushInDto.setMemberUserId(memberUserId);
//                PushOutDto pushOutDto=new PushOutDto();
//                pushOutDto.setMessageId(groupId);
//                pushOutDto.setMessageName(groupName);
//                pushOutDto.setUserName(groupJpaRepository.findUNameByUserId(userId));
//                pushOutDto.setMessageContent(PUSH_MESSAGE_GROUP_CREATE);
//                pushOutDto.setType(2);
//                //iWebSocketService.pushToUser(pushInDto);
//            }
//
//        }
//        return 0;
//    }
//
//
//    /**
//     * 删除群组
//     *
//     * @param inDto
//     * @return
//     */
//    @Override
//    public int delGroup(GroupInDto inDto) {
//        int userId = 0;
//        int groupId = 0;
//        try {
//            userId = inDto.getUserId();
//            groupId = inDto.getGroupId();
//        } catch (Exception e) {
//            throw new ServiceException("参数错误，请检查后重新输入");
//        }
//        logger.info("用户ID"+userId+"群组ID"+groupId);
//        if (userId == 0) throw new ServiceException("用户ID不能为空");
//        if (groupId == 0) throw new ServiceException("群组ID不能为空");
//        GtdGroupEntity group = null;
//        try {
//            group = groupJpaRepository.getOne(groupId);
//        } catch (Exception e) {
//            throw new ServiceException("群组不存在");
//        }
//
//        //根据群组ID获取群组下所有用户ID
//        List<Integer> userIds=groupMemberRepository.findAllUserIdByGroupId(groupId);
//        int createId=group.getCreateId();
//        if(userId==createId) {//判断是否为群组创建人
//            boolean flag = false; //判断是否为权限群组
//            Set<GtdLabelEntity> labels = group.getLabel();
//            for (GtdLabelEntity label : labels) {
//                if (label.getLabelId() == 1) {
//                    flag = true;
//                }
//            }
//            if (flag) {
//                //根据群组ID获得该群组的日程
//                List<GtdGroupScheduleEntity> groupSchedules=groupScheduleJpaRepository.findGroupSchedulesByGroupId(groupId);
//                if(groupSchedules!=null) {
//                    for (GtdGroupScheduleEntity g : groupSchedules) {
//                        int scheduleId = g.getScheduleId();//获取日程ID
//
//                        boolean boo = true;
//                        //根据日程ID获取有该日程的所有群组 判断这些群组中有没有此用户
//                        List<GtdGroupScheduleEntity> groups = groupScheduleJpaRepository.selectByScheduleId(scheduleId);
//                        for (GtdGroupScheduleEntity gs : groups) {
//                            if (gs.getGroupId() != groupId) {
//                                List<GtdGroupMemberEntity> groupMembers = groupMemberRepository.findMemberByGroupId(gs.getGroupId());
//                                for (GtdGroupMemberEntity member : groupMembers) {
//                                    if (member.getUserId() == userId) {
//                                        boo = false;
//                                    }
//                                }
//                            }
//                        }
//
//                        //在其他此日程群组不存在就删除
//                        if (boo) {
//                            List<Integer> playerIds = schedulePlayersJpaRepository.findAllPlayersId(scheduleId);
//                            for (Integer i : playerIds) {
//                                remindJpaRepository.deleteAllByPlayersId(i);//删除提醒时间表
//                            }
//                            for(Integer i:userIds) {
//                                schedulePlayersJpaRepository.deleteConnectionByScheduleIdAndUserId(scheduleId,i);//删除参与人表
//                            }
//                        }
//                    }
//                }
//               groupRepository.deleteByGroupId(groupId);//删除群组、群组标签、群成员、群组日程
//                // TODO 权限群组给群成员发送通知 删除群组
//
//                    PushInDto pushInDto = new PushInDto();
//                    pushInDto.setUserId(userId);
//                    pushInDto.setMemberUserId(userIds);
//                    PushOutDto pushOutDto=new PushOutDto();
//                    pushOutDto.setMessageId(groupId);
//                    pushOutDto.setMessageName(groupJpaRepository.findGNameByUserId(groupId));
//                    pushOutDto.setUserName(groupJpaRepository.findUNameByUserId(userId));
//                    pushOutDto.setMessageContent(PUSH_MESSAGE_GROUP_DELETE);
//                    pushOutDto.setType(2);
//                    //iWebSocketService.pushToUser(pushInDto);
//
//            } else {
//                //本地群组直接删除
//                groupRepository.deleteByGroupId(groupId);//删除群组、群组标签、群成员、群组日程
//
//            }
//        }else {
//            throw new ServiceException("没有删除权限");
//        }
//        return 0;
//    }
//
//    /**
//     * 退出群组
//     * @param inDto
//     * @return
//     */
//    @Override
//    public int exitGroup(GroupInDto inDto) {
//        int userId = 0;
//        int groupId = 0;
//        try {
//            userId = inDto.getUserId();
//            groupId = inDto.getGroupId();
//        } catch (Exception e) {
//            throw new ServiceException("参数错误，请检查后重新输入");
//        }
//        logger.info("用户ID"+userId+"群组ID"+groupId);
//        if (userId == 0 ) throw new ServiceException("用户ID不能为空");
//        if (groupId == 0) throw new ServiceException("群组ID不能为空");
//        GtdGroupEntity group = null;
//        try {
//            group = groupJpaRepository.getOne(groupId);
//        } catch (Exception e) {
//            throw new ServiceException("群组不存在");
//        }
//        //根据群组ID获取群组下所有用户ID
//        List<Integer> userIds=groupMemberRepository.findAllUserIdByGroupId(groupId);
//
//        int createId=group.getCreateId();
//        if(userId!=createId) {
//            //不是群组创建人
//            List<GtdGroupScheduleEntity> groupSchedules=groupScheduleJpaRepository.findGroupSchedulesByGroupId(groupId);
//            for(GtdGroupScheduleEntity g:groupSchedules) {
//                int scheduleId = g.getScheduleId();
//                boolean boo = true;
//                //根据日程ID获取有该日程的所有群组 判断这些群组中有没有此用户
//                List<GtdGroupScheduleEntity> groups = groupScheduleJpaRepository.selectByScheduleId(scheduleId);
//                for (GtdGroupScheduleEntity gs : groups) {
//                    if (gs.getGroupId() != groupId) {
//                        List<GtdGroupMemberEntity> groupMembers = groupMemberRepository.findMemberByGroupId(gs.getGroupId());
//                        for (GtdGroupMemberEntity member : groupMembers) {
//                            if (member.getUserId() == userId) {
//                                boo = false;
//                            }
//                        }
//                    }
//                }
//                if(boo) {
//                    Integer playerIds = schedulePlayersJpaRepository.findPlayersIdByUserIdAndScheduleId(scheduleId, userId);
//                    remindJpaRepository.deleteAllByPlayersId(playerIds);//删除提醒时间表
//                    schedulePlayersJpaRepository.deleteConnectionByScheduleIdAndUserId(scheduleId, userId);//删除参与人表
//                }
//            }
//            groupMemberRepository.deleteGroupMember(userId,groupId);
//        }else{
//            //删除群组
//            boolean flag = false; //判断是否为权限群组
//            Set<GtdLabelEntity> labels = group.getLabel();
//            for (GtdLabelEntity label : labels) {
//                if (labelRuleJpaRepository.getIdByLabel(label.getLabelId())!=null) {
//                    flag = true;
//                }
//            }
//            if (flag) {
//                // 权限群组发送通知 删除群组
//                //根据群组ID获得该群组的日程
//                List<GtdGroupScheduleEntity> groupSchedules=groupScheduleJpaRepository.findGroupSchedulesByGroupId(groupId);
//                if(groupSchedules!=null&&groupSchedules.size()!=0) {
//                    for (GtdGroupScheduleEntity g : groupSchedules) {
//                        int scheduleId = g.getScheduleId();//获取日程ID
//
//                        boolean boo = true;
//                        //根据日程ID获取有该日程的所有群组 判断这些群组中有没有此用户
//                        List<GtdGroupScheduleEntity> groups = groupScheduleJpaRepository.selectByScheduleId(scheduleId);
//                        for (GtdGroupScheduleEntity gs : groups) {
//                            if (gs.getGroupId() != groupId) {
//                                List<GtdGroupMemberEntity> groupMembers = groupMemberRepository.findMemberByGroupId(gs.getGroupId());
//                                for (GtdGroupMemberEntity member : groupMembers) {
//                                    if (member.getUserId() == userId) {
//                                        boo = false;
//                                    }
//                                }
//                            }
//                        }
//
//                        //在其他此日程群组不存在就删除
//                        if (boo) {
//                            List<Integer> playerIds = schedulePlayersJpaRepository.findAllPlayersId(scheduleId);
//                            for (Integer i : playerIds) {
//                                remindJpaRepository.deleteAllByPlayersId(i);//删除提醒时间表
//                            }
//                            for(Integer i:userIds) {
//                                schedulePlayersJpaRepository.deleteConnectionByScheduleIdAndUserId(scheduleId,i);//删除参与人表
//                            }
//                        }
//                    }
//                }
//                groupRepository.deleteByGroupId(groupId);//删除群组、群组标签、群成员、群组日程
//                //TODO 权限群组发送通知 删除群组
//                PushInDto pushInDto = new PushInDto();
//                pushInDto.setUserId(userId);
//                pushInDto.setMemberUserId(userIds);
//                PushOutDto pushOutDto=new PushOutDto();
//                pushOutDto.setMessageId(groupId);
//                pushOutDto.setMessageName(groupJpaRepository.findGNameByUserId(groupId));
//                pushOutDto.setUserName(groupJpaRepository.findUNameByUserId(userId));
//                pushOutDto.setMessageContent(PUSH_MESSAGE_GROUP_DELETE);
//                pushOutDto.setType(2);
//                //iWebSocketService.pushToUser(pushInDto);
//            } else {
//                //本地群组直接删除
//                groupRepository.deleteByGroupId(groupId);//删除群组、群组标签、群成员、群组日程
//
//            }
//        }
//        return 0;
//    }
//
//
//    /**
//     * 编辑群组
//     *
//     * @param inDto
//     * @return
//     */
//    @Override
//    public int updateGname(GroupInDto inDto) {
//        int userId = 0;
//        int groupId = 0;
//        List<Integer> labelIds = null;
//        String groupName = null;
//        String groupHeadImg = null;
//        List<GroupMemberDto> groupMembers = null;
//        try {
//            userId = inDto.getUserId();
//            groupId = inDto.getGroupId();
//            labelIds = inDto.getLabelIds();
//            groupName = inDto.getGroupName();
//            groupHeadImg = inDto.getGroupHeadImg();
//            groupMembers = inDto.getGroupMembers();
//        } catch (Exception e) {
//            throw new ServiceException("参数错误，请检查后重新输入");
//        }
//        logger.info("编辑群组 用户ID"+userId+"群组ID"+groupId+"标签ID"+labelIds+"群头像"+groupHeadImg+"群名"+groupName+"群成员"+groupMembers);
//        if (groupMembers==null||groupMembers.size() == 0) throw new ServiceException("群员不能为空");
//        if (userId == 0) throw new ServiceException("用户ID不能为空");
//        if (groupId == 0) throw new ServiceException("群组ID不能为空");
//        if (labelIds==null||labelIds.size()==0) throw new ServiceException("标签不能为空");
//        if(CommonMethods.checkMySqlReservedWords(groupName)){
//            throw new ServiceException("群组名称包含关键字");
//        }
//
//
//        for(GroupMemberDto g:groupMembers){
//            if(CommonMethods.checkMySqlReservedWords(g.getUserName())){
//                throw new ServiceException("群成员姓名包含关键字");
//            }
//            if(!CommonMethods.checkIsPhoneNumber(g.getUserContact())){
//                throw new ServiceException("群成员联系方式格式错误");
//            }
//        }
//
//        //查询该群组
//        GtdGroupEntity group = groupJpaRepository.getOne(groupId);
//        //查询群组下所有群成员
//        List<Integer> userIds=groupMemberRepository.findAllUserIdByGroupId(groupId);
//        logger.info("原群组成员ID："+userIds.toString());
//        int createId = group.getCreateId();
//        Set<GtdLabelEntity> labels = group.getLabel();//群组原标签
//
//        if (createId == userId) {
//            boolean flag = true;
//            int type = 0;//本地群
//            for (GtdLabelEntity g: labels) {
//                if (labelRuleJpaRepository.getIdByLabel(g.getLabelId())!=null) { //判断群组标签中是否含有权限标签
//                    flag = false;
//                    type = 1;//权限群
//                    for (int i = 0; i < labelIds.size(); i++) {
//                        if (labelIds.get(i) == g.getLabelId()) { //判断原权限标签是否存在
//                            flag = true; //存在
//                        }
//                    }
//                    if (!flag) {
//                        throw new ServiceException("权限标签不能删除");
//                    }
//                }
//                if(labelIds.indexOf(g.getLabelId())==-1){
//                    groupJpaRepository.deleteByGroupIdAndLabelId(groupId,g.getLabelId());
//                }
//            }
//
//            for(Integer i:labelIds){
//                boolean boo=true;
//                for(GtdLabelEntity g:labels) {
//                    if (g.getLabelId()==i) {
//                        boo=false;
//                    }
//                }
//                if(boo){
//                    GtdGroupLabel gtdGroupLabel = new GtdGroupLabel();
//                    gtdGroupLabel.setGroupId(groupId);
//                    gtdGroupLabel.setLabelId(i);
//                    gtdGroupLabel.setCreateId(userId);
//                    gtdGroupLabel.setCreateDate(new Timestamp(new Date().getTime()));
//                    groupLabelJpa.save(gtdGroupLabel);
//                }
//            }
//
//            if(!group.getGroupName().equals(groupName)&&groupName!=null) {
//                group.setGroupName(groupName);
//            }
//            if(!group.getGroupHeadimgUrl().equals(groupHeadImg)&&groupHeadImg!=null) {
//                group.setGroupHeadimgUrl(groupHeadImg);
//            }
//            Set<GtdLabelEntity> set = new HashSet<>();
//            boolean status = false;
//            for (Integer i : labelIds) {
//                GtdLabelEntity labelEntity = labelJpaRespository.findGtdLabelEntityByLabelId(i);
//                set.add(labelEntity);
//                if (labelRuleJpaRepository.getIdByLabel(i)!=null) {//判断新增有没有权限标签
//                    status = true;
//                }
//            }
//            Date date = new Date();
//            group.setUserId(userId);
//            //group.setLabel(set);
//            group.setUpdateId(userId);
//            group.setUpdateDate(new Timestamp(date.getTime()));
//            logger.info("修改后的群组"+group);
//            groupJpaRepository.save(group);
//
//            List<Integer> userIns = new ArrayList<>();
//            if (groupMembers != null) {
//                List<Integer> memberUserId=new ArrayList<>();
//                for (GroupMemberDto gmDto : groupMembers) {
//                    if (gmDto.getUserContact() == null || "".equals(gmDto.getUserContact()))
//                        throw new ServiceException("群员联系方式不能为空");
//                    if (gmDto.getUserName() == null || "".equals(gmDto.getUserName())) {
//                        throw new ServiceException("群员姓名不能为空");
//                    }else if(CommonMethods.checkMySqlReservedWords(groupName)){
//                        throw new ServiceException("群成员名称包含关键字");
//                    }
//                    GtdGroupMemberEntity groupMember = groupMemberRepository.findMemberByGroupIdAndUserId(groupId, groupRepository.findUserId(gmDto.getUserContact()));
//
//                    if (groupMember != null) {
//                        userIns.add(groupRepository.findUserId(gmDto.getUserContact()));
//                        if(type==0&&!status) {//本地群组才能编辑群成员且没有增加权限标签
//                            //groupMember.setUserId(groupRepository.findUserId(gmDto.getMemeberContact()));
//                            groupMember.setUserName(gmDto.getUserName());
//                            groupMember.setUserContact(gmDto.getUserContact());
//                            groupMember.setUpdateId(userId);
//                            groupMember.setUpdateDate(new Timestamp(new Date().getTime()));
//                            groupMemberRepository.save(groupMember);
//                        }
//                    } else {
//
//                        //群成员不存在 添加
//                        String name = gmDto.getUserName();
//                        String contact = gmDto.getUserContact();
//                        if (name == null || "".equals(name)) throw new ServiceException("群员姓名不能为空");
//                        if (contact == null || "".equals(contact)) throw new ServiceException("群员联系方式不能为空");
//                        GtdGroupMemberEntity ggm = new GtdGroupMemberEntity();
//                        Integer id = groupRepository.findUserId(contact);
//
//                       // if (id == 0) id = null;
//                        ggm.setUserId(id);
//                        ggm.setUserName(name);
//                        ggm.setGroupId(groupId);
//                        ggm.setUserContact(contact);
//                        ggm.setCreateId(userId);
//                        ggm.setCreateDate(new Timestamp(new Date().getTime()));
//                        if(type==0){//本地群添加成员
//                            ggm.setGroupMemberStatus(0);
//                        }
//                        if(type==1){//权限群添加群员
//                            ggm.setGroupMemberStatus(2);
//                            memberUserId.add(id);
//                            //TODO 给新成员发送通知
//                            System.out.println("通知通知");
//                        }
//                        groupMemberRepository.save(ggm);
//
//                    }
//                }
//                if(type==1) {
//                    PushInDto pushInDto = new PushInDto();
//                    pushInDto.setUserId(userId);
//                    pushInDto.setMemberUserId(memberUserId);
//                    PushOutDto pushOutDto = new PushOutDto();
//                    pushOutDto.setMessageId(groupId);
//                    pushOutDto.setMessageName(groupName);
//                    pushOutDto.setUserName(groupJpaRepository.findUNameByUserId(userId));
//                    pushOutDto.setMessageContent(PUSH_MESSAGE_GROUP_CREATE);
//                    pushOutDto.setType(2);
//                    //iWebSocketService.pushToUser(pushInDto);
//                }
//
//                //删除所有不在原群组的用户
//                List<Integer> deleteUserId=new ArrayList<>();
//                for (Integer i : userIds) {
//                    if (userIns.indexOf(i) == -1) {
//                        groupMemberRepository.deleteGroupMember(i, groupId);
//                        deleteUserId.add(i);
//                    }
//                }
//                if(type==1) {
//                    //TODO 发送通知给删除的群员
//                    PushInDto pushInDto = new PushInDto();
//                    pushInDto.setUserId(userId);
//                    pushInDto.setMemberUserId(deleteUserId);
//                    PushOutDto pushOutDto = new PushOutDto();
//                    pushOutDto.setMessageId(groupId);
//                    pushOutDto.setMessageName(groupName);
//                    pushOutDto.setUserName(groupJpaRepository.findUNameByUserId(userId));
//                    pushOutDto.setMessageContent(PUSH_MESSAGE_GROUP_DELETE);
//                    pushOutDto.setType(2);
//                    //iWebSocketService.pushToUser(pushInDto);
//                }
//
//                if(status) {//群组新添了权限标签
//                    for (Integer i : userIns) {
//
//                        if(type==0){ //本地群转权限群 将群成员状态设置为2
//                            GtdGroupMemberEntity groupMember = groupMemberRepository.findMemberByGroupIdAndUserId(groupId, i);
//                            groupMember.setGroupMemberStatus(2);
//                            groupMemberRepository.save(groupMember);
//                        }
//                    }
//                    //TODO 给所有群成员发送通知
//                    System.out.println("通知通知");
//                        PushInDto pushInDto = new PushInDto();
//                        pushInDto.setUserId(userId);
//                        pushInDto.setMemberUserId(userIns);
//                        PushOutDto pushOutDto=new PushOutDto();
//                        pushOutDto.setMessageId(groupId);
//                        pushOutDto.setMessageName(groupName);
//                        pushOutDto.setUserName(groupJpaRepository.findUNameByUserId(userId));
//                        if(type==0) {
//                            pushOutDto.setMessageContent(PUSH_MESSAGE_GROUP_CREATE);
//                        }
//                        if(type==1){
//                            pushOutDto.setMessageContent(PUSH_MESSAGE_GROUP_ADD);
//                        }
//                        pushOutDto.setType(2);
//                        //iWebSocketService.pushToUser(pushInDto);
//                }
//            }
//        } else {
//            throw new ServiceException("权限不足");
//        }
//        return 0;
//    }
//
//
//    /**
//     * 修改群成员状态
//     * @param inDto
//     * @return
//     */
//    @Override
//    public int updateStatus(GroupFindInDto inDto) {
//           int userId;
//           int groupId;
//           int resultType;
//           try {
//               userId = inDto.getUserId();
//               groupId = inDto.getGroupId();
//               resultType=inDto.getResultType();
//           }catch (Exception e){
//               throw new ServiceException("参数错误，请检查后输入正确参数");
//           }
//
//        logger.info("用户ID:"+userId+",群组ID:"+groupId+",修改结果类型:"+resultType);
//        if (userId == 0) throw new ServiceException("用户ID不能为空");
//        if (groupId == 0) throw new ServiceException("群组ID不能为空");
//        if (resultType == 0) throw new ServiceException("修改結果不能为空");
//
//        GtdGroupMemberEntity groupMember=groupMemberRepository.findMemberByGroupIdAndUserId(groupId,userId);
//        if (groupMember == null) {
//            throw new ServiceException("该群组不存在或没有此用户");
//        }
//        if(resultType==1||resultType==3) {
//            groupMember.setGroupMemberStatus(resultType);
//        }else{
//            throw new ServiceException("请输入正确的状态值");
//        }
//        groupMemberRepository.save(groupMember);
////        boolean flag = false; //判断是否为权限群组
////        Set<GtdLabelEntity> labels = group.getLabel();
////        for (GtdLabelEntity label : labels) {
////            if (label.getLabelId() == 1) {
////                flag = true;
////            }
////        }
////        if (flag) {
////            for (GroupMemberDto gmDto : member) {
////                if (gmDto.getUserId() == 0 || "".equals(gmDto.getUserId())) throw new ServiceException("群员ID不能为空");
////                if (gmDto.getUserContact() == null || "".equals(gmDto.getUserContact())) throw new ServiceException("群员联系方式不能为空");
////                if (gmDto.getUserName() == null || "".equals(gmDto.getUserName())) throw new ServiceException("群员姓名不能为空");
////                GtdGroupMemberEntity groupMember = groupMemberRepository.findMemberByGroupIdAndUserId(groupId, gmDto.getUserId());
////                //GtdGroupMemberEntity groupMember =new GtdGroupMemberEntity();
////                //修改群成员状态
////                if(groupMember!=null) {
////                    // 获取群成员状态
////                    groupMember.setGroupMemberStatus(3);
////                    groupMember.setUpdateId(userId);
////                    groupMember.setUpdateDate(new Timestamp(new Date().getTime()));
////                    groupMemberRepository.save(groupMember);
////                }else{
////                    throw new ServiceException("该群组没有此成员");
////                }
////            }
////        } else {
////            throw new ServiceException("本地群成员无法修改");
////        }
//        return 0;
//    }
//
//    /**
//     * 创建/编辑日程添加参与人用
//     * @param inDto
//     * @return
//     */
//    public List<GroupOutDto> createSchedule(GroupFindInDto inDto) {
//        int userId = inDto.getUserId();
//        int typeId = inDto.getFindType();
//        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
//        if (typeId == 0 || "".equals(typeId)) throw new ServiceException("类型ID不能为空");
//        if (typeId != 3)throw new ServiceException("类型ID参数错误");
//        List<Map> allList = groupJpaRepository.findAllPlayers(userId);
//        if (allList != null && allList.size() != 0){
//            List<GroupOutDto> list = new ArrayList<>();
//            for (Map gle: allList) {
//                GroupOutDto outDto = new GroupOutDto();
//                outDto.setGroupId((Integer) gle.get("GROUP_ID"));
//                outDto.setGroupName((String) gle.get("GROUP_NAME"));
//                outDto.setGroupCreateId((Integer) gle.get("USER_ID"));
//                list.add(outDto);
//            }
//            return list;
//        } else {
//            throw new ServiceException("未查询到参与人数据");
//        }
//
//    }
//
//
//
//}