package com.xiaoji.gtd.controller;

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
     * @param map ,method = RequestMethod.GET
     * @return
     */
    @RequestMapping(value="/agenda/save",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto add(@RequestBody AgdAgendaDto blacklist,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	log.info("---- 保存日程获取头部ai  -----" + relId);
    	log.info("---- 保存日程获取获取参数  -----" + JSONObject.toJSONString(blacklist));
    	
    	AgdAgenda agd = agendaService.findById(blacklist.getAi());
    	boolean isDef = false; 
		if(agd != null){
			if(!agd.getTitle().equals(blacklist.getAt())){
				isDef = true;
			}
			if(!agd.getAgendaDate().equals(blacklist.getAdt())){
				isDef = true;
			}
			if(!agd.getAgendaTime().equals(blacklist.getSt())){
				isDef = true;
			}
			if(!agd.getEndDate().equals(blacklist.getEd())){
				isDef = true;
			}
			if(!agd.getEndTime().equals(blacklist.getEt())){
				isDef = true;
			}
			if(!agd.getRemindFlag().equals(blacklist.getAa())){
				isDef = true;
			}
			if(!agd.getRepeatType().equals(blacklist.getAr())){
				isDef = true;
			}
		}else{
			isDef = true;
		}
    	
		if(!isDef){
			log.info("---- 日程信息没有发生变化不做更新  -----");
		}
		
    	if(isDef && !"".equals(relId) && relId != null && 
    			blacklist.getAi() != null &&!"".equals(blacklist.getAi())){
    		blacklist.setFc(relId);
    		AgdAgenda xj = agendaService.save(blacklist);
    		out.setD(xj);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG+"ai 不能为空！");
    	}

        return out;
    }
    
    /**
     * 获取日程信息
     * @param map
     * @return
     */
    @RequestMapping(value="/agenda/info",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto getInfo(@RequestBody AgdAgendaDto blacklist,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
    	
    	//String relId = request.getHeader("ai");
    	log.info("---- 保存日程获取获取参数  -----" + JSONObject.toJSONString(blacklist));
    	String agdId = blacklist.getAi();
    	if(!"".equals(agdId) && agdId != null){
//    		blacklist.setFc(relId);
    		AgdAgenda agd = agendaService.findById(blacklist.getAi());
    		if(agd != null){
    			out.setD(BaseUtil.agdToDtoAgd(agd));
    		}
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }
    
    /**
     * 删除日程
     * @param map  @RequestBody
     * @return
     */
    @RequestMapping(value="/agenda/remove",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto remove(@RequestBody AgdAgendaDto blacklist,HttpServletRequest request) {
    	
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	log.info("---- 保存日程获取获取参数  -----" + JSONObject.toJSONString(blacklist));
    	if(!"".equals(blacklist.getAi()) && blacklist.getAi() != null){
    		blacklist.setFc(relId);
    		agendaService.deleteById(blacklist);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }
    
    /**
     * 保存参与人
     * @param map
     * @return
     */
    @RequestMapping(value="/agendacontacts/save",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto saveContacts(@RequestBody AgdAgendaDto blacklist,HttpServletRequest request) {
    	log.info("---- 保存日程参与人获取获取参数  -----" + JSONObject.toJSONString(blacklist));
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	if(!"".equals(relId) && relId != null){
    		blacklist.setFc(relId);
    		contanctService.save(blacklist);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }

   
}
