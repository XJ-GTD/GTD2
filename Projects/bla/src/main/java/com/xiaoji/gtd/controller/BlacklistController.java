package com.xiaoji.gtd.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
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
    public BaseOutDto add(BlaBlacklistDto blacklist,HttpServletRequest request) {
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
    public BaseOutDto delete(BlaBlacklistDto blacklist,HttpServletRequest request) {
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
     * 删除黑名单
     * @param map
     * @return
     */
    @RequestMapping(value="/list")
    @ResponseBody
    public BaseOutDto getList(BlaBlacklistDto blacklist,HttpServletRequest request) {
    	
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	if(!"".equals(relId) && relId != null){
    		blacklist.setRelId(relId);
    		List<BlaBlacklist> xjList = blackService.findAll();
    		out.setD(xjList);
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setRc(ReturnMessage.ERROR_CODE);
    		out.setRm(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }

   
}
