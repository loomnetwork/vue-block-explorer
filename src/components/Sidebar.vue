<template>
	<div id="sliding-column">
    <ul class="sidebar-content">
			<li @click="triggerTabChange('dashboard')"><fa icon="chart-line" class="sidebar-icon"/>Dashboard</li>
			<li @click="triggerTabChange('nodes')"><fa icon="thermometer-quarter" class="sidebar-icon"/>Peer nodes</li>
			<li @click="triggerTabChange('deployment')"><fa icon="code-branch" class="sidebar-icon"/>Deployment</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
	@import '~@/styles/app.scss';
	.sidebar-content {
		color: #ffffff;
		padding-left: 24px;
		font-size: 18px;
		li {
			list-style: none;
			margin-rigth: 12px;
			margin-bottom: 12px;
			.sidebar-icon {
				width: 30px;
			}
			a {
				padding-left: 18px;
				text-decoration: none;
			}
		}		
	}

  #sliding-column {
		z-index: 99;
    position: relative;  	
    width: 264px;
    min-width: 228px;
    padding: 36px 0;    
    background-color: $bg_light_gray;
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
