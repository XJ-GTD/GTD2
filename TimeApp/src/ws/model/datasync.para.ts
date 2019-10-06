

/**
 * 数据同步
 *
 * create by zhangjy on 2019/03/12.
 */
export class DataSyncPara {
  //数据类型
  type:string;
  //数据ID
  id:any;
  //数据状态 删除或非删除
  status:string;
  //共享状态 共享成员删除,完成和接受/拒绝
  share:any;
  //数据参与成员
  to:Array<string> = new Array<string>();
  //数据
  data:any;
}
