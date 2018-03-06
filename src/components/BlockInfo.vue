<template>
  <b-card>
    <div slot="header" class="d-flex flex-row">
      <b-breadcrumb :items="breadcrumbs" @click="onTitleClicked"></b-breadcrumb>
      <div class="close-btn" @click="onCloseBtnClicked"></div>
    </div>
    <fa v-if="isLoading" icon="spinner" spin/>
    <div v-if="!isLoading && selectedTx">
      <component :is="txInfoComponent" :tx="selectedTx.data"/>
    </div>
    <div v-if="!isLoading && !selectedTx">
      <div v-if="block" class="text-muted">Created by <span class="node-name">{{ nodeName }}</span></div>
      <div v-if="block" class="text-muted">On <span class="time-tamp"> {{blockTimestamp }}</span></div>
      <div v-if="isVerified" class="text-muted"><img class="verified_icon" src="../images/verified.svg">Verified</div>
      <h5 class="text-white">Transactions</h5>
      <TransactionTable v-bind="txTableProps"/>
    </div>
  </b-card>
</template>

<style lang="scss" scoped>
@import '~@/styles/app.scss';

.card {
  background-color: #1a1a1a;
  border-color: lighten($body-bg, 10%);
}

div.close-btn {
  width: 23.8px;
  height: 23.8px;
  color: $white;
  outline: none;
  cursor: pointer;

  @include hover-focus {
    background-image: url(../images/close_icon_hover.svg);
  }
  position: absolute;
  top: 14px;
  right: 10px;
  background-image: url(../images/close_icon.svg);
}

.breadcrumb {
  flex: 1 1 auto;
  flex-wrap: nowrap;
  margin-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  background-color: transparent;
  font-size: 26px;

  .breadcrumb-item {
    color: $white;
    &::before {
      font-size: 20px;
      color: #ffffff;
    }
  }
}

.fa-spinner {
  width: 10vw;
  height: 10vh;
  color: $white;
}

li.active {
  span {
    font-size: 20px;
    text-align: left;
  }
}

.time-tamp {
  color: #ff4b80;
  font-weight: 600;
}

.node-name {
  font-weight: 600;
  color: theme-color('info');
}

.text-muted,
.text-white {
  color: #eeeeee !important;
  font-weight: normal !important;
}

</style>

<script lang="ts" src="./block-info.ts"></script>
