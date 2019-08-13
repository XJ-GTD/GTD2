
//事件类型
export enum EventType {
  Agenda = "0",
  Task = "1",
  MiniTask = "2"
}

export enum PlanType {
  CalendarPlan = '0',
  ActivityPlan = '1',
  PrivatePlan = '2'
}

export enum PlanItemType {
  Holiday = '0',
  Activity = '1'
}

export enum PlanDownloadType {
  NO = '0',
  YES = '1'
}

export enum ObjectType {
  Event = 'event',
  Memo = 'memo',
  Calendar = 'calendar'
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
  m10  = "10",
  m30 = "30",
  h1  = "60",
  h4 = "240",
  d1  = "1440"
}

//是否完成
export enum IsSuccess {
	wait = "0",
  success = "1"

}

//完成后是否需要自动创建
export enum IsCreate {
	isNo = "0",
  isYes = "1"

}

//是否全天
export enum IsWholeday {
  Whole = "0",
  NonWhole = "1"

}

//错误代码
export enum Err {
  netbroken = -901,
}

