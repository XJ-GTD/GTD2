import { NgModule } from '@angular/core';
import { FormatedatePipe } from './formatedate/formatedate';
import { FormatstringPipe } from './formatstring/formatstring';
import { FormatWeatherPipe } from './formatweather/formatweather';

@NgModule({
	declarations: [
		FormatedatePipe,
		FormatstringPipe,
		FormatWeatherPipe
	],
	imports: [],
	exports: [
		FormatedatePipe,
		FormatstringPipe,
		FormatWeatherPipe
	]
})
export class PipesModule {}
