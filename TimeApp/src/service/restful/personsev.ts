import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";

/**
 * 帐户 注册
 */
@Injectable()
export class PersonRestful {

  constructor(private request: RestfulClient,
              private config: RestFulConfig,) {
  }


  //token信息获取，头部登录码 get
  getToken(code:string): Promise<PersonOutData> {

    let personData:PersonOutData = new PersonOutData();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AAT");
      let urlEntity: UrlEntity = new UrlEntity();
      urlEntity.url = url.url;
      urlEntity.key = url.key;
      urlEntity.desc = url.desc;
      urlEntity.url = urlEntity.url + '?appid=d3d3Lmd1b2JhYS5jb20&secret=c2VjcmV0QHd3dy5ndW9iYWEuY29t&code='+ code +'&grant_type=any';
      return this.request.get(urlEntity).then(data => {
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
  get(phoneno:string): Promise<any> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AIG");
      let urlEntity: UrlEntity = new UrlEntity();
      urlEntity.url = url.url;
      urlEntity.key = url.key;
      urlEntity.desc = url.desc;
      urlEntity.url = urlEntity.url.replace("{phoneno}",phoneno);
      this.request.get(urlEntity).then(data => {
        //处理返回结果
        // bsModel.code = data.errcode;
        // bsModel.message = data.errmsg;
        // bsModel.data = data.data;
        resolve(data.data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }

  //批量帐户信息获取	AIGS post
  getMultis(phonenos:Array<string>): Promise<any> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AIGS");
      let urlEntity: UrlEntity = new UrlEntity();
      urlEntity.url = url.url;
      urlEntity.key = url.key;
      urlEntity.desc = url.desc;
      this.request.post(urlEntity, {phonenos: phonenos}).then(data => {
        //处理返回结果
        resolve(data.data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }

  //帐户头像获取	AAG get
  getavatar(phoneno:string): Promise<any> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AAG");
      let urlEntity: UrlEntity = new UrlEntity();
      urlEntity.url = url.url;
      urlEntity.key = url.key;
      urlEntity.desc = url.desc;
      urlEntity.url = urlEntity.url.replace("{phoneno}",phoneno);
      this.request.get(urlEntity).then(data => {
        //处理返回结果
        resolve(data.data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }

  //获取个人信息	AIU	获取个人信息 get
  getself(unionid:string): Promise<PersonOutData> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AIU");
      let urlEntity: UrlEntity = new UrlEntity();
      urlEntity.url = url.url;
      urlEntity.key = url.key;
      urlEntity.desc = url.desc;
      urlEntity.url = urlEntity.url.replace("{unionid}",unionid);
      this.request.get(urlEntity).then(data => {
        //处理返回结果
        resolve(data.data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }

  //帐户信息更新	AIU	更新用户信息(包括密码) put
  updateself(personData:any,unionid:string): Promise<any>  {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AIU");
      let urlEntity: UrlEntity = new UrlEntity();
      urlEntity.url = url.url;
      urlEntity.key = url.key;
      urlEntity.desc = url.desc;
      urlEntity.url = urlEntity.url.replace("{unionid}",unionid);
      this.request.put(urlEntity,personData).then(data => {
        //处理返回结果
        resolve(data.data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }

  //修改密码 MP put
  updatepass(personData:any,unionid:string): Promise<any> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("MP");
      let urlEntity: UrlEntity = new UrlEntity();
      urlEntity.url = url.url;
      urlEntity.key = url.key;
      urlEntity.desc = url.desc;
      urlEntity.url = urlEntity.url.replace("{unionid}",unionid);
      this.request.put(urlEntity, personData).then(data => {
        //处理返回结果
        resolve(data.data);

      }).catch(error => {
        //处理返回错误
        reject();

      })
    });

  }

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

export class PersonOutData{
  _id:string = "";
  phoneno  :string = "";
  verifykey  :string = "";
  verifycode  :string = "";
  userpassword  :string = "";
  openid  :string = "";
  password:string = "";
  unionid:string = "";
  province:string = "";
  city: string = "";
  country: string = "";
  nickname: string = "";   //姓名
  name:string = "";   // 真实姓名
  avatarbase64: string = "";     //头像64
  sex:string = "";    //性别
  birthday: string = "";  //出生日期
  ic: string = "";  //身份证
  contact: string = "";//  联系方式
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
