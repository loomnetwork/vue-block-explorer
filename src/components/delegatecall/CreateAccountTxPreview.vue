<template>
  <div>
    <TxPreviewField class="kind" label="Kind:" :value="kind"/>
    <div class="text-white text-title">Owner</div>
    <div class="row user-profile">
      <TxPreviewField >
        <img :src="image" v-on:mouseenter="onHeadImageHover" v-on:mouseleave="onHeadImageHover">
      </TxPreviewField>
     <TxPreviewField class="author author-name" label="" :value="name"/>
     <TxPreviewField class="user-image" v-show="active">
        <img :src="image">
      </TxPreviewField>
    </div>
      <TxPreviewField class="author" label="User Name: " :value="username"/>
    <div class="ml-3">
      <TxPreviewField class="text-bold" label="Chain ID:" :value="owner.chainId"/>
      <TxPreviewField class="text-normal" label="App:" :value="owner.app"/>
      <TxPreviewField class="address" label="Address:" :value="owner.address"/>
    </div>
   
   
    
      
  </div>
</template>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.ml-3 {
  margin-left: 0 !important;

  div {
    margin-bottom: 7px;
  }
}

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
    font-weight: 600px;
    color: #ffffff;
  }
}

.user-profile {
  $line_height: 82px;
  margin: {
    left: 0;
    bottom: 10px;
  }
  img {
    width: auto;
    height: $line_height;
  }

  .author-name {
    line-height: $line_height;
    margin-left: 20px;
  }
  
  .user-image{
    img{
      width: initial;
      height: initial;
      max-height: $line_height * 7;
      position: absolute;
      left: 145px;
      box-shadow: 8px 12px 20px 1px #101010
    }
  }
}

 .author{
    margin-bottom: 10px;
  }
</style>

<script lang="ts" src="./create-account-tx-preview.ts"></script>
