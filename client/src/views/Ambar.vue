<template>
  <div class="">
    <div class="text-center text-white">
        
      <nav>
        <RouterLink
          class="
            select-none
            p-2
            m-2
            border-solid border-2
            bg-blue-600
            border-sky-500
            rounded-md
            font-semibold
            uppercase
            cursor-pointer
            opacity-60
            hover:opacity-100
            transition-all
            hover:scale-110
            custom-op
          "
          to="/pdc"
          >KANTAR</RouterLink
        >
        <RouterLink
          class="
            select-none
            p-2
            m-2
            border-solid border-2
            bg-blue-600
            border-sky-500
            rounded-md
            font-semibold
            uppercase
            cursor-pointer
            opacity-60
            hover:opacity-100
            transition-all
            hover:scale-110
            custom-op
          "
          to="/slurry"
          >SAATLİK ŞLAM</RouterLink
        >
        <RouterLink
          class="
            select-none
            p-2
            m-2
            border-solid border-2
            bg-blue-600
            border-sky-500
            rounded-md
            font-semibold
            uppercase
            cursor-pointer
            opacity-60
            hover:opacity-100
            transition-all
            hover:scale-110
            custom-op
          "
          to="/ambar"
          >Ambar Pompa</RouterLink
        >
      </nav>
      <select class=" w-16 m-4 bg-gray-500 text-white" v-model="selectedday" @change="selectDay">
             <option v-for="item in dayselectoptions[0]" v-bind:value="item.value" :selected="item.value == selectedday">
               {{ item.label }}
            </option>
        </select>
        <span>Gün: {{ selectedday }}</span>
        <select class=" w-16 m-4 bg-gray-500 text-white" v-model="selectedmon" @change="selectDay">
             <option v-for="item in monselectoptions[0]" v-bind:value="item.value" :selected="item.value == selectedmon">
               {{ item.label }}
            </option>
        </select>
        <span>Ay: {{ selectedmon }}</span>
    </div>
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
  </div>
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs'
import moment from 'moment'

let datedays = []
var dayFrom = moment(dayFrom).subtract(1,'months').endOf('month').format('DD');
dayFrom++;
for (let t = 1; t < dayFrom; t++) {
    datedays.push({
        label: t,
        value: t
    })
}
let datemons = []
for (let t = 1; t < 13; t++) {
    datemons.push({
        label: t,
        value: t
    })
}

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
        default: 1200
      },
      height: {
        type: Number,
        default: 800
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
            selectedday: moment().format('D'),
            selectedmon: moment().format('M'),
            dayselectoptions: [datedays],
            monselectoptions: [datemons],
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: 'Durum',
                        backgroundColor: 'red',
                        borderColor: 'red',
                        data: [],
                        tension: 0.5
                    },
                    {
                        label: 'Seviye',
                        backgroundColor: 'yellow',
                        borderColor: 'yellow',
                        data: [],
                        tension: 0.5,
                        
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
                    text: 'Genel Grafik (Dakikalık)',
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
                          text: '10 Çalışıyor 20 Çalışmıyor 30 Acil Stop 40 Termik',
                          color: "#fff"
                        },
                        ticks: {
                          color: "#fff"
                        },
                    }
                },
                elements: {
                    point:{
                        radius: 0
                    }
                }
            }
        }
    },
    mounted() {
        this.chartData.labels = []
        for (let j = 0; j < this.chartData.datasets; j++) {
            this.chartData.datasets[j].data = []
        }
        axios.get('http://10.35.13.108:8001/api/getambardata').then(response => {
            let data = response.data
            
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                if (element.time.split(' ')[1].toString().split('-')[0] == this.selectedday && element.time.split(' ')[1].toString().split('-')[1] == this.selectedmon) {
                    this.chartData.labels.push(element.time)
                    this.chartData.datasets[0].data.push(element.status)
                    this.chartData.datasets[1].data.push(element.seviye)
                }
                // this.chartData.labels.push(element.time)
                // this.chartData.datasets[0].data.push(element.status)
                // this.chartData.datasets[1].data.push(element.seviye)
                
            }
        })
    },
    methods: {
        selectDay() {
            this.chartData.labels = []
            for (let j = 0; j < this.chartData.datasets; j++) {
                this.chartData.datasets[j].data = []
            }
            axios.get('http://10.35.13.108:8001/api/getambardata').then(response => {
                let data = response.data

                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if (element.time.split(' ')[1].toString().split('-')[0] == this.selectedday && element.time.split(' ')[1].toString().split('-')[1] == this.selectedmon) {
                        this.chartData.labels.push(element.time)
                        this.chartData.datasets[0].data.push(element.status)
                        this.chartData.datasets[1].data.push(element.seviye)
                    }
                    // this.chartData.labels.push(element.time)
                    // this.chartData.datasets[0].data.push(element.status)
                    // this.chartData.datasets[1].data.push(element.seviye)

                }
            })
        }
        
    }
        
}
</script>
