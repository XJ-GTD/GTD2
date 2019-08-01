import { NgModule } from '@angular/core';
import { FormatedatePipe } from './formatedate/formatedate';
import { FormatstringPipe } from './formatstring/formatstring';
import { FormatWeatherPipe } from './formatweather/formatweather';
import { FormatRepeatPipe } from './formatrepeat/formatrepeat';

@NgModule({
	declarations: [
		FormatedatePipe,
		FormatstringPipe,
		FormatWeatherPipe,
		FormatRepeatPipe
	],
	imports: [],
	exports: [
		FormatedatePipe,
		FormatstringPipe,
		FormatWeatherPipe,
		FormatRepeatPipe
	]
})
export class PipesModule {}
