import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";

/**
 * 帐户 注册
 */
@Injectable()
export class PersonRestful {

  constructor(private request: RestfulClient,
              private config: RestFulConfig) {
  }

  //TODO 此接口需要 GET PUT  请求方法

  //帐户信息更新	AIU	personsev.ts
  updateself(personData:PersonData): Promise<PersonData> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AIU");
      this.request.put(url,personData.reqData).then(data => {
        //处理返回结果
        personData.reqData = data;
        resolve(personData);

      }).catch(error => {
        //处理返回错误
        personData.errData = error;
        resolve(personData);

      })
    });
  }


  //帐户信息获取	AIG
  get(personData:PersonData): Promise<PersonData> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AIG");
      url.url = url+"?unionid="+personData.reqGet.unionid;
      this.request.get(url).then(data => {
        //处理返回结果
        personData.reqData = data;
        resolve(personData);

      }).catch(error => {
        //处理返回错误
        personData.errData = error;
        resolve(personData);

      })
    });
  }

  //帐户头像获取	AAG
  getavatar(personData:PersonData): Promise<PersonData> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AAG");
      url.url = url+"?phoneno="+personData.reqGetAvatar.phoneno;
      this.request.get(url).then(data => {
        //处理返回结果
        if(data.errcode == 0){
          personData.repData = data;
          resolve(personData);
        }else {
          personData.repData = data;
          resolve(personData);
        }

      }).catch(error => {
        //处理返回错误
        personData.errData = error;
        resolve(personData);

      })
    });
  }

  //修改密码 MP
  updatepass(personData:PersonData): Promise<PersonData> {
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("MP");
      this.request.put(url, personData.reqData).then(data => {
        //处理返回结果
        personData.reqData = data;
        resolve(personData);

      }).catch(error => {
        //处理返回错误
        personData.errData = error;
        resolve(personData);

      })
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
    phoneno:"",//手机号码
    verifykey:"",//短信验证码KEY
    verifycode:"",//短信验证码
    username:"",//姓名
    userpassword:"",//帐户密码
  };
  repData = {
    code: "",
    message: "",
    data: {},
  };

  errData = {}
}

export class PersonData {

  reqGet = {
    unionid: "fbdfab15-f911-4b50-8752-fdb306bb48d4",
  };

  reqGetAvatar = {
    phoneno: "",
  };

  reqData = {
    nickname: "",   //姓名
    password: "",   //密码
    sex: "0",       //性别 0 未知, 1 男性, 2 女性 Enum: [ 0, 1, 2 ]
    avatar: "",     //头像
    birthday: "", //出生日期  2019-03-11
    province: "", //省市/地区
    city: "",
    country: ""
  };



  repData = {
    code: "",
    message: "",
    data: {},
  };

  errData = {}
}
