package com.xiaoji.gtd.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

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
    	if(!"".equals(relId) && relId != null){
    		blacklist.setRelId(relId);
    		boolean xj = blackService.add(blacklist);
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
    public BaseOutDto getList(BlaBlacklistDto blacklist,HttpServletRequest request) {
    	
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	List<BlaBlacklistDto> dtoList = new ArrayList<BlaBlacklistDto>();
    	if(!"".equals(relId) && relId != null){
    		blacklist.setRelId(relId);
    		List<BlaBlacklist> xjList = blackService.findByRelId(relId);
    		for (BlaBlacklist bla : xjList) {
    			dtoList.add(this.blaToBlaDto(bla));
			}
    		out.setD(xjList);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }
    
    /**
     * 获取单个黑名单人员信息
     * @param map
     * @return
     */
    @RequestMapping(value="/getOne")
    @ResponseBody
    public BaseOutDto getOne(BlaBlacklistDto blacklist,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
    	String relId = blacklist.getRelId();
    	String mobile = blacklist.getMpn();
    	if(relId != null && !"".equals(relId) && mobile != null &&!"".equals(mobile)){
    		blacklist.setRelId(relId);
    		List<BlaBlacklist> xjList = blackService.findBlacklist(relId, mobile);
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
