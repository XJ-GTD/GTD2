package com.xiaoji.gtd.services.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.dto.AgdContactsDto;
import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.entity.AgdAgendaContacts;
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

	Logger log = LoggerFactory.getLogger(IAgendaServiceImpl.class);
	@Autowired
	private AgdAgendaRepository agdAgenda;
	
	@Autowired
	private AgdContactsRepository agdContactsRep;
	
	@Autowired
    private JmsMessagingTemplate jmsMessagingTemplate;
	
	@Value("${active.destinationName}")
	private String destinationName;

	/**
	 * 保存日程
	 */
	public AgdAgenda save(AgdAgendaDto inDto) {
		AgdAgenda agd = BaseUtil.dtoAgdToAgd(inDto);
		agd = agdAgenda.save(agd);
		if(inDto.getAc() != null && inDto.getAc().size()>0){
			//发送添加/更新日程消息
			for (AgdContactsDto dto : inDto.getAc()) {
				AgdAgendaContacts contacts = BaseUtil.dtoToContacts(dto);
				agdContactsRep.save(contacts);
				//TODO 生产消息MQ
				Map<String,Object> map = new HashMap<String,Object>();
		        map.put("to", inDto.getAc());
		        map.put("agenda", inDto);
		        map.put("notifyType", "update");
		        try{
		        	jmsMessagingTemplate.convertAndSend(destinationName, map);
			        System.out.println("map发送成功");	
		        }catch(Exception e){
		        	log.error("------- 发送失败  --------" + map.toString());
		        }
				
			}
		}
		
		return agd;
	}
	/**
	 * 删除日程
	 */
	public int deleteById(AgdAgendaDto inDto) {
		AgdAgenda agd = BaseUtil.dtoAgdToAgd(inDto);
		agdAgenda.delete(agd);
		if(inDto.getAc() != null && inDto.getAc().size()>0){
			//发送添加/更新日程消息
			/*for (AgdContactsDto dto : inDto.getAc()) {
				
			}*/
			//TODO 生产消息MQ
			Map<String,Object> map = new HashMap<String,Object>();
	        map.put("to", inDto.getAc());
	        map.put("agenda", inDto);
	        map.put("notifyType", "delete");
	        try{
	        	jmsMessagingTemplate.convertAndSend(destinationName, map);
		        System.out.println("map发送成功");	
	        }catch(Exception e){
	        	log.error("------- 发送失败  --------" + map.toString());
	        }
		}
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
