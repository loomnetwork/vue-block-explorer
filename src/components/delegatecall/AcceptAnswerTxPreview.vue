<template>
  <div>
    <TxPreviewField label="Kind:" class="kind" value="Accepted Answer"/>
    <TxPreviewField label="Permalink:" class="permalink" :value="permalink"/>
    <TxPreviewField label="Accepted By:" class="author" :value="acceptor"/>
  </div>
</template>

<script lang="ts" src="./accept-answer-tx-preview.ts"></script>
