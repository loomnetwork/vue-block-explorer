<template>
  <div class="position-relative">
    <div>
      <div class="section-header d-flex flex-row">
        <div class="bg-dark">
            <div class="header-logo">
              <a href="/" class="">
                <img src="../images/loom_logo.svg"> <span class="site-name">DAppChain</span>
              </a>
            </div>
            <div class="header-table-name">
              <div class="text-primary pointer-only">Blocks <fa v-if="isBusy" icon="spinner" spin/></div>
            </div>
            <div class="header-profile">
              <img src="../images/user_image.png" class="user-head">
              <img src="../images/down_gray_arrow.svg" class="down-arrow">

            </div>
        </div>
        <!-- TODO
        <div class="bg-dark ml-auto px-0">
          <div class="d-flex flex-row">
            <h3 class="mx-2 text-white pointer-only">Filter by</h3>
            <b-dropdown text="Most recent" right variant="dark">
              <b-dropdown-item>Most old</b-dropdown-item>
              <b-dropdown-item>Pending</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
        -->
      </div>
      <div class="blocks-table">
        <b-table ref="blocksTable"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :no-provider-sorting="true"
          :show-empty="true"
          :items="blocks"
          :fields="fields"
          :hover="true"
          :head-variant="muted"
          @row-clicked="onRowClicked"
          :current-page="currentPage"
          :per-page="perPage"
          :busy.sync="isBusy"
          class="table-dark bg-dark">
          <template slot="blockHeight" slot-scope="row">
            <span>#{{ row.value }}</span>
          </template>
          <template slot="numTransactions" slot-scope="row">
            <span class="text-info">{{ row.value }}</span>
          </template>
          <template slot="age" slot-scope="row">
            <span>{{ row.value }}</span>
          </template>
          <template slot="time" slot-scope="row">
            <span>{{ row.value }}</span>
          </template>
        </b-table>
        <div class="d-flex flex-row">
        <ConnectionStatus v-if="showConnectionDropdown" class="connection-status"
          :blockchain="blockchain"
          @urlClicked="onConnectionUrlChanged"/>
        <b-pagination
          v-model="currentPage"
          size="sm"
          :total-rows="totalNumBlocks"
          :per-page="perPage"
          :align="paginationAlignment"
          first-text="&nbsp;"
          last-text="&nbsp;"
          prev-text="&nbsp;"
          next-text="&nbsp;"
          />
        </div>
      </div>
    </div>
    <div class="block-info-overlay" :class="{ show: isBlockInfoVisible }">
      <BlockInfo class="block-info-card" v-bind="blockInfoProps"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~@/styles/app.scss';
// header bar
.section-header {
  .bg-dark {
    width: 100%;
    height: 26px;
    padding: 0;
    line-height: 25px;
    div {
      display: inline-block;
      padding: 0;
    }
  }
  padding: 26px 0;
  @include normal-font();
  .header-logo {
    width: 20%;
    a {
      color: $blue2;
      font-size: 25px;
      font-weight: 300;
      text-align: left;
      &:hover {
        text-decoration: none;
      }
      img {
        height: 25px;
        width: auto;
        vertical-align: top;
        margin-right: 4px;
      }
    }
  }
  .header-table-name {
    width: 60%;
    text-align: center;
    .text-primary {
      font-size: 28px;
      font-weight: 300;
      line-height: 0.88;
      letter-spacing: 0.7px;
      text-align: left;
      color: theme-color('primary');
      display: inline-block;
      margin: 0 auto;
      width: 180px;
    }
  }
  .header-profile {
    text-align: right;
    float: right;
    padding-right: 20px !important;
    .user-head {
      height: 38px;
      width: auto;
      margin-right: 10px;
    }
  }
}

.block-info-overlay {
  position: absolute;
  z-index: 100;
  top: 0;
  right: calc(-50%);
  width: 0;
  height: 100%;
  // slide-in/out the overlay from the right
  transition-property: right, width;
  transition-duration: 0.3s;

  &.show {
    right: -17px; // fix the right margin
    width: 50%;
  }
}

.block-info-card {
  width: 100%;
  height: 100%;

  background-color: $black2;
}

.connection-status {
  width: 400px;
  flex: none;
}

.pagination {
  flex: 1 1 auto;
}
</style>

<script lang="ts" src="./block-list.ts"></script>
