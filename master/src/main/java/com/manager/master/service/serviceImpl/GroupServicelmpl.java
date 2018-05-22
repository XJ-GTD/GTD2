package com.manager.master.service.serviceImpl;

import com.manager.master.dao.IGroupDao;
import com.manager.master.dto.GroupDto;
import com.manager.master.service.IGroupService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
@Service
@Transactional
public class GroupServicelmpl implements IGroupService {

    @Resource
    private IGroupDao groupDao;

    @Override
    public List<GroupDto> findGroup(int userId) {

        return groupDao.findGroup(userId);
    }

    @Override
    public void createGroup(String groupId,String groupName,int userId,int roleId) {
        groupDao.createGroup(groupId,groupName,userId,roleId);
    }
}
