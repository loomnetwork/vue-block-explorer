<template>
  <div>
    <TxPreviewField class="kind" label="Kind:" :value="kind"/>
    <div class="text-white text-title">Owner</div>
    <div class="ml-3">
      <TxPreviewField label="Chain ID:" :value="owner.chainId"/>
      <TxPreviewField  label="App:" :value="owner.app"/>
      <TxPreviewField class="address" label="Address:" :value="owner.address"/>
    </div>
    <TxPreviewField class="author" label="Username:" :value="username"/>
  </div>
</template>

<script lang="ts" src="./create-account-tx-preview.ts"></script>
