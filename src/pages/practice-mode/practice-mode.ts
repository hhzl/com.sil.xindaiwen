import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var BoxOfQuestions: any;
declare var LWdb: any;
declare var LWutils: any;
var lw = BoxOfQuestions(LWdb('lw-storage'));
var correctAnswerID = "";
var mode = "";
var questionObj = null;
var tag = "";
var wordNumber = 1;
var characterCorrect = false;
var exampleCorrect = false;
/**
 * Generated class for the PracticeModePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-practice-mode',
  templateUrl: 'practice-mode.html',
})
export class PracticeModePage {

  public buttonColor: string = '#FFFFFF';

  arrOptionButtons: any;
  arrOptionButtonsSorted: any;
  lessonName: any; 
  title: string; 

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticeModePage');
  }


  ionViewDidEnter()
  {
    console.log("entered PracticeModePage");

    tag = this.navParams.get('tag');
    mode = this.navParams.get('mode');

    console.log("tag: " + tag);
    console.log("mode: " + mode);

    this.lessonName = tag;
    
    this.title = "练习 '" + tag + "'";

    lw.resetQueried();

    this.showRepeat(tag, mode);
  }

  listen() : void
  {
    if(questionObj != null)
    {
      var fileNumber = questionObj['_id'] + 1;
      LWutils.playAudio("assets/lessonmaterial/audio/" + fileNumber + "-" + questionObj['type'] + ".mp3");
    }
  }
  optionClick(clickedOption) : void
  {    
    if(clickedOption.buttonColor === '#FFFFFF') { 
      clickedOption.buttonColor = '#FFF0F5'
    } else {
      clickedOption.buttonColor = '#FFFFFF'
    }

    var buttonID = clickedOption.currentTarget.id;
    //var wordID = buttonID.replace("_character", "");
    //wordID = wordID.replace("_example", "");

    //var w = lw.findID(buttonID);
    //var clickedWord = lw.getWord(w);
    var myButton = document.getElementById(buttonID);

    console.log("buttonID: " + buttonID);
    //console.log("clickedWord: " + clickedWord.nr);
    console.log("correctAnswerID: " + correctAnswerID);

    var correct = false;
    if(myButton)
    {
      if(buttonID == correctAnswerID)
      {
          correct = true;

          myButton.classList.add("correct");

          lw.moveQuestionForward();
      }
      else {
          myButton.classList.add("wrong");

          lw.moveQuestionBackwards();
      }
      
      setTimeout(()=>{  
        if(correct)
        {
          myButton.classList.remove("correct");
          this.showRepeat(tag, mode);
        }
        else {
          this.listen();
          myButton.classList.remove("wrong");
          myButton.style.opacity = "0.3";
        }
      }, 2000);
    }
}
  showRepeat(tag, mode) {

    var wordsFilteredByTag = lw.allWordsFilteredByTag(tag);

    this.arrOptionButtonsSorted = [];
    this.arrOptionButtons = [];

    questionObj = lw.question(tag, mode, "");
    
    if(typeof questionObj !== 'undefined')
    {
      //correctAnswerID = lw.answer(tag, mode);
      correctAnswerID = questionObj['nr'];

      console.log("# correctAnswerID: " + correctAnswerID);
      this.listen();

      var arrOptionButtonsSorted = document.getElementsByClassName("optionBtn");
      var arrOptions = lw.getAnswerOptions(tag, mode, questionObj['type']);
  
      var numberOfOptions = 2;
      if(arrOptions.length < numberOfOptions)
      {
        if(wordNumber > numberOfOptions) {
          numberOfOptions = arrOptions.length - (wordNumber + numberOfOptions);
        }
        else {
          numberOfOptions = arrOptions.length;
        }
      }      

      console.log("numberOfOptions: " + numberOfOptions);
      console.log(wordsFilteredByTag);
      for (var i = 0; i < numberOfOptions; i++) {

        if(arrOptions[i])
        {

          //var card = "<div class=answer><div class=answerText>" + arrOptions[i]['word'] + "</div></div>";
          //this.arrOptionButtonsSorted.push({id: arrOptions[i]['nr'], content: card}); 


          var words = wordsFilteredByTag.filter(function (option) { return option._id == arrOptions[i]['_id']});

          console.log(words);
          var card = "<div class=answer><div class=answerText>" + words[0]['word'] + "</div></div>";

          this.arrOptionButtonsSorted.push({id: words[0]['nr'], content: card}); 
          
          var card = "<div class=answer><div class=answerText>" + words[1]['word'] + "</div></div>";

          this.arrOptionButtonsSorted.push({id: words[1]['nr'], content: card}); 
          
        }
      }


      //randomize answer options
      var arrOptionNumbers = [0, 1, 2, 3];
      lw.shuffle(arrOptionNumbers);

      for (var i = 0; i < this.arrOptionButtonsSorted.length; i++) {

        var optionNr = arrOptionNumbers[i];
        this.arrOptionButtons[i] = this.arrOptionButtonsSorted[optionNr];
      }


    }
    else
    {
      if(mode == "practice")
      {
        this.showRepeat(tag, "practiceagain");
        /*
        this.navCtrl.push('PracticeModePage', {
          tag: tag,
          mode: "practiceagain"
        });
        */    
      }
      else
      {
        var LWarea = document.getElementById("learnWords2-area");
        LWarea.style.display = "none";

        var finished = document.getElementById("finished");
        finished.style.display = "table";
      }
    }

  }  

  goHome() {
    this.navCtrl.setRoot(HomePage);
    /* 
    Uncaught (in promise): Error Type HomePage is part of the declarations of 2 modules:
    AppModule and HomePageModule! Please consider moving HomePage to a higher module that imports AppModule
    */ 
  }
}
