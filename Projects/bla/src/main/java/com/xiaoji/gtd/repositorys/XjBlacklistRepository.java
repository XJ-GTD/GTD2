package com.xiaoji.gtd.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.xiaoji.gtd.entity.BlaBlacklist;

/**
 * BlaBlacklist 数据持久层操作接口
 *
 */
public interface XjBlacklistRepository extends JpaRepository<BlaBlacklist, Long> {

	@Query("select xj.id,xj.accountId,xj.phone,xj.contactsName,xj.relAccountId from BlaBlacklist xj where xj.relAccountId = ?1 and xj.phone = ?2")
	public List<BlaBlacklist> findBlacklist(String relAccountId,String phone);
	
	@Query("select xj.id,xj.accountId,xj.phone,xj.contactsName,xj.relAccountId from BlaBlacklist xj where xj.relAccountId = ?1")
	public List<BlaBlacklist> findByRelId(String relAccountId);
	
//	@Modifying
//	@Query("delete from XjBlacklist xj where xj.relAccountId = ?1 and xj.phone = ?2")
//	int deleteByInfo(String relAccountId,String phone);
}
