/*jshint esversion: 6 */

// Variable Initialization
let playerHealth = 3; // Players Health
let elemInv = [ ['Fire Bottle', 0], ['Freeze Spray', 0], ['Air Cannon', 0], ['Stun Gun', 0] ];
const gameConsole = document.getElementById('gameConsole');
const lifeBar = document.getElementById('life-bar');
const dialogueBox = document.getElementById('dialogue-box');
const blackBox = document.getElementById('blackBox');
const inventoryButton = document.getElementById('inventoryButton');
const inventoryBox = document.getElementById('inventoryBox');
let consoleButtonRow = ''; // cant use getelement becuase it hasnt been created yet, but declaring up here to avoid multipole declarations
let playerName = ''; // players name

// used for outputting to DOM
let insertedElement = '';
let elementTarget = '';
let outputText = '';

let dialogueTime = ''; //used as set interval later
let dialogueFlag = -1; //used to keep track of conversation steps
let needClear = true; //used to avoid two straight dialogue draws
let dialogueCont = false; // used for the continue button in long conversation
let dialogueShown = false; // used to determine if a dialogue has been drawn in conversations


document.getElementById('intro-button').addEventListener('click', beginGame);
document.getElementById('intro-button').addEventListener('touchstart', beginGame);

drawHealthBar();

function drawHealthBar() { // Function to refresh the health bar

  lifeBar.innerHTML = ""; // Remove health bar to redraw

  if (playerHealth === 0) { // if health = 0, uh oh

  lifeBar.innerHTML = 'DANGER';
  lifeBar.setAttribute('class', 'text-warning');

  } else { // otherwise draw health as usual

    for (i = 0; i < playerHealth; i++) { // Loop for each health point

      lifeBar.innerHTML += '<i class="fa fa-heart" aria-hidden="true"></i>';

    } // End for loop

  } // End else
} // End drawHealthBar

function beginGame() {

  gameConsole.innerHTML = ""; // Reset console and display text
  insertedElement = document.createElement('p');
  insertedElement.innerHTML = 'As you click the button, you start to feel queasy. The world gets hazy around you, but only for a moment. Everything looks the same, but yet somehow feels different, including yourself. The most obvious difference is now a floating blue door in front of you with elegant gold markings abound. It has no depth to it, but clearly leads to somewhere else. Another look at your surroundings gives you a sense of uneasiness. What will you do?';
  gameConsole.appendChild(insertedElement);

  insertedElement = document.createElement('div'); // create button row
  insertedElement.setAttribute('class', 'flex-container justify-space-around');
  insertedElement.setAttribute('id', 'console-button-row');
  gameConsole.appendChild(insertedElement);

  consoleButtonRow = document.getElementById('console-button-row'); // make the newly created buttonrow a var that we can manipulate
  insertedElement = document.createElement('button'); //insert first button
  insertedElement.setAttribute('class', 'btn btn-primary');
  insertedElement.setAttribute('onclick', 'decision11()');
  insertedElement.innerHTML = 'Enter the door';
  consoleButtonRow.appendChild(insertedElement);

  insertedElement = document.createElement('button'); // insert second button
  insertedElement.setAttribute('class', 'btn btn-danger');
  insertedElement.setAttribute('onclick', 'decision12()');
  insertedElement.innerHTML = 'Ignore the door and look around';
  consoleButtonRow.appendChild(insertedElement);

}

function decision11() {
// player correctly chose to enter the door

gameConsole.innerHTML = '';

  outputText = 'As you go through the door, you find yourself sitting in a classroom. There are approximately 20 seats, but yours is the only one occupied. The walls are a deep blue, and you notice a couple of posters with text on them, but as you try to read it the text is incomprehensible. Before you can observe anything else in the room, your focus is immediately on the teachers desk which is occupied by a strange looking man.';
  appendOutputConsole('p', outputText);
  outputText = 'This \"teacher\" is wearing a black tuxedo with a white undershirt and a white hankerchief in his front pocket. He looks awfully thin, almost frail. His hair is a light grey, and only along the outside of his head as the top of his head is bald. His eyebrows seem unnecessarily long, and his eyes are almost completely circular in shape. His ears are pointed and his nose... extends at least 4 inches from his face. All of this conveys the look of an older man, but as he speaks to you, he does so in a voice that is both inquisitive and strangely upbeat, almost as if he anticipated your arrival:';
  appendOutputConsole('p', outputText);

  appendOutputConsole('div', '<button class="btn btn-primary" onclick="decision11A()">Continue</button>', 'flex-container justify-center');

}

