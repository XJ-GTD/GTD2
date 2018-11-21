package com.xiaoji.master.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LabelRuleJpaRepository extends JpaRepository<GtdLabelRuleEntity,Integer> {
    /**
     * 判断标签是否为权限标签
     * @param labelId
     * @return
     */
    @Query(value = "SELECT LABEL_RULE_ID FROM gtd_label_rule WHERE LABEL_ID=?1",nativeQuery = true)
    Integer getIdByLabel(int labelId);
}
