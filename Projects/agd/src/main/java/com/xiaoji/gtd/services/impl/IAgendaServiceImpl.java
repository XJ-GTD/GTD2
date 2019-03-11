package com.xiaoji.gtd.services.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
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
	
	@Value("${spring.activemq.broker-url}")
	private String mqurl;

	/**
	 * 保存日程
	 */
	public AgdAgenda save(AgdAgendaDto inDto) {
		AgdAgenda agd = BaseUtil.dtoAgdToAgd(inDto);
		agd = agdAgenda.save(agd);
		List<AgdAgendaContacts> agdList = agdContactsRep.findContactsByRelId(inDto.getAi());
		if(agdList != null && agdList.size()>0){
			List<AgdContactsDto> agdOList = new ArrayList<AgdContactsDto>();
			for (AgdAgendaContacts agdAgendaContacts : agdList) {
				agdOList.add(BaseUtil.AgdToContactsDto(agdAgendaContacts));
				agdContactsRep.deleteById(agdAgendaContacts.getRecId());
				//TODO 发送更新日程消息
				Map<String,Object> map = new HashMap<String,Object>();
		        map.put("to", JSONObject.toJSONString(agdOList));
		        map.put("agenda", JSONObject.toJSONString(inDto));
		        map.put("notifyType", "update");
		        try{
		        	Map<String,Object> map2 = new HashMap<String,Object>();
		        	map2.put("context", map);
		        	jmsMessagingTemplate.convertAndSend(destinationName, map2);
			        System.out.println("map发送成功");	
			        log.info(destinationName +",url"+mqurl+":------- 更新日程发送成功  --------" + map.toString());
		        }catch(Exception e){
		        	log.error("------- 发送失败  --------" + e.getMessage());
		        }
			}
		}
//		if(inDto.getAc() != null && inDto.getAc().size()>0){
//			//发送添加/更新日程消息
//			for (AgdContactsDto dto : inDto.getAc()) {
//				AgdAgendaContacts contacts = BaseUtil.dtoToContacts(dto);
//				agdContactsRep.save(contacts);			
//			}
//			//TODO 生产消息MQ
//			Map<String,Object> map = new HashMap<String,Object>();
//	        map.put("to", JSONObject.toJSONString(inDto.getAc()));
//	        map.put("agenda", JSONObject.toJSONString(inDto));
//	        map.put("notifyType", "update");
//	        try{
//	        	Map<String,Object> map2 = new HashMap<String,Object>();
//	        	map2.put("context", map);
//	        	jmsMessagingTemplate.convertAndSend(destinationName, map2);
//		        System.out.println("map发送成功");	
//		        log.info(destinationName +",url"+mqurl+":------- 更新日程发送成功  --------" + map.toString());
//	        }catch(Exception e){
//	        	log.error("------- 发送失败  --------" + e.getMessage());
//	        }
//		}
		
		return agd;
	}
	/**
	 * 删除日程
	 */
	public int deleteById(AgdAgendaDto inDto) {
		AgdAgenda agenL = null;
		Optional<AgdAgenda> agen = agdAgenda.findById(inDto.getAi());
		if(agen.isPresent()){
			agenL = agen.get();
		}
		if(agenL!=null){
			AgdAgenda agd = agenL;
			agdAgenda.deleteById(agd.getAgendaId());
			
			List<AgdAgendaContacts> agdList = agdContactsRep.findContactsByRelId(inDto.getAi());
			if(agdList.size()>0){
				//发送添加/更新日程消息
				List<AgdContactsDto> dels = new ArrayList<AgdContactsDto>();
				for (AgdAgendaContacts agdAgendaContacts : agdList) {
					dels.add(BaseUtil.AgdToContactsDto(agdAgendaContacts));
					agdContactsRep.deleteById(agdAgendaContacts.getRecId());
					//TODO 发送删除日程消息
				}
				// 生产删除消息MQ
				Map<String,Object> map = new HashMap<String,Object>();
		        map.put("to", JSONObject.toJSONString(dels));
		        inDto = BaseUtil.agdToDtoAgd(agd);
		        map.put("agenda", JSONObject.toJSONString(inDto));
		        map.put("notifyType", "delete");
		        try{
		        	Map<String,Object> map2 = new HashMap<String,Object>();
		        	map2.put("context", map);
		        	jmsMessagingTemplate.convertAndSend(destinationName, map2);
		        	log.info(destinationName +":------- 删除日程发送成功  --------" + map.toString());
		        }catch(Exception e){
		        	log.error("------- 发送失败  --------" + map.toString());
		        }
			}
			
		}
		
		return 0;
	}
	
	/**
	 * 根据日程ID查询日程
	 */
	public AgdAgenda findById(String agendaId) {
		Optional<AgdAgenda> ageno = agdAgenda.findById(agendaId);
		AgdAgenda agenL = null;
		if(ageno.isPresent()){
			agenL = ageno.get();
		}
		return agenL;
	}
	/**
	 * 查询所有日程
	 */
	public List<AgdAgenda> findAll() {
		List<AgdAgenda> agenList = agdAgenda.findAll();
		return agenList;
	}
	
}
