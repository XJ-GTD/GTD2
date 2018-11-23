import { Injectable } from '@angular/core';
import {BaseSqliteService} from "./base-sqlite.service";

/**
 * 系统设置
 */
@Injectable()
export class SystemSqliteService {

  constructor(private baseSqlite: BaseSqliteService) {

  }
}
