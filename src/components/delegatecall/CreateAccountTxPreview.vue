<template>
  <div>
    <TxPreviewField class="kind" label="Kind:" :value="kind"/>
    <div class="row user-profile" v-show="hasProfilePic">
      <div class="user-image-small">
        <img :src="image" v-on:mouseenter="onHeadImageHover" v-on:mouseleave="onHeadImageHover"/>
      </div>
      <TxPreviewField class="author author-name" label="" :value="username"/>
      <!--<TxPreviewField class="author author-name" label="" :value="name"/>-->
      <div class="user-image" v-show="showLargeHead">
        <img :src="image"/>
      </div>
    </div>
    <TxPreviewField v-show="!hasProfilePic" class="author" label="Username:" :value="username"/>
    <!--<div class="text-white text-title">Owner</div>-->
    <!--<div class="ml-3">-->
      <!--<TxPreviewField class="text-bold" label="Chain ID:" :value="owner.chainId"/>-->
      <!--<TxPreviewField class="text-normal" label="App:" :value="owner.app"/>-->
      <!--<TxPreviewField class="address" label="Address:" :value="owner.address"/>-->
    <!--</div>-->
  </div>
</template>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';

.text-title {
  margin-top: 26px;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  text-align: left;
  color: $light_white;
  text-transform: uppercase;
}

.text-bold {
  .text-colored {
    font-weight: 600;
    color: #ffffff;
  }
}

.user-profile {
  $profile_head_height: 82px;
  margin: {
    left: 0;
    bottom: 10px;
  }
  img {
    width: auto;
    height: $profile_head_height;
  }

  .author-name {
    line-height: $profile_head_height;
    margin-left: 20px;
  }
  .user-image-small {
    width: $profile_head_height;
    height: $profile_head_height;
    img{
      width: $profile_head_height;
      height: $profile_head_height;
    }
  }
  .user-image {
    img {
      width: initial;
      height: initial;
      max-height: $profile_head_height * 7;
      position: absolute;
      left: 145px;
      box-shadow: 8px 12px 20px 1px #101010;
    }
  }
}

.author {
  margin-bottom: 10px;
}
</style>

<script lang="ts" src="./create-account-tx-preview.ts"></script>
