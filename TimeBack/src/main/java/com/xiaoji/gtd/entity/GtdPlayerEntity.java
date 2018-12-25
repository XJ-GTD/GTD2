package com.xiaoji.gtd.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "gtd_player", schema = "gtd", catalog = "")
public class GtdPlayerEntity {
    private String id;
    private String playerId;
    private String pyOhterName;
    private String playerAnotherName;
    private String playerName;
    private String pyUserName;
    private Integer playerFlag;
    private String playerHeadimg;
    private Integer playerType;
    private String playerContact;
    private String relation;
    private String userId;
    private String createId;
    private Timestamp createDate;
    private String updateId;
    private Timestamp updateDate;

    @Id
    @Column(name = "ID")
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Basic
    @Column(name = "PLAYER_ID")
    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    @Basic
    @Column(name = "PY_OHTER_NAME")
    public String getPyOhterName() {
        return pyOhterName;
    }

    public void setPyOhterName(String pyOhterName) {
        this.pyOhterName = pyOhterName;
    }

    @Basic
    @Column(name = "PLAYER_ANOTHER_NAME")
    public String getPlayerAnotherName() {
        return playerAnotherName;
    }

    public void setPlayerAnotherName(String playerAnotherName) {
        this.playerAnotherName = playerAnotherName;
    }

    @Basic
    @Column(name = "PLAYER_NAME")
    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    @Basic
    @Column(name = "PY_USER_NAME")
    public String getPyUserName() {
        return pyUserName;
    }

    public void setPyUserName(String pyUserName) {
        this.pyUserName = pyUserName;
    }

    @Basic
    @Column(name = "PLAYER_FLAG")
    public Integer getPlayerFlag() {
        return playerFlag;
    }

    public void setPlayerFlag(Integer playerFlag) {
        this.playerFlag = playerFlag;
    }

    @Basic
    @Column(name = "PLAYER_HEADIMG")
    public String getPlayerHeadimg() {
        return playerHeadimg;
    }

    public void setPlayerHeadimg(String playerHeadimg) {
        this.playerHeadimg = playerHeadimg;
    }

    @Basic
    @Column(name = "PLAYER_TYPE")
    public Integer getPlayerType() {
        return playerType;
    }

    public void setPlayerType(Integer playerType) {
        this.playerType = playerType;
    }

    @Basic
    @Column(name = "PLAYER_CONTACT")
    public String getPlayerContact() {
        return playerContact;
    }

    public void setPlayerContact(String playerContact) {
        this.playerContact = playerContact;
    }

    @Basic
    @Column(name = "RELATION")
    public String getRelation() {
        return relation;
    }

    public void setRelation(String relation) {
        this.relation = relation;
    }

    @Basic
    @Column(name = "USER_ID")
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "CREATE_ID")
    public String getCreateId() {
        return createId;
    }

    public void setCreateId(String createId) {
        this.createId = createId;
    }

    @Basic
    @Column(name = "CREATE_DATE")
    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }

    @Basic
    @Column(name = "UPDATE_ID")
    public String getUpdateId() {
        return updateId;
    }

    public void setUpdateId(String updateId) {
        this.updateId = updateId;
    }

    @Basic
    @Column(name = "UPDATE_DATE")
    public Timestamp getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Timestamp updateDate) {
        this.updateDate = updateDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GtdPlayerEntity that = (GtdPlayerEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(playerId, that.playerId) &&
                Objects.equals(pyOhterName, that.pyOhterName) &&
                Objects.equals(playerAnotherName, that.playerAnotherName) &&
                Objects.equals(playerName, that.playerName) &&
                Objects.equals(pyUserName, that.pyUserName) &&
                Objects.equals(playerFlag, that.playerFlag) &&
                Objects.equals(playerHeadimg, that.playerHeadimg) &&
                Objects.equals(playerType, that.playerType) &&
                Objects.equals(playerContact, that.playerContact) &&
                Objects.equals(relation, that.relation) &&
                Objects.equals(userId, that.userId) &&
                Objects.equals(createId, that.createId) &&
                Objects.equals(createDate, that.createDate) &&
                Objects.equals(updateId, that.updateId) &&
                Objects.equals(updateDate, that.updateDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, playerId, pyOhterName, playerAnotherName, playerName, pyUserName, playerFlag, playerHeadimg, playerType, playerContact, relation, userId, createId, createDate, updateId, updateDate);
    }
}
