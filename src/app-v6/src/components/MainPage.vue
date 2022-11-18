<template>
  <v-container>
    <v-row justify="center">

      <v-col
        class="mb-12"
        cols="12"
        v-if="screenWallet == 'extension'"
      >
        <v-row class="mb-4" justify="center">
          <h2 class="text-subtitle-4">
            Please install EVER Wallet chrome extension
          </h2>
        </v-row>
      </v-col>
      <v-col
        class="mb-12"
        cols="12"
        v-if="screenWallet == 'login'"
      >
        <v-row class="mb-4" justify="center">
          <h2 class="text-subtitle-4">
            Please authorize your account on the Main Network
          </h2>
        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex'
import eversdk from "../services/eversdk";

let abiGameRoot = require("../../../../contracts/build/GameRoot.abi.json");
let abiRouter = require("../../../../contracts/build/Router.abi.json");
let abiCell = require("../../../../contracts/build/Cell.abi.json");
let Config = require("../../../../config.json");

export default {
  name: 'MainPage',

  data: () => ({
    Games: [],
    Liders: [],
  }),

  methods: {
    ...mapActions(['subscribeContract', 'getContract', 'getAccountsByCodeHash', 'setAllGames']),
    countDownTimer () {
      setTimeout(() => {
        const d = new Date();
        this.timeLeft = Math.floor((new Date(this.endBidding*1000) - Date.now())/1000);
        this.countDownTimer()
      }, 1000)
    },
    subscribeRoot() {
      console.log('subscribeRoot', true);
      this.subscribeContract({
        eventName: 'contractStateChanged',
        address: this.RootAddress,
        onEvent: async (event) => {
          console.log('Root StateChanged', event);
          await this.updGames();
        }
      });
    },
    subscribeRouter() {
      console.log('subscribeRouter', true);
      if (!this.RouterAddress) return
      this.subscribeContract({
        eventName: 'contractStateChanged',
        address: this.RouterAddress,
        onEvent: async (event) => {
          console.log('Router StateChanged', event);
          await this.updCails();
        }
      });
    },
    async updGames() {
      console.log('updGames', true, this.CodeHash);
      let details = await this.getAccountsByCodeHash({
        codeHash: this.CodeHash,
        limit: 50,
      });
      let addreses = details.accounts.map((el) => el.toString());
      let accs = await eversdk.getAccArr(addreses);
      let games = [];
      for (let i = 0; i < accs.length; i++) {
        let details = await this.getDetailsRouter(accs[i].id, accs[i].boc);
        if (details) {
          details.address = accs[i].id;
          details.endTimeFormat = details.endTime == 0 ? 'Waiting users' : new Date(1000 * details.endTime);
          games.push({...details})
        }
      }
      this.setAllGames(games);
    },
    async getDetailsRouter(address, boc = null) {
      if (boc) {
        try {
          const output = await eversdk.runLocal(
            abiRouter,
            address,
            "getDetails",
            {},
            true,
            boc
          );
          return output;
        } catch (error) {
          console.error(error);
        }
      }
      const contract = await this.getContract({
        abi: abiRouter,
        address: address,
      });
      try {
          const output = await contract.methods.getDetails({
          }).call();
          console.log('Router getDetails', output);
          return output;
      } catch (error) {
          console.error(error);
      }
    }
  },

  computed: {
    ...mapGetters(['screenWallet', 'network', 'account']),
    RoundEnd() {
      return (new Date(this.endRound*1000)).customFormat( "#DD#-#MM#-#YYYY# #hhhh#:#mm#:#ss#" );
    },
    RootAddress() {
      return Config[this.network].gameroot;
    },
    CodeHash() {
      return Config[this.network].codeHash;
    },
    RouterAddress() {
      return '';
    },
    TimeLeft() {
      if (this.timeLeft < 0) return "00:00:00"
      const leftTime = new Date();
      leftTime.setHours(0);
      leftTime.setMinutes(0);
      leftTime.setSeconds(this.timeLeft);
      return (leftTime).customFormat( "#hhhh#:#mm#:#ss#" );
    },
  },

  watch: {
    account(val) {
      console.log('account', val);
      if (val) {
        eversdk.initClient(Config[this.network].endpoint);        
        this.subscribeRoot();
        this.updGames();
      }
    },

  },
    
  async mounted() {
  },
}
</script>
