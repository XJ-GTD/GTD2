package com.xiaoji.gtd.dto;

import java.util.List;
import java.util.Map;

/**
 * 参与人查询入参
 */
public class SearchInDto {

    private String userId;
    private String targetUserId;
    private String targetMobile;

    private List<PlayerDataDto> players;
    
}
