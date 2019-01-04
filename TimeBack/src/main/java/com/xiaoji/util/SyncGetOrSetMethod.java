package com.xiaoji.util;

import com.xiaoji.gtd.dto.sync.SyncTableData;
import com.xiaoji.gtd.entity.GtdPlayerEntity;

/**
 * 同步方法用
 * entity 取值赋值统一方法
 */
public class SyncGetOrSetMethod {

    /**
     * 联系人Dto转化entity
     * @param std
     * @return
     */
    public static GtdPlayerEntity dtoToEntity(SyncTableData std) {
        GtdPlayerEntity playerEntity = new GtdPlayerEntity();

        playerEntity.setId(std.getTableA());                    //主键
        playerEntity.setPlayerAnotherName(std.getTableB());     //别称
        playerEntity.setPyOhterName(std.getTableC());           //别称拼音
        playerEntity.setPlayerId(std.getTableD());              //联系人用户ID
        playerEntity.setPlayerHeadimg(std.getTableE());         //联系人头像
        playerEntity.setPlayerName(std.getTableF());            //联系人昵称
        playerEntity.setPyPlayerName(std.getTableG());          //联系人昵称拼音
        playerEntity.setPlayerContact(std.getTableH());         //联系人手机号
        playerEntity.setPlayerFlag(Integer.valueOf(std.getTableI()));   //授权联系人标识
        playerEntity.setPlayerType(Integer.valueOf(std.getTableJ()));   //联系人类型
        playerEntity.setUserId(std.getTableK());                //联系人数据归属

        return playerEntity;
    }

    /**
     * 联系人entity转化Dto
     * @param gpe
     * @return
     */
    public static SyncTableData entityToDto(GtdPlayerEntity gpe) {
        SyncTableData data = new SyncTableData();

        data.setTableA(gpe.getId());                                //主键
        data.setTableB(gpe.getPlayerAnotherName());                 //别称
        data.setTableC(gpe.getPyOhterName());                       //别称拼音
        data.setTableD(gpe.getPlayerId());                          //联系人用户ID
        data.setTableE(gpe.getPlayerHeadimg());                     //联系人头像
        data.setTableF(gpe.getPlayerName());                        //联系人昵称
        data.setTableG(gpe.getPyPlayerName());                      //联系人昵称拼音
        data.setTableH(gpe.getPlayerContact());                     //联系人手机号
        data.setTableI(String.valueOf(gpe.getPlayerFlag()));        //授权联系人标识
        data.setTableJ(String.valueOf(gpe.getPlayerType()));        //联系人类型
        data.setTableK(gpe.getUserId());                            //联系人数据归属

        return data;
    }
}
