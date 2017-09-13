/*jshint esversion: 6 */

// Variable Initialization
let playerHealth = 3; // Players Health
let extraLife = 0; // second change if they get to 0 life
let elemInv = [ ['Fire Bottle', 0], ['Freeze Spray', 0], ['Air Cannon', 0], ['Stun Gun', 0] ];
let bossAffinity = ['red', 'blue', 'green', 'yellow'];
let bossHealth = 3; // initialize boss health for next encounter
let currAffinity = 0;

const gameConsole = document.getElementById('gameConsole');
const lifeBar = document.getElementById('life-bar');
const dialogueBox = document.getElementById('dialogue-box');
const blackBox = document.getElementById('blackBox');
const inventoryButton = document.getElementById('inventoryButton');
const inventoryBox = document.getElementById('inventoryBox');
const jokerBox = document.getElementById('jokerBox');
const battleBox = document.querySelector('#battleBox');
const leftButtonArea = document.getElementById('left-button-area');
const bossBGM = new Audio('sound/villain.mp3');
const willpowerBGM = new Audio('sound/willpower.mp3');
let musicControl = ''; // will be used for audio button once drawn

let consoleButtonRow = ''; // cant use getelement becuase it hasnt been created yet, but declaring up here to avoid multipole declarations
let playerName = ''; // players name

// used for outputting to DOM
let insertedElement = '';
let elementTarget = '';
let outputText = '';

let enableMusic = true; // In case i want to turn off music
let dialogueTime = ''; //used as set interval later
let dialogueFlag = -1; //used to keep track of conversation steps
let needClear = true; //used to avoid two straight dialogue draws
let dialogueCont = false; // used for the continue button in long conversation
let dialogueShown = false; // used to determine if a dialogue has been drawn in conversations

//CHAPTER 2 var declarations
let party = [];
let currentEnemies=[];
let initialBattleDraw = true; //tells the function for drawing enemies if containers need to either be drawn initially, or reset in the battle box
let battleOrder = [];
let currentTurn = 0; //determines whose turn i t is in battle
//declare party members
let protag = new partyMember('', 3, 'hS', 6, 6, 6);







//declare enemies
let enemyUkobach = new enemy('Ukobach', 50, 50, 'iW', [abilityList.agi], 2, 3, 2);


battleBox.style.display = 'none';
document.getElementById('intro-button').addEventListener('click', beginGame);
document.getElementById('intro-button').addEventListener('touchstart', beginGame);
document.querySelector('#ch2Skip').addEventListener('click', section200);

drawHealthBar();

