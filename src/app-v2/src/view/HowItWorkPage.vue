<template>
  <div class="flex flex-col items-center gap-20 bg-base-100 py-20">
    <p>Важно</p>
    <p>
      Перед началом игры убедитесь что у вас установлено расширение браузера "Ever Wallet". Все дейсвия в игре выполняются в смарт контракте, размещенном в блокчейне, это означает что каждое действие необходимо подтверждать в кошельке "Ever Wallet" от аккаунта который вы выбрали для авторизации в игре. Игра находится в тестовом режиме, поэтому используется тестовая сеть "testnet". Не забудьте переключиться на нее в кошельке. Монеты тестовой сети вы можете всегда получить в телеграм боте @everdev_giver_bot.
    </p>
    <p>Опиание интерфейса</p>
    <img src="/img/info_game_rooms.png">
    <p>Список локаций</p>
    <p>
      На панели отображены все текущие локации созданные игроками. Справа от каждой локации указано количество игроков которые присоединились к игре и максимальное количество игроков в локации. "1/3" означает что к игре присоденился 1 игрок из 3.
      Если в локации еще не все места заняты, можете зайти в локацию "Join" и присоединиться к игре. Раунд начинается сразу как только наберется нужное количество игроков.
      Если локация уже заполнена игроками, вы можеет зайти "Info" и наблюдать за их игрой.
    </p>
    <p>
      Вы таже можете создать свою локацию. Для этого необходимо указать "Room name", выбрать максимальное количество игроков и нажать "Add". После подтверждения транзакции, ваша новая локация появится в списке.
    </p>
    <img src="/img/info_this_game.png">
    <p>Информация о текущей игре</p>
    <p>
      После того какак вы выбрали локацию по кнокам "Join" или "Info", информация о ней отображается на закладке "This game". В списке указывается адрес игрока и количество захваченных им ячеек. Цвет адреса в списке отображает цвет ячеек игрока на карте
    </p>
    <img src="/img/info_top_users.png">
    <p>Топ игроков по завершенным играм</p>
    <p>
      По всем играм информация по игрокам суммируется и отображается на закладке "30 days TOP". В списке указывается адрес игрока и количество захваченных ячеек в играх которых он участвовал.
    </p>
    <img src="/img/info_main_map.png">
    <p>Процесс игры</p>
    <p>
      Для более удобной игры вы всегда можете свернуть панель информации.
      Также вы можете двигать карту управляя клавишами: "A"-⬅️, "D"-➡️, "W"-⬆️, "S"-⬇️
    </p>
    <p>
      Grab the first cell. 
      Для захвата первой ячейки необходимо выполнить двойной клик левой кнопкой мышки по любой выбранной свободной ячейке на поле.
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
      Upgrade the level of your cell. Для увеличения уровня ячейки необходимо сначала поставить отметку на нужной ячейке, клиекнув по ней один раз левой кнопкой мышки, и далее выполнить двойной клик левой кнопкой мышки по этой же ячейке. You will lose 3k energy - this is the cost of the lvlap. Now the energy production rate of this cell has increased.
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
