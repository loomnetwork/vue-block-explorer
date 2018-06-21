// interface IBlockListItem {
//   blockHeight: number
//   numTransactions: number
//   hash: string
//   age: string
//   time: string
//   block: IBlockchainBlock
// }

import { Component, Prop, Vue } from 'vue-property-decorator'
import TransactionList from './TransactionList.vue'
import { Blockchain } from '@/blockchain'

@Component({
  components: {
    TransactionList
  }
})
export default class Transactions extends Vue {
  defaultUrl: string = ''
  allowedUrls: any

  blockchain: Blockchain | null = new Blockchain({
    serverUrl: this.defaultUrl,
    allowedUrls: this.allowedUrls
  })
}
