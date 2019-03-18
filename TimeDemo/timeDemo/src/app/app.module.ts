import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CalendarModule } from 'ion2-calendar';
import { ComponentsModule } from '../components/components.module';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LoginPasswordPage } from '../pages/login-password/login-password';
import { LoginSmsPage } from '../pages/login-sms/login-sms';
import { RegisterPage } from '../pages/register/register';
import { SetupPage } from '../pages/setup/setup';
import { BlackListPage } from '../pages/black-list/black-list';
import { CalendarPage } from '../pages/calendar/calendar';
import { AgendaListPage } from '../pages/agenda-list/agenda-list';
import { PlanListPage } from '../pages/plan-list/plan-list';
import { MenuPage } from '../pages/menu/menu';
import { ContactGroupPage } from '../pages/contact-group/contact-group';
import { AccountPage } from '../pages/account/account';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { NewPasswordPage } from '../pages/new-password/new-password';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    LoginPasswordPage,
    LoginSmsPage,
    RegisterPage,
    SetupPage,
    BlackListPage,
    CalendarPage,
    AgendaListPage,
    PlanListPage,
    MenuPage,
    ContactGroupPage,
    AccountPage,
    ChangePasswordPage,
    NewPasswordPage
  ],
  imports: [
    BrowserModule,
    CalendarModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    LoginPasswordPage,
    LoginSmsPage,
    RegisterPage,
    SetupPage,
    BlackListPage,
    CalendarPage,
    AgendaListPage,
    PlanListPage,
    MenuPage,
    ContactGroupPage,
    AccountPage,
    ChangePasswordPage,
    NewPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
