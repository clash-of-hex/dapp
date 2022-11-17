<template>
  <div class="controls">
    <div style="position: absolute; left: 50%" id="energy">
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
    </div>
    <table style="position: absolute; left: 0px" id="tblRouters">
      <tbody data-behavior="main" style="display: none">
        <tr>
          <td colspan="6">New Location:</td>
        </tr>
        <tr>
          <td>Name:</td>
          <td>Radius:</td>
          <td>Users:</td>
          <td>Speed:</td>
          <td>End:</td>
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
          <td>
            <input
              type="number"
              id="router_radius"
              name="radius"
              min="3"
              max="10"
              value="5"
            />
          </td>
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
          <td>
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
          </td>
          <td>
            <button type="button" data-behavior="addRouterAction">Add</button>
          </td>
        </tr>
      </tbody>
    </table>
    <table style="position: absolute; right: 0px; top: 40%" id="tblLiders">
      <tbody data-behavior="main" style="display: none">
        <tr>
          <td colspan="5">Lider board:</td>
        </tr>
      </tbody>
    </table>
    <table style="position: absolute; right: 0px">
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
</template>

