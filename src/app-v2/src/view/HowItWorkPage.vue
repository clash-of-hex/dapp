<template>
  <div class="flex flex-col items-center gap-20 bg-base-100 py-20">
    <p>Attention</p>
    <p>
      Before starting the game, make sure you have installed the "Ever Wallet" browser extension. All actions in the game are performed in a smart contract placed in the blockchain, which means that each action must be confirmed in the "Ever Wallet" from the account you have chosen to authorize in the game. The game is in test mode, so the test network "testnet" is used. Do not forget to switch to it in the wallet. Coins from the testnet you can always get in telegram bot @everdev_giver_bot.
    </p>
    <p>Interface</p>
    <img src="/img/info_game_rooms.png">
    <p>Game rooms</p>
    <p>
      The panel displays all the current locations created by the players. To the right of each location is the number of players who have joined the game and the maximum number of players in the room. "1/3" means that the game joined 1 player out of 3.
      If not all seats are taken yet, you can join the game by pressing "Join". The round starts as soon as the required number of players is reached.
      If the location is already filled with players, you can press "Info" and become an observer.
    </p>
    <p>
      You can also create your own room. To do this, you need to specify "Room name", select the maximum number of players and click "Add". After confirming the transaction, your new location will be displayed in the list.
    </p>
    <img src="/img/info_this_game.png">
    <p>Current game information</p>
    <p>
      After you have selected a room with the "Join" or "Info" buttons, information about it will be displayed in the "This game" tab. The list shows the address of the player and the number of cells he has captured. The color of the address in the list shows the color of the player's cells on the map.
    </p>
    <img src="/img/info_top_users.png">
    <p>Leaderboard</p>
    <p>
      The best players are placed in the "30 days TOP". The list shows the address of the player and the number of captured cells in the games in which he participated.
    </p>
    <img src="/img/info_main_map.png">
    <p>Gameplay</p>
    <p>
      You can always minimize the information panel for a more comfortable game.
      You can also move the map by pressing the "A"-⬅️, "D"-➡️, "W"-⬆️, "S"-⬇️
    </p>
    <p>
      Capture the first cell.
      To capture the first cell, double left-click on any free cell on the map.
    </p>
    <img src="/img/info_ceil.png">
    <p>
      The cell has the following stats:
      Current amount of energy, base capacity, rate of energy production. 
      A table of stats is at the end of "how to play".
    </p>
    <p>
      Stats can be increased by leveling up. 
    </p>
    <p>
      After the last player joins and captures the first cell the round begins. The round lasts for 15 minutes.
    </p>
    <p>
      Upgrade the level of your cell. To do this, mark the desired cell by clicking it once with the left mouse button, and then double-click the same cell with the left mouse button. You will lose 3k energy - this is the cost of the lvlap. Now the energy production rate of this cell has increased.
    </p>
    <img src="/img/info_grab_cail.png">
    <p>
      Wait until you accumulate 4k energy and capture the next cell. To do this, click on the cell near which you want to capture the cell and click on the cell you want to capture. You will lose 4k - this is the cost of the capture. Now you control two cells.
    </p>
    <img src="/img/info_help_cail.png">
    <p>
      Wait until the energy of the cells fills up. Then transfer energy from the first cell to the second cell. To do this, select cell 1 and dbl click on cell 2. Now the energy of cell two has exceeded the base capacity and every second it will lose energy until it returns to the base capacity level. Hurry up to use your energy advantage in your tactics.
    </p>
    <img src="/img/info_attk_cail.png">
    <p>
      If you are adjacent to an enemy cell, you can attack and capture it if your energy exceeds the enemy's. To do this, select your cell and then the enemy cell. Energy is subtracted and if your energy is greater, the cell will be captured.
    </p>
    <p>
      The goal of the game is to own as many cells as possible by the end of the round.
    </p>
  </div>
</template>
