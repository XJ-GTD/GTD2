//package com.manager.config.security;
//
//import UserJpaRepository;
//import UserRepository;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.authority.AuthorityUtils;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Component;
//
//import javax.annotation.Resource;
//
///**
// * 用户认证逻辑
// *
// * create by wzy on 2018/08/28
// */
//@Component
//public class UserAuthService implements UserDetailsService {
//
//    private Logger logger = LogManager.getLogger(this.getClass());
//    @Autowired
//    private UserRepository userRepository;
//    @Resource
//    private UserJpaRepository userJpaRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String accountName) throws UsernameNotFoundException {
//
//        return new User(accountName, "123456", AuthorityUtils.commaSeparatedStringToAuthorityList("admin"));
//    }
//}
