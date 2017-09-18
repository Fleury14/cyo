Chapter 2 BATTLE ENGINE README
created by J.R. Ruggiero

If you wish to skip immediately to the part where the battle engine is utilized in the game, click the '200' button on the upper right hand portion of the screen. This will start you with all of the elemental items intact, which is quite the advantage if you just wanted to scream through the battles. This is because using the ice item "Freeze Spray" will knock out the enemies in the first two fights in one hit, but it is unlikely that the player will have 3 of them in his inventory at the time.

Here I will explain the flow of the battle engine, as looking at the code could be rather confusing.

Declared ahead of time:

vars.js -- this keeps the constructors for party members and enemies, a list of skills, skill list growth charts and xp charts and a complete inventory listing. I wanted to put as many declarations there as I possible could. Unfortunately, I couldn't put the AI scripts because it would refer to function in the main game file. In the future, I'd like to have it simply return the necessary files and become self-sufficient in that Regardless

battle.js -- Aside from the actual engine, all enemy AI routines are kept at the bottom.

script.js -- All actual party members and enemies are declared at the top. Initial equipment and skills need to be given to the party member prior to their first battle. I have the protags info listed at the bottom within the flow of the program, I will probably move that to the top where I put the second party members initial gear/skills.

NOTES ABOUT SPECIFIC VARIABLES/OBJECTS : Most of the party members values are pretty self-explanatory.

Element reference: fire - 'f', ice - 'i', wind 'w', lightning 'l', physical 'p', holy 'h', darkness 'd'

name -- Character Name. If nothing is entered or the skip button is used, it defaults to 'protag'
level -- characters level
label -- used to refer to the skill chart, since I can't use the character's name as a reference point in the skill growth chart. This is because the characters will depend on the user's input.
str - character strength, used in determining damage with weapon and physical attacks
mag - character magic, used in determining damage with skills
ag - character agility, used in determining battle order. Will eventually be used to all determine hit/dodge chance.
currentWeapon / weaponPwr / currentArmor / armorPwr -- Title and attack/defense values for current equipped weapon.
resistStr - a string which lists a characters element strengths and weaknesses. Any attribute stars with a lowercase letter for the element (see element reference above) and then an uppercase letter to determin the resistance (S - strong, W - weak, N - nullifies damage, D - absorbs damage).
xp - character experience. This is initially set to the base amount for the declared level as referred in the xpChart
skillGrowth - a list of skills the character learns and at what level they learn them
usedGuard - A status check to see if the character is in a defensive stance during battle, which will reduce damage. This is automatically reset to false at the beginning of that characters turn.
currentHP/currentMP - maxHP/maxMP - the current and maximum hit points (health) and magic points (used in skills) for each character

I do not have a defense stat... yet.

Enemy vars are the same as party member vars with a couple of additions:

xp - the amount of experience the party receives for defeating that Enemy
money - same as above only money.
ai - the function used to determine the enemy's actions on their turn

BATTLE flow
Prior to the battle, all players must have their equipment and skills pushed to their object. Also, the bottom half of the victory screen ('.result-bottom') needs to have a button with an eventListener attached to go to the next part of the story. For the first few battles, it looks like I redrew and re-added each listener, but it may prove more prudent to just remove the listener itself and add a new one.

Declaring a battle begins with calling beginBattleEngine with an array of enemies to fight.

          ---------------------
        |   beginBattleEngine  |
          ---------------------
              /           \
  ------------------      ------------------       -----------
 | battleEnemyTurn  |    | battlePlayerTurn | --->|playerGuard|---------\
  ------------------      ----------------------   -----------          |
          |                |                |   \ -----\                |
  ------------------  -----------------     --------   ---------        |
 | enemyTurnResult | |playerFightTarget |  |useItem|   |useSkill|       |
  ------------------ -------------------   --------     --------        |
          |                |                   |          |             |
          |                |             -------------    -----------   |
          |                |             | SelectItem |  |selectSkill|  |
          |                |              ------------    -----------   |
          |               /                    |           |            |
          |              /    ----------------------------------        |
          |             /    | Targeting mechanic:             |        |
          |            /     | playerFightTarget or            |        |
          |           /      | partySelectTarget               |        |
          |          /        ---------------------------------         |
          |         /           |                      |                |
          |         |    ---------------         ---------------        |
          |         |-->| attackEnemy  |        | partySkillUse |       |
          |              ---------------         ---------------        |
          |                       \             /                      /
           \                      ---------------                     /
            ---------------->    | nextTurn     | <------------------                  
                                  --------------
                                       |
                               ------------------------------
                              | Go to either battleEnemyTurn |
                              | or battlePlayerTurn          |
                               ------------------------------

beginBattleEngine: Initializes the engine, reset and executes the initial draw of the player health bars, enemies, and command and description boxes. The battle order is gotten with getBattleOrder(). Numbers in an array are either 0 or greater for party members or -1 or lower for enemies. The order array is iterated through with battleTurn and currentTurn is set to whoevers turn it currently is taken from that array. Then, either battlePlayerTurn or battleEnemyTurn is executed depending on who is next up.

