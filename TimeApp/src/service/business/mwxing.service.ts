import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";

/**
 * 冥王星客户端用户操作外处理
 *
 * 检查权限并确认授权
 * 创建/升级数据库
 * 拉取并更新冥王星运行参数（不联网时使用原有参数运行）
 * 登录状态确认（未登录 => 进行登录）
 * 获取本地联系人
 * 获取jpush设备注册ID,并更新当前设备为默认设备（浏览器除外）
 * 连接消息队列（AMQP: 真机, WS: 浏览器）
 * 注册事件（jpush通知接收，网络连接与断开事件，联系人变动事件，日历变动事件）
 * 同步未同步数据
 * 第一次登录拉取最新数据
 *
 * create by leon_xi@163.com on 2019/10/15.
 */
@Injectable()
export class MWXingService extends BaseService {
  constructor() {
    super();
  }

  async start() {}
  async background() {}
  async foreground() {}

  async beforeHomeStart() {}
  async homeStart() {}
  async afterHomeStart() {}

  async beforeInstall() {}
  async install() {}
  async afterInstall() {}

  async beforeLogin() {}
  async login() {}
  async afterLogin() {}
}
