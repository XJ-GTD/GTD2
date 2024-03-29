package com.xiaoji.gtd.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.xiaoji.gtd.dto.BaseOutDto;
import com.xiaoji.gtd.dto.BlaBlacklistDto;
import com.xiaoji.gtd.entity.BlaBlacklist;
import com.xiaoji.gtd.services.IXjBlacklistService;
import com.xiaoji.gtd.util.ReturnMessage;

/**
 * BlacklistController 控制层
 *
 */
@RestController
@CrossOrigin
@RequestMapping(value = "/")
public class BlacklistController {
	
	Logger log = LoggerFactory.getLogger(BlacklistController.class);
	
    @Autowired
    IXjBlacklistService blackService;

    /**
     * 添加黑名单
     * @param map
     * @return
     */
    @RequestMapping(value="/target/add")
    @ResponseBody
    public BaseOutDto add(@RequestBody BlaBlacklistDto blacklist,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	if(relId != null && !"".equals(relId)   
    			&& blacklist.getMpn() != null && !"".equals(blacklist.getMpn())){
    		blacklist.setRelId(relId);
    		BlaBlacklist xj = blackService.add(blacklist);
    		out.setD(xj);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		log.error("入参不能为空："+ JSONObject.toJSONString(blacklist));
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}

        return out;
    }
    
    /**
     * 添加黑名单
     * @param map
     * @return
     */
    @RequestMapping(value="/target/addList")
    @ResponseBody
    public BaseOutDto addList(@RequestBody BlaBlacklistDto blacklist,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	if(!"".equals(relId) && relId != null 
    			&& blacklist.getBls() != null && blacklist.getBls().size()>0){
    		blacklist.setRelId(relId);
    		BlaBlacklist xj = blackService.add(blacklist);
    		out.setD(xj);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}

        return out;
    }
    
    /**
     * 删除黑名单
     * @param map
     * @return
     */
    @RequestMapping(value="/target/remove")
    @ResponseBody
    public BaseOutDto delete(@RequestBody BlaBlacklistDto blacklist,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	if(!"".equals(relId) && relId != null){
    		blacklist.setRelId(relId);
    		blackService.delete(blacklist);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		log.error("删除黑名单失败，入参不能为空："+ JSONObject.toJSONString(blacklist));
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }
    
    /**
     * 获取黑名单列表
     * @param map
     * @return
     */
    @RequestMapping(value="/list")
    @ResponseBody
    public BaseOutDto getList(@RequestBody BlaBlacklistDto blacklist,HttpServletRequest request) {
    	
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	List<BlaBlacklistDto> dtoList = new ArrayList<BlaBlacklistDto>();
    	log.info("=====获取头部信息："+ relId);
    	if(relId != null && !"".equals(relId)){
    		blacklist.setRelId(relId);
    		List<BlaBlacklist> xjList = blackService.findByRelId(relId);
    		for (BlaBlacklist bla : xjList) {
    			dtoList.add(this.blaToBlaDto(bla));
			}
    		out.setD(dtoList);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}
    	
    	log.info(out.toString());
        return out;
    }
    
    /**
     * 获取单个黑名单人员信息
     * @param map
     * @return
     */
    @RequestMapping(value="/getOne")
    @ResponseBody
    public BaseOutDto getOne(@RequestBody BlaBlacklistDto blacklist,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
    	String relId = blacklist.getRelId();
    	String mobile = blacklist.getMpn();
    	log.info("查询黑名单relId:"+relId+"mobile:"+mobile);
    	if(relId != null && !"".equals(relId) && mobile != null &&!"".equals(mobile)){
    		blacklist.setRelId(relId);
    		List<BlaBlacklist> xjList = blackService.findBlacklist(relId, mobile);
    		log.info("查询黑名单返回结果:"+JSONObject.toJSONString(xjList));
    		Map<String, Object> map = new HashMap<String, Object>();
    		map.put("mpn", mobile);
			map.put("relId", relId);
    		if(xjList.size()>0){
    			map.put("isbla", true);
    		}else{
    			map.put("isbla", false);
    		}
    		out.setD(map);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }
    
    private BlaBlacklistDto blaToBlaDto(BlaBlacklist bla){
		BlaBlacklistDto dto = new BlaBlacklistDto();
		dto.setAi(bla.getAccountId());
		dto.setN(bla.getContactsName());
		dto.setMpn(bla.getPhone());
		dto.setRelId(bla.getRelAccountId());
		dto.setA(bla.getHeadImg());
		return dto;
	}
}
