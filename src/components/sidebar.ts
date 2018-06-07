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
	activeTab: String | null = 'dashboard'
	switchTab(tab: String) {
		this.activeTab = tab
		this.$emit('switch-tab', tab)
	}
}