function decision11A() {
// Continuation of door event
  gameConsole.innerHTML = '';

// Igor speaks
  dialogueText('"Teacher"', 'Hello! Welcome to... this place. I\'m sure you have many question. Unfortunately, I cannot answer many of them at this time. If you would be so kind as to give me your name, I will divulge what I can. ');

// response
  appendOutputConsole('p' , 'He is correct in that you have many questions, but you wouldn\'t even know what to ask. You decide to give him your name. ');
  appendOutputConsole('div', '<button class="btn btn-primary" onclick="decision11B()">Continue</button>', 'flex-container justify-center');
}

function decision11B() {
  playerName = prompt('Please input your name:'); // Get players name
  dialogueFlag = 0; // initiate conversation chain
  gameConsole.innerHTML = ''; //clear screen


  console.log('interval set');
  dialogueTime = setInterval( dial11B, 250);

  function dial11B() {


    switch(dialogueFlag) {

      case 0:
        console.log(dialogueCont);
        if(dialogueShown == false) {
          dialogueText('"Teacher"' , 'Excellent. Now listen carefully. This room that you are in exists outside of normal space. It is a physical manifestation of your own consciousness. For some people it can be an elevator, for others a jail cell. In your case, since you are, and will be, constantly learning, this is a classroom. I am here to help you out of your current plight, but I only offer the tools to do so. The correct decisions will still need to be made by you.');
          dialogueShown = true; }

        if(dialogueCont == true) {
          console.log('true flag tripped');
          dialogueFlag++;
          dialogueShown = false;
          dialogueCont = false;
          needClear = false;
        } //end if
        break; //break case 0

      case 1:
        if(dialogueShown == false) {

          appendOutputConsole('p' , 'While you find it somewhat difficult to wrap your head around what he just said, you pay special attention to the last part. \"What plight?\" you think, and almost as if he can read your thoughts, he continues on:');
          appendOutputConsole('div', '<button class="btn btn-primary" onclick="pauseClick()">Continue</button>', 'flex-container justify-center');
          dialogueShown = true;  }

        if(dialogueCont == true) {
          dialogueFlag++;
          dialogueShown = false;
          dialogueCont = false;
          needClear = false;
        }  // end if;
        break; //break case 1

      case 2:
          if(dialogueShown == false) {
            gameConsole.innerHTML = '';
            dialogueText('"Teacher"', 'Prior to entering this room, you had an event occur which triggered a temporary bluriness of vision and a small degree of nausea did you not? This is because you were transported to another realm. While this place that you are in right now has no connection with the outside world, the one you crossed into is inexorably linked to the \"real\" world.\nBut it is dangerous. It is inhabited not by people, but by beings known as shadows.');
            dialogueShown=true;
          }

          if(dialogueCont == true) {
            dialogueFlag++;
            dialogueShown=false;
            dialogueCont=false;
            needClear=false;
          }
          break; //break case 2

      case 3:
          if(dialogueShown == false) {

            if(playerHealth === 2) {
              dialogueText('"Teacher"', 'You have already encountered these beings, so you should know the danger they pose.');
              dialogueShown = true;
            }//end playerHealthif

            if(playerHealth === 3) {
              dialogueText('"Teacher"', 'You have yet to encounter them, but you soon will, and they are quite dangerous.');
              dialogueShown = true;
            }//end playerHealth if

          } //end diallogueshown iff

          if(dialogueCont == true) {
            dialogueFlag++;
            dialogueShown=false;
            dialogueCont=false;
            needClear=true;
          }

          break; //break case 3

      case 4:
        if(dialogueShown == false) {
          dialogueText('"Teacher"', 'Now pay close attention as your survival depends on it. While you do not possess the ability to fight shadows yourself, I will provide you with some items that you will find useful. Pay special attention to your enemies, as some items will be more useful against particular shadows. Now go and see if you can find your way to safety');
          dialogueShown=true;
        }
        if(dialogueCont == true) {
          dialogueFlag++;
          dialogueShown=false;
          dialogueCont=false;
          needClear=false;
        }
        break; //end case 4

      case 5:
      if(dialogueShown == false) {
        gameConsole.innerHTML='';
        appendOutputConsole('p' , 'The teacher motions you to his desk. As you approach, he hands you four sets of items. Upon closer inspection, you notice that the items correspond to four elements: fire, ice, wind, and lightning. Before you can ask the teacher any more questions about what is going on, you are whisked out of the blue classroom. Now you are back where you started, and you hear the same rumbling before. But this time, you are ready for it. At least thats what you tell yourself');
        appendOutputConsole('div', '<button class="btn btn-primary" onclick="decision11C()">Continue</button>', 'flex-container justify-center');
        appendOutputConsole('p', 'Received Flame bottle x 3, Ice spray x 3, Air Cannon x 3, Stun Gun x 3', 'game');
        clearInterval(dialogueTime);
        console.log('dialogue ovah!');
      }
      break; //end case 5 and end of dialogue
    } //end switch
  }//end dial11B fucntion
} // end 11b function

