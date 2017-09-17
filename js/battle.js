/*jshint esversion: 6 */
// BATTLE ENGINE (IMPORTANT)

function beginBattleEngine(enemies) {
  currentEnemies = enemies;

  showBattleScreen(); //show the battle box
  drawPartyHealth(); //draw the party health bars
  drawEnemies(enemies); //draw the enemy section
  drawActionBars(); //draw the bottom bars
  getBattleOrder(enemies); // get the turn order based on agility
  let battleComplete = false;
  currentTurn = 0;
  if(battleOrder[currentTurn] < 0) {
    $(`.enemy${e2p(currentTurn)}`).addClass('current-turn-border');
    battleEnemyturn(currentTurn);
  } //end enemy turn
  else {
    $('.party' + currentTurn).addClass('current-turn-border');
    battlePlayerTurn(battleOrder[currentTurn]);
    $('.description-box').html(`It is ${party[currentTurn].name}'s turn, select an action.`);
  }

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
  <div class="action-row" id="commandRow3">
    <div class="arrow-box" id="arrowBox3"></div>
    <p>Defend</p>
  </div>

    `);  //end append

    drawArrow();

    window.addEventListener('keydown', commandBox); // allow keyboard and mouse countrols for command box
    document.querySelector('#commandRow0').addEventListener('click', playerFightTarget);
    document.querySelector('#commandRow1').addEventListener('click', useItem);
    document.querySelector('#commandRow2').addEventListener('click', useSkill);
    document.querySelector('#commandRow3').addEventListener('click', playerGuard);

} //end battleplayerturn

function drawArrow() { // function to draw the arrow
  for(i=0; i<4; i++) { //resets all arrow boxes
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
    gameSound.sfx.cursorBeep.play();
    currentArrow++; //increase the target by one
    if(currentArrow==4) {currentArrow=0;} //this if makes sure it wraps around after you hit the bottom
    drawArrow(); //and redraw the arrow
  }
  if(e.key == 'ArrowUp') { // same thing, but going up this time
    currentArrow--;
    gameSound.sfx.cursorBeep.play();
    if(currentArrow==-1) {currentArrow=3;}
    drawArrow();
  }
  if(e.key == 'Enter') { //if they press enter...
    gameSound.sfx.beep.play();
    switch(currentArrow) { //check and see what the arrow is currently set to and execute the appropriate alert
      case 0:
        playerFightTarget('wpnatk');
        break;
      case 1:
        useItem();
        break;
      case 2:
        useSkill();
        break;
      case 3:
        playerGuard();
        break;

    } //end switch
  } //end if

}; // end commandbox

function partySelectTarget(skill) { //function for selecting a party target
  $('.description-box').html(`
    <p class="text-center dos">Please select a target</p>
    <div class="flex-container justify-space-around game" id="partySelectRow"></div>
    `);
  for(let i=0; i<party.length; i++) {
    $('#partySelectRow').append(`
      <button class="btn btn-success" id="partymember${i}">${party[i].name}</button>
      `);
    document.querySelector('#partymember' + i).addEventListener('click', function() {
      $('.description-box').html(``);
      partySkillUse(skill, i);
    });
  } //end for
  //console.log('test');
  $('#partySelectRow').append(`<button id="target-cancel" class="button btn-warning">Cancel</button>`);
  document.querySelector('#target-cancel').addEventListener('click', function() {
    $('.description-box').html(``);
    window.addEventListener('keydown', commandBox); //re-add mouse and keyboard listeneres for command box
    document.querySelector('#commandRow0').addEventListener('click', playerFightTarget);
    document.querySelector('#commandRow1').addEventListener('click', useItem);
    document.querySelector('#commandRow2').addEventListener('click', useSkill);
    document.querySelector('#commandRow3').addEventListener('click', playerGuard);

  });
}//end partySelectTarget

//heal skill formula healpow + (level * mag)

function partySkillUse(skill, target) {
  //console.log(skill, target);
  switch(skill) {
    case 'dia':
      if(party[currentTurn].currentMP < abilityList[skill].mpCost) {
        $('.description-box').html(`<p class="game">You don't have enough MP for this skill!</p>`);
        break;
      } else {
        cancelItem(); // hide skill box
        $(inventoryBox).html(``); //and empty it
        party[currentTurn].currentMP -= abilityList[skill].mpCost;
        let healResult = abilityList[skill].healPow;
        healResult = healResult + (party[currentTurn].mag * party[currentTurn].level);
        $('.description-box').html(`${party[currentTurn].name} used ${skill}...`);
        setTimeout(function() {
          party[target].currentHP += healResult;
          if(party[target].currentHP > party[target].maxHP) {party[target].currentHP = party[target].maxHP;}
          $('.description-box').html(`<p class="game">${party[target].name} is healed for ${healResult} HP.`);
          drawPartyHealth();
        }, 2000);
        setTimeout(function() {nextTurn();}, 3000);
        break;
      } //end mp check
  }//end switch
}//end partySkillUse

