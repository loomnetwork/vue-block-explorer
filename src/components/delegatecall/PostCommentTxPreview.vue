<template>
  <div>
    <TxPreviewField label="Kind:" :value="payload.kind"/>
    <TxPreviewField v-if="payload.parent_permalink" :label="parentPermalinkLabel" :value="payload.parent_permalink"/>
    <TxPreviewField label="Permalink:" :value="payload.permalink"/>
    <TxPreviewField label="Author:" :value="payload.author"/>
    <TxPreviewField label="Title:" :value="payload.title"/>
    <b-form-textarea plaintext :value="payload.body" :rows="5" :no-resize="true"></b-form-textarea>
    <div>
      <span class="text-white">Tags: </span>
      <b-badge v-for="tag in payload.tags" :key="tag">{{ tag }}</b-badge>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '~@/styles/app.scss';

  .form-control-plaintext {
    color: $white;
    background-color: darken($body-bg, 5%);
  }
</style>

<script lang="ts" src="./post-comment-tx-preview.ts"></script>
