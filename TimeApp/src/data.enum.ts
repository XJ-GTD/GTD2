
//事件类型
export enum EventType {
  Agenda = "0",
  Task = "1",
  MiniTask = "2"
}


//是否同步
export enum SyncType {
  unsynch = "unsynch",
  synch = "synch"
}

//是否删除
export enum DelType {
  undel = "undel",
  del = "del"
}

//事件归属
export enum GsType {
  self = "0",
  him = "1",
  sys = "2",
  waitin = "3",
  waitdel = "4"
}

//对象类型
export enum ObType {
  event = "event",
  memo = "memo",
  calendar = "calendar"
}

//重复结束选项
export enum OverType {
  fornever = "fornever",
  times = "times",
  limitdate = "limitdate"
}

//重复类型选项
export enum CycleType {
  close = "close",
  d = "1",
  w = "2",
  m = "3",
  y = "4"
}

//重复开启选项
export enum OpenWay {
  close = "close",
  Monday  = "Monday",
  Tuesday  = "Tuesday",
  Wednesday  = "Wednesday",
  Thursday  = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday"
}

//修改权限
export enum ModiPower {
  disable = "0",
  enable  = "1",
}

//再邀请权限
export enum InvitePowr {
  disable = "0",
  enable  = "1",
}

//提醒选项
export enum TxType {
  close = "0",
  "10m"  = "1",
  "30m" = "2",
  "1h"  = "3",
  "4h" = "4",
  "1d"  = "5",
  customdef = "6"
}
