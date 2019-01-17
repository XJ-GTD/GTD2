package com.xiaoji.gtd.dto.player;

import com.xiaoji.gtd.dto.BaseOut;
import com.xiaoji.gtd.dto.player.PlayerDataDto;

import java.util.List;

/**
 * 参与人查询结果数据
 *
 * create by wzy on 2018/11/13
 */
public class SearchOutDto extends BaseOut {

    private String pyOfName;
    private List<PlayerDataDto> players;

    public List<PlayerDataDto> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerDataDto> players) {
        this.players = players;
    }

    public String getPyOfName() {
        return pyOfName;
    }

    public void setPyOfName(String pyOfName) {
        this.pyOfName = pyOfName;
    }
}
