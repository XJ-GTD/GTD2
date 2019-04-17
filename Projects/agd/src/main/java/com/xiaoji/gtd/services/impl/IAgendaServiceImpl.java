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
import com.xiaoji.gtd.entity.AgdAgendaRecord;
import com.xiaoji.gtd.repositorys.AgdAgendaRepository;
import com.xiaoji.gtd.repositorys.AgdContactsRepository;
import com.xiaoji.gtd.repositorys.AgdRecordRepository;
import com.xiaoji.gtd.services.IAgdRecordService;
import com.xiaoji.gtd.services.IAgendaService;
import com.xiaoji.gtd.util.BaseUtil;

/**
 * 日程操作实体类
 * 
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
	private AgdRecordRepository agdRecordRep;

	@Autowired
	private IAgdRecordService agdRecordServ;
	
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
		// 服务器adt规则 日期 + 时间 格式校正
		if (inDto.getAdt() != null && inDto.getAdt().length() == 10) {
			inDto.setAdt(inDto.getAdt() + (inDto.getSt() == null ? " 99:99" : (" " + inDto.getSt())));
		}
		AgdAgenda agd = this.findById(inDto.getAi());
		agd = BaseUtil.dtoAgdToAgd(inDto,agd);
		log.info("------保存日程AgdAgenda: ------" + JSONObject.toJSONString(agd));
		agd = agdAgenda.save(agd);
		return agd;
	}

	/**
	 * 保存日程并发送消息
	 * 
	 * @param blacklist
	 */
	public AgdAgenda saveAndSend(AgdAgendaDto inDto) {
		// 服务器adt规则 日期 + 时间 格式校正
		if (inDto.getAdt() != null && inDto.getAdt().length() == 10) {
			inDto.setAdt(inDto.getAdt() + (inDto.getSt() == null ? " 99:99" : (" " + inDto.getSt())));
		}
		AgdAgenda agd = this.findById(inDto.getAi());
		agd = BaseUtil.dtoAgdToAgd(inDto,agd);
		log.info("------保存日程AgdAgenda: ------" + JSONObject.toJSONString(agd));
		agd = agdAgenda.save(agd);
		List<AgdAgendaContacts> agdList = agdContactsRep.findContactsByRelId(inDto.getAi());
		if (agdList != null && agdList.size() > 0) {
			List<AgdContactsDto> agdOList = new ArrayList<AgdContactsDto>();
			for (AgdAgendaContacts agdAgendaContacts : agdList) {
				//查询是否存在未请求日程记录
				List<AgdAgendaRecord> recList = this.agdRecordRep.
						findRecordByAgdId(agd.getAgendaId(), agdAgendaContacts.getPhone());
				if(recList.size()>0){
					AgdAgendaRecord record = recList.get(0);
					record.setRequestState(1);
					this.agdRecordRep.save(record);
					record.setRecId(null);
					record.setRequestState(0);
					record.setTimeStamp(agd.getTimeStamp());
					this.agdRecordRep.save(record);
				}else{
					//不存在则发送消息
					this.agdRecordServ.save(agd, agdAgendaContacts.getPhone(), agdAgendaContacts.getAccountId());
					agdOList.add(BaseUtil.AgdToContactsDto(agdAgendaContacts));					
				}
				
			}
			if(agdOList.size()>0){
				// TODO 发送更新日程消息
				Map<String, Object> map = new HashMap<String, Object>();
				map.put("from", agd.getCreaterId()); // 发送人
				map.put("to", JSONObject.toJSON(agdOList));
				map.put("agenda", JSONObject.toJSON(inDto));
				map.put("notifyType", "update");
				try {
					Map<String, Object> map2 = new HashMap<String, Object>();
					map2.put("context", map);
					jmsMessagingTemplate.convertAndSend(destinationName, map2);
					System.out.println("map发送成功");
					log.info(destinationName + ",url" + mqurl + ":------- 更新日程发送成功  --------" + map.toString());
				} catch (Exception e) {
					log.error("------- 发送失败  --------" + e.getMessage());
				}
			}
			
		}
		// if(inDto.getAc() != null && inDto.getAc().size()>0){
		// //发送添加/更新日程消息
		// for (AgdContactsDto dto : inDto.getAc()) {
		// AgdAgendaContacts contacts = BaseUtil.dtoToContacts(dto);
		// agdContactsRep.save(contacts);
		// }
		// //TODO 生产消息MQ
		// Map<String,Object> map = new HashMap<String,Object>();
		// map.put("to", JSONObject.toJSONString(inDto.getAc()));
		// map.put("agenda", JSONObject.toJSONString(inDto));
		// map.put("notifyType", "update");
		// try{
		// Map<String,Object> map2 = new HashMap<String,Object>();
		// map2.put("context", map);
		// jmsMessagingTemplate.convertAndSend(destinationName, map2);
		// System.out.println("map发送成功");
		// log.info(destinationName +",url"+mqurl+":------- 更新日程发送成功 --------" +
		// map.toString());
		// }catch(Exception e){
		// log.error("------- 发送失败 --------" + e.getMessage());
		// }
		// }

		return agd;
	}

	/**
	 * 删除日程
	 */
	public int deleteById(AgdAgendaDto inDto,String openId) {
		AgdAgenda agenL = null;
		Optional<AgdAgenda> agen = agdAgenda.findById(inDto.getAi());
		if (agen.isPresent()) {
			agenL = agen.get();
		}
		log.info("======== 删除日程信息INFO："+JSONObject.toJSONString(agenL));
		log.info("======== 删除日程openId："+openId);
		if (agenL != null) {
			AgdAgenda agd = agenL;
			agdAgenda.deleteById(agd.getAgendaId());
			//如果是被分享日程则删除参与人
			if (agd.getCreaterId() != null && !"".equals(agd.getCreaterId())
					&& !agd.getCreaterId().equals(openId)) {
				//获取当前登录人手机号
				BaseUtil base = new BaseUtil();
				String phoneNo = base.getUserInfo(openId);
				log.info("======== 获取openId的phoneNo："+phoneNo);
				this.agdContactsRep.delContactsByRelId(agd.getRelAgendaId(), phoneNo);
				log.info("======== 删除日程参与人成功openId："+openId);
			}else{
				log.info("======== 发送日程删除消息  ========");
				//否侧发送日程删除消息
				List<AgdAgendaContacts> agdList = agdContactsRep.findContactsByRelId(inDto.getAi());
				log.info("======== 发送参与人："+ JSONObject.toJSONString(agdList));
				if (agdList.size() > 0) {
					// 发送添加/更新日程消息
					List<AgdContactsDto> dels = new ArrayList<AgdContactsDto>();
					for (AgdAgendaContacts agdAgendaContacts : agdList) {
						dels.add(BaseUtil.AgdToContactsDto(agdAgendaContacts));
						agdContactsRep.deleteById(agdAgendaContacts.getRecId());
						// TODO 发送删除日程消息
					}
					// 生产删除消息MQ
					Map<String, Object> map = new HashMap<String, Object>();
					map.put("from", agd.getCreaterId()); // 发送人
					map.put("to", JSONObject.toJSON(dels));
					inDto = BaseUtil.agdToDtoAgd(agd);
					map.put("agenda", JSONObject.toJSON(inDto));
					map.put("notifyType", "delete");
					try {
						Map<String, Object> map2 = new HashMap<String, Object>();
						map2.put("context", map);
						jmsMessagingTemplate.convertAndSend(destinationName, map2);
						log.info(destinationName + ":------- 删除日程发送成功  --------" + map.toString());
					} catch (Exception e) {
						log.error("------- 发送失败  --------" + map.toString());
					}
				}
			}	
		}

		return 0;
	}

	/**
	 * 获取日程信息，并更新发送日程消息记录状态为已获取
	 */
	public AgdAgenda findById(String agendaId) {
		Optional<AgdAgenda> ageno = agdAgenda.findById(agendaId);
		AgdAgenda agenL = null;
		if (ageno.isPresent()) {
			agenL = ageno.get();
		}
		return agenL;
	}
	
	/**
	 * 获取日程信息，并更新发送日程消息记录状态为已获取
	 * @param agendaId
	 * @return
	 */
	public AgdAgenda getAgdAgendaInfo(String agendaId,HttpServletRequest request){
		AgdAgenda agd = this.findById(agendaId);
		//获取当前登录人手机号
		BaseUtil base = new BaseUtil();
		String phoneNo = base.getUserInfo(request.getHeader("ai"));
		//查询是否存在未请求日程记录
		List<AgdAgendaRecord> recList = this.agdRecordRep.
				findRecordByAgdId(agd.getAgendaId(), phoneNo);
		//存在则更新
		if(recList.size()>0){
			AgdAgendaRecord record = recList.get(0);
			record.setRequestState(1);
			this.agdRecordRep.save(record);
		}
		return agd;
		
	}
	

	/**
	 * 查询所有日程
	 */
	public List<AgdAgenda> findAll() {
		List<AgdAgenda> agenList = agdAgenda.findAll();
		return agenList;
	}

}
