import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormControl} from "@angular/forms";
import {ScheduleModel} from "../../model/schedule.model";
import {ParamsService} from "../../service/params.service";

/**
 * Generated class for the CharPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-char',
  templateUrl: 'char.html',
})
export class CharPage {

  toUser = {
    _id: '534b8e5aaa5e7afc1b23e69b',
    pic: 'assets/img/avatar/ian-avatar.png',
    username: 'Venkman',
  };

  user = {
    _id: '534b8fb2aa5e7afc1b23e69c',
    pic: 'assets/img/avatar/marty-avatar.png',
    username: 'Marty',
  };

  doneLoading = false;

  messages = [ //要展示的数据系统和用户
    // {
    //   _id: 1,
    //   date: new Date(),
    //   userId: this.user._id,
    //   username: this.user.username,
    //   pic: this.user.pic,
    //   text: 'OH CRAP!!'
    // },
    // {
    //   _id: 2,
    //   date: new Date(),
    //   userId: this.toUser._id,
    //   username: this.toUser.username,
    //   pic: this.toUser.pic,
    //   text: 'what??'
    // },
    // {
    //   _id: 3,
    //   date: new Date(),
    //   userId: this.toUser._id,
    //   username: this.toUser.username,
    //   pic: this.toUser.pic,
    //   text: 'Pretty long message with lots of content'
    // },
    // {
    //   _id: 4,
    //   date: new Date(),
    //   userId: this.user._id,
    //   username: this.user.username,
    //   pic: this.user.pic,
    //   text: 'Pretty long message with even way more of lots and lots of content'
    // },
    // {
    //   _id: 5,
    //   date: new Date(),
    //   userId: this.user._id,
    //   username: this.user.username,
    //   pic: this.user.pic,
    //   text: '哪尼??'
    // },
    // {
    //   _id: 6,
    //   date: new Date(),
    //   userId: this.toUser._id,
    //   username: this.toUser.username,
    //   pic: this.toUser.pic,
    //   text: 'yes!'
    // }
  ];

  @ViewChild(Content) content: Content;

  public messageForm: any;
  chatBox: any;

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              public formBuilder: FormBuilder,
              private paramsService: ParamsService) {
    this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
    this.chatBox = '';
    this.init();
  }


  scheduleList: Array<ScheduleModel>;

  init() {
    this.scheduleList = [];
    this.scheduleList = this.paramsService.scheduleList;
    console.log('chat获取页面传递数据',this.scheduleList)
  }

  ionViewDidLoad() {
    let modelData: string = '用户名：' + this.navParams.get('chatId');
    console.log(modelData);
  }

  // 发送消息
  send(message) {
    if (message && message !== '') {
      // this.messageService.sendMessage(chatId, message);

      const messageData =
        {
          toId: this.toUser._id,
          _id: 6,
          date: new Date(),
          userId: this.user._id,
          username: this.toUser.username,
          pic: this.toUser.pic,
          text: message
        };

      this.messages.push(messageData);
      this.scrollToBottom();

      setTimeout(() => {
        const replyData =  //返回得数据
          {
            toId: this.toUser._id,
            _id: 6,
            date: new Date(),
            userId: this.toUser._id,
            username: this.toUser.username,
            pic: this.toUser.pic,
            text: 'Just a quick reply'
          };
        this.messages.push(replyData);
        this.scrollToBottom();
      }, 1000);
    }
    this.chatBox = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }

  viewProfile(message: string){
    console.log(message);
  }


}
