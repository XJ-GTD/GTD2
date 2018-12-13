package com.xiaoji.gtd.dto;

import java.util.List;

/**
 * 参与人查询结果数据
 *
 * create by wzy on 2018/11/13
 */
public class SearchOutDto extends BaseOut {

    private List<PlayerDataDto> players;

    public List<PlayerDataDto> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerDataDto> players) {
        this.players = players;
    }
}
