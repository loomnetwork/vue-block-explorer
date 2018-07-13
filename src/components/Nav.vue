<template>
  <b-row id="nav-container">
    <div class="section-header d-flex flex-row">
      <div class="header-logo">
        <a href="/">
          <div class="loom-logo"></div><span class="site-name">DAppChain</span>
        </a>
      </div>
    </div>         
  </b-row>
</template>

<style lang="scss" scoped>

  @import '~@/styles/app.scss';

  #nav-container {
    z-index: 100;
    position: relative;
    background-color: #ffffff;
    @include shadow();
  }

  .section-header {
    width: 100%;
    padding: 24px 48px;    
    @include normal-font();

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

  .loom-logo {
    display: inline-block;
    background: url('../images/loom_logo.svg') no-repeat center;
    width: 32px;
    height: 28px;
    margin-right: 12px;
    vertical-align: top;
  }

  .site-name {
    font-size: 20px;
    font-weight: 600;
    color: #354167;
  }


</style>

<script lang="ts" src="./nav.ts"></script>
