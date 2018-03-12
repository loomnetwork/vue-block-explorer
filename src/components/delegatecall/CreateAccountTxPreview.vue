<template>
  <div>
    <TxPreviewField class="kind" label="Kind:" :value="kind"/>
    <div class="text-white text-title">Owner</div>
    <div class="ml-3">
      <TxPreviewField class="text-bold" label="Chain ID:" :value="owner.chainId"/>
      <TxPreviewField class="text-normal" label="App:" :value="owner.app"/>
      <TxPreviewField class="address" label="Address:" :value="owner.address"/>
    </div>
    <TxPreviewField class="author" label="Username" :value="username"/>
    <TxPreviewField class="author" label="Acountname:" :value="name"/>
    <TxPreviewField label="">
        <img :src="image">
    </TxPreviewField>
      
  </div>
</template>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.ml-3 {
  margin-left: 0 !important;

  div {
    margin-bottom: 7px;
  }
}

.text-title {
  margin-top: 26px;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  text-align: left;
  color: $light_white;
  text-transform: uppercase;
}

.text-bold {
  .text-colored {
    font-weight: 600px;
    font-color: #ffffff;
  }
}
</style>

<script lang="ts" src="./create-account-tx-preview.ts"></script>
