
/**
 * 意图
 *
 * create by wzy on 2018/11/28
 */
export class SkillConfig {

  //通用操作
  public static XF_NMT: string = "A0001";    //确认
  public static XF_NMC: string = "A0002";    //取消

  //讯飞指令
  public static XF_SCC: string = "A1101";    //讯飞：日程添加
  public static XF_SCD: string = "A1102";    //讯飞：日程删除
  public static XF_SCF: string = "A1103";    //讯飞：日程查询
  public static XF_PEC: string = "A1201";    //讯飞：参与人添加
  public static XF_PED: string = "A1202";    //讯飞：参与人删除
  public static XF_PEF: string = "A1203";    //讯飞：参与人查询
  public static XF_PEA: string = "A1204";    //讯飞：参与人授权
  public static XF_SYSH: string = "A1301";    //讯飞：私密模式

  //其他技能
  public static XF_OTWT: string = "B1001";    //天气
  public static XF_OTCN: string = "B1002";    //万年历
  public static XF_OTDT: string = "B1003";    //日期

  //业务指令
  public static BC_SCC: string = "D1101";    //添加日程
  public static BC_SCD: string = "D1102";    //删除日程
  public static BC_SCU: string = "D1103";    //更新日程
  public static BC_PEC: string = "D1201";    //添加参与人

}
