package com.xiaoji.gtd.util;

import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.dto.AgdContactsDto;
import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.entity.AgdAgendaContacts;

public class BaseUtil {
	
	/**
	 * 日程入参类转日程实体类
	 * @param agd
	 * @param inDto
	 * @return
	 */
	public static AgdAgendaContacts inAgdToAgd(AgdContactsDto inDto){
		AgdAgendaContacts agd = new AgdAgendaContacts();
		agd.setAccountId(inDto.getAi()); //联系人账户ID
		agd.setRelAgendaId(inDto.getRi());//关联日程主键
		agd.setContactsId(inDto.getCi());//联系人ID
		agd.setContactsName(inDto.getN());//名称
		agd.setPhone(inDto.getMpn());//电话
		return agd;
	}
	
	/**
	 * 日程入参类转日程实体类
	 * @param agd
	 * @param inDto
	 * @return
	 */
	public static AgdAgenda inAgdToAgd(AgdAgendaDto inDto){
		AgdAgenda agd = new AgdAgenda();
		agd.setAgendaId(inDto.getAi()); //日程主键
		agd.setRelAgendaId(inDto.getRai());//关联日程主键
		agd.setTitle(inDto.getAt());//标题
		agd.setAgendaDate(inDto.getAdt());//时间
		agd.setRepeatType(inDto.getAr()); //重复
		agd.setCreaterId(inDto.getFc());//来自于谁（创建人）
		agd.setPlanFlag(inDto.getAp()); //计划
		agd.setRemindFlag(inDto.getAa());//提醒方式
		agd.setRemarks(inDto.getAm());//备注
		return agd;
	}
}
