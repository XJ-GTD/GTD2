import {Injectable} from "@angular/core";
import * as moment from "moment";

@Injectable()
export class TaskService {
  constructor() {
    moment.locale('zh-cn');
  }
}
