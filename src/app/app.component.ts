import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { HomePage } from '../pages/home/home';

declare var BoxOfQuestions: any;
declare var LWdb: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(public platform: Platform, public http: Http) {
    platform.ready().then(() => {
      this.initializeApp();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("initiallizing app");

    });
  }  
}

