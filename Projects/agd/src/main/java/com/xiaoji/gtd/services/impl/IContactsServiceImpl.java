package com.xiaoji.gtd.services.impl;

import java.util.ArrayList;
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

import com.alibaba.fastjson.JSONObject;
import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.dto.AgdContactsDto;
import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.entity.AgdAgendaContacts;
import com.xiaoji.gtd.repositorys.AgdAgendaRepository;
import com.xiaoji.gtd.repositorys.AgdContactsRepository;
import com.xiaoji.gtd.services.IContactsService;
import com.xiaoji.gtd.util.BaseUtil;

/**
 * 日程参与人接口实现类
 * @author dch
 *
 */
@Service
@Transactional
public class IContactsServiceImpl implements IContactsService {
	Logger log = LoggerFactory.getLogger(IContactsServiceImpl.class);
	@Autowired
	private AgdContactsRepository agdContactsRep;
	@Autowired
	private AgdAgendaRepository agdAgendaRep;
	@Autowired
    private JmsMessagingTemplate jmsMessagingTemplate;
	@Value("${active.destinationName}")
	private String destinationName;
	/**
	 * 保存日程参与人
	 */
	public AgdAgendaContacts save(AgdAgendaDto inDto) {
		
		if(inDto.getAc() != null && inDto.getAc().size()>0){
			List<AgdAgendaContacts> agdList = agdContactsRep.findContactsByRelId(inDto.getAi());
			List<AgdContactsDto> addList = new ArrayList<AgdContactsDto>(); //入参：参与人
			List<AgdAgendaContacts> delList = new ArrayList<AgdAgendaContacts>();
			delList.addAll(agdList); //删除日程的参与人
			log.debug("------- 开始查询 ------- ");
			//获取日程详情
			AgdAgenda agenL = agdAgendaRep.findByStrId(inDto.getAi());;
			inDto = BaseUtil.agdToDtoAgd(agenL);
			//获取删除的参与人和新添加的参与人
			if(agdList.size()>0){
				for (AgdContactsDto add : inDto.getAc()) {
					boolean isExsit = false;
					for (AgdAgendaContacts agd : agdList) {
						if(add.getMpn().equals(agd.getPhone())){
							isExsit=true;
							delList.remove(agd); //移除存在的参与人
							break;
						}
					}
					//添加不存在的参与人
					if(!isExsit){
						addList.add(add); 
					}
					
				}
			}
			
			if(addList.size()>0){
				for (AgdContactsDto add : addList) {
					AgdAgendaContacts agd = BaseUtil.dtoToContacts(add);
					agd = agdContactsRep.save(agd);
				}
				//TODO 发送添加日程消息
				Map<String,Object> map = new HashMap<String,Object>();
		        map.put("to", JSONObject.toJSONString(addList));
		        map.put("agenda", JSONObject.toJSONString(inDto));
		        map.put("notifyType", "add");
		        try{
		        	Map<String,Object> map2 = new HashMap<String,Object>();
		        	map2.put("context", map);
		        	jmsMessagingTemplate.convertAndSend(destinationName, map2);
		        	log.info("------- 添加日程发送成功  --------" + map.toString());
		        }catch(Exception e){
		        	log.error("------- 添加日程发送失败  --------" + map.toString());
		        }
				
			}
			
			if(delList.size()>0){
				List<AgdContactsDto> dels = new ArrayList<AgdContactsDto>();
				for (AgdAgendaContacts agdAgendaContacts : delList) {
					dels.add(BaseUtil.AgdToContactsDto(agdAgendaContacts));
					agdContactsRep.deleteById(agdAgendaContacts.getRecId());
					//TODO 发送删除日程消息
				}
				//TODO 生产消息MQ
				Map<String,Object> map = new HashMap<String,Object>();
		        map.put("to", JSONObject.toJSONString(dels));
		        map.put("agenda", JSONObject.toJSONString(inDto));
		        map.put("notifyType", "delete");
		        try{
		        	Map<String,Object> map2 = new HashMap<String,Object>();
		        	map2.put("context", map);
		        	jmsMessagingTemplate.convertAndSend(destinationName, map2);
		        	log.info("------- 删除日程发送成功  --------" + map.toString());
		        }catch(Exception e){
		        	log.error("------- 删除日程发送失败  --------" + map.toString());
		        }
		        
			}
		}
		
		
		return null;
	}
	
	/**
	 * 根据日程ID查询参与人
	 */
	public List<AgdAgendaContacts> findContactsByRelId(String relAgendaId) {
		List<AgdAgendaContacts> agdList = agdContactsRep.findContactsByRelId(relAgendaId);
		return agdList;
	}
	/**
	 * 根据ID删除参与人
	 */
	public int deleteById(Long recId) {
		// TODO Auto-generated method stub
		return 0;
	}
	/**
	 * 根据ID查询参与人
	 */
	public AgdAgendaContacts findById(Long recId) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
