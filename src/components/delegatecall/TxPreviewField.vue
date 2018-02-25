<template>
  <div>
    <span class="text-white">{{curLabel}}</span>
    <slot>
      <span class="text-muted">{{curValue}}</span>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
  @import '~@/styles/app.scss';

  .text-muted {
    color: lighten($text-muted, 30%) !important;
  }
</style>

<script lang="ts" src="./tx-preview-field.ts"></script>