function drawHealthBar() { // Function to refresh the health bar

  lifeBar.innerHTML = ""; // Remove health bar to redraw

  if (playerHealth === 0) { // if health = 0, uh oh

    if (extraLife === 0) { // and no extra life? you dead.
      lifeBar.innerHTML = '*DEAD*';
      lifeBar.setAttribute('class', 'text-danger');

      gameConsole.innerHTML = '';
      appendOutputConsole ('p', 'You have ran out of health. You collapse on the ground, disappointed that the decisions you made have left to this. You though you made the right choice. Instead, it turned out to be your last surprise.');
      appendOutputConsole ('p', 'GAME OVER. REFRESH TO TRY AGAIN', 'text-center game');
      // Gaaaaaaame Ooooovaaaahhh!!!!
    } else { // end extra life check
      lifeBar.innerHTML = 'DANGER';
      lifeBar.setAttribute('class', 'text-warning');
    } // end extra life else
  } else { // otherwise draw health as usual

    if(playerName != '') {lifeBar.innerHTML = playerName + ': ';}
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
  playerName == '' ? prompt('I don\'t know anyone without a name. If you are not willing to disclose yours, I cannot help you') : alert('Name recieved');
  drawHealthBar(); //redraw healthbar with name
  dialogueFlag = 0; // initiate conversation chain
  gameConsole.innerHTML = ''; //clear screen


  console.log('interval set');
  dialogueTime = setInterval( dial11B, 250); // Interval time to check for input. Lowering increases response time, but will strain the browser

  function dial11B() { //dialogue chain start


    switch(dialogueFlag) { // Dialogue chain structure:
      // Dialogue is checked every .25 seconds for a response

      case 0:
        console.log(dialogueCont);
        if(dialogueShown == false) { //  if the current dialogue hasn't been shown yet, show it
          dialogueText('"Teacher"' , 'Excellent. Now listen carefully. This room that you are in exists outside of normal space. It is a physical manifestation of your own consciousness. For some people it can be an elevator, for others a jail cell. In your case, since you are, and will be, constantly learning, this is a classroom. I am here to help you out of your current plight, but I only offer the tools to do so. The correct decisions will still need to be made by you.');
          dialogueShown = true; } // and then change the flag so the same dialogue doesnt get redisplayed over and over

        if(dialogueCont == true) { // clicking the continue button makes this flag true so this code executes if the person clicked the button
          console.log('true flag tripped');
          dialogueFlag++; // increment the dialogue flag so it goes to the next case
          dialogueShown = false; //reset flags
          dialogueCont = false;
          needClear = false; //notify if the next dialogue section will require the console text to be blacked out
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
        clearInterval(dialogueTime); // Stop the dialogue refresh, give the player first items
        console.log('dialogue ovah!');
      }
      break; //end case 5 and end of dialogue
    } //end switch
  }//end dial11B fucntion
} // end 11b function

function decision11C() {
  inventoryButton.classList.remove('invisible'); // show inventory button
  gameConsole.innerHTML=''; // clear console
  appendOutputConsole('p', 'You exit the classroom and return to where you were. The same uneasiness from before is still there. That teacher didn\'t tell you where to go, but you decided going outside to investigate your surrounding would be a good start. Upon arriving outside you notice the absence of any people whatsoever. Fortunately, the teacher somewhat prepared you for that, so you notice a small rumbling behind you. When you turn around you see a flotaing grey blob with a mask on it. As it approaches you, it starts to take shape, transforming in to a small demon-ish imp about 2 feet in height holding a spoon that it lit on fire. It would almost seem cute if it wasn\'t trying to kill you. ');
  appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision21()">Use fire bottle</button><button class="btn btn-primary" onclick="decision22()">Use freeze spray</button><button class="btn btn-success" onclick="decision23()">Use Air Cannon</button>', 'flex-container justify-space-around');
  appendOutputConsole('div', '<button class="btn btn-info" onclick="decision23()">Use Stun Gun</button><button class="btn btn-warning" onclick=decision24()>Run Away</button>', 'flex-container justify-space-around');
  appendOutputConsole('p', 'Push the inventory button at any time to show your inventory', 'game');
  // ^^ set up first encounter

  elemInv.forEach(function(item, index){
    item[1] = 3;
  }); // give player 3 of each element
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

function decision21() {
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, 0) == false) {return;}
  elemInv[0][1]--;
  //user decided to use the one item that heals the enemy. -1 health
  gameConsole.innerHTML = '';
  playerHealth--; // lower health
  drawHealthBar(); //redraw health
  if(playerHealth==0) {return;} //death check (since death by low health is now possible)
  appendOutputConsole('p', 'The imp holds his spoon up to the fire bottle as you throw it at him and it only intensifies the flame on the end. Then, he somehow throws that flame at you, doing damage in the process. you remind yourself that it\'s probably not a good idea to use the element that a shadow has an affinity for.');
  appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision21()">Use fire bottle</button><button class="btn btn-primary" onclick="decision22()">Use freeze spray</button><button class="btn btn-success" onclick="decision23A()">Use Air Cannon</button>', 'flex-container justify-space-around');
  appendOutputConsole('div', '<button class="btn btn-info" onclick="decision23B()">Use Stun Gun</button><button class="btn btn-warning" onclick="decision24()">Run Away</button>', 'flex-container justify-space-around');
  appendOutputConsole('p', '-1 HEALTH', 'game');


}

function decision22() { //player used the correct item. crit bonus, and health bonus if they dont already have 4 health
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, 1) == false) {return;}
  elemInv[1][1]--;

  critAnimation();
  gameConsole.innerHTML = '';
  appendOutputConsole('p', 'The imp clearly does not like the cold in any manner, as not only does it clearly damage him, but it is knocked over in agony. You get the idea that using one more item could finish it off. On the other hand, this would be a great chance to escape.');
  appendOutputConsole('div', '<button class="btn btn-info" onclick="decision22A()">Use another</button><button class="btn btn-warning" onclick="decision25()">Run away</button>', 'flex-container justify-space-around');
}

function decision22A() {
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, 1) == false) {return;}
  elemInv[1][1]--;

  // player vanquishes monster
  gameConsole.innerHTML = '';
  appendOutputConsole('p', 'A second freeze spray was too much for it to handle, and the shadow evaporates into thin air...');

  // give life bonus if health is 4 or less
  healthBonus();
  appendOutputConsole('div', '<button class="btn btn-primary" onclick="decision25()">Continue</button>', 'flex-container justify-center');
} // end 22a

function decision23A() { //player selected wind
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, 2) == false) {return;}
  elemInv[2][1]--;

  decision23();
} // end 23a

function decision23B() { //player used lightning
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, 3) == false) {return;}
  elemInv[3][1]--;

  decision23();
} //end 23b

function decision23() { // player used an item that the monster was neither weak nor strong against. encounter success
  gameConsole.innerHTML = '';
  appendOutputConsole('p', 'You use the item on the shadow and it recoils in shock. In fact it seemed so sure that you were defenseless that it gives you plenty of time to escape.');
  appendOutputConsole('div', '<button class="btn btn-primary" onclick="decision25()">Continue</button>');
}// end 23

