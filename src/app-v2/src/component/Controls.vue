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
    <button class="show-controls" @click="showControls=!showControls">Game rooms</button>
    <div class="controls" v-show="showControls">
      <table id="tblRouters">
        <tbody data-behavior="main" style="display: none">
          <tr>
            <td>Name:</td>
            <!-- <td>Radius:</td> -->
            <td>Users:</td>
            <!-- <td>Speed:</td>
            <td>End:</td> -->
            <td></td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                id="router_name"
                name="name"
                value="new Location test"
              />
            </td>
            <!-- <td>
              <input
                type="number"
                id="router_radius"
                name="radius"
                min="3"
                max="10"
                value="5"
              />
            </td> -->
            <td>
              <input
                type="number"
                id="router_users"
                name="users"
                min="2"
                max="10"
                step="1"
                value="3"
              />
            </td>
            <!-- <td>
              <input
                type="number"
                id="router_speed"
                name="speed"
                min="1"
                max="10"
                value="1"
              />
            </td>
            <td>
              <input
                type="number"
                id="router_time"
                name="time"
                min="60"
                max="2592000"
                step="60"
                value="3600"
              />
            </td> -->
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
  data(){
    return {
      showControls: true,
    }
  }
}
</script>
<style>
.controls-wrapper {
  position: absolute;
  top: 64px;
  left: 0;
  height: 50px;
  width: 480px;
  z-index: 2;
  background: rgba(0, 4, 11, 0.9);
}
input[type="text"],
input[type="number"] {
  height: 24px;
  border: 1px solid #0095a7;
  border-radius: 4px;
}

.show-controls {
  height: 50px;
  width: 100%;
  font-size: 32px;
  color: #00e4ff;
  padding-bottom: 10px;
}
.controls {
  color: white;
  font-family: "JetBrains Mono";
  width: 480px;
  height: 100%;
  background: rgba(0, 4, 11, 0.9);
}
</style>
