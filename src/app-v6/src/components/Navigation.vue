<template>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
    >
      <v-list-item class="px-2">
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in allGames"
          :key="item.address"
          link
        >
          <v-list-item-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Navigation',

  data: () => ({
    drawer: true,
    mini: true,
  }),

  methods: {
    ...mapActions([]),
  },

  computed: {
    ...mapGetters(['allGames', 'account']),
  },

  watch: {
  },
    
  async mounted() {
  },
}
</script>
