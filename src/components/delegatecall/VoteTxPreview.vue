<template>
  <div>
    <TxPreviewField label="Kind:" :value="kind"/>
    <TxPreviewField label="Permalink:" :value="permalink"/>
    <TxPreviewField label="Vote:">
      <fa v-if="isUpvote" icon="arrow-up" fixed-width/>
      <fa v-else icon="arrow-down" fixed-width/>
    </TxPreviewField>
    <TxPreviewField label="Voter:" :value="voter"/>
  </div>
</template>

<style lang="css" scoped>
  .fa-arrow-up, .fa-arrow-down {
    color: white;
  }
</style>

<script lang="ts" src="./vote-tx-preview.ts"></script>
