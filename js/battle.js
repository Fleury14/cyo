/*jshint esversion: 6 */
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
    if(currentArrow==3) {currentArrow=0;} //this if makes sure it wraps around after you hit the bottom
    drawArrow(); //and redraw the arrow
  }
  if(e.key == 'ArrowUp') { // same thing, but going up this time
    currentArrow--;
    if(currentArrow==-1) {currentArrow=2;}
    drawArrow();
  }
  if(e.key == 'Enter') { //if they press enter...
    switch(currentArrow) { //check and see what the arrow is currently set to and execute the appropriate alert
      case 0:
        let target = playerFightTarget('wpnatk');
        break;
      case 1:
        useItem();
        break;
      case 2:
        useSkill();
        break;

    } //end switch
  } //end if

}; // end commandbox

//TYPES OF ATTACKS TO PASS TO TARGET
// 'wpnatk' -- basic fight command
// 'elem1x' -- level 1 elemental item with x being the element type

function playerFightTarget(type) { // function to select a target
  console.log(type);
  if(this.id=='commandRow0') {type = 'wpnatk';} // since values cant pe passed in event listeners without activating it, use 'this' to determine which row was selected therefore the attack type
  window.removeEventListener('keydown', commandBox); //remove keyboard commands for command box
  $('.description-box').html(`
    <p class="text-center dos">Click or select a target</p>
    <div class="flex-container justify-space-around" id="attack-target-container">
    </div>
    `); //end html

  for(let i=0; i<currentEnemies.length; i++) {
    //console.log('appending...');
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
  let damage = 0;
  switch(type) {
    case 'wpnatk':
      $('.description-box').html(`${party[currentTurn].name} is attacking...`);
      let resistMod = 0;
      // determine damage, get variables first to make this easier to analyze later
      let level = party[currentTurn].level; // get actors level
      let str = party[currentTurn].str; //get actors strength star
      let wpnPow = party[currentTurn].weaponPwr; // get power of equipped weaponPwr
      let damageMod = (Math.random() * 0.1) + 0.95; // random damage modifier, can be anwhere from 95% to 105%
      if(currentEnemies[target].resistStr.includes('pS') == true) { //check for physical resistence strength
        resistMod = 0.5; //50% damage reduction if strong against
      } else if (currentEnemies[target].resistStr.includes('pW') == true) { //check for weakness
        resistMod = 1.5; //50% damage boost
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
      damage = 5 * Math.sqrt(level * (str + wpnPow) ) * damageMod * resistMod * critMod;
      damage = Math.round(damage);

      //apply damage, use a time out for effect
      setTimeout(function() {
        currentEnemies[target].currentHP -= damage;
        drawEnemies(); //redraw enemies
        $('#battle-damage-text' + target).html(`
          <p class="game">${party[currentTurn].name} just did ${damage} damage!</p>
          `);
        if(critMod>1){$('battle-damage-text' + target).append(`<p>Critical Hit</p>`);}
        nextTurn(); // next persons turn
      }, 1000); //1s delay on damage draw.
      break;
    case 'elem1f':
    case 'elem1i':
    case 'elem1w':
    case 'elem1l':
      $('.description-box').html(`${party[currentTurn].name} uses an elemental item`);
      damage = 50; //base 50 damage for level 1 elemental items
      let elementFor = type.charAt(type.length-1); //get the element type from the string
      //check the enemy targets resistance str for any damage modifiers
      if(currentEnemies[target].resistStr.includes(`${elementFor}W`) == true) { //weak agasint
        damage *= 1.5; //50% bonus
        $('.description-box').append(`<p>You exploited a weakness!!</p>`);
      } else if (currentEnemies[target].resistStr.includes(`${elementFor}S`) == true) { //strong against
        damage *= 0.5; //50% penalty
        $('.description-box').append(`<p>It's strong against that element...</p>`);
      } else if(currentEnemies[target].resistStr.includes(`${elementFor}N`) == true) { //nulls element
        damage = 0; //100% penalty
        $('.description-box').append(`<p>It blocks that element completely</p>`);
      } else if(currentEnemies[target].resistStr.includes(`${elementFor}D`) == true) {//drains element
        damage *= -0.75; //enemy is healed for 75% of the damage
      }
      //apply damage, use a time out for effect
      setTimeout(function() {
        currentEnemies[target].currentHP -= damage;
        drawEnemies(); //redraw enemies
        $('#battle-damage-text' + target).html(`
          <p class="game">${party[currentTurn].name} just did ${damage} damage!</p>
          `);
        nextTurn(); // next persons turn
      }, 1000); //1s delay on damage draw.
      break;

  } //end switch
} //end attack enemy

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

function useItem() { //function when player selects item from the command list
 $(inventoryBox).html(`Click on an item to select it`);
 let inventoryBoxId = 0;
 inventoryBox.classList.remove('hide-inventory');
 window.removeEventListener('keydown', commandBox); //remove keyboard commands for command box
 for (let item in inventory.battleItems) { //use for in to cycle through inventory items and display anything > 0
   if(inventory.battleItems[item].numOwned>0) {
     $(inventoryBox).append(`<p id="invMenu${inventoryBoxId}" class="${item}">${inventory.battleItems[item].name}: ${inventory.battleItems[item].numOwned}</p>`);
     document.querySelector('#invMenu' + inventoryBoxId).addEventListener('click', selectItem); // then ad a listener to each Item
     inventoryBoxId++;
   }
 } //end for in
 $(inventoryBox).append(`<button id="btnHideInv" class="btn btn-warning flex-container justify-center dos">Hide Inventory</button>`);
 document.querySelector('#btnHideInv').addEventListener('click', cancelItem);

} //end useItem

function cancelItem() {
  inventoryBox.classList.add('hide-inventory'); //shift box over
  let inventoryDelay = setTimeout(function() {inventoryBox.innerHTML = '';}, 250); // empty content
  window.addEventListener('keydown', commandBox); // allow keyboard and mouse countrols for command box

} //end cancel item

function selectItem(event) { //after a user clicks on an item, the appropriate action for each item must be determined
    console.log(event.target.className);
    let currentItemObj = {};
    inventoryBox.classList.add('hide-inventory'); //shift box over

    for (let item in inventory.battleItems) { //going to use for..in to cycle through items and mark when its a match. each item has been given a class name that should match up to the item in the inventory object
      if(event.target.className == item) { //now that we've matched it up, lets create an object with all the necessary info
        console.log(`item ${item} matches up with clicked event ${event.target.className}. we did it!`);
        inventory.battleItems[item].numOwned--;
        switch(item) {
          case 'fireBottle':
            playerFightTarget('elem1f');
            break;
          case 'freezeSpray':
            playerFightTarget('elem1i');
            break;
          case 'airCannon':
            playerFightTarget('elem1w');
            break;
          case 'stunGun':
            playerFightTarget('elem1l');
            break;
        }
      }//end if
    }//end for..in
} //end selectItem

function useSkill() { //player selected skill on the command menu. we will use the inventory box for this.
  $(inventoryBox).html(`Click on an item to select it`); // clear inventory box and add header
  let inventoryBoxId = 0;
  inventoryBox.classList.remove('hide-inventory');
  window.removeEventListener('keydown', commandBox); //remove keyboard commands for command box
  $(inventoryBox).append(`
    <div class="container" id="skillList">
      <div class="row">
        <div class="col-sm-2 text-center game">Elem</div>
        <div class="col-sm-3 text-center game">Name</div>
        <div class="col-sm-2 text-center game">Cost</div>
        <div class="col-sm-5 text-center game">Description</div>
      </div>
    </div>
    `);
  for(let ability in party[currentTurn].abilityList) {
    console.log(ability);
  }

}
