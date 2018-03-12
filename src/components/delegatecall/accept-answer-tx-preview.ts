import { Component, Prop, Vue } from 'vue-property-decorator'

import { IAcceptAnswerTx } from '@/transaction-reader'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TxPreviewField from './TxPreviewField.vue'

@Component({
  components: {
    TxPreviewField
  }
})
export default class AcceptAnswerTxPreview extends Vue {
  @Prop() tx!: IAcceptAnswerTx // prettier-ignore

  get acceptor(): string {
    return this.tx.acceptor
  }

  get permalink(): string {
    return this.tx.answer_permalink
  }
}
