export class MessageConfig {

  public static initMessage(){
    let message:Message = new Message();
    message.message = "正常";
    message.sucess = true;
    this._Message.set("0",message);

    message = new Message();
    message.message = "用户无权限访问";
    message.sucess = false;
    this._Message.set("401",message);


  }

  public static getMessage(code:string):Message{
    let mesg:Message = this._Message.get(code);

    return mesg
  }


  private static _Message = new Map<string, Message>();

}

class Message{
  message:string;
  sucess:boolean;
  traMessage(para?:Array<string>){
    let i = 0;
    let msg = this.message;
    if (para){
      for (let s of para){
        msg = msg.replace("#"+ i,s);
        i ++;
      }
    }
    return msg;
  }
}
