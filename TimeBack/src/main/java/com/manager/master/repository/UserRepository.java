package com.manager.master.repository;

import com.manager.master.entity.GtdAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface UserRepository extends JpaRepository<GtdAccountEntity, Integer> {



}
