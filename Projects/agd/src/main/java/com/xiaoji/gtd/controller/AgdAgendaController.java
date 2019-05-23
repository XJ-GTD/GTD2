package com.xiaoji.gtd.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.dto.AgdContactsDto;
import com.xiaoji.gtd.dto.BaseOutDto;
import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.services.IAgendaService;
import com.xiaoji.gtd.services.IContactsService;
import com.xiaoji.gtd.util.BaseUtil;
import com.xiaoji.gtd.util.ReturnMessage;

/**
 * AgdAgendaController 日程管理控制层
 *
 */
@RestController
@CrossOrigin
@RequestMapping(value = "/")
public class AgdAgendaController {
	Logger log = LoggerFactory.getLogger(AgdAgendaController.class);
	@Autowired
	IAgendaService agendaService;
	@Autowired
	IContactsService contanctService;

	/**
	 * 保存日程
	 * 
	 * @param map
	 *            ,method = RequestMethod.GET
	 * @return
	 */
	@RequestMapping(value = "/agenda/save", method = RequestMethod.POST)
	@ResponseBody
	public BaseOutDto add(@RequestBody AgdAgendaDto freshAgd, HttpServletRequest request) {
		BaseOutDto out = new BaseOutDto();
		String relId = request.getHeader("ai");
		log.info("---- 保存日程获取头部ai  -----" + relId);
		log.info("---- 保存日程获取获取参数  -----" + JSONObject.toJSONString(freshAgd));
		freshAgd.setSerCreaterId(relId);
		AgdAgenda agd = agendaService.findById(freshAgd.getAi());
		boolean isDef = false;
		if (agd != null) {
			log.info("---- 服务器日程获取获取参数  -----" + JSONObject.toJSONString(agd));
			if (agd.getTitle() == null || !agd.getTitle().equals(freshAgd.getAt())) {
				log.info(agd.getTitle() + " => " + freshAgd.getAt());
				isDef = true;
			}
			// 修正它系统全天标示不一致的问题
			String adt = agd.getAgendaDate();
			String freshAdt = freshAgd.getAdt();
			if (adt != null && adt.length() >= 10) {
				adt = adt.substring(0, 10);
			}
			if (freshAdt != null && freshAdt.length() >= 10) {
				freshAdt = freshAdt.substring(0, 10);
			}
			if (adt == null || !adt.equals(freshAdt)) {
				log.info(agd.getAgendaDate() + " => " + freshAgd.getAdt());
				isDef = true;
			}
			if (agd.getAgendaTime() == null || !agd.getAgendaTime().equals(freshAgd.getSt())) {
				log.info(agd.getAgendaTime() + " => " + freshAgd.getSt());
				isDef = true;
			}
			if (agd.getEndDate() == null || !agd.getEndDate().equals(freshAgd.getEd())) {
				log.info(agd.getEndDate() + " => " + freshAgd.getEd());
				isDef = true;
			}
			if (agd.getEndTime() == null || !agd.getEndTime().equals(freshAgd.getEt())) {
				log.info(agd.getEndTime() + " => " + freshAgd.getEt());
				isDef = true;
			}
			// if(agd.getRemindFlag() != null &&
			// !agd.getRemindFlag().equals(blacklist.getAa())){
			// isDef = true;
			// }
			if (agd.getRepeatType() == null || !agd.getRepeatType().equals(freshAgd.getAr())) {
				log.info(agd.getRepeatType() + " => " + freshAgd.getAr());
				isDef = true;
			}
		} else {
			isDef = true;
		}

		if (!isDef) {
			log.info("---- 日程信息没有发生变化不做发送只做更新  -----");
			AgdAgenda xj = agendaService.save(freshAgd);
			out.setD(xj);
			out.setRc(ReturnMessage.SUCCESS_CODE);
			out.setRm(ReturnMessage.SUCCESS_MSG);
		}

		if (isDef && !"".equals(relId) && relId != null && freshAgd.getAi() != null && !"".equals(freshAgd.getAi())) {
			AgdAgenda xj = agendaService.saveAndSend(freshAgd, request);
			out.setD(xj);
			out.setRc(ReturnMessage.SUCCESS_CODE);
			out.setRm(ReturnMessage.SUCCESS_MSG);
		} else {
			out.setRc(ReturnMessage.ERROR_CODE);
			out.setRm(ReturnMessage.ERROR_MSG + "ai 不能为空！");
		}

		return out;
	}