//TYPES OF ATTACKS TO PASS TO TARGET
// 'wpnatk' -- basic fight command
// 'elem1x' -- level 1 elemental item with x being the element type
// physskill magskill -- skills of a physical or magic variety
function playerFightTarget(type, skill) { // function to select a target
  //console.log(type);
  if(this.id=='commandRow0') {type = 'wpnatk';} // since values cant pe passed in event listeners without activating it, use 'this' to determine which row was selected therefore the attack type
  window.removeEventListener('keydown', commandBox); //remove keyboard commands for command box
  $('.description-box').html(`
    <p class="text-center dos">Click or select a target</p>
    <div class="flex-container justify-space-around" id="attack-target-container">
    </div>
    `); //end html

  for(let i=0; i<currentEnemies.length; i++) {
    console.log('appending targets...');
    $('#attack-target-container').append(`
      <div class="attack-target-box">
        <div class="attack-target-arrow"></div>
        <div class="attack-target-content${i}">${currentEnemies[i].name}</div>
      </div>
      `);
      document.querySelector('.attack-target-content' + i).addEventListener('click', function() {
        //console.log(`enemy ${i} selected`);
        gameSound.sfx.cursorBeep.play();
        $('.description-box').html(``);
        attackEnemy(i, type, skill);
      });//end event listener
  } //end for
  $('#attack-target-container').append(`
    <div class="attack-target-box">
      <div class="attack-target-arrow"></div>
      <div class="attack-target-cancel">Cancel</div>
    </div>
    `);
    document.querySelector('.attack-target-cancel').addEventListener('click', function() { //in the event they cancel the target selection
      gameSound.sfx.doubleBeep.play();
      $('.description-box').html(``); // clear the description-box
      window.addEventListener('keydown', commandBox); //re-add mouse and keyboard listeneres for command box
      document.querySelector('#commandRow0').addEventListener('click', playerFightTarget);
      document.querySelector('#commandRow1').addEventListener('click', useItem);
      document.querySelector('#commandRow2').addEventListener('click', useSkill);
      document.querySelector('#commandRow3').addEventListener('click', playerGuard);

    }); //end cancel event listener
} // end playerFightDamage

function attackEnemy(target, type, skill) { //an action has been selected, and now a target has been selected
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
        gameSound.sfx.hit1.play();
        $('#battle-damage-text' + target).html(`
          <p class="game">${party[currentTurn].name} just did ${damage} damage!</p>
          `);
        if(critMod>1){$('battle-damage-text' + target).append(`<p>Critical Hit</p>`);}
        nextTurn(); // next persons turn
      }, 1000); //1s delay on damage draw.
      setTimeout(function() {$('#battle-damage-text' + target).html(``);}, 2000); //2s delay on clear
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
      setTimeout(function() {$('#battle-damage-text' + target).html(``);}, 2000); //2s delay on clear

      break;

    case 'physskill': //start with a check if they have enough HP to use the skill
      if(party[currentTurn].currentHP < party[currentTurn].maxHP*abilityList[skill].hpCost) {
        $('.description-box').html(`You don't have enough HP to use this skill.`);
      } else {
        cancelItem();
        $(inventoryBox).html(``);
        $('.description-box').html(`${party[currentTurn].name} uses ${skill}...`);
        party[currentTurn].currentHP -= Math.round(party[currentTurn].maxHP * abilityList[skill].hpCost);
        drawPartyHealth();
        let resistMod = 0;
        // determine damage, get variables first to make this easier to analyze later
        let level = party[currentTurn].level; // get actors level
        let str = party[currentTurn].str; //get actors strength star
        let wpnPow = party[currentTurn].weaponPwr; // get power of equipped weaponPwr
        let damageMod = (Math.random() * 0.1) + 0.95; // random damage modifier, can be anwhere from 95% to 105%
        let skillPow = abilityList[skill].atkPow;
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
        damage = 5 * Math.sqrt(level * (str + wpnPow) ) * damageMod * skillPow * resistMod * critMod;
        damage = Math.round(damage);

        //apply damage, use a time out for effect
        setTimeout(function() {
          currentEnemies[target].currentHP -= damage;
          drawEnemies(); //redraw enemies
          $('#battle-damage-text' + target).html(`
            <p class="game">${party[currentTurn].name} just did ${damage} damage!</p>
            `);
          nextTurn(); // next persons turn
        }, 1000); //1s delay on damage draw.
        setTimeout(function() {$('#battle-damage-text' + target).html(``);}, 2000); //2s delay on clear
      }//end hp check
      break;

    case 'magskill':
      if(party[currentTurn].currentMP < abilityList[skill].mpCost) {
        $('description-box').html(`<p class="game">You don't have enough MP for this skill</p>`);
        break;
      } else {
        $('.description-box').html(`${party[currentTurn].name} used ${skill}!!`);
        cancelItem();
        let damage = 0;
        let resistMod = 0;
        let damageMod = (Math.random() * 0.1) + 0.95; // random damage modifier, can be anwhere from 95% to 105%
        if(currentEnemies[target].resistStr.includes(`${abilityList[skill].element}S`) == true) { //check for physical resistence strength
          resistMod = 0.5; //50% damage reduction if strong against
        } else if (currentEnemies[target].resistStr.includes(`${abilityList[skill].element}W`) == true) { //check for weakness
          resistMod = 1.5; //50% damage boost
        } else if (currentEnemies[target].resistStr.includes(`${abilityList[skill].element}N`) == true)  {// check for null resist
          resistMod = 0; //100% damage resist
        } else if (currentEnemies[target].resistStr.includes(`${abilityList[skill].element}D`) == true)  {//check for drain phys
          resistMod = -0.75; //75% damage drained
        } else {
          resistMod = 1; //no change
        }
        //damage = atkpow + (level * mag)
        damage = abilityList[skill].atkPow + (party[currentTurn].level * party[currentTurn].mag);
        // then * damage modifier and resistence. mag skills cannot crit
        damage = Math.round(damage * resistMod * damageMod);

        //apply damage, use a time out for effect
        setTimeout(function() {
          currentEnemies[target].currentHP -= damage;
          drawEnemies(); //redraw enemies
          $('#battle-damage-text' + target).html(`
            <p class="game">${party[currentTurn].name} just did ${damage} damage!</p>
            `);
          nextTurn(); // next persons turn
        }, 1000); //1s delay on damage draw.
        setTimeout(function() {$('#battle-damage-text' + target).html(``);}, 2000); //2s delay on clear
        break;
      }


  } //end switch
} //end attack enemy

