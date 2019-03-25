import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Nav, Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { HomePage } from '../pages/home/home';

declare var BoxOfQuestions: any;
declare var LWdb: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, page: string}>;

  rootPage:any = HomePage;

  constructor(public platform: Platform, public http: Http) {
    platform.ready().then(() => {
      this.initializeApp();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("initiallizing app");

      this.pages = [
        { title: '功课', page: 'HomePage' },
        { title: '关于', page: 'AboutPage' },
      ];      
    });
  }
  

}

