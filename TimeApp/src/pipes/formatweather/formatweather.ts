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
    this.WEATHER_FONT_MAP_DAY.set("晴", "day-sunny");
    this.WEATHER_FONT_MAP_DAY.set("", "day-cloudy");
    this.WEATHER_FONT_MAP_DAY.set("", "day-cloudy-gusts");
    this.WEATHER_FONT_MAP_DAY.set("", "day-cloudy-windy");
    this.WEATHER_FONT_MAP_DAY.set("", "day-fog");
    this.WEATHER_FONT_MAP_DAY.set("", "day-hail");
    this.WEATHER_FONT_MAP_DAY.set("", "day-haze");
    this.WEATHER_FONT_MAP_DAY.set("", "day-lightning");
    this.WEATHER_FONT_MAP_DAY.set("", "day-rain");
    this.WEATHER_FONT_MAP_DAY.set("", "day-rain-mix");
    this.WEATHER_FONT_MAP_DAY.set("", "day-rain-wind");
    this.WEATHER_FONT_MAP_DAY.set("", "day-showers");
    this.WEATHER_FONT_MAP_DAY.set("", "day-sleet");
    this.WEATHER_FONT_MAP_DAY.set("", "day-sleet-storm");
    this.WEATHER_FONT_MAP_DAY.set("", "day-snow");
    this.WEATHER_FONT_MAP_DAY.set("", "day-snow-thunderstorm");
    this.WEATHER_FONT_MAP_DAY.set("", "day-snow-wind");
    this.WEATHER_FONT_MAP_DAY.set("", "day-sprinkle");
    this.WEATHER_FONT_MAP_DAY.set("", "day-storm-showers");
    this.WEATHER_FONT_MAP_DAY.set("", "day-sunny-overcast");
    this.WEATHER_FONT_MAP_DAY.set("", "day-thunderstorm");
    this.WEATHER_FONT_MAP_DAY.set("", "day-windy");
    this.WEATHER_FONT_MAP_DAY.set("", "solar-eclipse");
    this.WEATHER_FONT_MAP_DAY.set("", "hot");
    this.WEATHER_FONT_MAP_DAY.set("", "day-cloudy-high");
    this.WEATHER_FONT_MAP_DAY.set("", "day-light-wind");

    //夜晚
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-clear");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-cloudy");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-cloudy-gusts");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-cloudy-windy");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-hail");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-lightning");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-rain");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-rain-mix");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-rain-wind");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-showers");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-sleet");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-sleet-storm");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-snow");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-snow-thunderstorm");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-snow-wind");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-sprinkle");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-storm-showers");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-thunderstorm");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-cloudy");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-cloudy-gusts");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-cloudy-windy");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-fog");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-hail");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-lightning");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-partly-cloudy");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-rain");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-rain-mix");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-rain-wind");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-showers");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-sleet");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-sleet-storm");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-snow");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-snow-thunderstorm");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-snow-wind");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-sprinkle");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-storm-showers");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-thunderstorm");
    this.WEATHER_FONT_MAP_NIGHT.set("", "lunar-eclipse");
    this.WEATHER_FONT_MAP_NIGHT.set("", "stars");
    this.WEATHER_FONT_MAP_NIGHT.set("", "storm-showers");
    this.WEATHER_FONT_MAP_NIGHT.set("", "thunderstorm");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-cloudy-high");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-cloudy-high");
    this.WEATHER_FONT_MAP_NIGHT.set("", "night-alt-partly-cloudy");

    //正常
    this.WEATHER_FONT_MAP.set("", "cloud");
    this.WEATHER_FONT_MAP.set("", "cloudy");
    this.WEATHER_FONT_MAP.set("", "cloudy-gusts");
    this.WEATHER_FONT_MAP.set("", "cloudy-windy");
    this.WEATHER_FONT_MAP.set("", "fog");
    this.WEATHER_FONT_MAP.set("", "hail");
    this.WEATHER_FONT_MAP.set("", "rain");
    this.WEATHER_FONT_MAP.set("", "rain-mix");
    this.WEATHER_FONT_MAP.set("", "rain-wind");
    this.WEATHER_FONT_MAP.set("", "showers");
    this.WEATHER_FONT_MAP.set("", "sleet");
    this.WEATHER_FONT_MAP.set("", "snow");
    this.WEATHER_FONT_MAP.set("", "sprinkle");
    this.WEATHER_FONT_MAP.set("", "storm-showers");
    this.WEATHER_FONT_MAP.set("", "thunderstorm");
    this.WEATHER_FONT_MAP.set("", "snow-wind");
    this.WEATHER_FONT_MAP.set("", "snow");
    this.WEATHER_FONT_MAP.set("", "smog");
    this.WEATHER_FONT_MAP.set("", "smoke");
    this.WEATHER_FONT_MAP.set("", "lightning");
    this.WEATHER_FONT_MAP.set("", "raindrops");
    this.WEATHER_FONT_MAP.set("", "raindrop");
    this.WEATHER_FONT_MAP.set("", "dust");
    this.WEATHER_FONT_MAP.set("", "snowflake-cold");
    this.WEATHER_FONT_MAP.set("", "windy");
    this.WEATHER_FONT_MAP.set("", "strong-wind");
    this.WEATHER_FONT_MAP.set("", "sandstorm");
    this.WEATHER_FONT_MAP.set("", "earthquake");
    this.WEATHER_FONT_MAP.set("", "fire");
    this.WEATHER_FONT_MAP.set("", "flood");
    this.WEATHER_FONT_MAP.set("", "meteor");
    this.WEATHER_FONT_MAP.set("", "tsunami");
    this.WEATHER_FONT_MAP.set("", "volcano");
    this.WEATHER_FONT_MAP.set("", "hurricane");
    this.WEATHER_FONT_MAP.set("", "tornado");
    this.WEATHER_FONT_MAP.set("", "small-craft-advisory");
    this.WEATHER_FONT_MAP.set("", "gale-warning");
    this.WEATHER_FONT_MAP.set("", "storm-warning");
    this.WEATHER_FONT_MAP.set("", "hurricane-warning");
    this.WEATHER_FONT_MAP.set("", "wind-direction");

  }

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (!value) {
      return "cloudy-windy";
    }

    return "cloudy-windy";
  }
}
