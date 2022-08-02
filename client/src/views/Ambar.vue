<template>
  <LineChartGenerator class=" text-white"
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'
import axios from 'axios'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
)

export default {
    name: 'LineChart',
    components: {
      LineChartGenerator
    },
    props: {
      chartId: {
        type: String,
        default: 'line-chart'
      },
      datasetIdKey: {
        type: String,
        default: 'label'
      },
      width: {
        type: Number,
        default: 400
      },
      height: {
        type: Number,
        default: 400
      },
      cssClasses: {
        default: '',
        type: String
      },
      styles: {
        type: Object,
        default: () => {}
      },
      plugins: {
        type: Array,
        default: () => []
      },
      color: {
          type: Array,
          default: () => [
              'white',
          ]
      }
    },
    data() {
        return {
            data: [],
            status: [],
            time: [],
            seviye: [],
            chartData: {
                labels: [time],
                datasets: [
                    {
                        label: 'Durum',
                        backgroundColor: '#ffffff',
                        borderColor: '#ffffff',
                        data: [status],
                        tension: 0.5
                    },
                    {
                        label: 'Seviye',
                        backgroundColor: '#ffffff',
                        borderColor: '#ffffff',
                        data: [seviye],
                        tension: 0.5
                    }

                    
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                spanGaps: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Genel Grafik (Saatlik)',
                    color: "#fff"
                  }
                },
                interaction: {
                  intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                          display: true
                        },
                        ticks: {
                          color: "#fff"
                        }
                    },
                    y: {
                        suggestedMin: 0,
                        display: true,
                        title: {
                          display: true,
                          text: '1 Çalışıyor 2 Çalışmıyor 3 Acil Stop 4 Termik',
                          color: "#fff"
                        },
                        ticks: {
                          color: "#fff"
                        },
                    }
                }
            }
        }
    },
    mounted() {
        axios.get('http://10.35.13.108:8001/api/getambardata').then(response => {
            let data = response.data
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                this.status.push(element.status)
                this.time.push(element.time)
                this.seviye.push(element.seviye)
            }
        })
    },
}
</script>
