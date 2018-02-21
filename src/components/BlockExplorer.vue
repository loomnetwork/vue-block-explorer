<template>
  <component :is="viewComponent" :blockchain="blockchain"></component>
</template>

<style lang="scss">
  .pointer-only {
    user-select: none;
    cursor: default;
  }
</style>

<script lang="ts" src="./block-explorer"></script>
