import {Injectable} from "@angular/core";
import {AndroidPermissions} from '@ionic-native/android-permissions';

/**
 * 请求权限service
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class PermissionsService {


  //APP使用权限 4 android
  public list_all: Array<any> = [
    this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
    this.androidPermissions.PERMISSION.RECORD_AUDIO,
    this.androidPermissions.PERMISSION.ACCESS_NETWORK_STATE,
    this.androidPermissions.PERMISSION.READ_PHONE_STATE,
    this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
    this.androidPermissions.PERMISSION.WRITE_SETTINGS,
    this.androidPermissions.PERMISSION.ACCESS_WIFI_STATE,
    this.androidPermissions.PERMISSION.CHANGE_WIFI_STATE,
    this.androidPermissions.PERMISSION.READ_CALENDAR,
    this.androidPermissions.PERMISSION.WRITE_CALENDAR,
    this.androidPermissions.PERMISSION.RECEIVE_BOOT_COMPLETED,
    this.androidPermissions.PERMISSION.WAKE_LOCK,
    this.androidPermissions.PERMISSION.VIBRATE,
    this.androidPermissions.PERMISSION.BLUETOOTH,
    this.androidPermissions.PERMISSION.READ_CONTACTS,
    this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
  ];

  constructor(
    private androidPermissions: AndroidPermissions
  ) {

  }

  public checkAllPermissions(): Promise<any> {
    let i = 0;
    return this.checkPermission(this.list_all[i++])
      .then(res => {
        return this.checkPermission(this.list_all[i++]);
      })
      .then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).then(res => {
        return this.checkPermission(this.list_all[i++]);
      }).catch(err=>{
        return;
      })
  }

  public checkPermission(permission: string): Promise<any> {
    return this.androidPermissions.checkPermission(permission).then(
      (result) => {
        if (!result.hasPermission) {
          return this.androidPermissions.requestPermission(permission);
        }
      }
    )
  }

}
