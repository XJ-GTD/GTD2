/**
 * create by wzy on 2018/05/28
 */

//日程类
export class ScheduleModel {
  scheduleId: string;         //事件id
  scheduleName: string;         //事件名
  scheduleDetail: string;       //事件详情
  scheduleIssuer: string;       //发布人Id

  scheduleIssuerName: string;       //发布人姓名

  scheduleExecutor: string;       //执行人EXECUTOR
  scheduleCreateDate: any;     //创建时间SCHEDULE_CREATE_DATE
  scheduleStartDate: any;     //开始时间SCHEDULE_START_DATE
  scheduleFinishDate: any;     //完成时间SCHEDULE_FINISH_DATE
  scheduleEndDate: any;     //截止时间SCHEDULE_END_DATE
  scheduleState: number;     //事件状态SCHEDULE_STATE(-1 未完成 1完成)
  groupId: string;          //组群idGROUP_ID
  scheduleMap: string;     //位置SCHEDULE_MAP
  scheduleRemindDate: any;     //提醒时间SCHEDULE_REMIND_DATE
  scheduleRemindRepeat: string;     //重复提醒SCHEDULE_REMIND_REPEAT
  scheduleRemindRepeatType: string;     //重复提醒类型SCHEDULE_REMIND_REPEAT_TYPE（1 每日 2 每月 3每年）
  scheduleEditDate: any;//修改时间SCHEDULE_EDIT_DATE
  flagCreateGroup: string;

  //执行事件表(日程关联表)
  executorFinishDate: any;     //完成时间-执行事件表
  executorRemindDate: any;    //提醒时间-执行事件表
  executorRemindRepeat: string;     //重复提醒-执行事件表
  executorRemindRepeatType: string;     //重复提醒类型-执行事件表（1 每日 2 每月 3每年）

  executorEditDate: any;    //修改时间SCHEDULE_EDIT_DATE

  executorState: number; //事件状态 EXECUTOR_STATE
  //用户表
  executorId: string;//执行人ID
  executorName: string;//执行人姓名（用户表里的用户名）
}
