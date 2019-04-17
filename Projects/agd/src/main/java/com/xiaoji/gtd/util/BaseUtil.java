package com.xiaoji.gtd.util;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSONObject;
import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.dto.AgdContactsDto;
import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.entity.AgdAgendaContacts;

public class BaseUtil {
	Logger log = LoggerFactory.getLogger(this.getClass());
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
	public static AgdAgenda dtoAgdToAgd(AgdAgendaDto inDto,AgdAgenda agd) {
		if(agd == null){
			agd = new AgdAgenda();
		}
		agd.setServerCreaterId(inDto.getSerCreaterId());
		if(inDto.getAi() != null && !"".equals(inDto.getAi())){
			agd.setAgendaId(inDto.getAi()); // 日程主键
		}
		if(inDto.getRai() != null && !"".equals(inDto.getRai())){
			agd.setRelAgendaId(inDto.getRai());// 关联日程主键
		}
		if(inDto.getAt() != null && !"".equals(inDto.getAt())){
			agd.setTitle(inDto.getAt());// 标题
		}
		if(inDto.getAdt() != null && !"".equals(inDto.getAdt())){
			agd.setAgendaDate(inDto.getAdt());// 开始日期
		}
		if(inDto.getSt() != null && !"".equals(inDto.getSt())){
			agd.setAgendaTime(inDto.getSt()); //开始时间
		}
		
		if(inDto.getEd() != null && !"".equals(inDto.getEd())){
			agd.setEndDate(inDto.getEd());// 结束日期
		}
		if(inDto.getEt() != null && !"".equals(inDto.getEt())){
			agd.setEndTime(inDto.getEt());//结束时间
		}
		if(inDto.getAr() != null && !"".equals(inDto.getAr())){
			agd.setRepeatType(inDto.getAr()); // 重复
		}
		
		if(inDto.getFc() != null && !"".equals(inDto.getFc())){
			agd.setCreaterId(inDto.getFc());// 来自于谁（创建人）
		}
		
		if(inDto.getAp() != null && !"".equals(inDto.getAp())){
			agd.setPlanFlag(inDto.getAp()); // 计划
		}
		if(inDto.getAa() != null && !"".equals(inDto.getAa())){
			agd.setRemindFlag(inDto.getAa());// 提醒方式
		}	
		if(inDto.getAm() != null && !"".equals(inDto.getAm())){
			agd.setRemarks(inDto.getAm());// 备注
		}	
		if(inDto.getWtt() != null && !"".equals(inDto.getWtt())){
			agd.setWtt(inDto.getWtt());// 创建时间戳
		}
		agd.setTimeStamp(System.currentTimeMillis());
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
		inDto.setSt(agd.getAgendaTime()); //开始时间
		inDto.setEd(agd.getEndDate());// 结束日期
		inDto.setEt(agd.getEndTime());//结束时间
		inDto.setWtt(agd.getWtt());// 创建时间戳
		return inDto;
	}
	
	/**
	 * 判断是否存在于参与人的黑名单
	 * @param openId 当前登录人ID
	 * @param relId  参与人ID
	 * @param request
	 * @return
	 */
	public boolean getBla(String openId, String relId,HttpServletRequest request) {
		String url = "https://www.guobaa.com/bla/getOne";
		log.info("========获取黑名单：mpn" + openId+",relId:"+relId);
		// 设置参数
		Map<String, Object> hashMap = new LinkedHashMap<String, Object>();
		hashMap.put("mpn", openId);
		hashMap.put("relId", relId);
		JSONObject json = this.httpReq(url, hashMap, "POST", request);
		log.info("========获取黑名单：" + json.toString());
		boolean isbla = false;
		if(json.containsKey("rc") && "0".equals(json.getString("rc"))){
			json = json.getJSONObject("d");
			isbla = json.getBooleanValue("isbla");
		}
		return isbla;
	}
	/**
	 * Http请求
	 * @param url
	 * @param hashMap
	 * @param reqType
	 * @param request
	 * @return
	 */
	public JSONObject httpReq(String url,Map<String, Object> hashMap,String reqType,HttpServletRequest request) {
		
		// 设置header
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
		httpHeaders.add("lt",request.getHeader("lt"));	
		httpHeaders.add("pi",request.getHeader("pi"));	
		httpHeaders.add("pv",request.getHeader("pv"));	
		httpHeaders.add("ai",request.getHeader("ai"));	
		httpHeaders.add("di",request.getHeader("di"));	
		httpHeaders.add("dt",request.getHeader("dt"));	
		
		HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<Map<String, Object>>(hashMap, httpHeaders);
		// 执行请求
		RestTemplate restTemplate = new RestTemplate();
		String json = null;
		log.info("========url获取返回信息：" + url);
		if(reqType.equals("POST")){
			json = restTemplate.exchange(url, HttpMethod.POST,
					requestEntity, String.class).getBody();
		}else{
			json = restTemplate.exchange(url, HttpMethod.GET,
					requestEntity, String.class).getBody();
		}
		log.info("========获取返回信息：" + json);
		return JSONObject.parseObject(json);
	}
	
	/**
	 * 获取用户信息手机号
	 */
	public String getUserInfo(String unionid) {
		String npm = "";
		String url = "https://www.guobaa.com/aup/user/" + unionid + "/userinfo";
		log.info("========url获取返回信息：" + url);
		// 设置参数
//		JSONObject json = this.httpReq(url, hashMap, "GET", request);
		// 执行请求
		RestTemplate restTemplate = new RestTemplate();
		JSONObject json = restTemplate.getForObject(url, JSONObject.class);
		if(json.containsKey("errcode") && json.getString("errcode").equals("0")){
			json = json.getJSONObject("data");
			npm = json.getString("phoneno");
		}
		log.info("========获取人员信息：" + json.toString());
		return npm;
	}

}
