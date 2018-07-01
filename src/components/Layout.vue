<template>
  <div>
    <Nav></Nav>
    <div id="flex-wrapper">
      <Sidebar v-on:switch-tab="switchTabHandler"/>
      <div class="main-content">
        <b-container fluid>

      	<transition mode="out-in" name="fade">
      		<component :is="activeComponent"
        						 :showConnectionDropdown="true"
            				 :defaultUrl="allowedUrls[1]"
            				 :allowedUrls="allowedUrls"
            				 :searchQuery="searchQuery"/>
				</transition>
        </b-container>
      </div>
    </div>
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
    display: flex;
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
    background-color: #eff3f5;
    flex-grow: 1;
  }

</style>

<script lang="ts" src="./layout.ts"></script>
