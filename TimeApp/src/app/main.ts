import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import FastClick from 'fastclick'

import { AppModule } from './app.module';
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body);
  }, false)
};

platformBrowserDynamic().bootstrapModule(AppModule);

