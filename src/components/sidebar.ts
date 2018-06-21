// interface IBlockListItem {
//   blockHeight: number
//   numTransactions: number
//   hash: string
//   age: string
//   time: string
//   block: IBlockchainBlock
// }

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class Sidebar extends Vue {
  activeTab: string | null = 'blocks'
  expandAccordion: boolean = true
  switchTab(tab: String) {
    this.activeTab = tab as string
    this.$emit('switch-tab', tab)
    this.expandAccordion = false
  }
}
