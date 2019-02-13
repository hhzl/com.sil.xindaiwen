import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
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

  constructor(public navCtrl: NavController, public http: Http) {
    
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
    this.importLessons();
  }  

  displayLessons() {

    var lw = BoxOfQuestions(LWdb('lw-storage'));

    //var wordsFilteredByTag = lw.allWordsFilteredByTag(tag);
    var wordlist = lw.db.allWords(); //lw.getLearnCards(tag);

    console.log("displayLessons");
    console.log("wordlist:");
    console.log(wordlist);
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
    localStorage.clear();
    console.log("import lessons");
    this.http.get('assets/lessonmaterial/lessons.json')
    .map(res => res.json())
    .subscribe(data =>
    {
      console.log(data);
      var lw = BoxOfQuestions(LWdb('lw-storage'));
      var nr = 1;
      nr = lw.db.loadIntoStorage(nr, data, "character");
      lw.db.loadIntoStorage(nr, data, "example");
      this.displayLessons();
    });
  }
}
