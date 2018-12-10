import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator'
import { Blockchain } from '../blockchain'

@Component
export default class ConnectionStatus extends Vue {
  @Prop({ required: true }) blockchain!: Blockchain // prettier-ignore

  get connectionUrl() {
    return this.blockchain.serverUrl
  }

  get allowedUrls(): string[] {
    return this.blockchain.allowedUrls
  }

  get chainID() {
    return 'default'
  }

  get isConnected(): boolean {
    return this.blockchain.isConnected
  }

  @Emit('urlClicked')
  onUrlClicked(url: string) {
    // this comment is just for avoiding empty warn
  }

  @Emit('urlInput')
  setUrl(url: string) {
    // this comment is just for avoiding empty warn
  }

  @Emit('chainIDInput')
  setChainID(url: string) {
    // this comment is just for avoiding empty warn
  }
}
