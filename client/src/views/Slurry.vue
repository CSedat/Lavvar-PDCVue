<template>
  <div class="md:border-collapse">
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
        <a class="flex items-center gap-2 justify-center p-2">
          <h1>m³/h: {{ slurrym3 }}</h1>
          <h1>Saatlik Toplam: {{ slurryhourly }} m³</h1>
          <h1>Vardiyalık Toplam: {{ slurrytotal }} m³</h1>
        </a>
      </nav>
    </div>
    <a
      v-on:click="exportToExcel"
      class="
        cursor-pointer
        bg-green-700
        text-white
        hover:bg-green-500
        rounded
        p-1
        m-1
        top-0
        right-0
      "
      >Excel'e Aktar</a
    >

    <EasyDataTable
      buttons-pagination
      :headers="headers"
      :items="items"
      alternating
      table-border-color="#445269"
      row-border-color="#445269"
      header-background-color="#2d3a4f"
      header-font-color="#c1cad4"
      even-row-background-color="#4c5d7a"
      even-row-font-color="#fff"
      footer-background-color="#2d3a4f"
      footer-font-color="#c0c7d2"
      row-background-color="#2d3a4f"
      row-font-color="#c0c7d2"
      row-hover-background-color="#eee"
      row-hover-font-color="#2d3a4f"
      theme-color="#1d90ff"
    />
  </div>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";
import * as XLSX from "xlsx";
import moment from "moment";

export default {
  name: "Slurry",
  data() {
    return {
      headers: [],
      items: [],
      slurrym3: 0,
      slurryhourly: 0,
      slurrytotal: 0,
    };
  },
  setup() {},
  mounted() {
    this.headers.push(
      { text: "Tarih", value: "time" },
      { text: "Vardiya", value: "vardiya" },
      { text: "Şlam (m³)", value: "Slurry" }
    );
    axios.get("http://10.35.13.108:8001/api/getslurrydata").then((response) => {
      let jsondata = response.data;
      for (let i = 0; i < jsondata.length; i++) {
        this.items.push(jsondata[i]);
      }
    });
    setInterval(() => {
      axios.get("http://10.35.13.108:8001/api/getPLCData").then((response) => {
        let jsondata = response.data;
        this.slurrym3 = jsondata.slurrym3.toFixed(2);
        this.slurryhourly = jsondata.slurryhourly.toFixed(2);
        this.slurrytotal = jsondata.slurrytotal.toFixed(2);
      });
    }, 1000);
  },
  methods: {
    exportToExcel() {
      axios
        .get("http://10.35.13.108:8001/api/getslurrydata")
        .then((response) => {
          var createXLSLFormatObj = [];
          var xlsHeader = ["Tarih", "Vardiya", "Şlam (m³)"];
          var xlsRows = response.data;
          createXLSLFormatObj.push(xlsHeader);
          for (var i = 0; i < xlsRows.length; i++) {
            var xlsRowData = [];
            for (var key in xlsRows[i]) {
              xlsRowData.push(xlsRows[i][key]);
            }
            createXLSLFormatObj.push(xlsRowData);
          }
          let wb = XLSX.utils.book_new();
          let ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
          XLSX.utils.book_append_sheet(
            wb,
            ws,
            `${moment().format("DD-MM-YYYY h_mm_ss")}.xlsx`
          );
          if (typeof console !== "undefined") console.log(new Date());
          XLSX.writeFile(wb, `${moment().format("DD-MM-YYYY h_mm_ss")}.xlsx`);
        });
    },
  },
};
</script>