	/**
	 * 获取日程信息
	 * 
	 * @param map
	 * @return
	 */
	@RequestMapping(value = "/agenda/info", method = RequestMethod.POST)
	@ResponseBody
	public BaseOutDto getInfo(@RequestBody AgdAgendaDto freshAgd, HttpServletRequest request) {
		BaseOutDto out = new BaseOutDto();

		// String relId = request.getHeader("ai");
		log.info("---- 保存日程获取获取参数  -----" + JSONObject.toJSONString(freshAgd));
		String agdId = freshAgd.getAi();
		if (!"".equals(agdId) && agdId != null) {
			AgdAgenda agd = agendaService.getAgdAgendaInfo(agdId,request);
			if (agd != null) {
				out.setD(BaseUtil.agdToDtoAgd(agd));
				out.setRc(ReturnMessage.SUCCESS_CODE);
				out.setRm(ReturnMessage.SUCCESS_MSG);
			}else{
				out.setRc(ReturnMessage.NULL_CODE);
				out.setRm(ReturnMessage.NULL_MSG);
			}
			
		} else {
			out.setRc(ReturnMessage.ERROR_CODE);
			out.setRm(ReturnMessage.ERROR_MSG);
		}
		return out;
	}

	/**
	 * 删除日程
	 * 
	 * @param map
	 * 			@RequestBody
	 * @return
	 */
	@RequestMapping(value = "/agenda/remove", method = RequestMethod.POST)
	@ResponseBody
	public BaseOutDto remove(@RequestBody AgdAgendaDto freshAgd, HttpServletRequest request) {

		BaseOutDto out = new BaseOutDto();
		String openId = request.getHeader("ai");
		log.info("---- 保存日程获取获取参数  -----" + JSONObject.toJSONString(freshAgd));
		if (!"".equals(freshAgd.getAi()) && freshAgd.getAi() != null) {
			agendaService.deleteById(freshAgd, openId, request);
			out.setRc(ReturnMessage.SUCCESS_CODE);
			out.setRm(ReturnMessage.SUCCESS_MSG);
		} else {
			out.setRc(ReturnMessage.ERROR_CODE);
			out.setRm(ReturnMessage.ERROR_MSG);
		}
		return out;
	}

	/**
	 * 保存参与人
	 * 
	 * @param map
	 * @return
	 */
	@RequestMapping(value = "/agendacontacts/save", method = RequestMethod.POST)
	@ResponseBody
	public BaseOutDto saveContacts(@RequestBody AgdAgendaDto freshAgd, HttpServletRequest request) {
		log.info("---- 保存日程参与人获取获取参数  -----" + JSONObject.toJSONString(freshAgd));
		BaseOutDto out = new BaseOutDto();
		if (freshAgd.getAc() != null && freshAgd.getAc().size()>0 
				&& freshAgd.getAi() != null && !"".equals(freshAgd.getAi())) {
			List<AgdContactsDto> acL = freshAgd.getAc();
			if(acL != null && acL.size()>0){
				contanctService.save(freshAgd,request);
			}
			
			out.setRc(ReturnMessage.SUCCESS_CODE);
			out.setRm(ReturnMessage.SUCCESS_MSG);
		} else {
			out.setRc(ReturnMessage.ERROR_CODE);
			out.setRm("传入保存日程参与人信息不全");
			log.error("======== 传入保存日程参与人信息不全：" + JSONObject.toJSONString(freshAgd));
		}
		return out;
	}

}
