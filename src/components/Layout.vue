<template>
  <div>
    <b-container fluid>
      <Nav></Nav>
      <b-row id="flex-wrapper">        
        <Sidebar v-on:switch-tab="switchTabHandler"/>
        <div class="main-content">
        	<transition mode="out-in" name="fade">
        		<component :is="activeComponent"
	        						 :showConnectionDropdown="true"
	            				 :defaultUrl="allowedUrls[0]"
	            				 :allowedUrls="allowedUrls"
	            				 :searchQuery="searchQuery"/>
					</transition>
        </div>
      </b-row>
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

	.fade-enter-active, .fade-leave-active {
	  transition: opacity .5s;
	}

	.fade-enter, .fade-leave-to {
	  opacity: 0;
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
   	height: 100vh;
   	padding: 24px;
    flex-grow: 1;
  }

</style>

<script lang="ts" src="./layout.ts"></script>
