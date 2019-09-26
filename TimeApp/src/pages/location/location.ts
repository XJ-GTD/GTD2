import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, ViewController,} from 'ionic-angular';
import {ControlAnchor, MapOptions, Marker, NavigationControlOptions, NavigationControlType} from 'angular2-baidu-map';
import {AutoCompleteComponent} from "ionic2-auto-complete";
import {LocationSearchService} from "../../service/restful/LocationSearchService";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";


@IonicPage()
@Component({
  selector: 'page-location',
  template: `
    <modal-box title="地址" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">

      <!--<ion-searchbar   [(ngModel)]="searchText.title"  placeholder="地点" animated="true" (autocomplete)="on" (ionInput)="search()"></ion-searchbar>-->


      <ion-auto-complete #searchbar [dataProvider]="locationSearchService"
                         [options]="{ placeholder : '哪里活动？',autocomplete:'on' }"
                         (itemSelected) = "itemSelected($event)"
                         (ionAutoInput) = "ionAutoInput($event)" ></ion-auto-complete>
      <div class="mapwrap">
        <baidu-map #lmap id="map_container" [options]="mapOptions">
          <marker *ngFor="let marker of markers" [point]="marker.point" [options]="marker.options"></marker>
        </baidu-map>
      </div>
    </modal-box>
  `
})
export class LocationPage {

  @ViewChild(AutoCompleteComponent)
  searchbar: AutoCompleteComponent;

  @ViewChild(ModalBoxComponent)
  modalBoxComponent:ModalBoxComponent

  //是否选择了查询结果
  isItemSelected : boolean = false;


  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };


//百度地图选项
  mapOptions: MapOptions = {
    centerAndZoom: {
      lat: 116.402461,
      lng: 39.917787,
      zoom: 5
    },
    enableScrollWheelZoom: true,
    enableKeyboard: true
  };

  markers: Array<any> = new Array<any>();
  searchText: any = {
    adr: "",
    adlat: 116.402461,
    adlng: 39.917787
  };

  constructor(public navCtrl: NavController,
              private viewCtrl: ViewController,
              public navParams: NavParams,
              private locationSearchService: LocationSearchService) {
  }

  autoBlur() {
    if (this.searchbar.keyword)
      this.locationSearchService.getlocationData(this.searchbar.keyword).then(data => {

        if (data) {
          this.searchText.adlat = data.location.lat;
          this.searchText.adlng = data.location.lng;

          this.searchText.adr = this.searchbar.keyword;

          this.mapOptions = {
            centerAndZoom: {
              lat: this.searchText.adlat,
              lng: this.searchText.adlng,
              zoom: 16
            },
          };


          this.markers.length = 0;

          this.markers.push(
            {
              point: {
                lat: this.searchText.adlat,
                lng: this.searchText.adlng,
              }
            }
          );
        }

      })

  }


  ionViewDidEnter() {

    this.modalBoxComponent.setBoxContent();

    if (this.navParams && this.navParams.data ) {
      this.searchText.adr = this.navParams.data.adr==null?"":this.navParams.data.adr;
      this.searchbar.keyword = this.searchText.adr;
    }

    if (this.navParams && this.navParams.data && this.navParams.data.adrx) {
      let value = this.navParams.data;

      this.searchText.adlat = value.adrx;
      this.searchText.adlng = value.adry;


      this.mapOptions = {
        centerAndZoom: {
          lat: this.searchText.adlat,
          lng: this.searchText.adlng,
          zoom: 16
        },
      };

      this.markers.push(
        {
          point: {
            lat: this.searchText.adlat,
            lng: this.searchText.adlng
          }
        }
      );


    } else {

      if (navigator.geolocation)
      //gps获取位置
        this.locationSearchService.queryinitlocation().then(data => {
          this.searchText.adlat = data.content.point.y;
          this.searchText.adlng = data.content.point.x;

          this.mapOptions = {
            centerAndZoom: {
              lat: this.searchText.adlat,
              lng: this.searchText.adlng,
              zoom: 10
            },
          };


          this.markers.push(
            {
              point: {
                lat: this.searchText.adlat,
                lng: this.searchText.adlng
              }
            }
          );

        }).catch(err => {
          console.log(err);
        })
    }


  }

  save() {

    if (this.searchbar.suggestions && this.searchbar.suggestions.length > 0){

      if (!this.isItemSelected){
        this.searchText.adr = this.searchbar.keyword;
        this.searchText.adlat = this.searchbar.suggestions[0].location.lat;
        this.searchText.adlng = this.searchbar.suggestions[0].location.lng;
      }
    }else{
      this.searchText.adr = this.searchbar.keyword;
      this.searchText.adlat = 0;
      this.searchText.adlng = 0;
    }

    let data: Object = {
      adr: this.searchText.adr,
      adrx: this.searchText.adlat,
      adry: this.searchText.adlng
    };
    this.viewCtrl.dismiss(data);

  }

  cancel() {
    this.navCtrl.pop();
  }

  itemSelected(e){
    this.isItemSelected = true;
    this.searchText.adr = e.name;
    this.searchText.adlat = e.location.lat;
    this.searchText.adlng = e.location.lng;

    this.mapOptions = {
      centerAndZoom: {
        lat: this.searchText.adlat,
        lng: this.searchText.adlng,
        zoom: 16
      },
    };


    this.markers.length = 0;

    this.markers.push(
      {
        point: {
          lat: this.searchText.adlat,
          lng: this.searchText.adlng,
        }
      }
    );
  }

  ionAutoInput(e){
    //重新查询则初始化
    this.isItemSelected = false;
  }
}
