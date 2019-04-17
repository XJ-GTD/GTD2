package com.xiaoji.gtd.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.xiaoji.gtd.entity.AgdAgendaRecord;

/**
 * AgdRecordRepository 数据持久层操作接口
 *
 */
@Repository
public interface AgdRecordRepository extends JpaRepository<AgdAgendaRecord, Long>,JpaSpecificationExecutor<AgdAgendaRecord> {
	/**
	 * 根据日程ID和参与人手机号查询发送记录
	 * @param relAgendaId
	 * @return
	 */
	@Query("select new AgdAgendaRecord(recId,agendaId,accountId,timeStamp,phone,requestState)"
			+ " from AgdAgendaRecord where requestState=0 and agendaId = ?1 and phone=?2")
	public List<AgdAgendaRecord> findRecordByAgdId(String agendaId,String phone);
	
}
