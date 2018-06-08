export const planetChartData = {
  type: 'line',
  data: {
    labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    datasets: [
      { // one line graph
        label: 'Number of Moons',
        data: [0, 0, 1, 2, 67, 62, 27, 14],
        backgroundColor: [
          'rgba(52, 156, 250, 0.8)',
          'rgba(52, 156, 250, 0.8)',
          'rgba(52, 156, 250, 0.8)',
          'rgba(52, 156, 250, 0.8)',
          'rgba(52, 156, 250, 0.8)',
          'rgba(52, 156, 250, 0.8)',
          'rgba(52, 156, 250, 0.8)',
          'rgba(52, 156, 250, 0.8)'
        ],
        borderColor: [
          '#0861af',
          '#0861af',
          '#0861af',
          '#0861af',
          '#0861af',
          '#0861af',
          '#0861af',
          '#0861af',
        ],
        borderWidth: 2
      },
      { // another line graph
        label: 'Planet Mass (x1,000 km)',
        data: [4.8, 12.1, 12.7, 6.7, 139.8, 116.4, 50.7, 49.2],
        backgroundColor: [
          'rgba(52, 156, 250, 0.5)',
        ],
        borderColor: [
          '#0861af',
        ],
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    lineTension: 1,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          padding: 25,
        }
      }]
    }
  }
}

export default planetChartData;