function drawPartyHealth() { //function for drawing the party health in battle
  if(party.length == 1) { //if theres only 1 party member, draw health this way so its centered
    if(party[0].currentHP<0) {party[0].currentHP = 0;}
    if(initialBattleDraw === true) { //if this is the first draw, then add containers and the like
      console.log(`partyboxappendtriggered, ${initialBattleDraw}`);
      $('#battleBox').append(`
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-4 col-sm-offset-4 party0 party-member-box game text-center">
              <p>${party[0].name}</p>
              <p id="hp0-text">HP: ${party[0].currentHP}/${party[0].maxHP}</p>
              <p id="mp0-text">MP: ${party[0].currentMP}/${party[0].maxMP}</p>
            </div>
          </div>
        </div>
      `); //end append
      // Note: The reason the flag isnt switched here is because on the first battle draw, the party members draw will always be followed by the enemy and action bar draw. Therefore, resettig the initial draw flag is done on the last function
    } else { //otherwise just reset the content inside
      console.log('redraw triggered');
      $('.party-member-box').html(`
        <p>${party[0].name}</p>
        <p id="hp0-text">HP: ${party[0].currentHP}/${party[0].maxHP}</p>
        <p id="mp0-text">MP: ${party[0].currentMP}/${party[0].maxMP}</p>
      `); //end .html
    } // end else
    if(party[0].currentHP / party[0].maxHP > 0.90) {
      $('#hp0-text').addClass('green-text');
    } //end health pct check
  } else if(party.length==2) {//end party length 1 check
    if(party[0].currentHP<0) {party[0].currentHP = 0;}
    if(party[1].currentHP<0) {party[1].currentHP = 0;}
    if(initialBattleDraw === true) { //if this is the first draw, then add containers and the like
      console.log(`partyboxappendtriggered, ${initialBattleDraw}`);
      $('#battleBox').append(`
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-3 col-sm-offset-3 party-member-box game text-center party0">
              <p>${party[0].name}</p>
              <p id="hp0-text">HP: ${party[0].currentHP}/${party[0].maxHP}</p>
              <p id="mp0-text">MP: ${party[0].currentMP}/${party[0].maxMP}</p>
            </div>
            <div class="col-sm-3 party-member-box game text-center party1">
              <p>${party[1].name}</p>
              <p id="hp1-text">HP: ${party[1].currentHP}/${party[1].maxHP}</p>
              <p id="mp1-text">MP: ${party[1].currentMP}/${party[1].maxMP}</p>
            </div>
          </div>
        </div>
      `); //end append
      // Note: The reason the flag isnt switched here is because on the first battle draw, the party members draw will always be followed by the enemy and action bar draw. Therefore, resettig the initial draw flag is done on the last function
    } else { //otherwise just reset the content inside
      //console.log('redraw triggered');
      $('.party0').html(`
        <p>${party[0].name}</p>
        <p id="hp0-text">HP: ${party[0].currentHP}/${party[0].maxHP}</p>
        <p id="mp0-text">MP: ${party[0].currentMP}/${party[0].maxMP}</p>
      `); //end .html
      $('.party1').html(`
        <p>${party[1].name}</p>
        <p id="hp1-text">HP: ${party[1].currentHP}/${party[1].maxHP}</p>
        <p id="mp1-text">MP: ${party[1].currentMP}/${party[1].maxMP}</p>
      `); //end .html
    } // end else
    for(i=0;i<2;i++){
      if(party[i].currentHP / party[i].maxHP > 0.90) {
        $(`#hp${i}-text`).addClass(`green-text`);
      } //end health pct check
    }
  }
} //end drawpartyhealth()

