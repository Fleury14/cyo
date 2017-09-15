/*jshint esversion: 6 */

function partyMember(name, level, resist, str, mag, ag) { //constructor for party members
  this.name = name;
  this.level = level;
  this.str = str;
  this.mag = mag;
  this.ag = ag;
  this.maxHP = (100 + Math.round(level * 7 + (Math.random() * 4 * level) ));
  this.maxMP = (100 + Math.round(level * 6 + (Math.random() * 4 * level) ));
  this.currentHP = this.maxHP;
  this.currentMP = this.maxMP;
  this.weaponObj = '';
  this.armorObj = '';
  this.currentWeapon = '';
  this.currentArmor = '';
  this.weaponPwr = 0;
  this.armorPwr = 0;
  this.resistStr = '';
  this.abilityList = {};
  this.exp = 0;

} //end partyMember constructor

let inventory = {
  weapons : {
    ironSword: {
      name: 'Iron Sword',
      attackPow: 15,
      numOwned: 0
    } //end ironsword
  }, //end weapons
  armor : {
    plainClothes: {
      name: 'Plain Clothes',
      defensePow: 5,
      numOwned: 0
    } //end plainclothes
  }, //end armor
  battleItems : {
    fireBottle: {
      name: 'Fire Bottle',
      type: 'element-item',
      damage: 50,
      element: 'f',
      numOwned: 0
    }, //end fireBottle
    freezeSpray: {
      name: 'Freeze Spray',
      type: 'element-item',
      damage: 50,
      element: 'i',
      numOwned: 0
    }, //end freezeSpray
    airCannon: {
      name: 'Air Cannon',
      type: 'element-item',
      damage: 50,
      element: 'w',
      numOwned: 0
    }, //end airCannon
    stunGun: {
      name: 'Stun Gun',
      type: 'element-item',
      damage: 50,
      element: 'l',
      numOwned: 0
    } //end stunGun
  } //end battleitems
}; //end inventory

// ability notes: attacktype: 1 - magical, 0 - physical, 2 healing
// element: 0 - physical, 1 - fire, 2 - ice, 3 - wind, 4 - lightning, 5 - nuclear, 6 - psychic, 7 - holy, 8 - dark, 9 - almighty
// hp cost is displayed as pct of max hp
let abilityList = {
  agi : {
    name: 'Agi',
    description: 'Low level fire damage to one enemy',
    mpCost: 5,
    attackType: 1,
    element: 'f',
    atkPow: 35
  },
  bufu : {
    name: 'Bufu',
    description: 'Low level ice damage to one enemy',
    mpCost: 5,
    attackType: 1,
    element: 'i',
    atkPow: 35
  },
  garu : {
    name: 'Garu',
    description: 'Low level wind damage to one enemy',
    mpCost: 5,
    attackType: 1,
    element: 'w',
    atkPow: 35
  },
  zio : {
    name: 'Zio',
    description: 'Low level lightning damage to one enemy',
    mpCost: 5,
    attackType: 1,
    element: 'l',
    atkPow: 35
  },
  kouha : {
    name: 'Kouha',
    description: 'Low level holy damage to one enemy',
    mpCost: 5,
    attackType: 1,
    element: 'h',
    atkPow: 35
  },
  eiha : {
    name: 'Eiha',
    description: 'Low level dark damage to one enemy',
    mpCost: 5,
    attackType: 1,
    element: 'd',
    atkPow: 35
  },
  dia : {
    name: 'Dia',
    description: 'Small healing to one target',
    mpCost: 4,
    element: 'heal',
    attackType: 2,
    healPow: 30
  },
  strongStrike : {
    name: 'Strong Strike',
    description: 'Low physical damage to one enemy',
    hpCost: 0.06,
    attackType: 0,
    element: 'p',
    atkPow: 1.1
  }
}; //end ability list

function enemy(name, hp, mp, resist, abilities, str, mag, ag, ai, level) {
  this.name = name;
  this.maxHP = hp;
  this.currentHP = hp;
  this.maxMP = mp;
  this.currentMP = mp;
  this.resistStr = resist;
  this.abilities = abilities;
  this.str = str;
  this.mag = mag;
  this.ag = ag;
  this.ai = ai;
  this.level = level;
} //end enemy constructor

function elementIcon(element) { //function to return the fontawesome icon of whatever element is sent in
  let icon = '';
  switch(element) {
    case 'f': //fire
      icon = '<i class="fa fa-fire fire-icon" aria-hidden="true"></i>';
      break;
    case 'i': //ice
      icon = '<i class="fa fa-snowflake-o ice-icon" aria-hidden="true"></i>';
      break;
    case 'w': //wind
      icon='<i class="fa fa-envira wind-icon" aria-hidden="true"></i>';
      break;
    case 'l': //lightning
      icon='<i class="fa fa-bolt lightning-icon" aria-hidden="true"></i>';
      break;
    case 'h': //holy
      icon='<i class="fa fa-sun-o" aria-hidden="true"></i>';
      break;
    case 'd': //dark
      icon='<i class="fa fa-internet-explorer darkness-icon" aria-hidden="true"></i>';
      break;
    case 'p': //physical
      icon='<i class="fa fa-hand-rock-o physical-icon" aria-hidden="true"></i>';
      break;
    case 'heal': //healing
      icon='<i class="fa fa-medkit heal-icon" aria-hidden="true"></i>';
      break;
    default:
      icon='<span>ICON ERROR</span>';
      break;
  }//end switch
  return icon;
}//end elementIcon

function displayCost(ability) { //function to display hp/mp cost in the menu
  console.log(ability);
  let result = '';
  if(ability.element=='p') { //if the ability is physical, display HP cost
    result = `${Math.round(party[currentTurn].maxHP * ability.hpCost)} HP`;
  } else { //otherwise display mp cost
    result  = `${ability.mpCost} MP`;
  }
  return result;
}
