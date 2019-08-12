
export enum EventType {
  Agenda = "0",
  Task = "1",
  MiniTask = "2"
}

export enum SyncType {
  unsynch = "unsynch",
  synch = "synch"
}

export enum DelType {
  undel = "undel",
  del = "del"
}

export enum GsType {
  self = "0",
  him = "1",
  sys = "2",
  waitin = "3",
  waitdel = "4"
}

export enum ObType {
  event = "event",
  memo = "memo",
  calendar = "calendar"
}

//重复结束选项
export enum OverType {
  forever = "forever",
  times = "times",
  limitdate = "limitdate"
}

//重复类型选项
export enum CycleType {
  close = "close",
  d = "d",
  m = "m",
  w = "w",
  y = "y"
}

//重复开启选项
export enum WeekType {
  close = "close",
  Monday  = "Monday",
  Tuesday  = "Tuesday",
  Wednesday  = "Wednesday",
  Thursday  = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday"
}

