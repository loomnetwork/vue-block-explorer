<template>
	<div id="sliding-column">
    <ul class="sidebar-content">
			<li :class="{ active: activeTab == 'dashboard' }"><a @click="switchTab('dashboard')"><fa icon="chart-line" class="sidebar-icon"/>Dashboard</a></li>
			<li :class="{ active: activeTab == 'blocks' || activeTab == 'transactions' }">
				<a v-b-toggle="'submenu'" @click="switchTab('blocks')">
					<fa icon="code-branch" class="sidebar-icon"/>Blocks
				</a>
			  <b-collapse id="submenu" v-model="expandAccordion">
		      <ul class="submenu">
		      	<li>
		      		<a @click="switchTab('blocks')">Blocks</a>
		      	</li>
		      	<li>
		      		<a @click="switchTab('transactions')">Transactions</a>
		      	</li>
		      </ul>
			  </b-collapse>
			</li>
			<li :class="{ active: activeTab == 'peers' }"><a @click="switchTab('peers')"><fa icon="thermometer-quarter" class="sidebar-icon"/>Peers</a></li>
			<li :class="{ active: activeTab == 'deployment' }"><a @click="switchTab('deployment')"><fa icon="code-branch" class="sidebar-icon"/>Deployment</a></li>
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
			border-left: 4px solid transparent;
			a {
				display: inline-block;
				width: 100%;
				padding: 12px 0 12px 24px;	
			}			
			.sidebar-icon {
				width: 30px;
			}
			&.active {
				background-color: rgb(37, 37, 37);
    		border-left: 4px solid #fc4b7f;
			}
		}		
	}

	.submenu {		
		li {
			padding: 6px 0 6px 12px;
			a {
				padding: 0px;
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
