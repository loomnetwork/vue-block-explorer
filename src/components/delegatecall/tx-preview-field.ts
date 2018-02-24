import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class TxPreviewField extends Vue {
  @Prop()
  label!: string

  @Prop({ type: [String, Number, Boolean] })
  value?: string | number | boolean

  get curLabel() {
    return this.label
  }

  get curValue() {
    return this.value
  }
}
