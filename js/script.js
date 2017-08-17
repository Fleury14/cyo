/*jshint esversion: 6 */

// Variable Initialization
let playerHealth = 3; // Players Health
let gameConsole = document.getElementById('gameConsole');
let lifeBar = document.getElementById('life-bar');
let consoleButtonRow = ''; // cant use getelement becuase it hasnt been created yet, but declaring up here to avoid multipole declarations

let insertedElement = '';
let elementTarget = '';


drawHealthBar();

function drawHealthBar() { // Function to refresh the health bar

  lifeBar.innerHTML = ""; // Remove health bar to redraw

  if (playerHealth === 0) { // if health = 0, uh oh

  lifeBar.innerHTML = 'DANGER';

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

gameConsole.innerHTML = 'Correct decision';

}

function decision12() {
// Player chose to not go through the door. peanlty is one life. failure to answer correctly will result in instant death

playerHealth--;
drawHealthBar();

gameConsole.innerHTML = 'You decide that floating doors are a little to weird for you and turn your attention to the world around you. As you leave the room you are in, you hear a rumbling sound approaching. Before you have time to react, a greyish floating blob appears before you with a mask attached that has the letters II attached to its forehead. It rapidly approaches you and as you brace yourself it passes right through you. There is a small pain felt, but more importantly than that you feel far more tired than before. That cannot happen again. You immediately retreat to find the blue door still there, this time emitting a small hum. Whatever that blob thing was, it is sure to return.';

}