battleEnemyTurn: Enemy turns are for more simple than player turns in terms of flow. Their respective AI is called which is stored in the enemy object, and returns the type of attack, the target, and the skill if applicable. This is all passed to the next step below.

enemyTurnResult: The type of attack is taken from the enemy AI routine and the correct action is used based on a case-switch of the type. 'wpnatk' is a basic attack, 'magskill' and 'physskill' are magical and physical skills respectively taken from the abilityList object. Note that in the future, the abilityList will contain some skills that are only accessible to enemies. After the damage has been applied, respective health redrawn, the nextTurn function is called.

battlePlayerTurn: At the start of a players turn, the commandBox appears listing the options and giving the player the option to use keyboard commands to move the arrow or o simply click. In future iterations, I plan to allow for compete keyboard controls. At this point there are 4 different branches the player can take depending on the command issued. I should also mention that there are cancel functions for most commands that I did not put on the map as it would make it look more confusing than it already is.

playerGuard: The easiest one to explain, said party member takes a defensive stance halving incoming damage. The guard flag in the players object is activated, and nextTurn is called.


useItem: Party member uses an item from the inventory. This un-hides the inventory box, and draws all battle items owned by the party. It gives each box a class name that matches up with the item's name in the inventory list. This will prove important later. A listener is attached to each row and the event calls selectItem. The cancel button will call cancelItem which simply hides the inventory box and gives the player control of the command box again.

selectItem: This function goes through the passed event, finds the class name and matches it up with the inventory object to figure out which item was used. The item is then switch/cased to figure out the exact effect and the respective targeting mechanic is called. As of right now, there are no items that target the party, but there will be in the future.

useSkill: A similar mechanic to the useItem, this draws a list of skills in the inventory box, and allows the player to pick one or cancel. Cancel also calls the cancelItem function which works because the same inventory box is used to draw the skill list. In order to explain each skill thoroughly, the corresponing ability is parsed through the abilityList and the element, cost, and description of the skill is displayed. Because the list display is more complex, I couldn't pass a single class name over, although upon thinking about it I could have used jquery to check, but instead I assigned the ability name to be passed in the 'title' part of the element. Listeners are attached to each row and selectSkill is called upon click.

selectSkill: Just like select item, this goes through the event to get the skill name and then matches it up to the ability list to figure the next course of action. The main difference is that instead of using the class of the element, it uses the title. The corresponsing targeting mechanic is used depending on the element of the skill. If its 'heal' then it selects a party member, otherwise it selects an enemy.

playerFightTarget: The targeting mechanic for selecting an enemy. The type of attack, and skill if applicable, is retained all the way through. Once a target is selected, the aforementioned type and skill are passed along with the target. At the moment I have decided to not prevent the player from selecting a dead target. This essentially forfeits the players turn. I may change that in the future. Once an enemy is targets, attackEnemy is called to parse the damage result.

partySelectTarget: This functions the same as the enemy targeting system, only this selects a party member. This is used for healing skills, and in the future, items. Once a target is selected, playerSkillUse is called.

playerSkillUse: This takes in the target and the skill used, and executes the correct command based on the skill passed. In this case, the only event is the healing skill 'dia' which executes a heal based on the power of the skill and the magic stat of the user. HP is updated, health is redrawn, and nextTurn is called.

attackEnemy: Now that we have the type, target, and skill, we can call the respective damage formula and apply the damage. The type is switch/cased, 'wpnatk' calling the basic wepaon attack formula, physskill also caling the weapon formula but applying a bonus% based on the skills power, and 'magskill' dealing damage based on the power of the skill used and the user's magic stat. After the damage is calculated, it is redrawn and nextTurn is called. Much like the enemyTurnResult function, there is a small timeout set to display the damage for effect.

nextTurn: This is called when a turn is over. It immediately checks to make sure either the party isnt all dead, then the enemies aren't all dead, and if so, displays either the game over screen, or victory screen. The XP/money gain, and the check for levelling up is also done in this function, but that may change at a later date. If there isn't a victor decided, the next iteration of the battleOrder array is called, the currentTurn is set to whoever's turn is up, and based on that being an enemy or a partymember, the whole thing starts again.

NOTABLE SIDE FUNCTIONS:

getBattleOrder: This orders the enemies and party members based on their agility stat and sorts them in an array. 0-3 are partyMember[0] through [3]. In order to properly denote which enemy, the currentEnemies index is incremented by one, and then multiplied by -1. Therefore in the order array, enemy[0] would be -1, enemy[1] would be -2, and so on. This way, when we want to check to see if an enemy or player is up, we simply see if currentTurn is less than 0.

e2p: Because currentTurn is set to a negative number in the order array, if we want to act on the respective enemy, we need to revert that number back to the correct index in the currentEnemies array. The e2p function does exactly that. Therefore, if we need the current enemies strength stats, since currentTurn is negative, we simply call currentEnemies[e2p(currentTurn)]. Neato.
