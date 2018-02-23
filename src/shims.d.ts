// Stop TypeScript complaining about missing type definitions
declare module 'bootstrap-vue'
declare module 'bootstrap-vue/es/components'
declare module '@fortawesome/vue-fontawesome'

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'loom/wire' {
  class Reader {
    constructor(buf: Buffer)
    readInt8(): number
    readUint8(): number
    readByte(): number
    readInt16(): number
    readUint16(): number
    readInt32(): number
    readUint32(): number
    readInt64(): number
    readUint64(): number
    readUvarint(): number
    readString(): string
  }
}
