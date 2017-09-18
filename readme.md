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
          |                 \                  |           |            |
          |                   ----------------------------------        |
          |                  | Targeting mechanic:             |        |
          |                  | playerFightTarget or            |        |
          |                  | partySelectTarget               |        |
          |                   ---------------------------------         |
          |                     |                      |                |
          |              ---------------         ---------------        |
          |             | attackEnemy  |        | partySkillUse |       |
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

playerFightTarget: The player executes a basic weapon attack. This immediately calls the targeting mechanic which is explained further below.

useItem: Party member uses an item from the inventory. This un-hides the inventory box, and draws all battle items owned by the party. It gives each box a class name that matches up with the item's name in the inventory list. This will prove important later. A listener is attached to each row and the event calls selectItem. The cancel button will call cancelItem which simply hides the inventory box and gives the player control of the command box again.

selectItem: This function goes through the passed event, finds the class name and matches it up with the inventory object to figure out which item was used. 
