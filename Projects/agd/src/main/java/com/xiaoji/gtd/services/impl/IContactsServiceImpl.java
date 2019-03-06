package com.xiaoji.gtd.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.dto.AgdContactsDto;
import com.xiaoji.gtd.entity.AgdAgendaContacts;
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
	
	@Autowired
	private AgdContactsRepository agdContactsRep;

	/**
	 * 保存日程参与人
	 */
	public AgdAgendaContacts save(AgdAgendaDto inDto) {
		List<AgdAgendaContacts> agdList = agdContactsRep.findContactsByRelId(inDto.getAi());
		List<AgdContactsDto> addList = new ArrayList<AgdContactsDto>(); //入参：参与人
		List<AgdAgendaContacts> delList = new ArrayList<AgdAgendaContacts>();
		delList.addAll(agdList); //删除日程的参与人
		if(inDto.getAc() != null && inDto.getAc().size()>0){
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
				for (AgdContactsDto add : inDto.getAc()) {
					AgdAgendaContacts agd = BaseUtil.inAgdToAgd(add);
					agd = agdContactsRep.save(agd);
					//TODO 发送添加日程消息
				}
				
			}
		}
		if(delList.size()>0){
			for (AgdAgendaContacts agdAgendaContacts : delList) {
				agdContactsRep.deleteById(agdAgendaContacts.getRecId());
				//TODO 发送删除日程消息
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