function decision24() { // player attemps to run away and fails, -1 health
  gameConsole.innerHTML = '';
  playerHealth--;
  drawHealthBar();
  appendOutputConsole('p', 'You decide not to chance using the items and instead try an escape. The imp is prepared, however, and cuts you off while burning you with the flame on his spoon');
  appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision21()">Use fire bottle</button><button class="btn btn-primary" onclick="decision22()">Use freeze spray</button><button class="btn btn-success" onclick="decision23A()">Use Air Cannon</button>', 'flex-container justify-space-around');
  appendOutputConsole('div', '<button class="btn btn-info" onclick="decision23B()">Use Stun Gun</button><button class="btn btn-warning" onclick="decision24()">Run Away</button>', 'flex-container justify-space-around');
  appendOutputConsole('p', '-1 HEALTH', 'game flex-container justify-center');
} // end 24

function decision25() { // Begin encounter 2
  gameConsole.innerHTML = '';
  appendOutputConsole('p', 'With that encounter over, you made your way down the street. As you pass by various buildings, you still find it jarring that there is no sense of life whatsoever. After a few minutes, you almost start to become accustomed to it. This just makes it all the more startling when you hear voices from a nearby building. Human voices. As you make your way towards the building, another shadow makes it\'s way towards you, this time forming into what almost looks like a unicorn. At least thats what you would call it except for where you would expect to find a single horn, this creature has two ram-like horns pertruding out, making it for of a bicorn than a unicorn. As it kicks its legs into the air, a fierce wind bats you in the face. It becomes clear that there\'s no getting away from this thing without using an item.');
  appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision31()">Use fire bottle</button><button class="btn btn-primary" onclick="decision32()">Use freeze spray</button>', 'flex-container justify-space-around');
  appendOutputConsole('div', '<button class="btn btn-success" onclick="decision33()">Use Air Cannon</button><button class="btn btn-info" onclick="decision34()">Use Stun Gun</button>', 'flex-container justify-space-around');
} // end f25

function decision31() { // player uses fire. lands a crit, killing the monster, but no health bonus
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, 0) == false) {return;}
  elemInv[0][1]--;

  critAnimation();
  gameConsole.innerHTML='';
  appendOutputConsole('p', 'As the bicorn kicks up another fierce wind gust, you throw the fire bottle at it. It shatters before reaching it\'s target, but the wind only fuels the fire as the bicorn is scorched, as you barely dive out of the way from the expanding blast. As you watch the bicorn dissolve, you think you see it containing some sort of item, but it also is burned in the blast. ');
  appendOutputConsole('div', '<button class="btn btn-primary" onclick="decision35()">Continue</button>', 'flex-container justify-center');
} // end f31

function decision32() { // player uses ice, no effect, but no damage, retry
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, 1) == false) {return;}
  elemInv[1][1]--;

  gameConsole.innerHTML='';
  appendOutputConsole('p', 'You attempt to use the freeze spray, but the gust of wind proves too difficult to get around. The good news is that because the bicorn had to actively defend your attack, there was no retaliation. The bad news is that the item had no effect, means its use was wasted. It would be a good idea to not try that again.');
  appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision31()">Use fire bottle</button><button class="btn btn-primary" onclick="decision32()">Use freeze spray</button>', 'flex-container justify-space-around');
  appendOutputConsole('div', '<button class="btn btn-success" onclick="decision33()">Use Air Cannon</button><button class="btn btn-info" onclick="decision34()">Use Stun Gun</button>', 'flex-container justify-space-around');
} // end f32

function decision33() { // player uses wind, -1 health, retry
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, 2) == false) {return;}
  elemInv[2][1]--;

  playerHealth--;
  drawHealthBar();

  gameConsole.innerHTML='';
  appendOutputConsole('p', 'As you ready the wind cannon, the small, focused gust of you you produced is completely overwhelmed by the wind produced by the bicorn. While it prevented the wind from overwheling you completely, you take damage in the process. The bicorn clearly has an affinity for wind, so you should try something else.');
  appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision31()">Use fire bottle</button><button class="btn btn-primary" onclick="decision32()">Use freeze spray</button>', 'flex-container justify-space-around');
  appendOutputConsole('div', '<button class="btn btn-success" onclick="decision33()">Use Air Cannon</button><button class="btn btn-info" onclick="decision34()">Use Stun Gun</button>', 'flex-container justify-space-around');
  appendOutputConsole('p', '-1 HEALTH', 'text-center game');
} // end f33

