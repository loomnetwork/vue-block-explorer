import { Component, Prop, Vue } from 'vue-property-decorator'

import { ICreateAccountTx } from '@/transaction-reader'

// @ts-ignore: Work around for https://github.com/Toilal/vue-webpack-template/issues/62
import TxPreviewField from './TxPreviewField.vue'

@Component({
  components: {
    TxPreviewField
  }
})
export default class CreateAccountTxPreview extends Vue {
  @Prop() tx!: ICreateAccountTx // prettier-ignore

  showLargeHead: boolean = false;

  get kind(): string {
    return this.tx.txKind
  }

  get owner(): { chainId: string; app: string; address: string } {
    const { chainId, app, address } = this.tx.owner
    return { chainId, app, address: address.toString('hex') }
  }

  get username(): string {
    return this.tx.username
  }

  get email(): string {
    return this.tx.email
  }

  get name(): string {
    return this.tx.name
  }

  get image(): string {
    return this.tx.image
  }

  onHeadImageHover(): void {
    this.showLargeHead = !this.showLargeHead;
  }
}
