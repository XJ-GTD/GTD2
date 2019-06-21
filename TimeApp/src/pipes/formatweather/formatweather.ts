import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatWeatherPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatweather',
})
export class FormatWeatherPipe implements PipeTransform {

  //天气概述字体映射表
  private WEATHER_FONT_MAP: Map<string, string> = new Map<string, string>();
  private WEATHER_FONT_MAP_DAY: Map<string, string> = new Map<string, string>();
  private WEATHER_FONT_MAP_NIGHT: Map<string, string> = new Map<string, string>();

  constructor() {
    //白天
    this.WEATHER_FONT_MAP_DAY.set("晴", "day-sunny");            //晴
    this.WEATHER_FONT_MAP_DAY.set("阴", "day-cloudy");             //阴天
    this.WEATHER_FONT_MAP_DAY.set("", "day-cloudy-gusts");       //多云阵风
    this.WEATHER_FONT_MAP_DAY.set("", "day-cloudy-windy");       //阴天刮风
    this.WEATHER_FONT_MAP_DAY.set("雾", "day-fog");                //雾
    this.WEATHER_FONT_MAP_DAY.set("冰雹", "day-hail");               //冰雹
    this.WEATHER_FONT_MAP_DAY.set("霾", "day-haze");               //霾
    this.WEATHER_FONT_MAP_DAY.set("", "day-lightning");          //雷击
    this.WEATHER_FONT_MAP_DAY.set("", "day-rain");               //雨
    this.WEATHER_FONT_MAP_DAY.set("", "day-rain-mix");           //雨水混合
    this.WEATHER_FONT_MAP_DAY.set("", "day-rain-wind");          //风雨
    this.WEATHER_FONT_MAP_DAY.set("", "day-showers");            //阵雨
    this.WEATHER_FONT_MAP_DAY.set("", "day-sleet");              //雨夹雪
    this.WEATHER_FONT_MAP_DAY.set("", "day-sleet-storm");        //雨雪风暴
    this.WEATHER_FONT_MAP_DAY.set("", "day-snow");               //雪
    this.WEATHER_FONT_MAP_DAY.set("", "day-snow-thunderstorm");  //雪雷暴
    this.WEATHER_FONT_MAP_DAY.set("", "day-snow-wind");          //雪风
    this.WEATHER_FONT_MAP_DAY.set("", "day-sprinkle");           //洒
    this.WEATHER_FONT_MAP_DAY.set("", "day-storm-showers");      //风暴雨
    this.WEATHER_FONT_MAP_DAY.set("", "day-sunny-overcast");     //晴天阴天
    this.WEATHER_FONT_MAP_DAY.set("", "day-thunderstorm");       //雷暴
    this.WEATHER_FONT_MAP_DAY.set("", "day-windy");              //刮风
    this.WEATHER_FONT_MAP_DAY.set("", "solar-eclipse");          //日食
    this.WEATHER_FONT_MAP_DAY.set("", "hot");                    //高温
    this.WEATHER_FONT_MAP_DAY.set("", "day-cloudy-high");        //阴天高
    this.WEATHER_FONT_MAP_DAY.set("", "day-light-wind");         //晴微风

    //夜晚
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-clear");             //有月亮
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-cloudy");        //阴天
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-cloudy-gusts");  //多云阵风
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-cloudy-windy");  //阴天刮风
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-hail");          //冰雹
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-lightning");     //雷击
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-rain");          //雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-rain-mix");      //雨水混合
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-rain-wind");     //风雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-showers");       //阵雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-sleet");         //雨夹雪
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-sleet-storm");   //雨雪风暴
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-snow");          //雪
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-snow-thunderstorm");//雪雷暴
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-snow-wind");     //雪风
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-sprinkle");      //洒
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-storm-showers"); //风暴雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-thunderstorm");  //雷暴
    this.WEATHER_FONT_MAP_NIGHT.set("阴", "night-cloudy");            //阴天
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-cloudy-gusts");      //多云，阵风
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-cloudy-windy");      //阴天，刮风
    this.WEATHER_FONT_MAP_NIGHT.set("雾", "night-fog");               //雾
    this.WEATHER_FONT_MAP_NIGHT.set("冰雹", "night-hail");              //冰雹
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-lightning");         //闪电
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-partly-cloudy");     //部分浑浊
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-rain");              //雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-rain-mix");          //雨水混合
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-rain-wind");         //风雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-showers");           //阵雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-sleet");             //雨夹雪
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-sleet-storm");       //雨雪风暴
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-snow");              //雪
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-snow-thunderstorm"); //雪雷暴
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-snow-wind");         //雪风
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-sprinkle");          //洒
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-storm-showers");     //风暴雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-thunderstorm");      //雷阵雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "lunar-eclipse");           //月食
    this.WEATHER_FONT_MAP_NIGHT.set("", "stars");                   //有星星
    this.WEATHER_FONT_MAP_NIGHT.set("", "storm-showers");           //风暴雨
    this.WEATHER_FONT_MAP_NIGHT.set("", "thunderstorm");            //雷暴
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-cloudy-high");   //阴天高
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-cloudy-high");       //阴天高
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-partly-cloudy"); //部分浑浊

    //正常
    this.WEATHER_FONT_MAP.set("多云", "cloud");           //云
    this.WEATHER_FONT_MAP.set("阴", "cloudy");          //阴天
    this.WEATHER_FONT_MAP.set("", "cloudy-gusts");    //阴天阵风
    this.WEATHER_FONT_MAP.set("", "cloudy-windy");    //阴天刮风
    this.WEATHER_FONT_MAP.set("雾", "fog");            //雾
    this.WEATHER_FONT_MAP.set("雷阵雨伴有冰雹", "hail");            //冰雹
    this.WEATHER_FONT_MAP.set("小到中雨", "rain");            //雨
    this.WEATHER_FONT_MAP.set("中到大雨", "rain");            //雨
    this.WEATHER_FONT_MAP.set("小到中雨", "rain");            //雨
    this.WEATHER_FONT_MAP.set("小雨", "rain");            //雨
    this.WEATHER_FONT_MAP.set("中雨", "rain");            //雨
    this.WEATHER_FONT_MAP.set("大雨", "rain");            //雨
    this.WEATHER_FONT_MAP.set("", "rain-mix");        //雨水混合
    this.WEATHER_FONT_MAP.set("", "rain-wind");       //风雨
    this.WEATHER_FONT_MAP.set("阵雨", "showers");         //阵雨
    this.WEATHER_FONT_MAP.set("冻雨", "sleet");           //雨夹雪
    this.WEATHER_FONT_MAP.set("雨夹雪", "sleet");           //雨夹雪
    this.WEATHER_FONT_MAP.set("", "snow");            //雪
    this.WEATHER_FONT_MAP.set("", "sprinkle");        //洒
    this.WEATHER_FONT_MAP.set("大到暴雨", "storm-showers");   //风暴雨
    this.WEATHER_FONT_MAP.set("暴雨到大暴雨", "storm-showers");   //风暴雨
    this.WEATHER_FONT_MAP.set("大暴雨到特大暴雨", "storm-showers");   //风暴雨
    this.WEATHER_FONT_MAP.set("暴雨", "storm-showers");   //风暴雨
    this.WEATHER_FONT_MAP.set("大暴雨", "storm-showers");   //风暴雨
    this.WEATHER_FONT_MAP.set("特大暴雨", "storm-showers");   //风暴雨
    this.WEATHER_FONT_MAP.set("雷阵雨", "thunderstorm");    //雷暴
    this.WEATHER_FONT_MAP.set("", "snow-wind");       //雪风
    this.WEATHER_FONT_MAP.set("阵雪", "snow");
    this.WEATHER_FONT_MAP.set("小雪", "snow");
    this.WEATHER_FONT_MAP.set("中雪", "snow");
    this.WEATHER_FONT_MAP.set("大雪", "snow");
    this.WEATHER_FONT_MAP.set("暴雪", "snow");
    this.WEATHER_FONT_MAP.set("小到中雪", "snow");
    this.WEATHER_FONT_MAP.set("中到大雪", "snow");
    this.WEATHER_FONT_MAP.set("大到暴雪", "snow");
    this.WEATHER_FONT_MAP.set("霾", "smog");            //烟雾
    this.WEATHER_FONT_MAP.set("", "smoke");           //烟雾
    this.WEATHER_FONT_MAP.set("", "lightning");       //闪电
    this.WEATHER_FONT_MAP.set("", "raindrops");       //雨滴
    this.WEATHER_FONT_MAP.set("", "raindrop");        //雨滴
    this.WEATHER_FONT_MAP.set("浮尘", "dust");            //尘
    this.WEATHER_FONT_MAP.set("", "snowflake-cold");  //雪花冷
    this.WEATHER_FONT_MAP.set("", "windy");           //多风
    this.WEATHER_FONT_MAP.set("", "strong-wind");     //强风
    this.WEATHER_FONT_MAP.set("沙尘暴", "sandstorm");       //沙尘暴
    this.WEATHER_FONT_MAP.set("强沙尘暴", "sandstorm");       //沙尘暴
    this.WEATHER_FONT_MAP.set("扬沙", "sandstorm");       //沙尘暴
    this.WEATHER_FONT_MAP.set("", "earthquake");      //地震
    this.WEATHER_FONT_MAP.set("", "fire");            //火灾
    this.WEATHER_FONT_MAP.set("", "flood");           //洪水
    this.WEATHER_FONT_MAP.set("", "meteor");          //流星
    this.WEATHER_FONT_MAP.set("", "tsunami");         //海啸
    this.WEATHER_FONT_MAP.set("", "volcano");         //火山
    this.WEATHER_FONT_MAP.set("", "hurricane");       //飓风
    this.WEATHER_FONT_MAP.set("", "tornado");         //龙卷风
    this.WEATHER_FONT_MAP.set("", "small-craft-advisory");  //小手工艺咨询
    this.WEATHER_FONT_MAP.set("", "gale-warning");    //大风预警
    this.WEATHER_FONT_MAP.set("", "storm-warning");   //风暴预警
    this.WEATHER_FONT_MAP.set("", "hurricane-warning");//飓风警告
    this.WEATHER_FONT_MAP.set("", "wind-direction");  //风向

  }

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (!value) {
      return "cloudy-windy";
    }

    if (args.length == 1) {
      if (args[0] == "centigrade") {
        if (!(value.indexOf("℃") > 0)) {
          return value + "℃";
        } else {
          return value;
        }
      }

      if (args[0] == "winame") {
        //晴转多云
        if (value.indexOf("转") > 0) {
          let first: string = value.split("转")[0];

          let wiKey = this.WEATHER_FONT_MAP.get(first);

          if (wiKey) {
            return wiKey;
          }
        } else {
          let wiKey = this.WEATHER_FONT_MAP.get(value);

          if (wiKey) {
            return wiKey;
          }
        }
      }
    }

    return "cloudy-windy";
  }
}
