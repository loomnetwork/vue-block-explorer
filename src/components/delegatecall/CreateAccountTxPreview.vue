<template>
  <div>
    <div class="text-white">Owner</div>
    <div class="ml-3">
      <TxPreviewField label="Chain ID:" :value="owner.chainId"/>
      <TxPreviewField label="App:" :value="owner.app"/>
      <TxPreviewField label="Address:" :value="owner.address"/>
    </div>
    <TxPreviewField label="Username:" :value="username"/>
  </div>
</template>

<script lang="ts" src="./create-account-tx-preview.ts"></script>
