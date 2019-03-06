package com.xiaoji.gtd.services;

import java.util.List;

import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.entity.AgdAgenda;

/**
 * Book 数据持久层操作接�?
 *
 */
public interface IAgendaService {
	
	/**
	 * 保存日程
	 * @param blacklist
	 */
	AgdAgenda save(AgdAgendaDto inDto);
	
	/**
	 * 删除日程
	 * @param blacklist
	 */
	int deleteById(AgdAgendaDto inDto);
	
	/**
	 * 查询所有日程
	 * @param blacklist
	 */
	List<AgdAgenda> findAll();
	
	/**
	 * 根据日程ID查询日程
	 * @param agendaId
	 * @return
	 */
	AgdAgenda findById(String agendaId);
}
