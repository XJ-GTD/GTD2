import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Scroll } from 'ionic-angular';
import { ControlAnchor, MapOptions, NavigationControlOptions, NavigationControlType } from 'angular2-baidu-map';
import { Geolocation } from '@ionic-native/geolocation';
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
declare var BMap;
@IonicPage()
@Component({
  selector: 'page-location',
  template: `
  <modal-box title="地址" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
    <div class="c-searchbar">
      <ion-searchbar   [(ngModel)]="searchText.title"  placeholder="地点" animated="true"></ion-searchbar>
      <button class = "searchbutton" ion-button (click)="search(searchText.title)">搜索</button>
    </div>
    <baidu-map #lmap id="map_container" [options] = "mapOptions" (loaded)="maploaded($event)">
      <control type="navigation" [options]="navOptions"></control>
      <marker *ngFor="let marker of markers" [point]="marker.point" [options]="marker.options"></marker>
    </baidu-map>
  </modal-box>
  <div id="r-result" class = "div-mapresult" *ngIf="isShowMarkers">
    <!--<div class="shade"  (click)="closeDialog()" *ngIf="isShowCover"></div>-->
    <ion-list no-lines  class="mark-list">
      <button ion-item detail-none *ngFor="let marker of markers" (click)="resultListClick(marker)">
        <div class="color-dot"  item-start></div>
        <ion-label>{{marker.title}}</ion-label>
        <ion-label>{{marker.adr}}</ion-label>
      </button>
    </ion-list>
  </div>
  `
})
export class LocationPage {

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  isShowMarkers : boolean = false;
  isShowCover : boolean = false;

  statusBarColor: string = "#fff";

  mapOptions: MapOptions;  //百度地图选项
  navOptions: NavigationControlOptions; //百度导航条选项
  markers: Array<any> = new Array<any>();
  local: any;
  searchText:any =  {
    title:"",
    adr :"",
    adlat :0,
    adlng :0
  };
  map : any;

  myGeo: any;

  curIcon: any;

