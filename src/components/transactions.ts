// interface IBlockListItem {
//   blockHeight: number
//   numTransactions: number
//   hash: string
//   age: string
//   time: string
//   block: IBlockchainBlock
// }

import { Vue } from 'vue-property-decorator'
// @ts-ignore
import TransactionList from './TransactionList.vue'
import { Blockchain } from '../blockchain'

export default Vue.extend({
  name: 'Transactions',
  data() {
    return {
      blockchain: new Blockchain({
        chainID: this.chainID,
        serverUrl: this.defaultUrl,
        allowedUrls: this.allowedUrls
      })
    }
  },
  components: {
    TransactionList
  },
  props: ['defaultUrl', 'allowedUrls', 'chainID']
})
