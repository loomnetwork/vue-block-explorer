import { Component, Prop, Vue } from 'vue-property-decorator'
import { VueConstructor } from 'vue/types/vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import BlockExplorer from '../components/BlockExplorer.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import Transactions from '../components/Transactions.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import Deployment from '../components/Deployment.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import Dashboard from '../components/Dashboard.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import Sidebar from '../components/Sidebar.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import Peers from '../components/Peers.vue'
// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import Nav from '../components/Nav.vue'
// @ts-ignore
import ISearchQuery from 'block-explorer'
@Component({
  components: {
    BlockExplorer,
    Sidebar,
    Nav
  },
  props: {
    showConnectionDropdown: Boolean,
    defaultUrl: String,
    allowedUrls: Array
  }
})
export default class Layout extends Vue {
  activeTab: string
  blockHeight: string | null = null
  pages: Object | null = {
    dashboard: Dashboard,
    blocks: BlockExplorer,
    transactions: Transactions,
    deployment: Deployment,
    peers: Peers
  }

  switchTabHandler(tab: string) {
    this.activeTab = tab
  }

  get searchQuery(): ISearchQuery {
    let blockHeight: number | null = null
    if (this.blockHeight) {
      blockHeight = parseInt(this.blockHeight, 10)
      if (!Number.isInteger(blockHeight) || blockHeight < 0) {
        blockHeight = null
      }
    }
    return { blockHeight }
  }

  get activeComponent(): VueConstructor {
    // return this.pages![this.activeTab] || BlockExplorer
    return BlockExplorer
  }
}
