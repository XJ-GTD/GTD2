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
  Activity = '1',
  Weather = '2'
}

export enum SelfDefineType {
  System = "0",
  Define = "1"
}

export enum PlanDownloadType {
  NO = '0',
  YES = '1'
}

// 翻页控制
export enum PageDirection {
  PageUp = 'up',
  PageInit = 'init',
  PageDown = 'down',
  PageAssign = 'assign',
  NoOption = 'nooption'
}

export enum ObjectType {
  Event = 'event',
  Memo = 'memo',
  Calendar = 'calendar',
  CalendarPlan = 'plan'
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
  RepeatToOnly = "2",
}

//修改确认类型
export enum ConfirmType {
  None = "None",
  CurrentOrFutureAll = "CurrentOrFutureAll",
  FutureAll = "FutureAll",
  All = "All"
}

//重复开启选项
export enum OpenWay {
  close = -1,
  Monday  = 0,
  Tuesday  = 1,
  Wednesday  = 2,
  Thursday  = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6
}

//修改权限
export enum ModiPower {
  disable = "0",
  enable  = "1",
}

// 完成状态
export enum CompleteState {
  None = "none",
  UnComplete = "uncomplete",
  Completed = "completed"
}

//邀请状态
export enum InviteState {
  None = "none",
  Accepted = "accepted",
  Rejected = "rejected"
}

//再邀请权限
export enum InvitePowr {
  disable = "0",
  enable  = "1",
}

//提醒选项
export enum RemindTime {
  beginevent = 0,
  m10  = 10,
  m30 = 30,
  h1  = 60,
  h4 = 240,
  d1  = 440
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
  StartSet = "0",
  WholeDay = "1",
  EndSet = "2"
}

//错误代码
export enum Err {
  netbroken = -901,
}

//日程修改、删除类型
export enum OperateType  {
  OnlySel = "OnlySel",
  FromSel = "FromSel",
  Non = "Non"
}

//成员共享状态
export enum MemberShareState {
  SendWait = "0",
  AcceptWait = "1",
  Accepted = "2",
  Rejected = "3",
  Removed = "4"
}

// 数据同步权限
export enum SyncDataSecurity {
  None                      = 'None',                     // 非共享/多设备间同步
  SelfModify                = 'SelfModify',               // 只有发起人可以修改
  ShareModify               = 'ShareModify',              // 所有人都可以修改
  ShareModifyWithoutSender  = 'ShareModifyWithoutSender'  // 共享后发起人本地删除
}

// 数据同步状态
export enum SyncDataStatus {
  Deleted = "del",
  UnDeleted = "undel"
}

// 是否加入todolist
export enum ToDoListStatus {
  On = "0",
  Off = "1"
}

export enum EventFinishStatus{
  Finished = "0",
  NonFinish = "1"
}

export enum  StatusType{
  other = 1,
  home = 2,
  meun = 3,
  page = 4,
  model = 5
}

export enum ModalTranType {
  def = "def",
  right = "right",
  left = "left",
  top = "top",
  scale = "scale",
}
export enum UpdState {
  inherent = "inherent",
  updtodel = "updtodel",
  updtoadd = "updtoadd",
}

export enum PullType {
  Full = "Plan|Attachment|Grouper|Memo|PlanItem|Agenda|Task|MiniTask"
}

export enum TellyouType {
  invite_agenda = "invite_agenda",      //1活动邀请
  invite_planitem = "invite_planitem", //2日历项邀请
  remind_agenda = "remind_agenda",     //3 活动提醒
  remind_minitask = "remind_minitask",// 4小任务提醒
  remind_planitem = "remind_planitem",// 5日历项提醒
  remind_todo = "remind_todo",         // 6重要事项系统
  remind_merge = "remind_merge",// 7和并提醒
  cancel_agenda = "cancel_agenda",      //取消活动
  cancel_planitem = "cancel_planitem",      //@活动
  at_agenda = "at_agenda",      //at活动
  system = "system",      // 10系统消息
  default = "default",      // 缺省
}

export enum TellyouIdType {
  Agenda = "Agenda",    // 1活动
  PlanItem = "PlanItem",// 2日历项
  MiniTask = "MiniTask",// 3小任务
}
