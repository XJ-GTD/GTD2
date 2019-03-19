import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { SetupPage } from '../setup/setup';
import { BlackListPage } from '../black-list/black-list';
import { CalendarPage } from '../calendar/calendar';
import { AgendaListPage } from '../agenda-list/agenda-list';
import { PlanListPage } from '../plan-list/plan-list';
import { MenuPage } from '../menu/menu';
import { ContactGroupPage } from '../contact-group/contact-group';
import { AccountPage } from '../account/account';
import { NewAgendaPage } from '../new-agenda/new-agenda';
    
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  
  openNavDetailsPage(item) {
    if (item === 'login')
      this.navCtrl.push(LoginPage, { item: item });
    else if (item === 'register')
      this.navCtrl.push(RegisterPage, { item: item });
    else if (item === 'setup')
      this.navCtrl.push(SetupPage, { item: item });
    else if (item === 'blackList')
      this.navCtrl.push(BlackListPage, { item: item });
    else if (item === 'calendar')
      this.navCtrl.push(CalendarPage, { item: item });
    else if (item === 'agendaList')
      this.navCtrl.push(AgendaListPage, { item: item });
    else if (item === 'planList')
      this.navCtrl.push(PlanListPage, { item: item });
    else if (item === 'menu')
      this.navCtrl.push(MenuPage, { item: item });
    else if (item === 'account')
      this.navCtrl.push(AccountPage, { item: item });
    else if (item === 'newAgenda')
      this.navCtrl.push(NewAgendaPage, { item: item });
    else
      this.navCtrl.push(ContactGroupPage, { item: item });
  }
}
