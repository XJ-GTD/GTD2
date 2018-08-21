package com.manager.master.repository;

import com.manager.master.entity.GtdAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<GtdAccountEntity, Integer> {
}