function decision34() { // player uses lightning. lands crit, health bonus
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, 3) == false) {return;}
  elemInv[3][1]--;

  critAnimation();
  gameConsole.innerHTML='';
  appendOutputConsole('p', 'The lightning that emerges from the stun gun quickly pierces any wind defense the bicorn attempts to put up. Furthermore, its horns act like a lightning rod only further increasing the damage taken. You have found the monsters weak point, as it is so vulnerable to lightning that another use of the stun gun is not required; it simply collapses and dissolves on the spot.');
  healthBonus();
  appendOutputConsole('div', '<button class="btn btn-primary" onclick="decision35()">Continue</button>', 'flex container, justify-center');
} // end f34

function decision35() { // enncounter success, prelude to boss fight
  gameConsole.innerHTML='';
  let bossHealth = 3; // initialize boss health for next encounter
  appendOutputConsole('p', 'After defeating the bicorn you make your way to the building where you thought you heard the voices. Now there seems to be only one voice, a female with a strong, assertive tone. You enter the building, and as you enter, you try to figure out where this woman is. In the buildings foyer, you hear another large rumbling. Something is coming, and it is much bigger than the previous two encounters');
  appendOutputConsole('div', '<button class="btn btn-primary" onclick="decision36()">Continue</button>', 'flex-container justify-center');

} // end f35

function decision36() { // begin boss fight
/* Boss fight mechanics: Boss will start with 3 health. Each round, its shield wil glow a color corresponding to an element. If the player picked the opposite color, he will do damage. If picks the same color, he will take damage. Anything else will have no effect */
// The biggest challenge in this mechanic actually comes from not running out of items. It is possible to get bad RNG and force yourself to take damage to change the bosses afinity

  gameConsole.innerHTML='';

  if(enableMusic == true) {
    bossBGM.play(); // play boss music
    insertedElement = document.createElement('button');
    insertedElement.setAttribute('onclick', 'muteMusic()');
    insertedElement.setAttribute('id', 'musicControl');
    insertedElement.setAttribute('class', 'btn btn-info btn-block');
    insertedElement.innerHTML = '<i class="fa fa-volume-off" aria-hidden="true"></i>';
    leftButtonArea.appendChild(insertedElement);
  }

  appendOutputConsole('p', '*Boss Fight*', 'text-center game');
  appendOutputConsole('h1', 'BERITH', 'text-center game');

  let bossHealthBar = ''; // put a string together of hearts for boss health
  for(let i=0; i<bossHealth; i++){
    bossHealthBar += '<i class="fa fa-heart" aria-hidden="true"></i>';
  }

  let shieldColor = '';
  switch (currAffinity) { // use the boss's affinity to determine the color of the shield being drawn
    case 0:
      shieldColor = 'text-danger';
      break;
    case 1:
      shieldColor = 'text-info';
      break;
    case 2:
      shieldColor = 'text-success';
      break;
    case 3:
      shieldColor = 'text-warning';
      break;
  } // end switch
  // draw shield with the color that he is strong against
  appendOutputConsole('p', '<i class="fa fa-shield" aria-hidden="true"></i>', 'text-center boss-shield ' + shieldColor);

  appendOutputConsole('p', 'Health: ' + bossHealthBar, 'game text-center');
  appendOutputConsole('p', 'This time, the shadow turns into a knight atop a floating horse, armed with a spear and shield. Of particular note is its shield: It is glowing a distinct color and you feel like this is going to be the key to the battle. You look over your inventory one last time and harden your resolve. One of you is walking away from this. ');

  currAffinity = Math.floor(Math.random() * 4); //determine bosses affinity.
  appendOutputConsole('p', 'The knight\'s shield is glowing ' + bossAffinity[currAffinity]);
  appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision41(0)">Use fire bottle</button><button class="btn btn-primary" onclick="decision41(1)">Use freeze spray</button>', 'flex-container justify-space-around');
  appendOutputConsole('div', '<button class="btn btn-success" onclick="decision41(2)">Use Air Cannon</button><button class="btn btn-warning" onclick="decision41(3)">Use Stun Gun</button>', 'flex-container justify-space-around');
} // end f36

