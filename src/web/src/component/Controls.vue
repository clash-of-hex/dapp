<template>
  <div class="controls-wrapper" data-behavior="main" style="display: none">
    <!-- <div style="position: absolute; left: 50%" id="energy" class="mb-10">
      <input type="radio" name="energy" id="energy20" value="20" /> 20%
      <input type="radio" name="energy" id="energy40" value="40" /> 40%
      <input type="radio" name="energy" id="energy60" value="60" /> 60%
      <input type="radio" name="energy" id="energy80" value="80" /> 80%
      <input
        type="radio"
        name="energy"
        id="energy100"
        value="100"
        checked="checked"
      />
      100%
    </div> -->
    <button class="show-controls" @click="showControls = !showControls">
      {{ activeTab === "games" ? "Game rooms" : "Leader board" }}
      <img
        class="arrow-image"
        src="/arrow.svg"
        :class="[showControls ? 'down' : 'up']"
      />
    </button>
    <div v-show="showControls" class="controls">
      <perfect-scrollbar>
        <div v-show="activeTab === 'games'" class="games-tab">
          <form @submit="checkForm" id="add-room">
            <div v-for="(error, i) in errors" class="errors" :key="'error' + i">
              {{ error }}
            </div>
            <table class="table-games" id="tblRouters">
              <tbody>
                <tr class="routers-heading">
                  <td>
                    <div>
                      Room name
                      <button
                        type="button"
                        data-behavior="getRoutersAction"
                        style="display: inline"
                      >
                        ↻
                      </button>
                    </div>
                  </td>
                  <td>Players</td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      id="router_name"
                      name="name"
                      placeholder="Room name"
                      class="router-name"
                      v-model="roomName"
                      required
                      minlength="2"
                      maxlength="20"
                    />
                  </td>
                  <td class="flex items-center">
                    <img
                      src="/users.svg"
                      alt="users"
                      style="max-width: 20px; height: 10px"
                    />
                    <div class="users-number">
                      <svg
                        @click="setUsersNumber('up')"
                        width="7"
                        height="5"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="arrow-number up"
                      >
                        <path
                          d="M25.1525 21.7346C25.5895 22.5576 25.6143 23.3914 25.2271 24.2358C24.8412 25.0786 24.2448 25.5 23.438 25.5L2.56252 25.5C1.75574 25.5 1.15872 25.0786 0.771462 24.2358C0.385551 23.3914 0.411099 22.5576 0.848107 21.7346L11.2859 1.61112C11.6893 0.870375 12.2607 0.500002 13.0003 0.500002C13.7398 0.500002 14.3113 0.870375 14.7147 1.61112L25.1525 21.7346Z"
                          fill="#FFC700"
                        />
                      </svg>
                      <input
                        type="number"
                        id="router_users"
                        name="users"
                        min="2"
                        max="4"
                        step="1"
                        :value="usersNumber"
                        @input="checkNumber"
                      />
                      <svg
                        @click="setUsersNumber('down')"
                        width="7"
                        height="5"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="arrow-number down"
                      >
                        <path
                          d="M25.1525 21.7346C25.5895 22.5576 25.6143 23.3914 25.2271 24.2358C24.8412 25.0786 24.2448 25.5 23.438 25.5L2.56252 25.5C1.75574 25.5 1.15872 25.0786 0.771462 24.2358C0.385551 23.3914 0.411099 22.5576 0.848107 21.7346L11.2859 1.61112C11.6893 0.870375 12.2607 0.500002 13.0003 0.500002C13.7398 0.500002 14.3113 0.870375 14.7147 1.61112L25.1525 21.7346Z"
                          fill="#FFC700"
                        />
                      </svg>
                    </div>
                  </td>
                  <td>
                    <button
                      v-show="
                        !checkedErrors ||
                        errors.nameError.length !== 0 ||
                        errors.numberError.length !== 0
                      "
                      class="button-add"
                      :style="[
                        checkedErrors &&
                        errors.nameError.length === 0 &&
                        errors.numberError.length === 0
                          ? 'display: none'
                          : '',
                      ]"
                      type="submit"
                      form="add-room"
                    >
                      +Add
                    </button>
                    <button
                      v-show="
                        checkedErrors &&
                        errors.nameError.length === 0 &&
                        errors.numberError.length === 0
                      "
                      class="button-add"
                      type="submit"
                      form="add-room"
                      ref="buttonAdd"
                      data-behavior="addRouterAction"
                    >
                      +Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <div v-show="activeTab === 'thisgame'" class="thisgame-tab">
          <div class="show-name" data-behavior="rommName"></div>
          <table id="tblUsers">
            <tbody>
              <tr class="routers-heading">
                <td>User address</td>
                <td colspan="2">Cells</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <table class="mt-8">
            <tbody>
              <tr>
                <td colspan="3">
                  <button type="button" data-behavior="destroyCellsAction">
                    Destroy Cells
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <button type="button" data-behavior="calcRewardsAction">
                    Calc Rewards
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <button type="button" data-behavior="claimRewardAction">
                    Claim Reward
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-show="activeTab === 'top'" class="leaders-tab">
          <table id="tblLiders">
            <tbody>
              <tr class="routers-heading">
                <td>User address</td>
                <td colspan="2">Cells</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </perfect-scrollbar>
      <div class="bottom-buttons">
        <button
          class="button-games"
          :class="{ active: activeTab === 'games' }"
          @click="activeTab = 'games'"
        >
          Game rooms
        </button>
        <button
          class="button-thisgame"
          :class="{ active: activeTab === 'thisgame' }"
          @click="activeTab = 'thisgame'"
        >
          This game
        </button>
        <button
          class="button-top"
          :class="{ active: activeTab === 'top' }"
          @click="activeTab = 'top'"
        >
          30 days TOP
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import * as EVER from "../services/ever.js";
export default {
  data() {
    return {
      showControls: true,
      usersNumber: 3,
      roomName: "",
      activeTab: "games",
      errors: {
        nameError: "",
        numberError: "",
      },
      checkedErrors: false,
    };
  },
  watch: {
    roomName(value) {
      if (value.length <= 2) {
        this.errors.nameError = "Room name should be longer";
      } else if (value.length >= 17) {
        this.errors.nameError = "Room name should be shorter";
      } else {
        this.errors.nameError = "";
      }
      this.roomName = value;
      this.checkedErrors = true;
    },
  },
  methods: {
    setUsersNumber(direction) {
      if (direction === "down") {
        if (this.usersNumber > 2 && this.usersNumber <= 4) {
          this.usersNumber--;
        } else {
          this.usersNumber = 2;
        }
      } 
      if (direction === "up") {
        if (this.usersNumber >= 2 && this.usersNumber < 4) {
          this.usersNumber++;
        } else {
          this.usersNumber = 4;
        }
      } 
      this.errors.numberError = "";
    },
    checkNumber(event) {
      let val = event.target.value;
      if (val < 2 || val > 4) {
        this.errors.numberError = "Number of users must be between 2 and 4";
      } else {
        this.errors.numberError = "";
      }
      this.usersNumber = val;
      this.checkedErrors = true;
    },
    checkForm: function (e) {
      if (this.roomName.length <= 2) {
        this.errors.nameError = "Room name should be longer";
      } else if (this.roomName.length >= 17) {
        this.errors.nameError = "Room name should be shorter";
      } else if (this.usersNumber < 2 || this.usersNumber > 4) {
        this.errors.numberError = "Number of users must be between 2 and 4";
      }
      this.checkedErrors = true;

      e.preventDefault();
    },
  },
};
</script>
<style lang="scss">
.controls-wrapper {
  position: fixed;
  top: 72px;
  left: 0;
  width: 440px;
  z-index: 2;
}

