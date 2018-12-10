import { Component, Prop, Vue } from 'vue-property-decorator'
import { VueConstructor } from 'vue/types/vue'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import BlockList from './BlockList.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TransactionList from './TransactionList.vue'

import { Blockchain } from '../blockchain'

export enum BlockExplorerView {
  Blocks = 'blocks',
  Transactions = 'transactions'
}

export interface ISearchQuery {
  blockHeight: number | null | string
}

@Component({
  components: {
    TransactionList,
    BlockList
  }
})
export default class BlockExplorer extends Vue {
  @Prop() view!: string // prettier-ignore
  @Prop({ default: true }) showConnectionDropdown!: boolean // prettier-ignore
  @Prop({ required: true }) defaultUrl!: string // prettier-ignore
  @Prop({ required: true }) allowedUrls!: string[] // prettier-ignore
  @Prop({ required: true }) defaultWS!: string // prettier-ignore
  @Prop({ required: true }) allowedWSs!: string[] // prettier-ignore
  @Prop({ default: () => ({ blockHeight: null }) }) searchQuery!: ISearchQuery // prettier-ignore

  blockchain: Blockchain | null = new Blockchain({
    serverUrl: this.defaultUrl,
    allowedUrls: this.allowedUrls,
    serverWS: this.defaultWS,
    allowedWSs: this.allowedWSs
  })

  beforeDestroy() {
    if (this.blockchain) {
      this.blockchain.dispose()
      this.blockchain = null
    }
  }

  get viewComponent(): VueConstructor {
    return this.view === BlockExplorerView.Transactions ? TransactionList : BlockList
  }

  get curSearchQuery(): ISearchQuery {
    return this.searchQuery
  }
}
