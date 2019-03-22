package com.xiaoji.gtd.services;

import java.util.List;

import com.xiaoji.gtd.dto.BlaBlacklistDto;
import com.xiaoji.gtd.entity.BlaBlacklist;

/**
 * Book 数据持久层操作接�?
 *
 * Created by bysocket on 09/10/2017.
 */
public interface IXjBlacklistService {
	
	/**
	 * 添加黑名�?
	 * @param blacklist
	 */
	BlaBlacklist add(BlaBlacklistDto blacklist);
	
	List<BlaBlacklist> addList(BlaBlacklistDto blacklist);
	
	/**
	 * 删除黑名�?
	 * @param blacklist
	 */
	boolean delete(BlaBlacklistDto blacklist);
	
	/**
	 * 查询黑名�?
	 * @param blacklist
	 */
	List<BlaBlacklist> findByRelId(String relAccountId);
	
	List<BlaBlacklist> findBlacklist(String relAccountId,String phone);
}
