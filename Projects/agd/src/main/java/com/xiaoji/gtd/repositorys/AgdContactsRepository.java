package com.xiaoji.gtd.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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

}
