package com.xiaoji.gtd.services;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

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
	 * 保存日程并发送消息
	 * @param blacklist
	 */
	AgdAgenda saveAndSend(AgdAgendaDto inDto, HttpServletRequest request);
	
	/**
	 * 删除日程
	 * @param blacklist
	 */
	int deleteById(AgdAgendaDto inDto, String openId, HttpServletRequest request);
	
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
	
	/**
	 * 获取日程信息，并更新发送日程消息记录状态为已获取
	 * @param agendaId
	 * @return
	 */
	AgdAgenda getAgdAgendaInfo(String agendaId,HttpServletRequest request);
	
	
}
