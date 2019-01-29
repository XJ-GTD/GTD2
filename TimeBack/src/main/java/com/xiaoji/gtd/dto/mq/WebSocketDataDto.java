package com.xiaoji.gtd.dto.mq;

/**
 * MQ消息业务数据类
 *
 * create by wzy on 2018/11/22
 */
public class WebSocketDataDto {

    //业务：日程
    private String sn;      //scheduleName;
    private String st;      //startTime;
    private String et;      //endTime;
    private String lb;      //label;
    private String pn;      //planName;
    private String pln;     //playerName;
    private String ss;      //status;

    private String si;      //scheduleId;
    private String ei;       //executeId
    private String pli;     //playerId;
    private Integer sa;     //scheduleAuth

    //日程：子表
    private String id;      //ID
    private String rm;      //comment
    private String cft;     //repeatType
    private String ac;      //remindType
    private String dt;      //remindTime
    private String fh;      //finishStatus
    private String wd;      //finishTime

    //联系人
    private String us;      //userId
    private String un;      //userName
    private String hi;      //headImg
    private String mb;      //mobile
    private Boolean ia;      //isAgree

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public String getSt() {
        return st;
    }

    public void setSt(String st) {
        this.st = st;
    }

    public String getEt() {
        return et;
    }

    public void setEt(String et) {
        this.et = et;
    }

    public String getLb() {
        return lb;
    }

    public void setLb(String lb) {
        this.lb = lb;
    }

    public String getPn() {
        return pn;
    }

    public void setPn(String pn) {
        this.pn = pn;
    }

    public String getPln() {
        return pln;
    }

    public void setPln(String pln) {
        this.pln = pln;
    }

    public String getSs() {
        return ss;
    }

    public void setSs(String ss) {
        this.ss = ss;
    }

    public String getUs() {
        return us;
    }

    public void setUs(String us) {
        this.us = us;
    }

    public String getUn() {
        return un;
    }

    public void setUn(String un) {
        this.un = un;
    }

    public String getHi() {
        return hi;
    }

    public void setHi(String hi) {
        this.hi = hi;
    }

    public Boolean getIa() {
        return ia;
    }

    public void setIa(Boolean ia) {
        this.ia = ia;
    }

    public String getMb() {
        return mb;
    }

    public void setMb(String mb) {
        this.mb = mb;
    }

    public String getSi() {
        return si;
    }

    public void setSi(String si) {
        this.si = si;
    }

    public String getEi() {
        return ei;
    }

    public void setEi(String ei) {
        this.ei = ei;
    }

    public Integer getSa() {
        return sa;
    }

    public void setSa(Integer sa) {
        this.sa = sa;
    }

    public String getPli() {
        return pli;
    }

    public void setPli(String pli) {
        this.pli = pli;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRm() {
        return rm;
    }

    public void setRm(String rm) {
        this.rm = rm;
    }

    public String getCft() {
        return cft;
    }

    public void setCft(String cft) {
        this.cft = cft;
    }

    public String getAc() {
        return ac;
    }

    public void setAc(String ac) {
        this.ac = ac;
    }

    public String getDt() {
        return dt;
    }

    public void setDt(String dt) {
        this.dt = dt;
    }

    public String getFh() {
        return fh;
    }

    public void setFh(String fh) {
        this.fh = fh;
    }

    public String getWd() {
        return wd;
    }

    public void setWd(String wd) {
        this.wd = wd;
    }

    //扩展字段
    private String common_A;        //人名原参数value
    private String common_B;        //人名原参数normValue
    private String common_C;        //
    private String common_D;        //
    private String common_E;
    private String common_F;
    private String common_G;
    private String common_H;
    private String common_J;
    private String common_K;
    private String common_L;
    private String common_M;
    private String common_N;
    private String common_O;
    private String common_P;
    private String common_Q;
    private String common_R;
    private String common_S;
    private String common_T;
    private String common_U;
    private String common_V;
    private String common_W;
    private String common_X;
    private String common_Y;
    private String common_Z;

    public String getCommon_A() {
        return common_A;
    }

    public void setCommon_A(String common_A) {
        this.common_A = common_A;
    }

    public String getCommon_B() {
        return common_B;
    }

    public void setCommon_B(String common_B) {
        this.common_B = common_B;
    }

    public String getCommon_C() {
        return common_C;
    }

    public void setCommon_C(String common_C) {
        this.common_C = common_C;
    }

    public String getCommon_D() {
        return common_D;
    }

    public void setCommon_D(String common_D) {
        this.common_D = common_D;
    }

    public String getCommon_E() {
        return common_E;
    }

    public void setCommon_E(String common_E) {
        this.common_E = common_E;
    }

    public String getCommon_F() {
        return common_F;
    }

    public void setCommon_F(String common_F) {
        this.common_F = common_F;
    }

    public String getCommon_G() {
        return common_G;
    }

    public void setCommon_G(String common_G) {
        this.common_G = common_G;
    }

    public String getCommon_H() {
        return common_H;
    }

    public void setCommon_H(String common_H) {
        this.common_H = common_H;
    }

    public String getCommon_J() {
        return common_J;
    }

    public void setCommon_J(String common_J) {
        this.common_J = common_J;
    }

    public String getCommon_K() {
        return common_K;
    }

    public void setCommon_K(String common_K) {
        this.common_K = common_K;
    }

    public String getCommon_L() {
        return common_L;
    }

    public void setCommon_L(String common_L) {
        this.common_L = common_L;
    }

    public String getCommon_M() {
        return common_M;
    }

    public void setCommon_M(String common_M) {
        this.common_M = common_M;
    }

    public String getCommon_N() {
        return common_N;
    }

    public void setCommon_N(String common_N) {
        this.common_N = common_N;
    }

    public String getCommon_O() {
        return common_O;
    }

    public void setCommon_O(String common_O) {
        this.common_O = common_O;
    }

    public String getCommon_P() {
        return common_P;
    }

    public void setCommon_P(String common_P) {
        this.common_P = common_P;
    }

    public String getCommon_Q() {
        return common_Q;
    }

    public void setCommon_Q(String common_Q) {
        this.common_Q = common_Q;
    }

    public String getCommon_R() {
        return common_R;
    }

    public void setCommon_R(String common_R) {
        this.common_R = common_R;
    }

    public String getCommon_S() {
        return common_S;
    }

    public void setCommon_S(String common_S) {
        this.common_S = common_S;
    }

    public String getCommon_T() {
        return common_T;
    }

    public void setCommon_T(String common_T) {
        this.common_T = common_T;
    }

    public String getCommon_U() {
        return common_U;
    }

    public void setCommon_U(String common_U) {
        this.common_U = common_U;
    }

    public String getCommon_V() {
        return common_V;
    }

    public void setCommon_V(String common_V) {
        this.common_V = common_V;
    }

    public String getCommon_W() {
        return common_W;
    }

    public void setCommon_W(String common_W) {
        this.common_W = common_W;
    }

    public String getCommon_X() {
        return common_X;
    }

    public void setCommon_X(String common_X) {
        this.common_X = common_X;
    }

    public String getCommon_Y() {
        return common_Y;
    }

    public void setCommon_Y(String common_Y) {
        this.common_Y = common_Y;
    }

    public String getCommon_Z() {
        return common_Z;
    }

    public void setCommon_Z(String common_Z) {
        this.common_Z = common_Z;
    }

}
