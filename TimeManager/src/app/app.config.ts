
/**
 * Generated class for the ScheduleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class AppConfig {

  /* 环境URL 头部 */
  private static REQUEST_URL: string = "http://192.168.99.39:8080/gtd";

  /* Controller */
  private static USER_URL: string = AppConfig.REQUEST_URL + "/user";

  // private static GROUP_URL() {   //群组类
  //   return this.REQUEST_URL() + "/group";
  // }
  // private static SCHEDULE_URL() {    //日程类
  //   return this.REQUEST_URL() + "/schedule";
  // }

  /* Connect */
  //用户类
  public static USER_LOGIN_URL: string = AppConfig.USER_URL + "/login";

  // public static USER_REGISTER_URL() {    //登陆
  //   return this.USER_URL() + "/signin";
  // }
  //
  // //群组类
  // public static GROUP_FIND_URL() {    //全部群组查询
  //   return this.GROUP_URL() + "/find";
  // }
  // public static GROUP_ADD_URL() {    //群组添加
  //   return this.GROUP_URL() + "/";
  // }
  //
  // //日程类
  // public static SCHEDULE_ADD_URL() {    //添加（新增）日程
  //   return this.SCHEDULE_URL() + "/create";
  // }
  // public static SCHEDULE_GROUP_ADD_URL() {    //群组内添加日程
  //   return this.SCHEDULE_URL() + "/create";
  // }
  // public static SCHEDULE_FIND_URL() {    //查询日程列表
  //   return this.SCHEDULE_URL() + "/create";
  // }
  // public static SCHEDULE_FIND_SINGLE_URL() {    //查询单个日程
  //   return this.SCHEDULE_URL() + "/create";
  // }
  // public static SCHEDULE_GROUP_ALL_URL() {    //查询群组全部日程
  //   return this.SCHEDULE_URL() + "/create";
  // }
  // public static SCHEDULE_MINE_GROUP_URL() {    //查询群组内日程是否自己执行
  //   return this.SCHEDULE_URL() + "/create";
  // }
  // public static SCHEDULE_EDIT_EXECUTOR_URL() {    //编辑个人执行日程
  //   return this.SCHEDULE_URL() + "/create";
  // }

}
