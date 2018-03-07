<template>
  <component :is="viewComponent"
    :blockchain="blockchain"
    :showConnectionDropdown="showConnectionDropdown">
  </component>
</template>

<style lang="scss">
@import '~@/styles/_variables.scss';
.pointer-only {
  user-select: none;
  cursor: default;
}
.header-table-name{
  text-transform: uppercase;
}

//pagination
.pagination {
  .page-link {
    border: none;
    background: none !important;
  }
  li {
    width: 24px;
    height: 24px;
    margin: 6px;
    a {
      margin-left: 0;
      padding: 0 !important;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      color: #ffffff;
      line-height: 24px;
      height: 24px;
      &:focus {
        box-shadow: none;
      }
    }
  }
  .active a {
    background-color: $red2 !important;
  }

  .page-item {
    &:first-child.disabled {
      background: url('../images/verry_back_arrow_left.svg') no-repeat center;
    }
    &:first-child {
      background: url('../images/verry_back_arrow_left_active.svg') no-repeat center;
    }

    &:nth-child(2).disabled {
      background: url('../images/back_arrow.svg') no-repeat center;
    }

    &:nth-child(2) {
      background: url('../images/back_arrow_active.svg') no-repeat center;
    }

    &:last-child.disabled {
      background: url('../images/verry_back_arrow_right.svg') no-repeat center;
    }

    &:last-child {
      background: url('../images/verry_back_arrow_right_active.svg') no-repeat center;
    }
    &:nth-last-child(2).disabled {
      background: url('../images/forward_arrow.svg') no-repeat center;
    }

    &:nth-last-child(2) {
      background: url('../images/forward_arrow_active.svg') no-repeat center;
    }
  }
}
</style>

<script lang="ts" src="./block-explorer"></script>
