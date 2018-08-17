package com.manager.master.repository;

import com.manager.master.bean.UserAccountBean;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserAccountBean, Integer> {
}
