import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/Rx';

declare var BoxOfQuestions: any;
declare var LWdb: any;
declare var LWutils: any;
var lw = BoxOfQuestions(LWdb('lw-storage'));
var arrOptions;
var wordNumber;
/**
 * Generated class for the LearnModePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-learn-mode',
  templateUrl: 'learn-mode.html',
})
export class LearnModePage {

  arrOptions: any;
  arrWords: any;
  lessonName: any; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
  }

  ionViewDidLoad() {
    arrOptions = [];
    wordNumber = 1;
    console.log('ionViewDidLoad LearnModePage');
    var tag = this.navParams.get('tag');
    this.lessonName = tag;
    
    this.http.get('assets/lessonmaterial/lessons.json')
    .map((res) => res.json())
    .subscribe(data =>
    {
      data = data.filter(res => res.tags === tag)
      arrOptions = data;
      this.showRepeat(tag);
    });    
  }

  listen(clickedOption, type) : void
  {
    var clickedWord = clickedOption.currentTarget.id;
    clickedOption.currentTarget.classList.add("listen");
    
    //doesn't work with ionic live-reload https://github.com/ionic-team/ionic-cli/issues/287
    var hasPlayed = LWutils.playAudio("assets/lessonmaterial/audio/" + clickedWord + "-" + type + ".mp3");

    hasPlayed.addEventListener("ended", function() {
      var myButton = document.getElementById(clickedWord);
      if(myButton !== null)
      {
        myButton.classList.remove("listen");
      }
    });
  }

  back(lesson) :  void {

    if(wordNumber > 1){
      wordNumber = wordNumber - (lw.db.getSettings()).numberOfLearnOptions;
      this.showRepeat(lesson);
    }
    else {
      window.location.href = "choose-mode.html?tag=" + lesson;
    }
  }  
  forward(lesson) : void {

    if(wordNumber < lw.db.numberOfWords())
    {
      wordNumber = wordNumber + (lw.db.getSettings()).numberOfLearnOptions;
      this.showRepeat(lesson);
    }
  }

  showRepeat(tag)
  {
    var numberOfOptions = 2; //(lw.db.getSettings()).numberOfLearnOptions;
    var nrOptionsToDisplay = numberOfOptions;

    //var arrOptions = lw.getLearnCards(tag);
    this.arrWords = [];

    if(arrOptions.length <= numberOfOptions)
    {
      if(wordNumber > numberOfOptions) {
        nrOptionsToDisplay = arrOptions.length - (wordNumber + numberOfOptions);
      }
      else {
        nrOptionsToDisplay = arrOptions.length;
      }
    }
    

    for (var i = 0; i < nrOptionsToDisplay; i++) {
      var w = wordNumber + i - 1;
      var questionObj = arrOptions[w];

      if(questionObj != null)
      {
            var cardCharacter = "<div class='character'>" + questionObj.character + "</div>";            
          
            var cardExample = "<div class=exampleImage><div><img class=imgAnswer src='assets/lessonmaterial/images/" + questionObj._id + ".png'></div></div>";
            cardExample += "<div class=exampleText>" + questionObj.example + "</div>";

            this.arrWords.push({id: questionObj._id, contentCharacter: cardCharacter, contentExample: cardExample }); 
      }
    }

  var backButton = document.getElementById("back");
  
  if(wordNumber == 1)
  {
    backButton.style.visibility = 'hidden';
  }
  else
  {
    backButton.style.visibility = 'visible';
  }
  
  var nextButton = document.getElementById("forward");

  if((wordNumber + numberOfOptions) > arrOptions.length)
  {
    nextButton.style.visibility = 'hidden';
  }
  else {
    nextButton.style.visibility = 'visible';
  }

}  

}
