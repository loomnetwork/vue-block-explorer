// Stop TypeScript complaining about missing type definitions
declare module 'bootstrap-vue'
declare module 'bootstrap-vue/es/components'
declare module '@fortawesome/vue-fontawesome'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