.show-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;
  font-size: 32px;
  color: #00e4ff;
  padding-bottom: 10px;
  background: rgba(0, 4, 11, 0.9);
  outline: none;
  user-select: none;
}
.arrow-image {
  height: 25px;
  margin-left: 10px;
  margin-top: 5px;
  transition: 0.3s;
  &.down {
    transform: rotate(180deg);
  }
}
//custom scroll
.ps {
  width: 440px;
  height: 350px;
  background: rgba(0, 4, 11, 0.9);
  padding-right: 10px;
}
.ps__thumb-y {
  background-color: #00e4ff;
}

.controls {
  display: flex;
  flex-direction: column;
  color: #69e0ee;
  font-family: "JetBrains Mono";
  width: 440px;
  background: rgba(0, 4, 11, 0.9);
  table {
    width: 100%;
    background: rgba(0, 4, 11, 0.9);
  }

  .routers-heading {
    border-top: 2px solid #c27400;
    border-bottom: 1px solid #c27400;
    td:first-child {
      width: 60%;
      border-right: 1px solid #c27400;
    }
  }
  td {
    padding: 5px;
  }
  .router-name {
    height: 24px;
    border: 1px solid #0095a7;
    border-radius: 4px;
    background-color: transparent;
    font-size: 12px;
    padding: 0px 10px;
  }
  .users-number {
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
      width: 50px;
      height: 24px;
      text-align: center;
      background-color: transparent;
      border: none;
    }
    .arrow-number {
      height: 5px;
      &.down {
        transform: rotate(180deg);
      }
    }
  }
  .games-tab,
  .thisgame-tab,
  .leaders-tab {
    flex: 1;
    height: 350px;
  }
  .bottom-buttons {
    margin-top: 10px;
    button {
      height: 50px;
      width: 33.33%;
      font-size: 20px;
      font-weight: 800;
    }
    .button-games {
      background-color: #00040b;
      color: #00e4ff;
      border: 3px solid #00e4ff;
      &.active {
        background-color: #00e4ff;
        color: #00040b;
      }
    }
    .button-thisgame {
      background-color: #00040b;
      color: #c7ff00;
      border: 3px solid #c7ff00;
      &.active {
        background-color: #c7ff00;
        color: #00040b;
      }
    }
    .button-top {
      background-color: #00040b;
      color: #ffc700;
      border: 3px solid #ffc700;
      &.active {
        background-color: #ffc700;
        color: #00040b;
      }
    }
  }
  .table-games {
    button {
      display: flex;
      align-items: center;
      height: 24px;
      padding: 0 10px;
      border-radius: 4px;
      font-size: 16px;
    }
  }
  .button-join {
    color: #00e4ff;
    border: 2px solid #00e4ff;
  }
  .button-info {
    color: #ffc700;
    border: 2px solid #ffc700;
  }
  .button-add {
    color: #08de04;
    border: 2px solid #08de04;
  }
  .show-name {
    text-align: center;
    margin-bottom: 10px;
  }
  .errors {
    color: #ff0404;
  }
}
input[type="number"] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
