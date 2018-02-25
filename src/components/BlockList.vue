<template>
  <div class="position-relative">
    <div>
      <div class="section-header d-flex flex-row">
        <div class="bg-dark col-9">
          <h3 class="text-primary pointer-only">Blocks <fa v-if="isBusy" icon="spinner" spin/></h3>
        </div>
        <div class="bg-dark ml-auto px-0">
          <div class="d-flex flex-row">
            <h3 class="mx-2 text-white pointer-only">Filter by</h3>
            <b-dropdown text="Most recent" right variant="dark">
              <b-dropdown-item>Most old</b-dropdown-item>
              <b-dropdown-item>Pending</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="blocks-table">
        <b-table ref="blocksTable"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
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
          <template slot="speed" slot-scope="row">
            <div class="d-flex flex-column">
              <span class="p-0">{{ row.value.time }} ms</span>
              <span class="p-0 text-muted">Via node # {{ row.value.node }}</span>
            </div>
          </template>
        </b-table>
        <div class="d-flex flex-row">
        <ConnectionStatus v-if="showConnectionDropdown" class="connection-status" :blockchain="blockchain"/>
        <b-pagination
          v-model="currentPage"
          size="sm"
          :total-rows="totalNumBlocks"
          :per-page="perPage"
          :align="paginationAlignment"/>
        </div>
      </div>
    </div>
    <div class="block-info-overlay" :class="{ show: isBlockInfoVisible }">
      <BlockInfo class="block-info-card" v-bind="blockInfoProps"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
      right: 0;
      width: 50%;
    }
  }

  .block-info-card {
    width: 100%;
    height: 100%;
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
