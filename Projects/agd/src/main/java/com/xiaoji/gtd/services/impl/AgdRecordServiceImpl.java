package com.xiaoji.gtd.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.entity.AgdAgendaRecord;
import com.xiaoji.gtd.repositorys.AgdRecordRepository;
import com.xiaoji.gtd.services.IAgdRecordService;

/**
 * AgdRecordServiceImpl 记录日程发送接口
 *
 */
@Service
@Transactional
public class AgdRecordServiceImpl implements IAgdRecordService  {

	
	@Autowired
	private AgdRecordRepository agdRecordRep;
	
	/**
	 * 新增日程发送记录
	 */
	@Override
	public AgdAgendaRecord save(AgdAgenda agd, String phone, String accountId) {
		AgdAgendaRecord record = new AgdAgendaRecord();
		record.setAccountId(accountId);
		record.setAgendaId(agd.getAgendaId());
		record.setPhone(phone);
		record.setRequestState(0);
		record.setTimeStamp(agd.getTimeStamp());
		this.agdRecordRep.save(record);
		return record;
	}

	
}
