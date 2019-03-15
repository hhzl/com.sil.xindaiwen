import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

declare var BoxOfQuestions: any;
declare var LWdb: any;

@IonicPage() 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  lessonButtons: any;

  constructor(public platform: Platform, public navCtrl: NavController, public http: Http) {
    
  }

  navigateToChooseMode(tag) : void {
    this.navCtrl.push('ChooseModePage', {
      lesson: tag
    });
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    /*
    if(this.dataIsImported())
    {
      this.displayLessons();
    }
    else
    {
      this.importLessons();
    }
    */
   this.platform.ready().then(() => {
      this.importLessons();
    });
  }  

  displayLessons() {

    var lw = BoxOfQuestions(LWdb('lw-storage'));

    //var wordsFilteredByTag = lw.allWordsFilteredByTag(tag);
    var wordlist = lw.db.allWords(); //lw.getLearnCards(tag);

    //wordlist.sort(function(a,b) {return a._id > b._id;});
    wordlist.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)); 

    console.log("displayLessons");
    console.log("wordlist:");
    
    for(var i=0;i<wordlist.length;i++) {
      console.log(wordlist[i]._id + " " + wordlist[i].tags);
    }

    var arrLesson = [];
    this.lessonButtons = [];
    
      if(wordlist.length > 0) {
            
      for(var i=0;i<wordlist.length;i++) {
        var lesson = wordlist[i].tags.split(",")[0];
        if(arrLesson.indexOf(lesson) === -1) {
          arrLesson.push(lesson)
          this.lessonButtons.push({lessonName: lesson}); 
        }
      }
    }
    
    lw.db.importFrom(wordlist);
    
  }

  dataIsImported() {
    var lw = BoxOfQuestions(LWdb('lw-storage'));
    var wordlist = lw.db.allWords(); 
    console.log("wordlist length: " + wordlist.length);
    if(wordlist.length > 0) {
      return true;
    }
    else
    {
      return false;
    }
  }

  importLessons()
  {
    this.http.get('assets/lessonmaterial/lessons.json')
    .map(res => res.json())
    .subscribe(data =>
    {
      console.log("localstorage data:");
      console.log(data);

      var lw = BoxOfQuestions(LWdb('lw-storage'));

      var nr = 1;
      nr = lw.db.loadIntoStorage(nr, data, "character");
      lw.db.loadIntoStorage(nr, data, "example");
      
      this.displayLessons();
    });
  }
}
