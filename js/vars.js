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
  this.currentWeapon = '';
  this.currentArmor = '';
  this.weaponPwr = 0;
  this.armorPwr = 0;
  this.resistStr = '';

} //end partyMember constructor

let inventory = {
  weapons : {
    ironSword: {
      name: 'Iron Sword',
      attackPow: '20',
      numOwned: 0
    } //end ironsword
  }, //end weapons
  armor : {
    plainClothes: {
      name: 'Plain Clothes',
      defensePow: '5',
      numOwned: 0
    }
  }
}; //end inventory

// ability notes: attacktype: 1 - magical, 0 - physical
// element: 0 - physical, 1 - fire, 2 - ice, 3 - wind, 4 - lightning, 5 - nuclear, 6 - psychic, 7 - holy, 8 - dark, 9 - almighty
// hp cost is displayed as pct of max hp
let abilityList = {
  agi : {
    name: 'Agi',
    description: 'Low level fire damage to one enemy',
    mpCost: 5,
    attackType: '1',
    element: '1',
    atkPow: 35
  },
  bufu : {
    name: 'Bufu',
    description: 'Low level ice damage to one enemy',
    mpCost: 5,
    attackType: '1',
    element: '2',
    atkPow: 35
  },
  garu : {
    name: 'Garu',
    description: 'Low level wind damage to one enemy',
    mpCost: 5,
    attackType: '1',
    element: '2',
    atkPow: 35
  },
  zio : {
    name: 'Zio',
    description: 'Low level lightning damage to one enemy',
    mpCost: 5,
    attackType: '1',
    element: '2',
    atkPow: 35
  },
  kouha : {
    name: 'Kouha',
    description: 'Low level holy damage to one enemy',
    mpCost: 5,
    attackType: '1',
    element: '2',
    atkPow: 35
  },
  eiha : {
    name: 'Eiha',
    description: 'Low level dark damage to one enemy',
    mpCost: 5,
    attackType: 1,
    element: '2',
    atkPow: 35
  },
  strongStrike : {
    name: 'Strong Strike',
    description: 'Low physical damage to one enemy',
    hpCost: 0.03,
    attacktype: 0,
    element: 0,
    atkPow: 30
  }
}; //end ability list

function enemy(name, hp, mp, resist, abilities, str, mag, ag) {
  this.name = name;
  this.maxHP = hp;
  this.currentHP = hp;
  this.maxMP = mp;
  this.currentMP = mp;
  this.resistStr = resist;
  this.abilities = abilities;
} //end enemy constructor
