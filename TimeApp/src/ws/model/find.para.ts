

/**
 * 日历修改参数
 *
 * create by zhangjy on 2019/03/12.
 */
export class FindPara{
  //参与人
  fs:[{
    n:string,
    ai:string,
    mpn:string
  }];
  scd:{
    //开始日期
    ds:string;
    //开始时间
    ts:string;
    //结束日期
    de:string;
    //结束时间
    te:string;
    //主题
    ti:string;
    //人物查询
    fs:Array<any>;
    //标签查询
    marks:Array<string>;
    //查询对象
    targets:Array<string>;
  }
}
