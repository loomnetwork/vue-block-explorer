import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Blockchain } from '../blockchain'

@Component
export default class ConnectionStatus extends Vue {
  @Prop({ required: true }) blockchain!: Blockchain // prettier-ignore

  connectionUrl = this.blockchain.serverUrl

  get allowedUrls(): string[] {
    return this.blockchain.allowedUrls
  }

  get isConnected(): boolean {
    return this.blockchain.isConnected
  }

  onUrlClicked(url: string) {
    this.connectionUrl = url
    this.blockchain.setServerUrl(url)
  }
}
