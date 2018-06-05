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
  triggerTabChange(tab: string) {
		console.log("The tab", tab);
		this.$parent.$options.methods.switchTab(tab)
  }  
}
