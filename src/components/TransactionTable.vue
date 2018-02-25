<template>
  <div class="block-explorer-tx-table">
    <b-table
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :show-empty="true"
      :items="items"
      :fields="fields"
      :hover="true"
      :head-variant="muted"
      @row-clicked="rowClickHandler"
      class="table-dark bg-dark">
      <template slot="hash" slot-scope="row">
        <span>{{ row.value }}</span>
      </template>
      <template slot="blockHeight" slot-scope="row">
        <span class="text-info">{{ row.value }}</span>
      </template>
      <template slot="txType" slot-scope="row">
        {{ row.value }}
      </template>
      <template slot="age" slot-scope="row">
        {{ row.value }}
      </template>
      <template slot="sender" slot-scope="row">
        {{ row.value }}
      </template>
    </b-table>
  </div>
</template>

<script lang="ts" src="./transaction-table.ts"></script>
