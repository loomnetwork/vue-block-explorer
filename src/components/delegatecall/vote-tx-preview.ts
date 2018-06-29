import { Component, Prop, Vue } from 'vue-property-decorator'

import { IVoteTx, CommentKind } from '@/transaction-reader'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TxPreviewField from './TxPreviewField.vue'

@Component({
  components: {
    TxPreviewField
  }
})
export default class VoteTxPreview extends Vue {
  @Prop() tx!: IVoteTx // prettier-ignore

  get kind(): string {
    return this.tx.txKind
  }

  get voter(): string {
    return this.tx.voter
  }

  get isUpvote(): boolean {
    return this.tx.up
  }

  get permalink(): string {
    return this.tx.comment_permalink
  }
}

function getBaseUrl() {
  return 'https://delegatecall.com'
}
