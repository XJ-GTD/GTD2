package com.xiaoji.gtd.services.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

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
import com.xiaoji.gtd.services.IAgdRecordService;
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
	private IAgdRecordService agdRecordServ;
	
	@Autowired
    private JmsMessagingTemplate jmsMessagingTemplate;
	
	@Value("${active.destinationName}")
	private String destinationName;

	@Value("${active.destinationName.v2}")
	private String destinationNamev2;

	@Value("${blocked.destinationName}")
	private String blockeddestinationName;
	
	@Value("${blacklist.getone}")
	private String blacklistgetOne;
	
	/**
	 * 保存日程参与人
	 */
	public AgdAgendaContacts save(AgdAgendaDto inDto, HttpServletRequest request) {

		String productId = request.getHeader("pi");
		if (productId == null || productId == "") productId = "cn.sh.com.xj.timeApp";
		String productVersion = request.getHeader("pv");
		if (productVersion == null || productVersion == "") productVersion = "v1";
		String deviceId = request.getHeader("di");
		if (deviceId == null || deviceId == "") deviceId = "browser";
		
		log.info("---- 传入保存日程参与人  -----" + JSONObject.toJSONString(inDto.getAc()));
		if(inDto.getAc() != null && inDto.getAc().size()>0 
				&& inDto.getAi() != null && !"".equals(inDto.getAi())){
			List<AgdAgendaContacts> agdList = agdContactsRep.findContactsByRelId(inDto.getAi());
			log.info("---- 查询已有日程参与人  -----" + JSONObject.toJSONString(agdList));
			List<AgdContactsDto> addList = new ArrayList<AgdContactsDto>(); //入参：参与人
			List<AgdContactsDto> blockedList = new ArrayList<AgdContactsDto>();	//黑名单禁止参与人
			List<AgdAgendaContacts> delList = new ArrayList<AgdAgendaContacts>();
			delList.addAll(agdList); //删除日程的参与人
			List<AgdContactsDto> acList = inDto.getAc();
			//获取日程详情
			AgdAgenda agenL = null;
			log.info("------- 开始获取日程详情 ------- ID:" + inDto.getAi());
			Optional<AgdAgenda> agen = agdAgendaRep.findById(inDto.getAi());
			
			if(agen.isPresent()){
				agenL = agen.get();
				log.info("------- 获取日程详情信息："+ JSONObject.toJSONString(agenL));
				
				inDto = BaseUtil.agdToDtoAgd(agenL);
				BaseUtil base = new BaseUtil();
				String phone =base.getUserInfo(request.getHeader("ai"));
				log.info("------- 当前登录人手机号phone："+ phone);
				//获取删除的参与人和新添加的参与人
				if(agdList.size()>0){
					for (AgdContactsDto add : acList) {
						boolean isExsit = false;
						for (AgdAgendaContacts agd : agdList) {
							if(add.getMpn().equals(agd.getPhone())){
								isExsit=true;
								delList.remove(agd); //移除存在的参与人
								break;
							}
						}
						//添加不存在的参与人
						if(!isExsit && !add.getMpn().equals(phone)){
							if(add.getAi() == null || "".equals(add.getAi())){
								add.setAi(add.getMpn());
							}
							//判断是否存在于黑名单
							boolean isbla = base.getBla(request.getHeader("ai"), add.getAi(), blacklistgetOne, request);
							if(!isbla){
								addList.add(add);
							} else {
								blockedList.add(add);
							}
							 
						}
						
					}
				}else{
					for (AgdContactsDto add : acList) {
						if(add.getAi() == null || "".equals(add.getAi())){
							add.setAi(add.getMpn());
						}
						//先判断是否存在于黑名单
						boolean isbla = base.getBla(request.getHeader("ai"), add.getAi(), blacklistgetOne, request);
						if(!isbla && !add.getMpn().equals(phone)){
							//添加日程发送记录表
							this.agdRecordServ.save(agenL, add.getMpn(), add.getAi());
							addList.add(add);
						}
						
						if (isbla) {
							blockedList.add(add);
						}
					}
				}
				log.info("------- 添加参与人："+ JSONObject.toJSONString(addList));
				if(addList.size()>0){
					for (AgdContactsDto add : addList) {
						AgdAgendaContacts agd = BaseUtil.dtoToContacts(add);
						agd.setRelAgendaId(agenL.getAgendaId());
						agd = agdContactsRep.save(agd);
					}
					
					JSONObject context = new JSONObject();
					context.put("productId", productId);
					context.put("productVersion", productVersion);
					context.put("deviceId", deviceId);
					
					//TODO 发送添加日程消息
					Map<String,Object> map = new HashMap<String,Object>();
					map.put("_context", context);
					map.put("from", agenL.getCreaterId());		// 发送人
			        map.put("to", JSONObject.toJSON(addList));
			        map.put("agenda", JSONObject.toJSON(inDto));
			        map.put("notifyType", "add");
			        try{
			        	Map<String,Object> map2 = new HashMap<String,Object>();
			        	map2.put("context", map);
			        	if ("v1".equals(productVersion)) {
				        	jmsMessagingTemplate.convertAndSend(destinationName, map2);
			        	} else {
				        	jmsMessagingTemplate.convertAndSend(destinationNamev2, map2);
			        	}
			        	log.info("------- 添加日程发送成功  --------" + map.toString());
			        }catch(Exception e){
			        	log.error("------- 添加日程发送失败  --------" + map.toString());
			        }
					
				}
				
				// 反馈被黑名单阻止人员的消息
				if (blockedList.size() > 0) {
					JSONObject context = new JSONObject();
					context.put("productId", productId);
					context.put("productVersion", productVersion);
					context.put("deviceId", deviceId);
					
					//TODO 发送添加日程消息
					Map<String,Object> map = new HashMap<String,Object>();
					map.put("_context", context);
					map.put("from", agenL.getCreaterId());		// 发送人
			        map.put("to", JSONObject.toJSON(blockedList));
			        map.put("agenda", JSONObject.toJSON(inDto));
			        map.put("blockType", "inblacklist");
			        try{
			        	Map<String,Object> map2 = new HashMap<String,Object>();
			        	map2.put("context", map);
			        	if (!"v1".equals(productVersion) && !"v2".equals(productVersion)) {
				        	jmsMessagingTemplate.convertAndSend(blockeddestinationName, map2);
			        	}
			        	log.info("------- 黑名单禁止发送通知  --------" + map.toString());
			        }catch(Exception e){
			        	log.error("------- 黑名单禁止发送通知失败  --------" + map.toString());
			        }
				}
//				log.info("------- 删除参与人："+ JSONObject.toJSONString(delList));
//				if(delList.size()>0){
//					List<AgdContactsDto> dels = new ArrayList<AgdContactsDto>();
//					for (AgdAgendaContacts agdAgendaContacts : delList) {
//						dels.add(BaseUtil.AgdToContactsDto(agdAgendaContacts));
//						agdContactsRep.deleteById(agdAgendaContacts.getRecId());
//						//TODO 发送删除日程消息
//					}
//					//TODO 生产消息MQ
//					Map<String,Object> map = new HashMap<String,Object>();
//					map.put("from", inDto.getFc());		// 发送人
//			        map.put("to", JSONObject.toJSON(dels));
//			        map.put("agenda", JSONObject.toJSON(inDto));
//			        map.put("notifyType", "delete");
//			        try{
//			        	Map<String,Object> map2 = new HashMap<String,Object>();
//			        	map2.put("context", map);
//			        	jmsMessagingTemplate.convertAndSend(destinationName, map2);
//			        	log.info("------- 删除日程发送成功  --------" + map.toString());
//			        }catch(Exception e){
//			        	log.error("------- 删除日程发送失败  --------" + map.toString());
//			        }
//			        
//				}
			}else{
				log.error("======== 日程信息不全：" + JSONObject.toJSONString(inDto));
			}
			
		}else{
			log.error("======== 传入保存日程参与人信息不全：" + JSONObject.toJSONString(inDto));
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
