package com.xiaoji.gtd.dto.player;

import com.xiaoji.gtd.dto.BaseOut;

import java.util.List;

/**
 *
 * create by wzy on 2018/12/05
 */
public class PlayerOutDto extends BaseOut {
    private List<PlayerOutData> playerList;

    public List<PlayerOutData> getPlayerList() {
        return playerList;
    }

    public void setPlayerList(List<PlayerOutData> playerList) {
        this.playerList = playerList;
    }
}
