import {Injectable} from "@angular/core";
import {UserConfig} from "../../service/config/user.config";

@Injectable()
export class MemberService {
  constructor() {
  }

  //根据条件查询参与人
  //根据条件查询参与人
  getfriend(key: string) {
    if (key)
      return UserConfig.friends.filter((value) => {
        return value.ran.indexOf(key) > -1
          || value.rc.indexOf(key) > -1
          || value.rn.indexOf(key) > -1
          || value.rc.indexOf(key) > -1
          || value.rnpy.indexOf(key) > -1
          || value.ranpy.indexOf(key) > -1
      });
    else
      return UserConfig.friends;
  }
}

