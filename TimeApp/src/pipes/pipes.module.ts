import { NgModule } from '@angular/core';
import { FormatedatePipe } from './formatedate/formatedate';
import { FormatWeatherPipe } from './formatweather/formatweather';

@NgModule({
	declarations: [
		FormatedatePipe,
		FormatWeatherPipe
	],
	imports: [],
	exports: [
		FormatedatePipe,
		FormatWeatherPipe
	]
})
export class PipesModule {}
