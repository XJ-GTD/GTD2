package com.xiaoji.gtd.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.dto.AgdContactsDto;
import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.repositorys.AgdAgendaRepository;
import com.xiaoji.gtd.repositorys.AgdContactsRepository;
import com.xiaoji.gtd.services.IAgendaService;
import com.xiaoji.gtd.util.BaseUtil;

/**
 * 日程操作实体类
 * @author dch
 *
 */
@Service
@Transactional
public class IAgendaServiceImpl implements IAgendaService {

	@Autowired
	private AgdAgendaRepository agdAgenda;
	
	@Autowired
	private AgdContactsRepository agdContactsRep;
	/**
	 * 保存日程
	 */
	public AgdAgenda save(AgdAgendaDto inDto) {
		AgdAgenda agd = BaseUtil.inAgdToAgd(inDto);
		agd = agdAgenda.save(agd);
		if(inDto.getAc() != null && inDto.getAc().size()>0){
			//发送添加/更新日程消息
			for (AgdContactsDto dto : inDto.getAc()) {
				//TODO 生产消息MQ
				
			}
		}
		
		return agd;
	}
	/**
	 * 删除日程
	 */
	public int deleteById(AgdAgendaDto inDto) {
		AgdAgenda agd = BaseUtil.inAgdToAgd(inDto);
		if(inDto.getAc() != null && inDto.getAc().size()>0){
			//发送添加/更新日程消息
			for (AgdContactsDto dto : inDto.getAc()) {
				//TODO 生产消息MQ
				
			}
		}
		agdAgenda.delete(agd);
		return 0;
	}
	
	/**
	 * 根据日程ID查询日程
	 */
	public AgdAgenda findById(String agendaId) {
		AgdAgenda agen = agdAgenda.findByStrId(agendaId);
		return agen;
	}
	/**
	 * 查询所有日程
	 */
	public List<AgdAgenda> findAll() {
		List<AgdAgenda> agenList = agdAgenda.findAll();
		return agenList;
	}
	
}
