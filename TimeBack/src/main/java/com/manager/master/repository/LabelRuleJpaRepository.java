package com.manager.master.repository;

import com.manager.master.entity.GtdLabelRuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LabelRuleJpaRepository extends JpaRepository<GtdLabelRuleEntity,Integer> {

}
