<template>
  <div class="howto-wrapper flex flex-col items-center gap-20 bg-base-100 py-20">
        <p>Attention</p>
    <p>
      Before starting the game, make sure you have installed the <a href="https://chrome.google.com/webstore/detail/ever-wallet/cgeeodpfagjceefieflmdfphplkenlfk/">"Ever Wallet"</a> browser extension. All actions in the game are performed in a smart contract placed in the blockchain, which means that each action must be confirmed in the "Ever Wallet" from the account you have chosen to authorize in the game. The game is in test mode, so the test network "testnet" is used. Do not forget to switch to it in the wallet. Coins from the testnet you can always get in <a href="https://t.me/everdev_giver_bot">telegram bot</a>.
    </p>
    <p>Interface</p>
    <p>Game rooms</p>
    <img src="/img/info_game_rooms.png">
    <p>
      The panel displays all the current locations created by the players. To the right of each location is the number of players who have joined the game and the maximum number of players in the room. "1/3" means that the game joined 1 player out of 3.
      If not all seats are taken yet, you can join the game by pressing "Join". The round starts as soon as the required number of players is reached.
      If the location is already filled with players, you can press "Info" and become an observer.
    </p>
    <p>
      You can also create your own room. To do this, you need to specify "Room name", select the maximum number of players and click "Add". After confirming the transaction, your new location will be displayed in the list.
    </p>
    <p>Current game information</p>
    <p>
      After you have selected a room with the "Join" or "Info" buttons, information about it will be displayed in the "This game" tab. The list shows the address of the player and the number of cells he has captured. The color of the address in the list shows the color of the player's cells on the map.
    </p>
    <img src="/img/info_this_game.png">
    <p>Leaderboard</p>
    <p>
      The best players are placed in the "30 days TOP". The list shows the address of the player and the number of captured cells in the games in which he participated.
    </p>
    <img src="/img/info_30days_top.png">
    <p>Gameplay</p>
    <p>
      You can always minimize the information panel for a more comfortable game.
      You can also move the map by pressing the "A"-⬅️, "D"-➡️, "W"-⬆️, "S"-⬇️
    </p>
    <p>
      Capture the first cell.
      To capture the first cell, double left-click on any free cell on the map.
    </p>
    <img src="/img/info_first_cell_capture.png">
    <p>
      The cell has the following stats:
      current amount of energy, base capacity, rate of energy production. 
      A table of stats is at the end of "how to play".
    </p>
    <p>
      Stats can be increased by leveling up. 
    </p>
    <p>
      After the last player joins and captures the first cell the round begins. The round lasts for 15 minutes.
    </p>
    <p>
      Upgrade the level of your cell. To do this, mark the desired cell by clicking it once with the left mouse button, and then double-click the same cell with the left mouse button. You will lose 3k energy - this is the cost of the lvlup. Now the energy production rate of this cell has increased.
    </p>
    <img src="/img/info_cell_lvlup.png">
    <p>
      Wait until you accumulate 4k energy and capture the next cell. To do this, click on the cell near which you want to capture the cell and click on the cell you want to capture. You will lose 4k - this is the cost of the capture. Now you control two cells.
    </p>
    <img src="/img/info_free_cell_capture.png">
    <p>
      Wait until the energy of the cells fills up. Then transfer energy from the first cell to the second cell. To do this, select cell 1 and dbl click on cell 2. Now the energy of cell two has exceeded the base capacity and every second it will lose energy until it returns to the base capacity level. Hurry up to use your energy advantage in your tactics.
    </p>
    <img src="/img/info_energy_transfer.png">
    <p>
      If you are adjacent to an enemy cell, you can attack and capture it if your energy exceeds the enemy's. To do this, select your cell and then the enemy cell. Energy is subtracted and if your energy is greater, the cell will be captured.
    </p>
    <img src="/img/info_enemy_capture.png">
    <p>
      The goal of the game is to own as many cells as possible by the end of the round.
    </p>
    <p>
      The game is over when the round time of the current location ends. After that, all captures and cell markings are prohibited. The winner is the player who captures the most cells on the map.<br>
      <br>
      The winner's reward is all EVERs accumulated in the cell contracts and the main room contract.<br>
      How do I get a reward?<br>
      1) Click the "Destroy Cells" button and wait for the process to complete. If there are any cells left on the field, press the button again. This will collect all the coins from their contracts in the main room contract.<br>
      2) Click on the "Calc Rewards" button and wait for the process to finish.<br>
      3) Click on "Claim Reward" and the prize money will be sent to your address if you are a winner. If there is more than one winner (they have the same number of cells), each winner must click the button to get their reward.<br>
    </p>
    <p>
      Game Parameters:<br>
      <br>
      Empty Cell Marking Price: 4000 ⚡️<br>
      Levelup: 3000 ⚡️<br>
      Maximum Cell Capacity:<br>
        Level 1 - 5000 ⚡️<br>
        Level 2 - 7000 ⚡️<br>
        Level 3 - 10000 ⚡️<br>
      Energy generation in the cell:<br>
        level 1 - 20 ⚡️/sec<br>
        Level 2 - 35 ⚡️/sec<br>
        Level 3 - 50 ⚡️/sec<br>
      Decreasing energy in the cell when it exceeds its capacity: 20 ⚡️/sec<br>
    </p>
  </div>
</template>
<style lang="scss">
.howto-wrapper {
  background-color: #00040b;
  color: #fff;
  padding: 20px 50px;
}
</style>
