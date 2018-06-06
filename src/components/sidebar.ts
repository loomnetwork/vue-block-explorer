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
	switchTab(tab) {
		this.$emit('switch-tab', tab)
	}
}
