import { Component, Prop, Vue } from 'vue-property-decorator'

import { IVoteTx, CommentKind, IDecodedTx } from '@/transaction-reader'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TxPreviewField from './TxPreviewField.vue'

@Component({
  components: {
    TxPreviewField
  }
})
export default class VoteTxPreview extends Vue {
  // @Prop() tx!: IVoteTx // prettier-ignore
  @Prop() tx!: IDecodedTx // prettier-ignore
  // get kind(): string {
  //   return this.tx.txKind
  // }
  //
  // get voter(): string {
  //   return this.tx.voter
  // }
  //
  // get isUpvote(): boolean {
  //   return this.tx.up
  // }
  //
  // get permalink(): string {
  //   return this.tx.comment_permalink
  // }
  get txData(): Array<any> {
    let txValueData = this.tx.txArrData[1];
    let data = txValueData.split(",");
    let txData = [];
    for (let i = 0; i < data.length; i += 2) {
      txData.push({
        key: data[i],
        value: data[i+1]
      });
    }
    return txData;
  }

  get txMethod(): string {
    return this.tx.txArrData[0]
  }
}

function getBaseUrl() {
  return 'https://delegatecall.com'
}
