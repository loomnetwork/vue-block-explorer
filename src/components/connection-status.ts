import Vue from 'vue'

export default Vue.extend({
  name: 'ConnectionStatus',
  props: {
    blockchain: { type: Object, required: true }
  },
  data() {
    return {
      connectionUrl: this.blockchain.serverUrl
    }
  },
  computed: {
    isConnected(): boolean {
      return this.blockchain.isConnected
    },
    isUrlEditable(): boolean {
      return this.blockchain.isUrlEditable
    }
  },
  methods: {
    changeConnectionUrl() {
      this.blockchain.serverUrl = this.connectionUrl
    }
  }
})