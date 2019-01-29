package com.xiaoji.gtd.dto.schedule;

import com.xiaoji.gtd.dto.player.PlayerDataDto;
import com.xiaoji.gtd.dto.player.SearchOutDto;

import java.util.List;

/**
 * 日程处理输出类详情
 *
 * create by wzy on 2019/01/29
 */
public class ScheduleOutData {

    private String scheduleId;
    private List<PlayerDataDto> players;

    public String getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(String scheduleId) {
        this.scheduleId = scheduleId;
    }

    public List<PlayerDataDto> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerDataDto> players) {
        this.players = players;
    }

}
