import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";

/**
 * 帐户 注册
 */
@Injectable()
export class PersonRestful {

  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }

  //帐户信息更新	AIU	personsev.ts
  updateself(): Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }


  //帐户信息获取	AIG
  get(): Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

  //帐户头像获取	AAG
  getavatar(): Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }

  //修改密码
  updatepass(): Promise<any> {
    return new Promise((resolve, reject) => {
    });
  }


  //注册帐户	RA
  signup(signupData: SignupData): Promise<SignupData> {
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("RA");
      this.request.post(url, signupData.repData).then(data => {
        //处理返回结果
        signupData.reqData = data;
        resolve(signupData);

      }).catch(error => {
        //处理返回错误
        signupData.errData = error;
        resolve(signupData);

      })
    });
  }
}

export class SignupData {
  reqData = {
    rai: "", //关联日程ID

    fc: "", //来自于谁(日程发送人用户ID)

    ai: "", //日程ID

    at: "", //主题

    adt: "",  //时间(YYYY/MM/DD HH:mm)

    ap: "", //

    ar: "", //

    aa: "", //

    am: "", //
  }
  repData = {
    code: "",
    message: "",
    data: {},
  }

  errData = {}
}


