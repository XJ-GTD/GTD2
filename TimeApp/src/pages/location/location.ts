import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Scroll } from 'ionic-angular';
import { ControlAnchor, MapOptions, NavigationControlOptions, NavigationControlType } from 'angular2-baidu-map';

import {ModalBoxComponent} from "../../components/modal-box/modal-box";
declare var BMap;
@IonicPage()
@Component({
  selector: 'page-location',
  template: `
  <modal-box title="地址" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
    <ion-searchbar  (ionBlur)="search(searchText)"  [(ngModel)]="searchText" (ionInput)="getItems($event)" placeholder="上海市东方明珠塔" animated="true"></ion-searchbar>
    <baidu-map #lmap id="map_container" [options] = "mapOptions" (loaded)="maploaded($event)">
      <control type="navigation" [options]="navOptions"></control>
      <marker *ngFor="let marker of markers" [point]="marker.point" [options]="marker.options"></marker>
    </baidu-map>
    <div id="r-result"></div>
    <ion-fab bottom center>
      <button ion-fab (click)="close()">
        <ion-icon name="checkmark"></ion-icon>
      </button>
    </ion-fab>
  </modal-box>
  `
})
export class LocationPage {

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  statusBarColor: string = "#fff";

  mapOptions: MapOptions;  //百度地图选项
  navOptions: NavigationControlOptions; //百度导航条选项
  markers: Array<any> = new Array<any>();
  local: any;
  dz: string = "";
  searchText: string;
  map : any;
  @ViewChild('lmap') map_container: ElementRef;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.dz = value;
      }
    }

    //百度地图设置
    this.mapOptions = {
      centerAndZoom: {
        lat: 31.244604,
        lng: 121.51606,
        zoom: 16
      },
      enableScrollWheelZoom: true,
      enableKeyboard: true
    };

    //百度地图导航条选项
    this.navOptions = {
      anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_RIGHT,
      type: NavigationControlType.BMAP_NAVIGATION_CONTROL_PAN
    };

    this.markers.push(
      {
        options: {
          icon: {
            imageUrl: '/assets/imgs/map/markericon.png',
            size: {
              height: 35,
              width: 25
            },
            imageSize: {
              height: 35,
              width: 25
            }
          }
        },
        point: {
          lat: 31.244604,
          lng: 121.51606
        }
      },
      {
        point: {
          lat: 31.246124,
          lng: 121.51232
        }
      }
    );
  }

  ionViewDidEnter() {
    /*this.map = new BMap.Map("map_container");
    let point = new BMap.Point( 121.51606,31.244604);
    this.map.centerAndZoom(point, 16);
    this.map.enableAutoResize();*/
  }

  save() {
    this.navCtrl.pop();
  }

  cancel() {
    this.navCtrl.pop();
  }

  getItems(ev) {
    console.log(ev);

  }

  maploaded(e: any) {
    this.map = e;
  }

  search2(txt){
    var myKeys = [txt];
    var local = new BMap.LocalSearch(this.map, {
      renderOptions:{map: this.map, panel:"r-result"},
      pageCapacity:5
    });
    local.searchInBounds(myKeys, this.map.getBounds());

  }
  search(txt) { // 对应baidu-map中loaded事件即地图加载时运行的方法 官方介绍e可以是map实例
    var myKeys = [txt];
  	//创建一个搜索类实例
  	this.local = new BMap.LocalSearch(this.map, {
    		renderOptions: {map: this.map, autoViewport: true, selectFirstResult: false,panel:"r-result"}
  	});

  	// 设置查询完成时的回调函数
  	this.local.setSearchCompleteCallback(async (searchResults) => {
      	let markeSize = this.markers.length; //每次搜索都会在地图上留下标记，这是去除以前留下的标记
      	for (let i = 0; i < markeSize; i++) {
       	 	this.map.removeOverlay(this.markers[i]);
      	}
      this.markers = [];
      if (!searchResults ||  searchResults.length < 1) {		// 检验搜索结果
        console.log("百度API没有搜索到该地址");
        return;
      }

      /*let searchResult = [];
      searchResult = searchResults.Qq;		// 查询结果存在searchResults.Lq中
      let size = searchResult.length;
      let temp;
      let myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), { // 设置地图标记的icon
        offset: new BMap.Size(10, 25),
        imageOffset: new BMap.Size(0, 0 - 10 * 25)
      });
      let contents = [];
      for (let i = 0; i < size; i++) {
        this.markers[i] = new BMap.Marker(new BMap.Point(searchResult[i].point.lng, searchResult[i].point.lat), {icon: myIcon});//在地图上添加标识
        //点击标识后显示的内容
        contents[i] = "你要查找的地方:【" + searchResult[i].title + "】地址：" + searchResult[i].address;// 经纬度在searchResult[i].point.lng, searchResult[i].point.lat中
        this.markers[i].title = contents[i];
        //添加点击事件监听
        this.markers[i].addEventListener("click", () => {
          	var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + contents[i] + "</p>");
          	this.markers[i].openInfoWindow(infoWindow);
        });// 在点击标识的时候显示标识点信息
        this.map.addOverlay(this.markers[i]);// 添加标识
        if (i == 0) { // 默认显示查询结果第一条
          var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + contents[0] + "</p>");
          this.markers[0].openInfoWindow(infoWindow);
        }
      }*/
    });
    this.local.search(myKeys);
  }
}