  @ViewChild('lmap') map_container: ElementRef;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              public geolocation: Geolocation) {


    //百度地图默认设置
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

    /*this.markers.push(
      {
        options: {
          icon: {
            imageUrl: '/assets/imgs/map/markericon.png',
            size: {
              height: 45,
              width: 35
            },
            imageSize: {
              height:45,
              width: 35
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
    );*/
  }

  ionViewDidEnter() {
    if (this.navParams && this.navParams.data && this.navParams.data.adrx) {
      let value = this.navParams.data;
      this.searchText.title = value.adr;
      this.searchText.adr = value.adr;
      this.searchText.adlat = value.adrx;
      this.searchText.adlng = value.adry;

      this.mapOptions = {
        centerAndZoom: {
          lat: this.searchText.adlat,
          lng: this.searchText.adlng,
          zoom: 16
        },
        enableScrollWheelZoom: true,
        enableKeyboard: true
      };
      this.markers = [];
      this.markers.push(

        {
          point: {
            lat: this.searchText.adlat,
            lng: this.searchText.adlng
          }
        }
      );


    }else{//gps获取位置

      this.myGeo = new BMap.Geocoder();

      var geolocationControl = new BMap.GeolocationControl();

      this.map.addControl(geolocationControl);

      this.getLocation();
    }

  }

  save() {
    let data: Object = {
      adr: this.searchText.title,
      adrx: this.searchText.adlat,
      adry: this.searchText.adlng
    };
    this.viewCtrl.dismiss(data);

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

  search(txt) { // 对应baidu-map中loaded事件即地图加载时运行的方法 官方介绍e可以是map实例
    var myKeys = [txt];
  	//创建一个搜索类实例
  	this.local = new BMap.LocalSearch(this.map);

  	// 设置查询完成时的回调函数
  	this.local.setSearchCompleteCallback(async (searchResults) => {
      	let markeSize = this.markers.length; //每次搜索都会在地图上留下标记，这是去除以前留下的标记
      	for (let i = 0; i < markeSize; i++) {
       	 	this.map.removeOverlay(this.markers[i]);
      	}
      this.markers = [];
      if (!searchResults ||  searchResults.length < 1 || !searchResults[0] ||  searchResults[0].Qq.length < 1) {		// 检验搜索结果
        console.log("百度API没有搜索到该地址");
        this.isShowMarkers = false;
        this.searchText.title = "";
        this.searchText.adr = "";
        this.searchText.adlat = 0;
        this.searchText.adlng = 0;
        return;
      }

      let searchResult = [];
      searchResult = searchResults[0].Qq;		// 查询结果存在searchResults.Lq中
      let size = searchResult.length;
      if (size > 0 ){
        this.isShowMarkers = true;
        this.isShowCover = true;
      }

      let myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(31, 49), { // 设置地图标记的icon
        offset: new BMap.Size(10, 25),
        imageOffset: new BMap.Size(0, 0 - 10 * 25)
      });
      myIcon.imageSize =  new BMap.Size(31, 49);

      for (let i = 0; i < size; i++) {
        this.markers[i] = new BMap.Marker(new BMap.Point(searchResult[i].point.lng, searchResult[i].point.lat), {icon: myIcon});//在地图上添加标识
        //点击标识后显示的内容
        this.markers[i].title = searchResult[i].title;
        this.markers[i].adr = searchResult[i].address;
        this.markers[i].adlat = searchResult[i].point.lat;
        this.markers[i].adlng = searchResult[i].point.lng;

        //添加点击事件监听
        this.markers[i].addEventListener("click", () => {
          var infoWindow = new BMap.InfoWindow("<div style='font-size:14px;'>" + this.markers[i].title + "</div><div style='font-size:14px;'>地址：" + this.markers[i].adr + "</div>");
          this.markers[i].openInfoWindow(infoWindow);

          //点击内容显示在searchbar上
          this.searchText.title = this.markers[i].title + " " + this.markers[i].adr;
          this.searchText.adr = this.markers[i].adr;
          this.searchText.adlat = this.markers[i].adlat;
          this.searchText.adlng = this.markers[i].adlng;
        });// 在点击标识的时候显示标识点信息

        this.map.addOverlay(this.markers[i]);// 添加标识

        /*if (i == 0) { // 默认显示查询结果第一条
          var infoWindow = new BMap.InfoWindow("<div style='font-size:14px;'>" + this.markers[0].title + "</div><div style='font-size:14px;'>地址：" + this.markers[0].adr + "</div>");
          this.markers[0].openInfoWindow(infoWindow);
        }*/
      }
    });
    this.local.search(myKeys);
  }
  closeDialog() {
    if (this.isShowMarkers) {
      this.isShowMarkers = false;
      this.isShowCover = false;

    }
  }

  resultListClick(marker){
    var infoWindow = new BMap.InfoWindow("<div style='font-size:14px;'>" + marker.title + "</div><div style='font-size:14px;'>地址：" + marker.adr + "</div>");
    marker.openInfoWindow(infoWindow);
    this.searchText.title = marker.title + " " + marker.adr;
    this.searchText.adr = marker.adr;
    this.searchText.adlat = marker.adlat;
    this.searchText.adlng = marker.adlng;
    this.isShowMarkers = false;
  }

  getLocation() {
    this.curIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(32, 32));
    this.geolocation.getCurrentPosition().then((resp) => {

      if (resp && resp.coords) {

        let locationPoint = new BMap.Point(resp.coords.longitude, resp.coords.latitude);

        let convertor = new BMap.Convertor();

        let pointArr = [];

        pointArr.push(locationPoint);

        convertor.translate(pointArr, 1, 5, (data) => {

          if (data.status === 0) {

            let marker = new BMap.Marker(data.points[0], { icon: this.curIcon });

            this.map.panTo(data.points[0]);

            marker.setPosition(data.points[0]);

            this.map.addOverlay(marker);

          }

        })

        this.map.centerAndZoom(locationPoint, 13);

        console.log('GPS定位：您的位置是 ' + resp.coords.longitude + ',' + resp.coords.latitude);

      }

    }).catch(e => {
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
      console.log('Error happened when get current position.');

    });

  }
}