function decision11C() {
  inventoryButton.classList.remove('invisible');
  gameConsole.innerHTML='';
  appendOutputConsole('p', 'You exit the classroom and return to where you were. The same uneasiness from before is still there. That teacher didn\'t tell you where to go, but you decided going outside to investigate your surrounding would be a good start. Upon arriving outside you notice the absence of any people whatsoever. Fortunately, the teacher somewhat prepared you for that, so you notice a small rumbling behind you. When you turn around you see a flotaing grey blob with a mask on it. As it approaches you, it starts to take shape, transforming in to a small demon-ish imp about 2 feet in height holding a spoon that it lit on fire. It would almost seem cute if it wasn\'t trying to kill you. ')
  appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision21()">Use fire bottle</button><button class="btn btn-primary" onclick="decision22()">Use freeze spray</button><button class="btn btn-success" onclick="decision23()">Use Air Cannon</button>', 'flex-container justify-space-around');
  appendOutputConsole('div', '<button class="btn btn-info" onclick="decision23()">Use Stun Gun</button><button class="btn btn-warning" onclick=decision24()>Run Away</button>', 'flex-container justify-space-around');
  appendOutputConsole('p', 'Push the inventory button at any time to show your inventory', 'game');

}



function decision12() {
// Player chose to not go through the door. peanlty is one life. failure to answer correctly will result in instant death

playerHealth--;
drawHealthBar(); //Remove 1 health and redraw health bar

//text
gameConsole.innerHTML = 'You decide that floating doors are a little to weird for you and turn your attention to the world around you. As you leave the room you are in, you hear a rumbling sound approaching. Before you have time to react, a greyish floating blob appears before you with a mask attached that has the letters II attached to its forehead. It rapidly approaches you and as you brace yourself it passes right through you. There is a small pain felt, but more importantly than that you feel far more tired than before. That cannot happen again. You immediately retreat to find the blue door still there, this time emitting a small hum. Whatever that blob thing was, it is sure to return.';

insertedElement = document.createElement('div'); // create button row
insertedElement.setAttribute('class', 'flex-container justify-space-around');
insertedElement.setAttribute('id', 'console-button-row');
gameConsole.appendChild(insertedElement);

consoleButtonRow = document.getElementById('console-button-row'); // make the newly created buttonrow a var that we can manipulate
insertedElement = document.createElement('button'); //insert first button
insertedElement.setAttribute('class', 'btn btn-primary');
insertedElement.setAttribute('onclick', 'decision11()');
insertedElement.innerHTML = 'Enter the door, for real';
consoleButtonRow.appendChild(insertedElement);

insertedElement = document.createElement('button'); // insert second button
insertedElement.setAttribute('class', 'btn btn-danger');
insertedElement.setAttribute('onclick', 'decision13()');
insertedElement.innerHTML = 'Screw this, flee the premises!';
consoleButtonRow.appendChild(insertedElement);

insertedElement = document.createElement('p'); // create -1 health notice and remove after 3 seconds
insertedElement.setAttribute('class', 'game text-center');
insertedElement.setAttribute('id', 'health-notice');
insertedElement.innerHTML = '-1 HEALTH';
gameConsole.appendChild(insertedElement);
textTimer = setTimeout(function(){ document.getElementById('health-notice').innerHTML=""; }, 3000);


} // end decision12()

