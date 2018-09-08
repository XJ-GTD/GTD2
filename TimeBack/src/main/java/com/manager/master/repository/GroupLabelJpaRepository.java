package com.manager.master.repository;

import com.manager.master.entity.GtdGroupLabel;
import com.manager.master.entity.GtdLabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupLabelJpaRepository extends JpaRepository<GtdGroupLabel,Integer> {

}