function drawEnemies(enemies) {
  if(currentEnemies.length == 1) {

    if(initialBattleDraw==true) { //same as drawing party, check to see if this is the first draw
      if(currentEnemies[0].currentHP<0) {currentEnemies[0].currentHP=0;}
      $('#battleBox').append(`
        <div class="enemy-container game flex-container enemy0 text-uppercase align-center">
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
  }  else if(currentEnemies.length==2) {
    if(currentEnemies[0].currentHP<0) {console.log('neg hp triggered');currentEnemies[0].currentHP=0;}
    if(currentEnemies[1].currentHP<0) {currentEnemies[1].currentHP=0;}
    if(initialBattleDraw==true) { //same as drawing party, check to see if this is the first draw

      $('#battleBox').append(`
        <div class="container-fluid"></div class="row"><div class="col-sm-6">
            <div class="enemy-container enemy0 game flex-container text-uppercase align-center">
              <p>${currentEnemies[0].name}</p>
              <p id="enemy-health-text0">${Math.ceil(currentEnemies[0].currentHP/currentEnemies[0].maxHP * 100)}%</p>
              <p id="battle-damage-text0"></p>
            </div>
          </div><div class="col-sm-6">
            <div class="enemy-container enemy1 game flex-container text-uppercase align-center">
              <p>${currentEnemies[1].name}</p>
              <p id="enemy-health-text1">${Math.ceil(currentEnemies[1].currentHP/currentEnemies[1].maxHP * 100)}%</p>
              <p id="battle-damage-text1"></p>
            </div>
          </div></div></div>
      `); // (if so, add containers) end append
    } else { //if not, just edit the innermost HTML
      $('.enemy0').html(`
        <p>${currentEnemies[0].name}</p>
        <p id="enemy-health-text0">${Math.ceil(currentEnemies[0].currentHP/currentEnemies[0].maxHP * 100)}%</p>
        <p id="battle-damage-text0"></p>
      `);
      $('.enemy1').html(`
        <p>${currentEnemies[1].name}</p>
        <p id="enemy-health-text1">${Math.ceil(currentEnemies[1].currentHP/currentEnemies[1].maxHP * 100)}%</p>
        <p id="battle-damage-text1"></p>
      `);
    } //end initial draw check
    //console.log(enemies);
    for(let i=0; i<2; i++) {
      let green = Math.ceil(currentEnemies[i].currentHP/currentEnemies[i].maxHP * 255);
      let red = 255 - green;
      document.querySelector('#enemy-health-text' + i).style.color = `rgb(${red}, ${green}, 0)`;
      document.querySelector('#enemy-health-text' + i).style.fontSize = '4em';
    } //end for
  } else if(currentEnemies.length == 3) {
    if(currentEnemies[0].currentHP<0) {console.log('neg hp triggered');currentEnemies[0].currentHP=0;}
    if(currentEnemies[1].currentHP<0) {currentEnemies[1].currentHP=0;}
    if(currentEnemies[2].currentHP<0) {currentEnemies[2].currentHP=0;}
    if(initialBattleDraw==true) { //same as drawing party, check to see if this is the first draw

      $('#battleBox').append(`
        <div class="container-fluid"></div class="row"><div class="col-sm-4">
            <div class="enemy-container enemy0 game flex-container text-uppercase align-center">
              <p>${currentEnemies[0].name}</p>
              <p id="enemy-health-text0">${Math.ceil(currentEnemies[0].currentHP/currentEnemies[0].maxHP * 100)}%</p>
              <p id="battle-damage-text0"></p>
            </div>
          </div><div class="col-sm-4">
            <div class="enemy-container enemy1 game flex-container text-uppercase align-center">
              <p>${currentEnemies[1].name}</p>
              <p id="enemy-health-text1">${Math.ceil(currentEnemies[1].currentHP/currentEnemies[1].maxHP * 100)}%</p>
              <p id="battle-damage-text1"></p>
            </div>
          </div><div class="col-sm-4">
              <div class="enemy-container enemy2 game flex-container text-uppercase align-center">
                <p>${currentEnemies[2].name}</p>
                <p id="enemy-health-text2">${Math.ceil(currentEnemies[2].currentHP/currentEnemies[2].maxHP * 100)}%</p>
                <p id="battle-damage-text2"></p>
              </div>
          </div></div></div>
      `); // (if so, add containers) end append
    } else { //if not, just edit the innermost HTML
      $('.enemy0').html(`
        <p>${currentEnemies[0].name}</p>
        <p id="enemy-health-text0">${Math.ceil(currentEnemies[0].currentHP/currentEnemies[0].maxHP * 100)}%</p>
        <p id="battle-damage-text0"></p>
      `);
      $('.enemy1').html(`
        <p>${currentEnemies[1].name}</p>
        <p id="enemy-health-text1">${Math.ceil(currentEnemies[1].currentHP/currentEnemies[1].maxHP * 100)}%</p>
        <p id="battle-damage-text1"></p>
      `);
      $('.enemy2').html(`
        <p>${currentEnemies[2].name}</p>
        <p id="enemy-health-text2">${Math.ceil(currentEnemies[2].currentHP/currentEnemies[2].maxHP * 100)}%</p>
        <p id="battle-damage-text2"></p>
      `);
    } //end initial draw check
    //console.log(enemies);
    for(let i=0; i<3; i++) {
      let green = Math.ceil(currentEnemies[i].currentHP/currentEnemies[i].maxHP * 255);
      let red = 255 - green;
      document.querySelector('#enemy-health-text' + i).style.color = `rgb(${red}, ${green}, 0)`;
      document.querySelector('#enemy-health-text' + i).style.fontSize = '4em';
    } //end for
  }//end enemy# if
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
    console.log(`iteration total (party+enemies) = ${party.length + enemies.length}`);
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
    if(finalResult<999) {battleOrder.push(finalResult);}
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
  gameSound.sfx.doubleBeep.play();
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
  $(inventoryBox).html(`<p class="text-warning">Click on an item to select it</p>`); // clear inventory box and add header
  let skillBoxId = 0;
  inventoryBox.classList.remove('hide-inventory');
  window.removeEventListener('keydown', commandBox); //remove keyboard commands for command box
  $(inventoryBox).append(`
    <div class="container-fluid" id="skillList">
      <div class="row">
        <div class="col-sm-2 text-center text-info game">Elem</div>
        <div class="col-sm-3 text-center text-info game">Name</div>
        <div class="col-sm-2 text-center text-info game">Cost</div>
        <div class="col-sm-5 text-center text-info game">Description</div>
      </div>
    </div>
    `);
  for(let ability in party[currentTurn].abilityList) {
    //console.log(ability);
    $('#skillList').append(`
      <div id="skillBox${skillBoxId}" class="row" title="${ability}">
        <div class="col-sm-2 text-center skill-list game">${elementIcon(party[currentTurn].abilityList[ability].element)}</div>
        <div class="col-sm-3 text-center skill-list game">${party[currentTurn].abilityList[ability].name}</div>
        <div class="col-sm-2 text-center skill-list game">${displayCost(party[currentTurn].abilityList[ability])}</div>
        <div class="col-sm-5 text-center skill-list dos">${party[currentTurn].abilityList[ability].description}</div>
      </div>
      `);
      document.querySelector('#skillBox' + skillBoxId).addEventListener('click', selectSkill);
      skillBoxId++;
  } //end for
  $(inventoryBox).append(`<button id="btnHideInv" class="btn btn-warning flex-container justify-center dos skill-cancel-button">Cancel</button>`);
  document.querySelector('#btnHideInv').addEventListener('click', cancelItem);

}

function selectSkill(event) {
  console.log(event.target.parentElement.title);
  for(let skill in abilityList) {
    if(event.target.parentElement.title == skill) {
      console.log(`we have a match with ${skill}`);
      if(abilityList[skill].attackType == 2) {
        partySelectTarget(skill);
      } else if(abilityList[skill].attackType == 1) {
        playerFightTarget('magskill', skill);
      } else if(abilityList[skill].attackType == 0) {
        playerFightTarget('physskill', skill);
      } // end if else
    } //end matching skill if
  } //end for..in
} //end function selectSkill

function nextTurn() {
  //check to see if the party is dead
  let gameOver = true; //set the flag to true and then go over each party members hp
  party.forEach(function(i) { //if just one of them has hp over 0, switch the flag
    console.log(i.currentHP);
    if(i.currentHP>0) {gameOver=false;}
  });
  if(gameOver==true) { //game over man
    document.querySelector('#resultCont').classList.remove('hide-battle');
    $('.result-top').append(`
      <p class="game game-over-text">GAME OVER</p>
      `);
    document.querySelector('.game-over-text').style.fontSize = '72px';
    $('.result-bottom').html(``);
  } //end gameover
  let victory = true; //now do the same with the enemy
  currentEnemies.forEach(function(i) {
    if(i.currentHP>0) {victory=false;}
  }); //end forEach
  if(victory==true) {//battle complete
    //reset battle params
    document.querySelector('#resultCont').classList.remove('hide-battle');
    initialBattleDraw=true; //allow initial draw
    $(battleBox).html(``); //clear the box
    currentEnemies.forEach(function(e){
      e.currentHP=e.maxHP;
      e.currentMP=e.maxMP;
      battleOrder = [];
    });

    let totalXP = 0;
    let totalMunz = 0;
    currentEnemies.forEach(function(e) { //use forEach to total up xp and money from battle
      totalXP += e.xp;
      totalMunz += e.money;
    }); //end forEach
    $('.result-top').append(`
      <p class="game game-over-text">VICTOR-Y!!</p>
      <h3 class="game">EXP gained: ${totalXP}</h3>
      <h3 class="game">Money gained: $${totalMunz}</h3>
      `); //display money and xp
    money += totalMunz; //actually give money to player LOL
    party.forEach(function(e) { //check to see if added xp will level up the player, and if so, do it and display it
      if(e.xp + totalXP > xpChart[e.level + 1]) { //check to see if the resulting total passes the next number on the xp chart (vars.js)
        //LEVEL UP PROCEDURE: player recieve a random stat boost in the following categories for the following amounts:
        //HP - 18-25 MP 10-15 STR 0-2 MAG 0-2 AG 0-2
        let HPBonus = Math.floor(Math.random() * 8) + 18;
        let MPBonus = Math.floor(Math.random() * 6) + 10;
        let strBonus = Math.floor(Math.random() * 3);
        let magBonus = Math.floor(Math.random() * 3);
        let agBonus = Math.floor(Math.random() * 3);

        $('.result-top').append(`
          <h2 class="game game-over-text">${e.name} has reached level ${e.level + 1}!</h2>
          <h3 class="game">HP: +${HPBonus}, max is now ${e.maxHP + HPBonus}</h3>
          <h3 class="game">MP: +${MPBonus}, max is now ${e.maxMP + MPBonus}</h3>
          `);
        if(strBonus>0) {$('.result-top').append(`<h3 class="game">Str: +${strBonus}</h3>`);}
        if(magBonus>0) {$('.result-top').append(`<h3 class="game">Mag: +${magBonus}</h3>`);}
        if(agBonus>0) {$('.result-top').append(`<h3 class="game">Ag: +${agBonus}</h3>`);}
        e.xp+=totalXP;
        e.level++;
        e.str+=strBonus;
        e.mag+=magBonus;
        e.ag+=agBonus;
        e.maxHP+=HPBonus;
        e.maxMP+=MPBonus;

        if(e.skillGrowth[e.level] != undefined) {
          $('.result-top').append(`<h2 class="game">${e.name} learned ${e.skillGrowth[e.level]}!!</h2>`);
          e.abilityList[e.skillGrowth[e.level]]=abilityList[e.skillGrowth[e.level]];
        }
      } else {
        e.xp+=totalXP;
      }
    });
      document.querySelector('.game-over-text').style.fontSize = '72px';
      return;
  } // end victory check

  //reset border on currentturn
  if(currentTurn<0) {$('.enemy' + e2p(currentTurn)).removeClass('current-turn-border');}
  else {
    console.log(`'border removal on party end triggered, ideallty on party${currentTurn}'`);
    $(`.party${currentTurn}`).removeClass('current-turn-border');
  }


  //reset action-box so player can't make commands during an anemy turn
  $('.action-box').html(``);
  //at this point, the battle will continue, next turn up
  battleTurn++; //increment battleTurn to get the next part of the order array
  if(battleTurn==battleOrder.length) {battleTurn=0;} //make sure to loop around once it reaches the End
  currentTurn = battleOrder[battleTurn]; //next man up
  if(currentTurn < 0) {
    if(currentEnemies[e2p(currentTurn)].currentHP > 0){ //make sure a party member with hp 0 doesnt get a turn
      $(`.enemy${e2p(currentTurn)}`).addClass('current-turn-border');
      battleEnemyTurn(currentTurn);
    } else {nextTurn();}
  } else {
    if(party[currentTurn].currentHP > 0) {
      $(`.party${currentTurn}`).addClass('current-turn-border');
      $('.description-box').html(`It is ${party[currentTurn].name}'s turn, select an action.`);
      battlePlayerTurn(currentTurn);
    } else {
      nextTurn();
    } // end enemy hp check
  } //end enemy turn actions
} //end nextTurn

function battleEnemyTurn() { //start of enemy turn. call their ai after 2s
  //console.log(currentEnemies[e2p(currentTurn)]);
  $('.description-box').html(`Enemy ${currentEnemies[e2p(currentTurn)].name} prepares to act...`);
  setTimeout(function() {currentEnemies[e2p(currentTurn)].ai();}, 2000);
}

function enemyTurnResult(type, target, skill) {
  console.log(type, target, skill);
  switch(type) { //switch to act based on the resulting attack type
    case 'wpnatk': // in the event they use a weapon attack
      let resistMod = 0;
      // determine damage, get variables first to make this easier to analyze later
      let level = currentEnemies[e2p(currentTurn)].level; // get actors level
      let str = currentEnemies[e2p(currentTurn)].str; //get actors strength star
      let def = party[target].armorPwr; //get party members defense
      let damageMod = (Math.random() * 0.1) + 0.95; // random damage modifier, can be anwhere from 95% to 105%
      if(party[target].resistStr.includes('pS') == true) { //check for physical resistence strength
        resistMod = 0.5; //50% damage reduction if strong against
      } else if (party[target].resistStr.includes('pW') == true) { //check for weakness
        resistMod = 1.5; //50% damage boost
      } else if (party[target].resistStr.includes('pN') == true)  {// check for null resist
        resistMod = 0; //100% damage resist
      } else if (party[target].resistStr.includes('pD') == true)  {//check for drain phys
        resistMod = -0.75; //75% damage drained
      } else {
        resistMod = 1; //no change
      }
      let critCheck = Math.random();
      let critMod = critCheck > 0.9 ? 1.5 : 1.0;
      console.log(`level ${level}, str ${str}, $def ${def}, damageMod ${damageMod}, critMod ${critMod}`);
      //DAMAGE FORUMLA note: since enemies dont have an equipped weapon, i double the strength.
      damage = 6 * Math.sqrt(level * (str * 3 - def) ) * damageMod * resistMod * critMod;
      if(party[target].usedGuard==true) {damage*=0.5;} //check to see if target is defending
      damage = Math.round(damage);

      //apply damage, use a time out for effect

      setTimeout(function() {
        party[target].currentHP -= damage;
        drawPartyHealth(); //redraw enemies
        gameSound.sfx.hit1.play();
        $('#battle-damage-text' + e2p(currentTurn)).html(`
          <p class="game">${currentEnemies[e2p(currentTurn)].name} just did ${damage} damage to ${party[target].name}!</p>
          `);
        if(critMod>1){$('battle-damage-text' + target).append(`<p>Critical Hit</p>`);}


      }, 1000); //1s delay on damage draw.

      setTimeout(function() {
        console.log(`undraw triggered #battle-damage-text${e2p(currentTurn)}`);
        $('#battle-damage-text' + e2p(currentTurn)).html(` `);
        nextTurn(); // next persons turn
      }, 2000);

      break;

    case 'physskill':
      if(currentEnemies[e2p(currentTurn)].currentHP < skill.hpCost) { //if the enemy doesnt have enough mp, change type to wpnatk and rerun function
          type = 'wpnatk';
          enemyTurnResult(type, target, skill);
          break;
      } else {
        $('.description-box').append(`<p>Enemy ${currentEnemies[e2p(currentTurn)].name} uses ${skill.name} on ${party[target].name}</p>`);
        currentEnemies[e2p(currentTurn)].currentHP -= skill.hpCost;
        let resistMod = 0;
        let level = currentEnemies[e2p(currentTurn)].level; // get actors level
        let str = currentEnemies[e2p(currentTurn)].str; // get actors mag
        let skillPow = skill.atkPow;
        let def = party[target].armorPwr; //get party members defense
        let damageMod = (Math.random() * 0.1) + 0.95; // random damage modifier, can be anwhere from 95% to 105%
        if(party[target].resistStr.includes(`${skill.element}S`) == true) { //check for physical resistence strength
          resistMod = 0.5; //50% damage reduction if strong against
        } else if (party[target].resistStr.includes(`${skill.element}W`) == true) { //check for weakness
          resistMod = 1.5; //50% damage boost
        } else if (party[target].resistStr.includes(`${skill.element}N`) == true)  {// check for null resist
          resistMod = 0; //100% damage resist
        } else if (party[target].resistStr.includes(`${skill.element}D`) == true)  {//check for drain phys
          resistMod = -0.75; //75% damage drained
        } else {
          resistMod = 1; //no change
        }
        console.log(`level ${level}, mag ${mag}, skillpow ${skillPow}, def ${def}`);
        damage = 6 * Math.sqrt(level * (str * 3 - def) ) * damageMod * resistMod * skillPow * critMod;

        if(party[target].usedGuard==true) {damage*=0.5;} //check to see if target is defending
        damage = Math.round(damage);
        //apply damage, use a time out for effect
        setTimeout(function() {
          console.log(`${damage} damage`);
          party[target].currentHP -= damage;
          drawPartyHealth(); //redraw enemies
          $('#battle-damage-text' + e2p(currentTurn)).html(`
            <p class="game">${currentEnemies[e2p(currentTurn)].name} just did ${damage} damage to ${party[target].name}!</p>
            `);
          nextTurn(); // next persons turn
        }, 1000); //1s delay on damage draw.
        setTimeout(function() {$('#battle-damage-text' + e2p(currentTurn)).html(` `);}, 2000);
        break;
      }
      break;

    case 'magskill':
      if(currentEnemies[e2p(currentTurn)].currentMP < skill.mpCost) { //if the enemy doesnt have enough mp, change type to wpnatk and rerun function
          type = 'wpnatk';
          enemyTurnResult(type, target, skill);
          break;
      } else {
        $('.description-box').append(`<p>Enemy ${currentEnemies[e2p(currentTurn)].name} uses ${skill.name} on ${party[target].name}</p>`);
        let resistMod = 0;
        let level = currentEnemies[e2p(currentTurn)].level; // get actors level
        let mag = currentEnemies[e2p(currentTurn)].mag; // get actors mag
        let skillPow = skill.atkPow;
        let def = party[target].armorPwr; //get party members defense
        let damageMod = (Math.random() * 0.1) + 0.95; // random damage modifier, can be anwhere from 95% to 105%
        if(party[target].resistStr.includes(`${skill.element}S`) == true) { //check for physical resistence strength
          resistMod = 0.5; //50% damage reduction if strong against
        } else if (party[target].resistStr.includes(`${skill.element}W`) == true) { //check for weakness
          resistMod = 1.5; //50% damage boost
        } else if (party[target].resistStr.includes(`${skill.element}N`) == true)  {// check for null resist
          resistMod = 0; //100% damage resist
        } else if (party[target].resistStr.includes(`${skill.element}D`) == true)  {//check for drain phys
          resistMod = -0.75; //75% damage drained
        } else {
          resistMod = 1; //no change
        }
        console.log(`level ${level}, mag ${mag}, skillpow ${skillPow}, def ${def}`);
        let damage = skillPow + (level * (mag * 2 - def) ) * damageMod * resistMod;
        if(party[target].usedGuard==true) {damage*=0.5;} //check to see if target is defending
        damage = Math.round(damage);
        //apply damage, use a time out for effect
        setTimeout(function() {
          console.log(`${damage} damage`);
          party[target].currentHP -= damage;
          drawPartyHealth(); //redraw enemies
          $('#battle-damage-text' + e2p(currentTurn)).html(`
            <p class="game">${currentEnemies[e2p(currentTurn)].name} just did ${damage} damage to ${party[target].name}!</p>
            `);

        }, 1000); //1s delay on damage draw.
        setTimeout(function() {
          $('#battle-damage-text' + e2p(currentTurn)).html(` `);
          console.log('enemy magskill undraw triggered');
          nextTurn(); // next persons turn
        }, 2000);
        break;
      } //end mp check

  } //end switch
} //end enemyTurnResult

function e2p(order) { // this function converts the negative number used in battle order to a usable array value in currentEnemies
  let result = (order * -1) - 1;
  return result;
}

function playerGuard() { //player takes a defensive stance forfeiting action in favor of damage mitigation (50%)
  $('.description-box').html(`${party[currentTurn].name} takes a defensive stance. All incoming damage will be halved.`);
  party[currentTurn].usedGuard = true;
  setTimeout(function() {nextTurn();}, 1500);
}

//AI LIST --- MOVE THIS TO A LATER FILE

//begin monster AI

//general ai script: actions will be determined by a random number
//actions passed: wpnatk (basic attack)
//physskill, <skillobj>
//magskill, <skillobj>
//targeting is also done in this function, IF its an enemy target

function ukobachAI() {
  let num = Math.random();
  let result = '';
  let skill;
  let target = 0;
  if(num<0.70) {result = 'wpnatk';} else {
    result = 'magskill';
    skill = abilityList.agi;
  }
  target = Math.floor(Math.random() * party.length);
  enemyTurnResult(result, target, skill);
}

function berithAI() {
  let num = Math.random();
  let result = '';
  let skill;
  let target = -1;
  let breakLoop=false;
  if(num<0.5) {result = 'wpnatk';}
  else if(num<0.8) {
    result= 'physskill';
    skill = abilityList.strongStrike;
  } else {
    result = 'magskill';
    skill = abilityList.garu;
  }

  while (breakLoop==false) {
    target = Math.floor(Math.random() * party.length);
    //console.log(party[target].currentHP, target);
    if(party[target].currentHP>0) {
    //  console.log('true triggered');
      breakLoop=true;
      break;
    }
  }
  enemyTurnResult(result, target, skill);
}
