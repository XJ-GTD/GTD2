package com.manager.master.service.serviceImpl;

import com.manager.master.dao.IGroupDao;
import com.manager.master.dto.GroupOutDto;
import com.manager.master.service.IGroupService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@Service
@Transactional
public class GroupServicelmpl implements IGroupService {

    @Resource
    private IGroupDao groupDao;

    @Override
    public List<GroupOutDto> findGroup(int userId) {
        DateFormat df2= new SimpleDateFormat("yyyy-MM-dd HH:mm");
        List<GroupOutDto> dataList = groupDao.findGroup(userId);
        List<GroupOutDto> outData = new ArrayList<>();
        try {

            for (GroupOutDto groupDao:dataList) {
                if (groupDao.getScheduleCreateDate() != null) {
                    Date date = df2.parse(groupDao.getScheduleCreateDate());
                    groupDao.setScheduleCreateDate(df2.format(date));
                }
                outData.add(groupDao);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return dataList;
    }

    @Override
    public void createGroup(String groupId,String groupName,int userId,int roleId) {
        groupDao.createGroup(groupId,groupName,userId,roleId);
    }
}
