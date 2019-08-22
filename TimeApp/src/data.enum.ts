
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

// 翻页控制
export enum PageDirection {
  PageUp = 'up',
  PageInit = 'init',
  PageDown = 'down'
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
  //自己
  self = "0",
  //他人
  him = "1",
  //系统
  sys = "2",
  //共享待接受缓存
  waitin = "3",
  //共享待删除
  waitdel = "4"
}

//重复结束选项
export enum OverType {
  //永不
  fornever = "fornever",
  //截止次数
  times = "times",
  //截止时间
  limitdate = "limitdate"
}

//重复类型选项
export enum CycleType {
  close = "close",
  day = "1",
  week = "2",
  month = "3",
  year = "4"
}

//记录标志
export enum RepeatFlag {
  NonRepeat = "0",
  Repeat = "1",
  RepeatToNon = "2",
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
  Whole = "1",
  NonWhole = "0"

}

//错误代码
export enum Err {
  netbroken = -901,
}

//日程修改、删除类型
export enum OperateType  {
  OnlySel = "OnlySel",
  FromSel = "FromSel",
  Non ="Non"

}

// 数据同步权限
export enum SyncDataSecurity {
  None                      = 'None',                     // 非共享/多设备间同步
  SelfModify                = 'SelfModify',               // 只有发起人可以修改
  ShareModify               = 'ShareModify',              // 所有人都可以修改
  ShareModifyWithoutSender  = 'ShareModifyWithoutSender'  // 共享后发起人本地删除
}
