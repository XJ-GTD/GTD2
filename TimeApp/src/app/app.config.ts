
/**
 * Generated class for the ScheduleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 *
 * 请求路径类
 * create by wzy on 2018/05/24
 */

export class AppConfig {

  /* 环境URL 头部 */
  // private static REQUEST_URL: string = "http://192.168.176:8080/gtd";
  private static REQUEST_URL: string = "http://localhost:8080/gtd";//连接本地数据库

  /* RabbitMq WebSocket */
  public static RABBITMQ_WS_URL: string = "ws://192.168.0.219:15674/ws";

  /* RabbitMq SockJs */
  public static RABBITMQ_SJ_URL: string = "http://192.168.0.219:15674/stomp";

  /* 讯飞语音*/
  private static XUNFEI_URL: string = "http://192.168.0.176:8081/cortana";

  /* Controller */
  private static USER_URL: string = AppConfig.REQUEST_URL + "/user";    //用户类

  private static GROUP_URL: string = AppConfig.REQUEST_URL + "/group";   //群组类

  private static SCHEDULE_URL: string = AppConfig.REQUEST_URL + "/schedule";    //日程类

  private static WEB_SOCKET_URL: string = AppConfig.REQUEST_URL + "/push";    //webSocket推送

  /* Connect */
  //用户类
  public static USER_LOGIN_URL: string = AppConfig.USER_URL + "/login";   //登陆 POST

  public static USER_REGISTER_URL: string = AppConfig.USER_URL + "/register";   //注册 POST

  public static USER_LABEL_URL: string = AppConfig.USER_URL + "/find_label";           //查询标签

  //群组类
  public static GROUP_FIND_URL: string = AppConfig.GROUP_URL + "/find_all";    //全部群组查询 POST

  public static GROUP_ADD_GROUP_URL: string = AppConfig.GROUP_URL + "/add_group" //新增群组 post

  public static GROUP_FIND_SINGLE_URL: string = AppConfig.GROUP_URL + "/find_single";    //群组详情查询 POST

  public static GROUP_FIND_GROUPMEMBER_URL: string = AppConfig.GROUP_URL + "/find_group_member";    //查询群成员全部 POST

  // public static GROUP_ADD_URL: string = AppConfig.GROUP_URL + "/add_group";    //群组添加 POST

  public static GROUP_ALL_SHOW_URL: string = AppConfig.GROUP_URL + "/find_all_players";   //全部参与人展示

  //日程类
  // public static SCHEDULE_TASK_ISSUE: string = AppConfig.SCHEDULE_URL + "/task_announcement";    //发布任务 POST

  public static SCHEDULE_ADD_URL: string = AppConfig.SCHEDULE_URL + "/create";    //添加（新增）日程 POST

  public static SCHEDULE_GROUP_ADD_URL: string = AppConfig.SCHEDULE_URL + "/createII";    //群组内添加日程 POST

  public static SCHEDULE_FIND_URL: string = AppConfig.SCHEDULE_URL + "/findAll";    //查询日程列表 POST

  public static SCHEDULE_FIND_SINGLE_URL: string = AppConfig.SCHEDULE_URL + "/findScheduleByOne";    //查询单个日程 GET

  public static SCHEDULE_GROUP_ALL_URL: string = AppConfig.SCHEDULE_URL + "/findSchByGroup";    //查询群组全部日程 GET

  public static SCHEDULE_MINE_GROUP_URL: string = AppConfig.SCHEDULE_URL + "/findSchAndExcu";    //查询群组内日程是否自己执行 GET

  public static SCHEDULE_EDIT_EXECUTOR_URL: string = AppConfig.SCHEDULE_URL + "/updateExecutorSchedule";    //编辑个人执行日程 POST

  public static SCHEDULE_FIND_DATA_URL: string = AppConfig.SCHEDULE_URL + "/createschbycalendar";    //个人日历查询 GET

  public static SCHEDULE_UPDATE_STATE_URL: string = AppConfig.SCHEDULE_URL + "/update_state";  //更新日程状态

  //webSocket推送
  public static WEB_SOCKET_TASK_URL: string = AppConfig.WEB_SOCKET_URL + "/task";    //个人日历查询 GET


  //讯飞语音
  public static XUNFEI_URL_TEXT: string = AppConfig.XUNFEI_URL + "/answer_text";    //文本回传 POST
  public static XUNFEI_URL_AUDIO: string = AppConfig.XUNFEI_URL + "/answer_audio";    //语音文件带答案回传 POST
}
