package com.xiaoji.gtd.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.dto.BlaBlacklistDto;
import com.xiaoji.gtd.entity.BlaBlacklist;
import com.xiaoji.gtd.repositorys.XjBlacklistRepository;
import com.xiaoji.gtd.services.IXjBlacklistService;

/**
 *黑名单实现类
 *
 */
@Service
@Transactional
public class XjBlacklistServiceImpl implements IXjBlacklistService{

	@Autowired
	XjBlacklistRepository xjBlackRep;
	/**
	 * 
	 */
	public boolean add(BlaBlacklistDto black) {
		
		List<BlaBlacklist> list = xjBlackRep.findBlacklist(
				black.getRelId(), black.getMpn());
		if(list.size()<1){
			BlaBlacklist bla = new BlaBlacklist();
			bla.setAccountId(black.getAi());
			bla.setContactsName(black.getN());
			bla.setPhone(black.getMpn());
			bla.setRelAccountId(black.getRelId());
			bla.setHeadImg(black.getA());
			xjBlackRep.save(bla);
			return true;
		}
		return false;
	}

	public boolean delete(BlaBlacklistDto blacklist) {
		List<BlaBlacklist> list = xjBlackRep.findBlacklist(
				blacklist.getRelId(), blacklist.getMpn());
		if(list.size()>0){
			xjBlackRep.deleteById(list.get(0).getId());
			return true;
		}
		return false;
	}

	public List<BlaBlacklist> findAll() {
		List<BlaBlacklist> list = xjBlackRep.findAll();
		return list;
	}

	public List<BlaBlacklist> findBlacklist(String relAccountId, String phone) {
		List<BlaBlacklist> list = xjBlackRep.findBlacklist(relAccountId, phone);
		return list;
	}
	
}
