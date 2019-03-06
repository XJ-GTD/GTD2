package com.xiaoji.gtd.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.xiaoji.gtd.entity.AgdAgendaContacts;

/**
 * AgdContactsRepository 数据持久层操作接口
 *
 */
public interface AgdContactsRepository extends JpaRepository<AgdAgendaContacts, Long> {
	/**
	 * 根据日程ID查询联系人
	 * @param relAgendaId
	 * @return
	 */
	@Query("select recId,contactsId,relAgendaId,accountId,contactsName,phone"
			+ " from AgdAgendaContacts xj where xj.relAgendaId = ?1")
	public List<AgdAgendaContacts> findContactsByRelId(String relAgendaId);

}
