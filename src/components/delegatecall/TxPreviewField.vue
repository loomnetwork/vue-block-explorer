<template>
  <div>
    <span class="text-white">{{curLabel}}</span>
    <span class="text-muted">{{curValue}}</span>
  </div>
</template>

<style lang="scss" scoped>
  @import '~@/styles/app.scss';

  .text-muted {
    color: lighten($text-muted, 30%) !important;
  }
</style>

<script lang="ts" src="./tx-preview-field.ts"></script>
