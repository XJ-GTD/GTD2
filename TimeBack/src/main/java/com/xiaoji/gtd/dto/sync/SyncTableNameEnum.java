package com.xiaoji.gtd.dto.sync;

/**
 * 表名称对应
 *
 * create by wzy on 2019/01/04
 */
public enum SyncTableNameEnum {

    USER("GTD_A"),
    PLAYER("GTD_B"), PLAYER_MEMBER("GTD_B_X"),
    SCHEDULE("GTD_C"), EXECUTE("GTD_D"), LOCAL_SCHEDULE("gtd_local_schedule"),
    SCHEDULE_A("GTD_C_RC"),SCHEDULE_B("GTD_C_C"),SCHEDULE_C("GTD_C_BO"),SCHEDULE_D("GTD_C_JN"),SCHEDULE_E("GTD_C_MO"),
    PLAN("GTD_J_H");

    public String tableName;

    SyncTableNameEnum(String tableName) {
        this.tableName = tableName;
    }

}
