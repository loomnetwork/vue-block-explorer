import { Component, Prop, Vue } from 'vue-property-decorator'

import { IPostCommentTx, CommentKind } from '@/transaction-reader'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TxPreviewField from './TxPreviewField.vue'

@Component({
  components: {
    TxPreviewField
  }
})
export default class PostCommentTxPreview extends Vue {
  @Prop() tx!: IPostCommentTx // prettier-ignore

  get payload(): IPostCommentTx {
    return this.tx
  }

  get parentPermalinkLabel(): string {
    switch (this.tx.kind) {
      case CommentKind.Answer:
      case CommentKind.Comment:
        return 'Question:'
      default:
        return ''
    }
  }

  get resolvedParentPermalink(): string {
    let parentKind: CommentKind
    switch (this.tx.kind) {
      case CommentKind.Answer:
      case CommentKind.Comment:
        parentKind = CommentKind.Question
        break
      default:
        return ''
    }
    const route = getPermalinkRoute(parentKind)
    if (route) {
      return this.payload.parent_permalink
        ? `${getBaseUrl()}/${route}/${this.payload.parent_permalink}`
        : ''
    }
    return ''
  }

  get resolvedPermalink(): string {
    const route = getPermalinkRoute(this.tx.kind)
    if (route) {
      return this.payload.permalink ? `${getBaseUrl()}/${route}/${this.payload.permalink}` : ''
    }
    return ''
  }
}

function getPermalinkRoute(kind: CommentKind) {
  switch (kind) {
    case CommentKind.Question:
      return 'questions'
    default:
      return ''
  }
}

function getBaseUrl() {
  return 'https://delegatecall.com'
}
