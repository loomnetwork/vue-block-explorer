<template>
  <div>
    <TxPreviewField class="kind" label="Kind:" :value="payload.kind"/>
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
    <TxPreviewField v-else-if="isQuestion" label="Permalink:" :value="payload.permalink"/>
    <TxPreviewField class="author" label="Author:" :value="payload.author"/>
    <TxPreviewField label="" v-if="isQuestion" class="tx-title" :value="payload.title"/>
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
  color: $light_white;
  margin-top: 20px;
  text-align: center;
}

.form-control-plaintext {
  color: $white;
  padding: 23px 58px;
  margin: 31px 0 15px 0;
  background-color: $dark-text-bg;
  font-size: 18px;
  width: calc(100% + #{$block_side_padding} * 2) !important;
  margin-left: -#{$block_side_padding};
  max-height: 480px;

  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: $bg_gray;
    margin-top: 47px;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: $dark-text-bg;
  }

  &:hover,
  &:active,
  &:focus {
    outline: none;
  }
}

.badge-secondary {
  border-radius: 5px;
  border: solid 1.2px theme-color('info');
  background: none;
  font-size: 13px;
  font-weight: normal;
  text-align: left;
  color: theme-color('info');
  height: 24px;
  position: relative;
  margin-right: 12px;

  &::before {
    content: '●';
    margin-right: 4px;
  }
}
</style>

<script lang="ts" src="./post-comment-tx-preview.ts"></script>
