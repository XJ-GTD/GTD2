

/**
 * 日程整理（保存上下文）
 *
 * create by zhangjy on 2019/03/12.
 */
export class CudscdPara {
  //日程ID
  id:string;
  //日程主题
  d:string;
  //日程时间
  t:string;
  //日程日期
  ti:string;
  //地址
  adr:string;
  //重要事项
  todolist:string;
  //提醒
  reminds:Array<number>;
}
