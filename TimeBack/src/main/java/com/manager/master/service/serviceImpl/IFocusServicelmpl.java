package com.manager.master.service.serviceImpl;

import com.manager.master.dao.IFocusDao;
import com.manager.master.dao.IGroupDao;
import com.manager.master.dto.FocusInDto;
import com.manager.master.service.IFocusService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service
@Transactional
public class IFocusServicelmpl implements IFocusService {
    @Resource
    private IFocusDao focusDao;
    /**
     * 个人关注表创建
     *
     * @param  InDto
     */
    @Override
    public void createFocus(FocusInDto InDto) {
        int focusAllId =InDto.getFocusAllId();//关注ID（组群，日程，用户）
        int focusType=InDto.getFocusType();//关注类型（1组群，2日程，3用户）
        //int focusNumber=InDto.getFocusNumber();//自增主键
        int userId=InDto.getUserId();//用户ID
        focusDao.createFocus(focusAllId,focusType,userId);
    }
}
