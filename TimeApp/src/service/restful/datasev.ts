import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {UserConfig} from "../config/user.config";
import {SyncDataSecurity, SyncDataStatus, InviteState, CompleteState} from "../../data.enum";

/**
 * 数据同步操作
 */
@Injectable()
export class DataRestful {
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }

  /**
   * http://pluto.guobaa.com/abl/store/local/upload
   * formData: binary
   * username: group
   *
   * {"code":0,"msg":"success","data":9743}
   **/
  async upload(upload: UploadInData): Promise<UploadOutData> {
    let url: UrlEntity = this.config.getRestFulUrl("SUP");

    let data = await this.request.upload(url, upload, upload.filepath, upload.filename);

    let result: UploadOutData = new UploadOutData();

    if (data) {
      Object.assign(result, data);
    }

    return result;
  }

  /**
   * https://pluto.guobaa.com/abl/store/remote/download
   **/
  async download(download: DownloadInData): Promise<DownloadOutData> {
    let url: UrlEntity = this.config.getRestFulUrl("SDL");

    let data = await this.request.download(url, download, download.filepath);

    return new DownloadOutData();
  }

  /**
   * 上传同步数据
   * 同步成功通过MQ返回
   *
   * @author leon_xi@163.com
   **/
  async push(params: PushInData): Promise<PushOutData> {
    let url: UrlEntity = this.config.getRestFulUrl("SPH");

    params.mpn = UserConfig.account.phone;
    params.name = UserConfig.account.name;

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

    params.mpn = UserConfig.account.phone;

    let data = await this.request.post(url, params);

    if (data) {
      return data.d;
    } else {
      return null;
    }
  }
}

export class SyncDataFields {
  compared: Array<string> = new Array<string>();
  unshared: Array<string> = new Array<string>();
}

export class SyncData {
  src: string = "";       // 元数据唯一标识符(修改他人共享给自己的数据进行同步时使用)
  id: string;             // 本地数据唯一标识符
  timestamp: number;      // 时间戳与数据唯一标识符确定唯一数据和版本
  type: string;           // 数据类型(可以自定义, 建议使用Plan|PlanItem|Agenda|Task|MiniTask|Memo)
  title: string;          // 数据标题, 用于通知时使用
  datetime: string;       // 数据指定日时, 用于通知时使用
  main: boolean = false;  // 是否主数据, 用于判断是否需要通知(重复数据只需要第一条主数据进行通知)
  parent: boolean = false;// 是否父数据, 用于判断是否需要拉取子数据
  group: string = "";     // 子日程属于哪个主日程，用于服务器对数据进行管理，主日程没有接受，子日程不同步给参与人
  to: Array<string> = new Array<string>();  // 被共享人手机号(可以为空, 表示非共享数据)
  security: SyncDataSecurity = SyncDataSecurity.None;   // None(非共享/多设备间同步), SelfModify(只有发起人可以修改), ShareModify(所有人都可以修改), ShareModifyWithoutSender(共享后发起人本地删除)
  status: SyncDataStatus;   // 删除/未删除
  invitestate: InviteState; // 受邀状态
  todostate: CompleteState = CompleteState.None; // 完成状态
  fields: SyncDataFields = new SyncDataFields();
  payload: any;           // 数据
}

export class PushInData {
  mpn: string;  // 手机号码
  name: string; // 用户名称
  d: Array<SyncData> = new Array<SyncData>();   // 需要同步的数据负载
}

export class PushOutData {
  // 数据的同步返回通过MQ发送给客户端
}

export class PullInData {
  mpn: string;  // 手机号码
  type: string; // 拉取数据类型
  d: Array<string> = new Array<string>();     // 需要拉取得数据唯一标识符数组, 可以为空(表示拉取所有未拉取的数据)
}

export class PullOutData {
  // 拉取的数据通过MQ发送给客户端
}

export class UploadInData {
  saPrefix: string = "sas";
  username: string = UserConfig.account.id;
  group: string = "group";
  filepath: string;
  filename: string = "file";
}

export class UploadOutData {
  code: string;
  msg: string;
  data: number;
}

export class DownloadInData {
  group: string = "group";
  username: string = UserConfig.account.id;
  id: string;
  filepath: string;
}

export class DownloadOutData {}
