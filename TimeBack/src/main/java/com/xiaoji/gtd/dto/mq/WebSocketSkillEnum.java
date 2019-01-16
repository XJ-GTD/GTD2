package com.xiaoji.gtd.dto.mq;

/**
 * 意图命令枚举类
 *
 * create by wzy 2018/11/26
 */
public enum WebSocketSkillEnum {
    XF_GTD("0", "SCARECROW"),
    XF_NORM_TRUE("A0001","好的，已确认"), XF_NORM_CANCEL("A0002","好的，已取消"),
    XF_SCHEDULE_CREATE("A1101","gtd_schedule_create"), XF_SCHEDULE_DELETE("A1102","gtd_schedule_delete"), XF_SCHEDULE_FIND("A1103","gtd_schedule_find"),
    XF_PLAYER_CREATE("A1201","gtd_player_create"), XF_PLAYER_DELETE("A1202","gtd_player_delete"), XF_PLAYER_FIND("A1203","gtd_player_find"), XF_PLAYER_AUTH("A1204","gtd_player_auth"),
    XF_SYSTEM_HIDE("A1301","gtd_system_hide"),
    XF_OTHER_WEATHER("B1000","weather"), XF_OTHER_CALENDAR("B1000","calendar"), XF_OTHER_DATA("B1000","datetimeX"),
    BC_SCHEDULE_CREATE("D1101","schedule_create"), BC_SCHEDULE_DELETE("D1102","schedule_delete"), BC_SCHEDULE_UPDATE("D1103","schedule_update"),
    BC_PLAYER_CREATE("D1201","player_create"),;

    private String intent;
    private String code;

    WebSocketSkillEnum(String code, String intent) {
        this.intent = intent;
        this.code = code;
    }

    public static String getIntentCode(String intent) {
        for (WebSocketSkillEnum ie: WebSocketSkillEnum.values()) {
            if (intent.equals(ie.getIntent())) {
                return ie.getCode();
            }
        }
        return null;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }}
