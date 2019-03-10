import {Injectable} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";

@Injectable()
export class BlService {

  constructor() {

  }

  //获取黑名单列表
  get():Promise<Array<BlData>>{

    return new Promise<Array<BlData>>((resolve, reject)=>{
      //rest获取黑名单
    })
  }


}

export class BlData{

}
