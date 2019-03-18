import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-plan',
  templateUrl: 'plan.html',
})
export class PlanPage {

  today: string = '2019-03-18';
  plan: any = {
    "pn": {
        "pt": "齿轮计划"
    },
    "pa": [
        {
            "ai": "string",
            "at": "产品第一版功能需求讨论定稿",
            "adt": "2019-03-01",
            "ap": "string",
            "ar": "string",
            "aa": "string",
            "am": "明确第一版功能开发方向, 研发团队自用, 并分享好友使用; 上架苹果和安卓应用市场, 吸引自然流量; 寻求天使投资.",
            "ac": [
                {}
            ]
        },
        {
            "ai": "string",
            "at": "产品手机端app和服务器端接口确定",
            "adt": "2019-03-02",
            "ap": "string",
            "ar": "string",
            "aa": "string",
            "am": "确定手机端app和服务器端接口数量和每个接口的接口参数",
            "ac": [
                {}
            ]
        },
        {
            "ai": "string",
            "at": "共享日程和语音交互协议确定",
            "adt": "2019-03-02",
            "ap": "string",
            "ar": "string",
            "aa": "string",
            "am": "确定手机端app和服务器端通过Websocket对日程共享和语音交互内容的协议",
            "ac": [
                {}
            ]
        },
        {
            "ai": "string",
            "at": "产品服务器端服务开发完成",
            "adt": "2019-03-08",
            "ap": "string",
            "ar": "string",
            "aa": "string",
            "am": "",
            "ac": [
                {}
            ]
        },
        {
            "ai": "string",
            "at": "产品手机端开发框架搭建完成",
            "adt": "2019-03-08",
            "ap": "string",
            "ar": "string",
            "aa": "string",
            "am": "",
            "ac": [
                {}
            ]
        },
        {
            "ai": "string",
            "at": "体验版开发完成",
            "adt": "2019-03-15",
            "ap": "string",
            "ar": "string",
            "aa": "string",
            "am": "完成基本功能的体验版可以通过fir.im下载安装,并进行测试",
            "ac": [
                {}
            ]
        },
        {
            "ai": "string",
            "at": "公测版开发完成",
            "adt": "2019-03-31",
            "ap": "string",
            "ar": "string",
            "aa": "string",
            "am": "完成所需功能可以通过fir.im下载安装,并向团队以外的公测用户提供测试,收集反馈",
            "ac": [
                {}
            ]
        },
        {
            "ai": "string",
            "at": "正式在应用商店上线",
            "adt": "2019-04-08",
            "ap": "string",
            "ar": "string",
            "aa": "string",
            "am": "完成所有应用商店上线所需审核材料的提交申请,一旦审核通过,最终用户即可在应用商店中搜索到齿轮",
            "ac": [
                {}
            ]
        }
    ],
    "_shareaccount": "accountid",
    "_shareproduct": {
        "productid": "pi",
        "productversion": "pv"
    },
    "_sharetime": 1551794659307,
    "_expiretime": 31536000000
};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanPage');
  }

}
