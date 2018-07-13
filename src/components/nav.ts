import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class Nav extends Vue {
  mounted() {
    console.log('Nav is mounted')
  }
}
