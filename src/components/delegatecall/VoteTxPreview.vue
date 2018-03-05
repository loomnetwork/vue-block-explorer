<template>
  <div>
    <TxPreviewField label="Kind:" class="kind" :value="kind"/>
    <TxPreviewField label="Permalink:" :value="permalink"/>
    <TxPreviewField label="Vote:">
      <span  v-if="isUpvote" class="arrow arrow-up" fixed-width> </span>
      <span v-else class="arrow arrow-down" fixed-width> </span>
    </TxPreviewField>
    <TxPreviewField label="Voter:" class="author" :value="voter"/>
  </div>
</template>

<style lang="css" scoped>
.arrow {
  width: 16px;
  height: 18px;
  display: inline-block;
  background-position: bottom;
}
.arrow-up {
  background: url(../../images/arrow_up.svg) no-repeat;
}

.arrow-down {
  background: url(../../images/arrow_down.svg) no-repeat;
}
</style>

<script lang="ts" src="./vote-tx-preview.ts"></script>
