<template>
	<div id="sliding-column">
    <ul class="sidebar-content">
			<li @click="switchTab('dashboard')" :class="{ active: activeTab == 'dashboard' }"><fa icon="chart-line" class="sidebar-icon"/>Dashboard</li>
			<li @click="switchTab('blocks')" :class="{ active: activeTab == 'blocks' }"><fa icon="code-branch" class="sidebar-icon"/>Blocks</li>
			<li @click="switchTab('peers')" :class="{ active: activeTab == 'peers' }"><fa icon="thermometer-quarter" class="sidebar-icon"/>Peers</li>
			<li @click="switchTab('deployment')" :class="{ active: activeTab == 'deployment' }"><fa icon="code-branch" class="sidebar-icon"/>Deployment</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
	@import '~@/styles/app.scss';
	.sidebar-content {
		color: #ffffff;
		padding-left: 0;
		font-size: 18px;
		li {
			cursor: pointer;
			list-style: none;
			margin-rigth: 12px;
			padding: 12px 0 12px 24px;
			border-left: 4px solid transparent;			
			.sidebar-icon {
				width: 30px;
			}
			&.active {
				background-color: rgb(37, 37, 37);
    		border-left: 4px solid #fc4b7f;
			}
		}		
	}

  #sliding-column {
		z-index: 99;
    position: relative;
    min-width: 264px;
    padding: 36px 0;    
    background-color: $bg_light_gray;
    @include dark-shadow();
    box-shadow: 5px 12px 20px rgba(17, 18, 19, 0.33);
    transition: max-width 0.2s ease 0.5s;
  }

  @media (max-width: 576px) {
    #sliding-column {
      width: 100%;
    }
  }  

</style>

<script lang="ts" src="./sidebar.ts"></script>
