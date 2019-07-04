import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import { ControlAnchor, MapOptions, NavigationControlOptions, NavigationControlType } from 'angular2-baidu-map';
declare var BMap: any;

@IonicPage()
@Component({
  selector: 'page-dz',
  template: `
  <ion-content>
    <ion-searchbar (ionInput)="getItems($event)" placeholder="上海市东方明珠塔" animated="true"></ion-searchbar>
    <baidu-map [options]="options">
      <control type="navigation" [options]="navOptions"></control>
    </baidu-map>
    <ion-fab bottom center>
      <button ion-fab (click)="close()">
        <ion-icon name="checkmark"></ion-icon>
      </button>
    </ion-fab>
  </ion-content>
  `
})
export class DzPage {
  options: MapOptions;  //百度地图选项
  navOptions: NavigationControlOptions; //百度导航条选项
  markers: Array<any> = new Array<any>();
  local: any;

  constructor(public navCtrl: NavController) {

    //百度地图设置
    this.options = {
      centerAndZoom: {
        lat: 39.920116,
        lng: 116.403703,
        zoom: 12
      },
      enableScrollWheelZoom: true,
      enableKeyboard: true
    };

    //百度地图导航条选项
    this.navOptions = {
  		anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_RIGHT,
  		type: NavigationControlType.BMAP_NAVIGATION_CONTROL_PAN
	  };
  }

  close() {
    this.navCtrl.pop();
  }

  getItems(value) {
    console.log(value);
    this.search(value);
  }

  search(e: any) { // 对应baidu-map中loaded事件即地图加载时运行的方法 官方介绍e可以是map实例
  	//创建一个搜索类实例
  	this.local = new BMap.LocalSearch(e, {
    		renderOptions: {map: e, autoViewport: true, selectFirstResult: false},
    		pageCapacity: 10
  	});
  	// 设置查询完成时的回调函数
  	this.local.setSearchCompleteCallback(async (searchResults) => {
      	let markeSize = this.markers.length; //每次搜索都会在地图上留下标记，这是去除以前留下的标记
      	for (let i = 0; i < markeSize; i++) {
       	 	e.removeOverlay(this.markers[i]);
      	}
      this.markers = [];
      if (typeof(searchResults) == "undefined") {		// 检验搜索结果
        alert("百度API没有搜索到该地址");
        return;
      }
      let searchResult = [];
      searchResult = searchResults.Lq;		// 查询结果存在searchResults.Lq中
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
        e.addOverlay(this.markers[i]);// 添加标识
        if (i == 0) { // 默认显示查询结果第一条
          var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + contents[0] + "</p>");
          this.markers[0].openInfoWindow(infoWindow);
        }
      }
    });
  }
}
