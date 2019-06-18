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
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (!value) {
      return "day-cloudy";
    }

    return "day-cloudy";
  }
}
