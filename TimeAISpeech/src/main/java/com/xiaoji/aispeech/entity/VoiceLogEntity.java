package com.xiaoji.aispeech.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "gtd_voice_log", schema = "gtd")
public class VoiceLogEntity {
    private long id;
    private String reqUserid;
    private String reqService;
    private String reqDeviceId;
    private String reqText;
    private String resAnswer;
    private String resService;
    private String resSid;
    private String resOriginal;
    private String resSlot;
    private String resCode;
    private String resError;
    private Timestamp createDate;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Basic
    @Column(name = "REQ_USERID")
    public String getReqUserid() {
        return reqUserid;
    }


    public void setReqUserid(String reqUserid) {
        this.reqUserid = reqUserid;
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
    @Column(name = "REQ_SERVICE")
    public String getReqService() {
        return reqService;
    }

    public void setReqService(String reqService) {
        this.reqService = reqService;
    }

    @Basic
    @Column(name = "REQ_DEVICEID")
    public String getReqDeviceId() {
        return reqDeviceId;
    }

    public void setReqDeviceId(String reqDeviceId) {
        this.reqDeviceId = reqDeviceId;
    }

    @Lob
    @Column(name = "REQ_TEXT")
    public String getReqText() {
        return reqText;
    }

    public void setReqText(String reqText) {
        this.reqText = reqText;
    }

    @Lob
    @Column(name = "RES_ANSWER")
    public String getResAnswer() {
        return resAnswer;
    }

    public void setResAnswer(String resAnswer) {
        this.resAnswer = resAnswer;
    }

    @Basic
    @Column(name = "RES_SERVICE")
    public String getResService() {
        return resService;
    }

    public void setResService(String resService) {
        this.resService = resService;
    }

    @Basic
    @Column(name = "RES_SID")
    public String getResSid() {
        return resSid;
    }

    public void setResSid(String resSid) {
        this.resSid = resSid;
    }

    @Lob
    @Column(name = "RES_ORIGINAL")
    public String getResOriginal() {
        return resOriginal;
    }

    public void setResOriginal(String resOriginal) {
        this.resOriginal = resOriginal;
    }

    @Lob
    @Column(name = "RES_SLOT")
    public String getResSlot() {
        return resSlot;
    }

    public void setResSlot(String resSlot) {
        this.resSlot = resSlot;
    }

    @Basic
    @Column(name = "RES_CODE")
    public String getResCode() {
        return resCode;
    }

    public void setResCode(String resCode) {
        this.resCode = resCode;
    }

    @Basic
    @Column(name = "RES_ERROR")
    public String getResError() {
        return resError;
    }

    public void setResError(String resError) {
        this.resError = resError;
    }
}
