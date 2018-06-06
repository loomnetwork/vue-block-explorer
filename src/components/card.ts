import { Component, Prop, Vue } from 'vue-property-decorator'
import Chart from 'chart.js'
import planetChartData from '../chartdata'

@Component
export default class Card extends Vue {
  mounted() {
    this.createChart('myChart', planetChartData);
  } 
  createChart(chartId: string, chartData: object) {
    const ctx = document.getElementById(chartId)
    const myChart = new Chart(ctx, {
      type: chartData.type,
      data: chartData.data,
      options: chartData.options
    });
  }  
}
