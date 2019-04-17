package com.xiaoji.gtd.services;

import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.entity.AgdAgendaRecord;

/**
 * IContactsService 参与人接口
 *
 */
public interface IAgdRecordService {
	
	/**
	 * 保存参与人
	 * @param blacklist
	 */
	AgdAgendaRecord save(AgdAgenda agd,String phone,String AccountId);
	
}
