<template>
  <div class="controls-wrapper">
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
      Game rooms
      <img
        class="arrow-image"
        src="public/arrow.svg"
        :class="[showControls ? 'down' : 'up']"
      />
    </button>
    <div class="controls" v-show="showControls">
      <table id="tblRouters">
        <tbody data-behavior="main" style="display: none">
          <tr class="routers-heading">
            <td>Room name:</td>
            <td>Players:</td>
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
              />
            </td>
            <td class="flex">
              <img src="public/users.svg" alt="users" />
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
                  max="10"
                  step="1"
                  :value="usersNumber"
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
              <button type="button" data-behavior="addRouterAction">Add</button>
            </td>
          </tr>
        </tbody>
      </table>
      <table id="tblLiders" class="mt-8">
        <tbody data-behavior="main" style="display: none">
          <tr>
            <td colspan="5">Lider board:</td>
          </tr>
        </tbody>
      </table>
      <table class="mt-8">
        <tbody>
          <tr>
            <td>network</td>
            <td colspan="2">
              <div><p data-behavior="network"></p></div>
            </td>
          </tr>
          <tr data-behavior="extension" style="display: none">
            <td colspan="3">
              <div>
                Need
                <a href="https://l1.broxus.com/everscale/wallet">EVER Wallet</a>
              </div>
            </td>
          </tr>
          <tr data-behavior="login" style="display: none">
            <td colspan="3">
              <button type="button" data-behavior="connect">Connect</button>
            </td>
          </tr>
          <tr data-behavior="main" style="display: none">
            <td>address</td>
            <td colspan="2">
              <div><p data-behavior="address"></p></div>
            </td>
          </tr>
          <tr data-behavior="main" style="display: none">
            <td>pubkey</td>
            <td colspan="2">
              <div><p data-behavior="publicKey"></p></div>
            </td>
          </tr>
          <tr data-behavior="main" style="display: none">
            <td colspan="3">
              <button type="button" data-behavior="disconnectAction">
                Disconnect
              </button>
            </td>
          </tr>
          <tr data-behavior="main" style="display: none">
            <td colspan="3">_________</td>
          </tr>
          <tr data-behavior="main" style="display: none">
            <td colspan="3">
              <button type="button" data-behavior="getRoutersAction">
                Get Routers
              </button>
            </td>
          </tr>
          <tr data-behavior="main" style="display: none">
            <td colspan="3">
              <button type="button" data-behavior="destroyCellsAction">
                Destroy Cells
              </button>
            </td>
          </tr>
          <tr data-behavior="main" style="display: none">
            <td colspan="3">
              <button type="button" data-behavior="calcRewardsAction">
                Calc Rewards
              </button>
            </td>
          </tr>
          <tr data-behavior="main" style="display: none">
            <td colspan="3">
              <button type="button" data-behavior="claimRewardAction">
                Claim Reward
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showControls: true,
      usersNumber: 3,
    };
  },
  methods: {
    setUsersNumber(direction) {
      if (direction === "down" && this.usersNumber > 0) {
        this.usersNumber--;
      } else if (direction === "up" && this.usersNumber >= 0) {
        this.usersNumber++;
      }
    },
  },
};
</script>
<style lang="scss">
.controls-wrapper {
  position: fixed;
  top: 64px;
  left: 0;
  height: 50px;
  width: 480px;
  z-index: 2;
  background: rgba(0, 4, 11, 0.9);
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

.controls {
  color: #69e0ee;
  font-family: "JetBrains Mono";
  width: 480px;
  height: 100%;
  background: rgba(0, 4, 11, 0.9);
  table {
    width: 100%;
    max-width: 480px;
  }

  .routers-heading {
    border-top: 2px solid #c27400;
    border-bottom: 1px solid #c27400;
    td:first-child {
      width: 50%;
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
