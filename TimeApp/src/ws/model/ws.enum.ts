/**
 * MQ接收业务数据类处理类型
 *
 * create by zhangjy on 2019/03/13
 */

//播报
export enum S {
  AN = "S.AN",  //直接消息内播报
  P = "S.P"       // 替换参数后播报（本地）
}

//查询（日程，参与人）
export enum F {
  F = "F.F",  //参与人查询（根据拼音查询传入下步操作）
  C = "F.C"       // 查询日程
}

//日程整理（保存上下文）
export enum SS {
  C = "SS.C",  //新建日程
  U = "SS.U",       // 查询日程
  D = "SS.D",       // 查询日程
}

//日程处理（保存上下文）
export enum AG {
  C = "AG.C",  //新建日程
  U = "AG.U",       // 更新日程
  D = "AG.D",       // 删除日程
}

//备忘处理（保存上下文）
export enum MO {
  C = "MO.C",  //新建备忘
}

//日程修改（获取上下文中）
export enum SC {
  T = "SC.T",  //
}

//日程更新，新建，删除（被分享）
export enum SH {
  U = "SH.U",  //修改
  C = "SH.C",  //新建
  D = "SH.D",  //删除
}

//推送通知
export enum PN {
  DR = "PN.DR",   //每日简报通知推送
  FB = "PN.FB"    //中断反馈通知推送
}

//日程标签
export enum MK {
  U = "MK.U"  //标注日程语义标签
}

//设置
export enum SY {
  S = "SY.S",  //系统设置
  B = "SY.B",  //拒收朋友消息
}

//闹铃设置
export enum R {
  N = "R.N",  //闹铃设置无日程
  T = "R.T",  //计时设置
  C = "R.C",  //闹铃设置关联日程
}

//操作
export enum O {
  O = "O.O",  //确认
  C = "O.C",  //取消
  S = "O.S",  //追问(时间，主题)
}

//第三方接口或技能
export enum T {
}