function decision41(item) { // Player used item, check affinity for result and redraw
  //make sure player has the item before clearing screen
  if (inventoryCheck(elemInv, item) == false) {return;}
  elemInv[item][1]--;

// check if same affinity way used
  if(item == currAffinity){
    playerHealth--;
    drawHealthBar();
    decision41A();
    appendOutputConsole('p', 'The knight\'s shield is glowing ' + bossAffinity[currAffinity]);
    appendOutputConsole('p', 'Boss is strong against this element!');
    appendOutputConsole('p', '-1 HEALTH', 'text-center game');
    appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision41(0)">Use fire bottle</button><button class="btn btn-primary" onclick="decision41(1)">Use freeze spray</button>', 'flex-container justify-space-around');
    appendOutputConsole('div', '<button class="btn btn-success" onclick="decision41(2)">Use Air Cannon</button><button class="btn btn-warning" onclick="decision41(3)">Use Stun Gun</button>', 'flex-container justify-space-around');
    if(elemInv[0][1] + elemInv[1][1] + elemInv[2][1] + elemInv[3][1] == 0) { decision44(); return; }


  } else if ( (item == 0 && currAffinity == 1) || (item == 1 && currAffinity == 0) || (item == 2 && currAffinity == 3) || (item == 3 && currAffinity == 2) ) { // since opposite pairings are 0-2 and 1-3, we can just use remainder2 operator to check
    bossHealth--;
    if (bossHealth < 1) {  decision42(); return; } // check to see if boss is dead-text
    currAffinity = Math.floor(Math.random() * 4);
    decision41A();
    appendOutputConsole('p', 'You exploited a weakness and did some damage! But something is now different...');
    appendOutputConsole('p', 'The knight\'s shield is now glowing ' + bossAffinity[currAffinity]);
    appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision41(0)">Use fire bottle</button><button class="btn btn-primary" onclick="decision41(1)">Use freeze spray</button>', 'flex-container justify-space-around');
    appendOutputConsole('div', '<button class="btn btn-success" onclick="decision41(2)">Use Air Cannon</button><button class="btn btn-warning" onclick="decision41(3)">Use Stun Gun</button>', 'flex-container justify-space-around');
    if(elemInv[0][1] + elemInv[1][1] + elemInv[2][1] + elemInv[3][1] == 0) { decision44(); return; }

  } else {
    decision41A();
    appendOutputConsole('p', 'The item had no effect. Try something else.');
    appendOutputConsole('p', 'The knight\'s shield is glowing ' + bossAffinity[currAffinity]);
    appendOutputConsole('div', '<button class="btn btn-danger" onclick="decision41(0)">Use fire bottle</button><button class="btn btn-primary" onclick="decision41(1)">Use freeze spray</button>', 'flex-container justify-space-around');
    appendOutputConsole('div', '<button class="btn btn-success" onclick="decision41(2)">Use Air Cannon</button><button class="btn btn-warning" onclick="decision41(3)">Use Stun Gun</button>', 'flex-container justify-space-around');
    if(elemInv[0][1] + elemInv[1][1] + elemInv[2][1] + elemInv[3][1] == 0) { decision44(); return; }

  } // end iff
} //end f41

function decision41A() { //boss redraw
// check if player is out of items

  gameConsole.innerHTML='';
  appendOutputConsole('p', '*Boss Fight*', 'text-center game');
  appendOutputConsole('h1', 'BERITH', 'text-center game');
  let bossHealthBar = '';
  for(let i=0; i<bossHealth; i++){
    bossHealthBar += '<i class="fa fa-heart" aria-hidden="true"></i>';
  } // end for

  let shieldColor = '';
  switch (currAffinity) { // use the boss's affinity to determine the color of the shield being drawn
    case 0:
      shieldColor = 'text-danger';
      break;
    case 1:
      shieldColor = 'text-info';
      break;
    case 2:
      shieldColor = 'text-success';
      break;
    case 3:
      shieldColor = 'text-warning';
      break;
  } // end switch
  // draw shield with the color that he is strong against
  appendOutputConsole('p', '<i class="fa fa-shield" aria-hidden="true"></i>', 'text-center boss-shield ' + shieldColor);

  appendOutputConsole('p', 'Health: ' + bossHealthBar, 'text-center game');
} // f41a

function decision42() { // Boss defeated

  gameConsole.innerHTML='';
  appendOutputConsole('p', 'The boss begins to keel over. You prepare to empty the rest of your inventory on the thing when you are startled by the womans voice. You hear her yell "Go, Artemisia", and before you realize what\'s happening, the boss is enveloped in a giant ice cube, and then shatters to pieces.');
  appendOutputConsole('p', 'BOSS DEFEATED!!', 'text-center game');
  appendOutputConsole('div', '<button class="btn btn-primary" onclick="decision43()">Continue</button>', 'flex-container justify-center');
}

function decision43() { // encounter mitsuru, end game
  gameConsole.innerHTML='';
  if(enableMusic == true){ // stop music if its on
    bossBGM.pause();
    musicControl = document.getElementById('musicControl');
    musicControl.classList.add('invisible');
  }// end if

  appendOutputConsole('p', 'You look over to the woman and you are hit with a wave of exhaustion. All these encounters have clearly tired you out, and you cant go much farther. You drop to a knee, and as you do, the woman puts her hands on your shoulders. You look up at her; she has long, brunette hair and appears to be wearing what would appear to be a black battle suit except that on top of it she is wearing an extravagant whit fur coat. There is a fencing sword holstered inside her coat. One look at her face and you can tell she is some kind of leader, as she is exuding confidence and strength. She looks down to you and simply says, "My name is Mitsuru Kirijo, and I\'m going to get you out of here"');
  appendOutputConsole('p', 'TO BE CONTINUED...', 'text-center game');
}

