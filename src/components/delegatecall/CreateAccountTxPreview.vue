<template>
  <div>
    <TxPreviewField class="kind" label="Kind:" :value="kind"/>
    <div class="text-white text-title">Owner</div>
    <div class="ml-3">
      <TxPreviewField class="text-bold" label="Chain ID:" :value="owner.chainId"/>
      <TxPreviewField class="text-bold" label="App:" :value="owner.app"/>
      <TxPreviewField class="address" label="Address:" :value="owner.address"/>
    </div>
    <TxPreviewField class="author" label="Username:" :value="username"/>
  </div>
</template>

<style lang="scss" scoped>
.ml-3{
  margin-left:0 !important;
}
</style>

<script lang="ts" src="./create-account-tx-preview.ts"></script>
