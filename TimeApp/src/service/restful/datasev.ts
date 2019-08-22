import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {SyncDataSecurity, SyncDataStatus} from "../../data.enum";

/**
 * 数据同步操作
 */
@Injectable()
export class DataRestful {
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }

  /**
   * 上传同步数据
   * 同步成功通过MQ返回
   *
   * @author leon_xi@163.com
   **/
  async push(params: PushInData): Promise<PushOutData> {
    let url: UrlEntity = this.config.getRestFulUrl("SPH");

    let data = await this.request.post(url, params);

    if (data) {
      return data.d;
    } else {
      return null;
    }
  }

  /**
   * 拉取同步数据请求
   * 数据通过MQ返回
   *
   * @author leon_xi@163.com
   **/
  async pull(params: PullInData): Promise<PullOutData> {
    let url: UrlEntity = this.config.getRestFulUrl("SPL");

    let data = await this.request.post(url, params);

    if (data) {
      return data.d;
    } else {
      return null;
    }
  }
}

export class SyncData {
  src: string;        // 元数据唯一标识符(修改他人共享给自己的数据进行同步时使用)
  id: string;         // 本地数据唯一标识符
  type: string;       // 数据类型(可以自定义, 建议使用Plan|PlanItem|Agenda|Task|MiniTask|Memo)
  to: Array<string>;  // 被共享人手机号(可以为空, 表示非共享数据)
  security: SyncDataSecurity;   // None(非共享/多设备间同步), SelfModify(只有发起人可以修改), ShareModify(所有人都可以修改), ShareModifyWithoutSender(共享后发起人本地删除)
  status: SyncDataStatus; // 删除/未删除
  payload: any;       // 数据
}

export class PushInData {
  d: Array<SyncData>;   // 需要同步的数据负载
}

export class PushOutData {
  // 数据的同步返回通过MQ发送给客户端
}

export class PullInData {
  d: Array<string>;     // 需要拉取得数据唯一标识符数组, 可以为空(表示拉取所有未拉取的数据)
}

export class PullOutData {
  // 拉取的数据通过MQ发送给客户端
}