function decision44() { //player ran out of items -- game over
gameConsole.innerHTML = '';
appendOutputConsole('p', 'You no longer have any items with which to fight the boss. As he approached you to attack, you are completely defenseless...');
appendOutputConsole('p', '** GAME OVER ** ', 'game text-center');
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

  if (!(inventoryBox.classList.contains('hide-inventory'))) {
    inventoryBox.classList.add('hide-inventory');
    inventoryBox.innerHTML = '';
    return;
  }

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

function critAnimation() {
  let critSound = new Audio('sound/persona5-crit.wav');
  critSound.play();
  jokerBox.classList.remove('hide-joker');
  setTimeout(function() {jokerBox.classList.add('done-joker');}, 1000);
  setTimeout(function() {jokerBox.classList.add('no-transition');}, 1020);
  setTimeout(function() {jokerBox.classList.add('hide-joker');}, 1040);
  setTimeout(function() {jokerBox.classList.remove('done-joker');}, 1060);
  setTimeout(function() {jokerBox.classList.remove('no-transition');}, 1080);
}

function inventoryCheck(invArr, item) { // makes sure that player has the item in question

  let checkResult = invArr[item][1] == 0 ? true : false; // is the item count 0? (t/f)

  if(checkResult) { // return false is they didnt posses the item, otherwise return true
    appendOutputConsole('p', 'You dont have any more of that item!', 'text-center dos');
    return false;}
  else {return true;}
}

function healthBonus() { // give the player 1 extra health provided they dont go above 4
  if (playerHealth < 4) {
    appendOutputConsole('p', 'After the monster disappears, a clear plastic bottle drops to the ground. How and why a monster like that was carrying a plastic bottle is mind-boggling, but as you go to pick it up, it emits an absolutely delicious scent. You can\'t help but to drink it immediately, and after doing so, you feel even stronger than before');
    playerHealth++;
    drawHealthBar();
    appendOutputConsole('p', '+1 HEALTH', 'game flex-container justify-center');
  }
}

function muteMusic() { // functionality for the mute button

  // enableMusic == true ? (
  //   bossBGM.pause(),
  //   enableMusic = false
  // ) : (
  //   bossBGM.play(),
  //   enableMusic = true
  // );
  // This shows i can use ternary operators, but it gives a linter error

  if(enableMusic==true) {
    bossBGM.pause();
    enableMusic = false;
  } else {
    bossBGM.play();
    enableMusic = true;
  } //end if
} //end muteMusic

// CHAPTER 2 !!!!!!

function clearScreen() { //function to clear screens
  gameConsole.innerHTML = '';
}

function showBattleScreen() {
  battleBox.style.display = 'block';
  battleBox.classList.remove('hide-battle');
}

// BATTLE ENGINE (IMPORTANT)

function beginBattleEngine(enemies) {
  currentEnemies = enemies;

  showBattleScreen(); //show the battle box
  drawPartyHealth(); //draw the party health bars
  drawEnemies(enemies); //draw the enemy section
  drawActionBars(); //draw the bottom bars
  getBattleOrder(enemies); // get the turn order based on agility
  let battleTurn = 0;
  let battleComplete = false;

  if(battleOrder[battleTurn] < 0) {battleEnemyturn(battleTurn);} else {battlePlayerTurn(battleOrder[battleTurn]);}

} //end begin battleengine

function battlePlayerTurn(turn, enemies) { //function that runs when it is a partymembers turn
  currentTurn = turn; // note the persons turn globally
  $('.action-box').html(`
  <div class="action-row" id="commandRow0">
    <div class="arrow-box" id="arrowBox0"></div>
    <p>Fight</p>
  </div>
  <div class="action-row" id="commandRow1">
    <div class="arrow-box" id="arrowBox1"></div>
    <p>Item</p>
  </div>
  <div class="action-row" id="commandRow2">
    <div class="arrow-box" id="arrowBox2"></div>
    <p>Skill</p>
  </div>

    `);  //end append

    drawArrow();

    window.addEventListener('keydown', commandBox); // allow keyboard and mouse countrols for command box
    document.querySelector('#commandRow0').addEventListener('click', playerFightTarget);
} //end battleplayerturn

function drawArrow() { // function to draw the arrow
  for(i=0; i<3; i++) { //resets all arrow boxes
    let loopTarget = 'arrowBox' + i; // note: because all boxes are labeled #arrowBox0 through arrowBox3, I can target individual boxes with concatenation -sic-
    let loopElement = document.querySelector('#' + loopTarget);
    loopElement.innerHTML = '';
  }

  let target = 'arrowBox' + currentArrow; // use the same technique to target a particular box with the var currentArrow
  let element = document.querySelector('#' + target);
  element.innerHTML = '<i class="fa fa-arrow-right" aria-hidden="true"></i>'; // ideally this would be an svg of an actual arrow LOL

} //end for

let currentArrow = 0; //defaults to the top item on start (had to scope it outside)

let commandBox = function(e){
    console.log(e); // listens for key presses


  if(e.key == 'ArrowDown') { //if they push the down arrow....
    currentArrow++; //increase the target by one
    if(currentArrow==3) {currentArrow=0} //this if makes sure it wraps around after you hit the bottom
    drawArrow(); //and redraw the arrow
  }

  if(e.key == 'ArrowUp') { // same thing, but going up this time
    currentArrow--;
    if(currentArrow==-1) {currentArrow=2}
    drawArrow();
  }

  if(e.key == 'Enter') { //if they press enter...
    switch(currentArrow) { //check and see what the arrow is currently set to and execute the appropriate alert
      case 0:
        let target = playerFightTarget('wpnatk');
        break;
      case 1:
        alert ('Item');
        break;
      case 2:
        alert ('Skill');
        break;

    } //end switch
  } //end if

}; // end commandbox

function playerFightTarget(type) { // function to select a target
  window.removeEventListener('keydown', commandBox); //remove keyboard commands for command box
  if(this.id=='commandRow0') {type = 'wpnatk';} // since values cant pe passed in event listeners without activating it, use 'this' to determine which row was selected therefore the attack type
  console.log(type);
  $('.description-box').html(`
    <p class="text-center dos">Click or select a target</p>
    <div class="flex-container justify-space-around" id="attack-target-container">
    </div>
    `); //end html

  for(let i=0; i<currentEnemies.length; i++) {
    console.log('appending...');
    $('#attack-target-container').append(`
      <div class="attack-target-box">
        <div class="attack-target-arrow"></div>
        <div class="attack-target-content${i}">${currentEnemies[i].name}</div>
      </div>
      `);
      document.querySelector('.attack-target-content' + i).addEventListener('click', function() {
        //console.log(`enemy ${i} selected`);
        $('.description-box').html(``);
        attackEnemy(i, type);
      });//end event listener
  } //end for
  $('#attack-target-container').append(`
    <div class="attack-target-box">
      <div class="attack-target-arrow"></div>
      <div class="attack-target-cancel">Cancel</div>
    </div>
    `);
    document.querySelector('.attack-target-cancel').addEventListener('click', function() { //in the event they cancel the target selection
      $('.description-box').html(``); // clear the description-box
      window.addEventListener('keydown', commandBox); //re-add mouse and keyboard listeneres for command box
      document.querySelector('#commandRow0').addEventListener('click', playerFightTarget);
    }); //end cancel event listener
} // end playerFightDamage

function attackEnemy(target, type) { //an action has been selected, and now a target has been selected
  console.log(`attack ${type}triggered on ${target}`);
  switch(type) {
    case 'wpnatk':
      let resistMod = 0;
      // determine damage, get variables first to make this easier to analyze later
      let level = party[currentTurn].level; // get actors level
      let str = party[currentTurn].str; //get actors strength star
      let wpnPow = party[currentTurn].weaponPwr // get power of equipped weaponPwr
      let damageMod = (Math.random() * 0.1) + 0.95; // random damage modifier, can be anwhere from 95% to 105%
      if(currentEnemies[target].resistStr.includes('pS') == true) { //check for physical resistence strength
        resistMod = 0.5; //50% damage reduction if strong against
      } else if (currentEnemies[target].resistStr.includes('pW') == true) { //check for weakness
        resistMod = 1.5 //50% damage boost
      } else if (currentEnemies[target].resistStr.includes('pN') == true)  {// check for null resist
        resistMod = 0; //100% damage resist
      } else if (currentEnemies[target].resistStr.includes('pD') == true)  {//check for drain phys
        resistMod = -0.75; //75% damage drained
      } else {
        resistMod = 1; //no change
      }
      let critCheck = Math.random();
      let critMod = critCheck > 0.9 ? 1.5 : 1.0;
      //DAMAGE FORUMLA
      let damage = 5 * Math.sqrt(level * (str + wpnPow) ) * damageMod * resistMod * critMod;

      //apply damage
      currentEnemies[target].currentHP -= damage;
      drawEnemies(); //redraw enemies
      $('#battle-damage-text' + target).html(`
        <p class="game">${party[currentTurn]} just did ${damage} damage!</p>
        `);

  } //end switch
}

function drawPartyHealth() { //function for drawing the party health in battle
  if(party.length == 1) { //if theres only 1 party member, draw health this way so its centered

    if(initialBattleDraw === true) { //if this is the first draw, then add containers and the like
      console.log(`partyboxappendtriggered, ${initialBattleDraw}`);
      $('#battleBox').append(`
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-4 col-sm-offset-4 party-member-box game text-center">
              <p>${party[0].name}</p>
              <p id="hp0-text">HP: ${party[0].currentHP}/${party[0].currentHP}</p>
              <p id="mp0-text">MP: ${party[0].currentMP}/${party[0].currentMP}</p>
            </div>
          </div>
        </div>
      `); //end append
      // Note: The reason the flag isnt switched here is because on the first battle draw, the party members draw will always be followed by the enemy and action bar draw. Therefore, resettig the initial draw flag is done on the last function
    } else { //otherwise just reset the content inside
      $('.party-member-box').html(`
        <p>${party[0].name}</p>
        <p id="hp0-text">HP: ${party[0].currentHP}/${party[0].currentHP}</p>
        <p id="mp0-text">MP: ${party[0].currentMP}/${party[0].currentMP}</p>
      `); //end .html
    } // end else
    if(party[0].currentHP / party[0].maxHP > 0.90) {
      $('#hp0-text').addClass('green-text');
    } //end health pct check
  } //end party length 1 check
} //end drawpartyhealth()

function drawEnemies(enemies) {
  if(currentEnemies.length == 1) {

    if(initialBattleDraw==true) { //same as drawing party, check to see if this is the first draw
      $('#battleBox').append(`
        <div class="enemy-container game flex-container text-uppercase align-center">
          <p>${currentEnemies[0].name}</p>
          <p id="enemy-health-text0">${Math.ceil(currentEnemies[0].currentHP/currentEnemies[0].maxHP * 100)}%</p>
          <p id="battle-damage-text0"></p>
        </div>
      `); // (if so, add containers) end append
    } else { //if not, just edit the innermost HTML
      $('.enemy-container').html(`
        <p>${currentEnemies[0].name}</p>
        <p id="enemy-health-text0">${Math.ceil(currentEnemies[0].currentHP/currentEnemies[0].maxHP * 100)}%</p>
        <p id="battle-damage-text0"></p>
      `);
    } //end initial draw check
    //console.log(enemies);
    let green = Math.ceil(currentEnemies[0].currentHP/currentEnemies[0].maxHP * 255);
    let red = 255 - green;
    document.querySelector('#enemy-health-text0').style.color = `rgb(${red}, ${green}, 0)`;
    document.querySelector('#enemy-health-text0').style.fontSize = '4em';
  } //end if
} //end function drawEnemies()

function drawActionBars() {
  if(initialBattleDraw==true) {
    $('#battleBox').append(`

        <div class="row">
          <div class="col-sm-3 col-sm-offset-1 action-box game"></div>
          <div class="col-sm-6 col-sm-offset-1 dos description-box"></div>
        </div>

    `);
    initialBattleDraw=false;
  } //end if
} //end function drawactionbars

function getBattleOrder(enemies) {
  let finalResult=999;
  let currentMaxAg=0;
  let iteration = 0;

  while(iteration<(party.length + enemies.length)) {

    for(let i=0; i<party.length; i++) { //figure out party member with highest ag
      if(party[i].ag>currentMaxAg && battleOrder.includes(i)==false ) {
        currentMaxAg = party[i].ag;
        finalResult = i;
      } //end if
    }//end for
    let enemyResult = -1;
    //console.log(`current max ag in party is ${party[finalResult].name} with a max ag of ${currentMaxAg}`);
    for(let i=0; i<enemies.length; i++) {
      if(enemies[i].ag>currentMaxAg && battleOrder.includes((i+1)*-1)==false){
        currentMaxAg = enemies[i].ag;
        finalResult = (i+1) * -1;
      }
    } //end For
    //console.log(`enemycheck complete`);
    //console.log(`end result is ${finalResult} and ag ${currentMaxAg}`);
    currentMaxAg=0;
    battleOrder.push(finalResult);
    //console.log(battleOrder);
    iteration++;
  }//end while

} //end function getbattleorder

function section200() { //begin chapter two
  clearScreen();
  appendOutputConsole('p', 'Blah blah blah talk talk talk give this man a sword and lets fight..');
  appendOutputConsole('div', '<button class="btn btn-primary" id="continue200">Continue</button>', 'flex-container justify-center');
  protag.name = playerName; //set the playername in his object, and add him to the party
  if(protag.name == '') {protag.name = 'Protag';}
  // give protag basic weapon and armor and equip
  protag.weaponObj = 'ironSword';
  protag.armorObj = 'plainClothes';
  protag.currentWeapon = inventory.weapons[protag.weaponObj].name;
  protag.currentArmor = inventory.armor[protag.armorObj].name;
  protag.weaponPwr = inventory.weapons[protag.weaponObj].attackPow;
  protag.armorPwr = inventory.weapons[protag.weaponObj].defensePow;
  party.push(protag);

  document.querySelector('#continue200').addEventListener('click', section201);
}

function section201() { //initial battle test
  //declare monsters for fight
  willpowerBGM.play();


  beginBattleEngine([enemyUkobach]);

}
