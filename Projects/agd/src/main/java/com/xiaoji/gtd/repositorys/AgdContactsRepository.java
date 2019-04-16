package com.xiaoji.gtd.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.xiaoji.gtd.entity.AgdAgendaContacts;

/**
 * AgdContactsRepository 数据持久层操作接口
 *
 */
@Repository
public interface AgdContactsRepository extends JpaRepository<AgdAgendaContacts, Long>,JpaSpecificationExecutor<AgdAgendaContacts> {
	/**
	 * 根据日程ID查询联系人
	 * @param relAgendaId
	 * @return
	 */
	@Query("select new AgdAgendaContacts(xj.recId,xj.contactsId,xj.relAgendaId,xj.accountId,xj.contactsName,xj.phone)"
			+ " from AgdAgendaContacts xj where xj.relAgendaId = ?1")
	public List<AgdAgendaContacts> findContactsByRelId(String relAgendaId);
	
	/**
	 * 根据日程ID查询联系人
	 * @param relAgendaId
	 * @return
	 */
	@Query("select new AgdAgendaContacts(xj.recId,xj.contactsId,xj.relAgendaId,xj.accountId,xj.contactsName,xj.phone)"
			+ " from AgdAgendaContacts xj where xj.relAgendaId = ?1 and xj.phone=?2")
	public List<AgdAgendaContacts> findContactsByRelId(String relAgendaId,String mobile);
	
	/**
	 * 删除日程联系人
	 * @param relAgendaId
	 * @param mobile
	 * @return
	 */
	@Modifying
	@Query("delete from AgdAgendaContacts where relAgendaId = ?1 and phone=?2")
	@Transactional
	public int delContactsByRelId(String relAgendaId,String mobile);
}
