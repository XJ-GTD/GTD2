package com.xiaoji.gtd.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Enumeration;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;

import com.alibaba.dubbo.common.utils.IOUtils;
import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.dto.AgdContactsDto;
import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.entity.AgdAgendaContacts;

public class BaseUtil {

	/**
	 * 日程入参类转日程实体类
	 * 
	 * @param agd
	 * @param inDto
	 * @return
	 */
	public static AgdAgendaContacts dtoToContacts(AgdContactsDto inDto) {
		AgdAgendaContacts agd = new AgdAgendaContacts();
		agd.setAccountId(inDto.getAi()); // 联系人账户ID
		agd.setRelAgendaId(inDto.getRi());// 关联日程主键
		agd.setContactsId(inDto.getCi());// 联系人ID
		agd.setContactsName(inDto.getN());// 名称
		agd.setPhone(inDto.getMpn());// 电话
		return agd;
	}

	/**
	 * 日程入参类转日程实体类
	 * 
	 * @param agd
	 * @param inDto
	 * @return
	 */
	public static AgdContactsDto AgdToContactsDto(AgdAgendaContacts agd) {
		AgdContactsDto inDto = new AgdContactsDto();
		inDto.setAi(agd.getAccountId()); // 联系人账户ID
		inDto.setRi(agd.getRelAgendaId());// 关联日程主键
		inDto.setCi(agd.getContactsId());// 联系人ID
		inDto.setN(agd.getContactsName());// 名称
		inDto.setMpn(agd.getPhone());// 电话
		return inDto;
	}

	/**
	 * 日程入参类转日程实体类
	 * 
	 * @param agd
	 * @param inDto
	 * @return
	 */
	public static AgdAgenda dtoAgdToAgd(AgdAgendaDto inDto) {
		AgdAgenda agd = new AgdAgenda();
		agd.setAgendaId(inDto.getAi()); // 日程主键
		agd.setRelAgendaId(inDto.getRai());// 关联日程主键
		agd.setTitle(inDto.getAt());// 标题
		agd.setAgendaDate(inDto.getAdt());// 时间
		agd.setRepeatType(inDto.getAr()); // 重复
		agd.setCreaterId(inDto.getFc());// 来自于谁（创建人）
		agd.setPlanFlag(inDto.getAp()); // 计划
		agd.setRemindFlag(inDto.getAa());// 提醒方式
		agd.setRemarks(inDto.getAm());// 备注
		return agd;
	}

	/**
	 * 日程入参类转日程实体类
	 * 
	 * @param agd
	 * @param inDto
	 * @return
	 */
	public static AgdAgendaDto agdToDtoAgd(AgdAgenda agd) {
		AgdAgendaDto inDto = new AgdAgendaDto();
		inDto.setAi(agd.getAgendaId()); // 日程主键
		inDto.setRai(agd.getRelAgendaId());// 关联日程主键
		inDto.setAt(agd.getTitle());// 标题
		inDto.setAdt(agd.getAgendaDate());// 时间
		inDto.setAr(agd.getRepeatType()); // 重复
		inDto.setFc(agd.getCreaterId());// 来自于谁（创建人）
		inDto.setAp(agd.getPlanFlag()); // 计划
		inDto.setAa(agd.getRemindFlag());// 提醒方式
		inDto.setAm(agd.getRemarks());// 备注
		return inDto;
	}

	/**
	 * 打印 request BodyInfo
	 * 
	 * @param request
	 * @param log
	 */
	public static void getRequestParams(HttpServletRequest request, Logger log) {
		Enumeration enu = request.getParameterNames();
		Map<String, String[]> map = request.getParameterMap();
		//String str = request.getScheme();
		String str1 = request.getQueryString();
		StringBuffer stb = new StringBuffer();
		
		BufferedReader br = null;
        try {
            br = new BufferedReader(new InputStreamReader(request.getInputStream(), "UTF-8"));
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        String line = null;
        StringBuilder sb = new StringBuilder();
        try {
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
		while (enu.hasMoreElements()) {
			String paraName = (String) enu.nextElement();
			stb.append(paraName + ": " + request.getParameter(paraName) + " ;");
		}
		log.info("---- 保存日程获取头部request:" + stb.toString());
	}
}
