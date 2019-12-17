

export class WsDataConfig {
  /*========== 设置上下文contextRetMap key =========*/
  //日程信息
  public static SCD: string = "scd";
  //人员信息
  public static FS:string = "fs";
  //备忘信息
  public static MOD:string = "mod";
  //日历项信息
  public static PID:string = "pid";
  //前动作option服务器交互
  public static PRVOPTION:string = "prvoption";
  //前动作prvprocessor服务器交互
  public static PRVPROCESSOR:string = "prvprocessor";
  //前动作option本地
  public static OPTION4SPEECH:string = "option4Speech";
  //前动作process本地
  public static PROCESSOR4SPEECH:string = "processor4Speech";

  public static BRANCHCODE:string = "branchcode";

  public static BRANCHTYPE:string = "branchtype";


  /*========== 语音类型 =========*/
  public static TYPE_NONE:string = "NONE";

  public static TYPE_ONE:string = "ONE";

  public static TYPE_MULTI:string = "MULTI";

  public static TYPE_EMPTY:string = "EMPTY";

  /*========== 语音处理出错类型 =========*/
  public static BRANCHTYPE_FORBIDDEN:string = "FORBIDDEN";

  /*========== 语音处理出错代码 =========*/
  public static BRANCHCODE_E0001:string = "E0001";
}
