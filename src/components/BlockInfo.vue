<template>
  <b-card>
    <div slot="header" class="d-flex flex-row">
      <b-breadcrumb :items="breadcrumbs" @click="onTitleClicked"></b-breadcrumb>
      <b-button-close @click="onCloseBtnClicked"/>
    </div>
    <div v-if="selectedTx">
      <component :is="txInfoComponent" :tx="selectedTx.data"/>
    </div>
    <fa v-if="isLoading" icon="spinner" spin/>
    <div v-else>
      <div v-if="block" class="text-muted">Created by {{ nodeName }}</div>
      <div v-if="block" class="text-muted">On {{ blockTimestamp }}</div>
      <div v-if="isVerified" class="text-muted">Verified</div>
      <h5 class="text-white">Transactions</h5>
      <TransactionTable v-bind="txTableProps"/>
    </div>
  </b-card>
</template>

<style lang="scss" scoped>
  @import '~@/styles/app.scss';

  .card {
    background-color: lighten($body-bg, 5%);
    border-color: lighten($body-bg, 10%);

    .text-muted {
      color: lighten($text-muted, 40%) !important;
    }
  }

  button.close {
    color: $white;
    outline: none;

    @include hover-focus {
      color: $white;
    }
  }

  .breadcrumb {
    flex: 1 1 auto;
    flex-wrap: nowrap;
    margin-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    background-color: transparent;

    .breadcrumb-item {
      color: $white;
    }
  }

  .fa-spinner {
    width: 10vw;
    height: 10vh;
    color: $white;
  }
</style>

<script lang="ts" src="./block-info.ts"></script>
