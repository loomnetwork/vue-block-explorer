<template>
  <b-card>
    <div slot="header" class="d-flex flex-row">
      <b-breadcrumb :items="breadcrumbs" @click="onTitleClicked"></b-breadcrumb>
      <b-button-close @click="onCloseBtnClicked"/>
    </div>
    <div v-if="selectedTx">
      <div>Created by {{ nodeName }}</div>
      <div>On {{ txTimestamp }}</div>
      Details
    </div>
    <div v-else>
      <div v-if="block">Created by {{ nodeName }}</div>
      <div v-if="block">On {{ blockTimestamp }}</div>
      <div v-if="isVerified">Verified</div>
      <TransactionTable v-bind="txTableProps"/>
    </div>
  </b-card>
</template>

<style lang="scss" scoped>
  .breadcrumb {
    flex: 1 1 auto;
    flex-wrap: nowrap;
    margin-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    background-color: transparent;
  }
</style>


<script lang="ts" src="./block-info.ts"></script>
