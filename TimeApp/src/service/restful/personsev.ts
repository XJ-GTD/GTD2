import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {BsModel} from "./out/bs.model";

/**
 * 帐户 注册
 */
@Injectable()
export class PersonRestful {

  constructor(private request: RestfulClient,
              private config: RestFulConfig,) {
  }


  //token信息获取，头部登录码 get
  getToken(code:string): Promise<PersonTokenData> {

    let personData:PersonTokenData = new PersonTokenData();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AAT");
      url.url = url.url + '?appid=d3d3Lmd1b2JhYS5jb20&secret=c2VjcmV0QHd3dy5ndW9iYWEuY29t&code='+ code +'&grant_type=any';
      return this.request.get(url).then(data => {
        //处理返回结果
        personData = data;
        resolve(personData);

      }).catch(error => {
        //处理返回错误
        personData = error;
        resolve(personData);

      })
    });

  }

  //帐户信息获取	AIG get
  get(personData:PersonInData): Promise<BsModel<any>> {

    let bsModel = new BsModel();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AIG");
      url.url = url.url.replace("{phoneno}",personData.phoneno);
      this.request.get(url).then(data => {
        //处理返回结果
        bsModel.code = data.errcode;
        bsModel.message = data.errmsg;
        bsModel.data = data.data;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        reject(bsModel);

      })
    });

  }

  //帐户头像获取	AAG get
  getavatar(personData:PersonInData): Promise<BsModel<any>> {

    let bsModel = new BsModel();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AAG");
      url.url = url.url.replace("{phoneno}",personData.phoneno);
      this.request.get(url).then(data => {
        //处理返回结果
        bsModel.code = data.errcode;
        bsModel.message = data.errmsg;
        bsModel.data = data.data;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        reject(bsModel);

      })
    });

  }

  //获取个人信息	AIU	获取个人信息 get
  getself(personData:PersonInData): Promise<BsModel<any>> {

    let bsModel = new BsModel();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AIU");
      url.url = url.url.replace("{unionid}",personData.unionid);
      this.request.get(url).then(data => {
        //处理返回结果
        bsModel.code = data.errcode;
        bsModel.message = data.errmsg;
        bsModel.data = data.data;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        reject(bsModel);

      })
    });

  }

  //帐户信息更新	AIU	更新用户信息(包括密码) put
  updateself(personData:PersonInData): Promise<BsModel<any>>  {

    let bsModel = new BsModel();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AIU");
      this.request.put(url,personData).then(data => {
        //处理返回结果
        bsModel.code = data.errcode;
        bsModel.message = data.errmsg;
        bsModel.data = data.data;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        reject(bsModel);

      })
    });

  }

  //修改密码 MP put
  updatepass(personData:PersonInData): Promise<BsModel<any>> {

    let bsModel = new BsModel();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("MP");
      this.request.put(url, personData).then(data => {
        //处理返回结果
        bsModel.code = data.errcode;
        bsModel.message = data.errmsg;
        bsModel.data = data.data;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        reject(bsModel);

      })
    });

  }

  //注册帐户	RA post
  signup(signData: SignData): Promise<BsModel<any>> {

    let bsModel = new BsModel();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("RA");
      this.request.post(url, signData).then(data => {
        //处理返回结果
        bsModel.code = data.code;
        bsModel.message = data.message;
        bsModel.data = data.data;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        reject(bsModel);

      })
    });

  }

}

export class SignData{
  phoneno:string = "";//手机号码
  verifykey:string = "";//短信验证码KEY
  verifycode:string = "";//短信验证码
  username:string = "";//真实姓名
  userpassword:string = "";//帐户密码
}

export class PersonInData{
  phoneno: string = "";
  unionid: string = "";

  nickname: string = "";   //姓名
  password: string = "";   //密码
  sex: "0";      //性别 0 未知, 1 男性, 2 女性 Enum: [ 0, 1, 2 ]
  avatar: string = "";     //头像
  birthday: string = ""; //出生日期  2019-03-11
  province: string = ""; //省市/地区
  city: string = "";
  country: string = "";
}

export class PersonTokenData{
  _id:string = "";
  phoneno  :string = "";
  verifykey  :string = "";
  verifycode  :string = "";
  userpassword  :string = "";
  openid  :string = "";
  nickname: string = "";   //姓名
  password:string = "";
  unionid:string = "";
  sex:string = "";
  province:string = "";
  city: string = "";
  country: string = "";
  avatar: string = "";     //头像
  privilege:object;
  code:string = "";
  state:string = "";
  appid:string = "";
  access_token:string = "";
  refresh_token:string = "";
  access_time:string = "";
  expires_in:string = "";
  cmq:string = "";
}
