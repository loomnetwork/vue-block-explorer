<template>
	<div class="custom-card">
		<canvas id="myChart"></canvas>
  </div>
</template>

<style lang="scss" scoped>
	@import '~@/styles/app.scss';
	.custom-card {
		padding: 12px;
		border-radius: 12px;
		@include dark-shadow();
	}
</style>

<script lang="ts" src="./card.ts"></script>
