import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var BoxOfQuestions: any;
declare var LWdb: any;
declare var LWutils: any;
var lw = BoxOfQuestions(LWdb('lw-storage'));
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

  arrWords: any;
  lessonName: any; 

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    wordNumber = 1;
    console.log('ionViewDidLoad LearnModePage');
    var tag = this.navParams.get('tag');
    this.lessonName = tag;
    //lw = BoxOfQuestions(LWdb('lw-storage'));
    this.showRepeat(tag);
  }

  listen(clickedOption) : void
  {
    var wordID = clickedOption.currentTarget.id;
    var clickedWord = lw.getWord(wordID);
    clickedOption.currentTarget.classList.add("listen");
    
    //doesn't work with ionic live-reload https://github.com/ionic-team/ionic-cli/issues/287
    var fileNumber = clickedWord._id;
    var hasPlayedChar = LWutils.playAudio("assets/lessonmaterial/audio/" + fileNumber + "-char.mp3");

    hasPlayedChar.addEventListener("ended", function() {
      var hasPlayedWord = LWutils.playAudio("assets/lessonmaterial/audio/" + fileNumber + "-word.mp3");

      hasPlayedWord.addEventListener("ended", function() {
        var myButton = document.getElementById(wordID);
        myButton.classList.remove("listen");
      });
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
    //var tag = LWutils.getParameterByName("tag", window.location);
    var wordsFilteredByTag = lw.allWordsFilteredByTag(tag);
    var numberOfOptions = (lw.db.getSettings()).numberOfLearnOptions;
    var nrOptionsToDisplay = numberOfOptions;

    var arrOptions = lw.getLearnCards(tag);

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
      var questionObj = lw.getWord(w);
      if(questionObj != null)
      {
            var card = "<div class=characterContainer><div class=character>" + questionObj.character + "</div></div>";
            card += "<div class=example>";
            card += "<div class=exampleImage><div><img class=imgAnswer src='assets/lessonmaterial/images/" + questionObj._id + ".png'></div></div>";
            card += "<div class=exampleText>" + questionObj.example + "</div>";
            card += "</div>";

            this.arrWords.push({id: w.toString(), content: card}); 
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
