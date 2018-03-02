<template>
  <div>
    <TxPreviewField label="Kind:" :value="payload.kind"/>
    <!-- Resolve the permalink if possible and display as a link -->
    <TxPreviewField v-if="resolvedParentPermalink" :label="parentPermalinkLabel">
      <a :href="resolvedParentPermalink" target="_blank">{{payload.parent_permalink}}</a>
    </TxPreviewField>
    <!-- If the permalink can't be resolved just display as plain text -->
    <TxPreviewField v-else :label="parentPermalinkLabel" :value="payload.parent_permalink"/>
    <!-- Resolve the permalink if possible and display as a link -->
    <TxPreviewField v-if="resolvedPermalink" label="Permalink:">
      <a :href="resolvedPermalink" target="_blank">{{payload.permalink}}</a>
    </TxPreviewField>
    <!-- If the permalink can't be resolved just display as plain text -->
    <TxPreviewField v-else label="Permalink:" :value="payload.permalink"/>
    <TxPreviewField label="Author:" :value="payload.author"/>
    <TxPreviewField label="" class="tx-title" :value="payload.title"/>
    <b-form-textarea plaintext :value="payload.body" :rows="5" :no-resize="true"></b-form-textarea>
    <div v-if="payload.tags.length > 0">
      <span class="text-white">Tags: </span>
      <b-badge v-for="tag in payload.tags" :key="tag">{{ tag }}</b-badge>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~@/styles/app.scss';

.tx-title {
  letter-spacing: 0.6px;
  text-align: left;
  color: #eeeeee;
  text-align: center;
  font-size: 24px !important;
}

.form-control-plaintext {
  color: $white;
  padding: 23px 58px;
  margin-top: 9px;
  background-color: #111111;
  font-size: 18px;
  width: calc(100% + #{$blcok_side_padding} * 2) !important;
  margin-left: -#{$blcok_side_padding};
}
</style>

<script lang="ts" src="./post-comment-tx-preview.ts"></script>
