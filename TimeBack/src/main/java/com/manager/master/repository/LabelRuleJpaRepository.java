package com.manager.master.repository;

import com.manager.master.entity.GtdLabelRuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LabelRuleJpaRepository extends JpaRepository<GtdLabelRuleEntity,Integer> {

    @Query(value = "SELECT IFNULL(LABEL_RULE_ID,0) FROM gtd_label_rule WHERE LABEL_ID=?1",nativeQuery = true)
    Integer getIdByLabel(int labelId);
}
