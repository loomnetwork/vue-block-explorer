<template>
  <div>
    <h1 class="page-header">Dashboard</h1>
    <b-row>
      <b-col>
        <Card elementId="chart1">
          <canvas id="chart1"></canvas>
        </Card>
      </b-col>
      <b-col>
        <Card elementId="chart2">
          <canvas id="chart2"></canvas>
        </Card>
      </b-col>
      <b-col>
        <Card elementId="chart3">
          <canvas id="chart3"></canvas>
        </Card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <Card elementId="chart5">
          <canvas id="chart5"></canvas>
        </Card>
      </b-col>
      <b-col>
        <Card elementId="chart6">
          <canvas id="chart6"></canvas>
        </Card>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  color: #354168;
}
</style>

<script lang="ts" src="./dashboard.ts"></script>
