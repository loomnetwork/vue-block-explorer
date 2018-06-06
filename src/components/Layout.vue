<template>
  <div>
    <b-container fluid>
      <Nav></Nav>
      <b-row id="flex-wrapper">        
        <Sidebar v-on:switch-tab="switchTabHandler"/>
        <div class="main-content">
        	<component :is="activeComponent"
        						 :showConnectionDropdown="true"
            				 :defaultUrl="allowedUrls[0]"
            				 :allowedUrls="allowedUrls"
            				 :searchQuery="searchQuery"/>
        </div>
      </b-row>
      <b-row>
        Footer
      </b-row>
      <div class="block-search-query d-flex flex-row align-items-center">
        <fa :icon="['fas', 'search']" class="search-icon text-white" fixed-width/>
        <label for="sq-block-height" class="height-label text-white">Block Height:</label>
        <b-form-input id="sq-block-height" class="height-input bg-dark text-white" type="number" v-model="blockHeight"></b-form-input>
      </div>
    </b-container>
  </div>
</template>

<style lang="scss" scoped>
	@import '~@/styles/app.scss';

  .block-search-query {
    .search-icon {
      margin-right: 0.5rem;
      width: 32px;
      height: 32px;
    }
  
    .height-label {
      margin-right: 0.5rem;
      flex: 0 0 auto;
    }

    .height-input {
      flex: 0 0 200px;
    }
  }

  #flex-wrapper {
    flex-wrap: nowrap;
    flex-direction: row;
  }  

  @media (max-width: 576px) {
    #flex-wrapper {      
      flex-direction: column;
    }
  }

  // @media (min-width: 992px) {
  //   #sliding-column {
  //     max-width: 250px;
  //   }
  // }

  .main-content {
   	height: 100vh; // fallback
   	padding: 24px;
  	height: calc(100vh - 160px);
    flex-grow: 1;
  }

</style>

<script lang="ts" src="./layout.ts"></script>
