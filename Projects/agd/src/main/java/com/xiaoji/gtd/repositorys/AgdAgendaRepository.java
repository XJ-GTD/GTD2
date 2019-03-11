package com.xiaoji.gtd.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.xiaoji.gtd.entity.AgdAgenda;



/**
 * AgdAgenda 数据持久层操作接口
 *
 */
public interface AgdAgendaRepository extends JpaRepository<AgdAgenda, String> {
	
	/**
	 * 根据日程ID查询日程
	 * @param agendaId
	 * @return
	 */
	@Query("select agendaId,relAgendaId,createrId,title,agendaDate,planFlag,repeatType"
			+ " from AgdAgenda where agendaId = ?1")
	public AgdAgenda findByStrId(String agendaId);
	
	/**
	 * 根据日程ID删除日程
	 * @param agendaId
	 * @return
	 */
	@Modifying
	@Query("delete from AgdAgenda xj where xj.agendaId = ?1")
	int deleteByStrId(String agendaId);
}