function decision13() {
  // Player was given two chances to enter the door and refused both times. Game will now end

clearTimeout(textTimer);

lifeBar.innerHTML = '-DEAD-';
lifeBar.setAttribute('class', 'dead-text');

gameConsole.innerHTML = '';

outputText = 'First floating doors, now giant blobs? \"No thanks.\", you think as you sprint outside as fast as you can. As you do so, the rumbling intensifies, only increasing your desire to get out. When you arrive outside, the rumbling stops. As you catch your breath, you are at first thankful for the silence and then look around you and notice a different kind of silence. Everything outside seems normal, but there\'s no ambient sounds whatsoever. Cars, animals, the wind, nothing is making any sound. Where you expect to see people walking down the street or cars passing, there is nothing. It as if all life here has disappeared. \nThe eerieness of such a view has taken so much of your attention that you don\'t notice the blob behind you, and this time it brought friends. They all pass through you from behind this time, and the fatigue from before is now overwhelming. As you begin to lose consciousness, you hear a faint voice. You can only make out two words: \"How disappointing\".';

appendOutputConsole('p', outputText, '', '');
appendOutputConsole('p', '\nYou never saw it coming, and it was most definitely your last surprise', '', '');

appendOutputConsole('p', '*GAME OVER*', 'text-center game');
appendOutputConsole('p', 'REFRESH TO TRY AGAIN', 'text-center game');

}

// fucntion for outputting to conosle
function appendOutputConsole(element, value, className, idName, onClick) {
  insertedElement = document.createElement(element);
  insertedElement.setAttribute('class', className);
  insertedElement.setAttribute('id', idName);
  insertedElement.setAttribute('onclick', onClick);
  insertedElement.innerHTML = value;
  gameConsole.appendChild(insertedElement);
}

// function for spoken dialogue box
function dialogueText(speaker, text) {

  blackBox.classList.add('blacken');
  dialogueBox.classList.add('show-dialogue');

  dialogueBox.innerHTML = '<p class="game">' + speaker + '</p><p class="dos">' + text + '</p><button class="btn btn-primary dialogue-button" onclick="pauseClick()">Continue</button>';

  if(dialogueFlag < 0) { //do not auto blaken in a dialogue chain

    textTimer = setTimeout( function() {
      console.log('function triggered');
      dialogueBox.classList.remove('show-dialogue');
      blackBox.classList.remove('blacken');
    }, 5000);
  }// end if
} //end dialogueText

// function to remove dialogue
function pauseClick() {

  console.log('pauseClick invoked');
  if(dialogueFlag < 0) {
    clearTimeout(textTimer);
    dialogueBox.classList.remove('show-dialogue');
    blackBox.classList.remove('blacken');
 }

  if (dialogueFlag >= 0) {
    dialogueCont = true;

    if (needClear == true) { // only remove the black box and dialogue box if another dialogue box is not next
      dialogueBox.classList.remove('show-dialogue');
      blackBox.classList.remove('blacken');
    }
  } // if theres a conversation chain, clicking this button will progress it
} //end pauseclick()

function showInventory() {

  inventoryBox.classList.remove('hide-inventory');
  elemInv.forEach( function(item, index) {
    insertedElement=document.createElement('p');
    insertedElement.textContent = item[0] + ': ' + item[1];
    inventoryBox.appendChild(insertedElement);
  }); // end foreach

  insertedElement = document.createElement('div');
  insertedElement.innerHTML = '<button class="btn btn-warning flex-container justify-center dos" onclick="hideInventory()">Hide Inventory</button>';
  inventoryBox.appendChild(insertedElement); // draw hide inv button

}// end show inventory

function hideInventory() {
  inventoryBox.classList.add('hide-inventory'); //shift box over
  let inventoryDelay = setTimeout(function() {inventoryBox.innerHTML = '';}, 250); // empty content
}
