
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
  private static REQUEST_URL: string = "http://192.168.0.176:8080/gtd";

  /* RabbitMq WebSocket */
  public static RABBITMQ_WS_URL: string = "ws://192.168.0.219:15674/ws";

  /* RabbitMq SockJs */
  public static RABBITMQ_SJ_URL: string = "http://192.168.0.219:15674/stomp";

  /* Controller */
  private static USER_URL: string = AppConfig.REQUEST_URL + "/user";    //用户类

  private static GROUP_URL: string = AppConfig.REQUEST_URL + "/group";   //群组类

  private static SCHEDULE_URL: string = AppConfig.REQUEST_URL + "/schedule";    //日程类

  /* Connect */
  //用户类
  public static USER_LOGIN_URL: string = AppConfig.USER_URL + "/login";   //登陆 POST

  public static USER_REGISTER_URL: string = AppConfig.USER_URL + "/signin";   //注册 POST

  //群组类
  public static GROUP_FIND_URL: string = AppConfig.GROUP_URL + "/find";    //全部群组查询 GET

  public static GROUP_ADD_URL: string = AppConfig.GROUP_URL + "/";    //群组添加 POST

  //日程类
  public static SCHEDULE_ADD_URL: string = AppConfig.SCHEDULE_URL + "/create";    //添加（新增）日程 POST

  public static SCHEDULE_GROUP_ADD_URL: string = AppConfig.SCHEDULE_URL + "/createII";    //群组内添加日程 POST

  public static SCHEDULE_FIND_URL: string = AppConfig.SCHEDULE_URL + "/findAll";    //查询日程列表 POST

  public static SCHEDULE_FIND_SINGLE_URL: string = AppConfig.SCHEDULE_URL + "/findScheduleByOne";    //查询单个日程 GET

  public static SCHEDULE_GROUP_ALL_URL: string = AppConfig.SCHEDULE_URL + "/findSchByGroup";    //查询群组全部日程 GET

  public static SCHEDULE_MINE_GROUP_URL: string = AppConfig.SCHEDULE_URL + "/findSchAndExcu";    //查询群组内日程是否自己执行 GET

  public static SCHEDULE_EDIT_EXECUTOR_URL: string = AppConfig.SCHEDULE_URL + "/updateExecutorSchedule";    //编辑个人执行日程 POST

  public static SCHEDULE_FIND_DATA_URL: string = AppConfig.SCHEDULE_URL + "/createschbycalendar";    //个人日历查询 GET

}
