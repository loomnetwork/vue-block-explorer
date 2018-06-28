<template>
  <div>
    <!--<TxPreviewField label="Kind:" class="kind" :value="kind"/>-->
    <!--<TxPreviewField label="Permalink:" class="permalink" :value="permalink"/>-->
    <!--<TxPreviewField label="Vote:">-->
      <!--<span  v-if="isUpvote" class="arrow arrow-up" fixed-width> </span>-->
      <!--<span v-else class="arrow arrow-down" fixed-width> </span>-->
    <!--</TxPreviewField>-->
    <!--<TxPreviewField label="Voter:" class="author" :value="voter"/>-->
    <TxPreviewField label="Method:" class="kind" :value="txMethod"/>
    <div v-for="txValue in txData">
      <TxPreviewField label="Key:" class="kind" :value="txValue.key"/>
      <TxPreviewField label="Value:" class="kind" :value="txValue.value"/>
    </div>
  </div>
</template>

<style lang="css" scoped>
.arrow {
  width: 16px;
  height: 18px;
  display: inline-block;
  background-position: bottom !important;
}
.arrow-up {
  background: url(../../images/vote_up.svg) no-repeat;
}

.arrow-down {
  background: url(../../images/vote_down.svg) no-repeat;
}
</style>

<script lang="ts" src="./vote-tx-preview.ts"></script>
