import { Component, Prop, Vue } from 'vue-property-decorator'
import Chart from 'chart.js'
import planetChartData from '@/chartdata'

@Component({})
export default class Card extends Vue {
  @Prop() elementId: string

  mounted() {
    this.createChart(this.elementId, planetChartData)
  }

  createChart(chartId: string, chartData: object) {
    const ctx = document.getElementById(chartId)
    if (ctx) {
      const myChart = new Chart(ctx as HTMLCanvasElement, chartData)
    }
  }
}
