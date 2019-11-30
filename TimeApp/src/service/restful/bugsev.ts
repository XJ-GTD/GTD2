import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {UserConfig} from "../config/user.config";
import {SyncDataSecurity, SyncDataStatus, InviteState, CompleteState, UpdState} from "../../data.enum";
import {EmitService} from "../util-service/emit.service";
import {
  assertEmpty
} from "../../util/util";

/**
 * 数据同步操作
 */
@Injectable()
export class FindBugRestful {
  constructor(private request: RestfulClient,
    private config: RestFulConfig,
    private emitService:EmitService) {
  }

  /**
   * http://pluto.guobaa.com/bug/{bugtype}/{account}/{device}/{datatype}/{program}/upload
   **/
  async upload(bugtype: string, account: string, device: string, datatype: string, payload: any): Promise<string> {

    if (["Unsupported"].indexOf(UserConfig.account.phone) < 0) {
      return null;
    }

    let url: UrlEntity = this.config.getRestFulUrl("BUG",
      {name: "bugtype", value: bugtype},
      {name: "account", value: account || UserConfig.account.phone},
      {name: "device", value: device || UserConfig.getDeviceId()},
      {name: "datatype", value: datatype || "undefined"},
      {name: "program", value: "mwxing"}
    );

    try {
      let data = await this.request.post(url, {payload: payload});

      if (data) {
        return data.datapath;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }

  }

}
