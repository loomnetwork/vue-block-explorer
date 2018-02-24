import { Component, Prop, Vue } from 'vue-property-decorator'

import { IPostCommentTx } from '@/transaction-reader'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TxPreviewField from './TxPreviewField.vue'

@Component({
  components: {
    TxPreviewField
  }
})
export default class PostCommentTxPreview extends Vue {
  @Prop() tx!: IPostCommentTx // prettier-ignore

  get parentPermalinkLabel(): string {
    switch (this.tx.kind) {
      case 'question':
        return ''
      case 'answer':
        return 'Question Permalink:'
      case 'comment':
        return 'Question Permalink:'
    }
  }

  get payload(): IPostCommentTx {
    return this.tx
  }
}
