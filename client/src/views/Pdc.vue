<template>
  <div class="md:border-collapse">
    <div class="text-center text-white">
      <nav>
        <RouterLink class=" select-none p-2 m-2 border-solid border-2 bg-blue-600 border-sky-500 rounded-md font-semibold uppercase cursor-pointer opacity-60 hover:opacity-100 transition-all hover:scale-110 custom-op" to="/pdc">
          TREND
        </RouterLink>
        <RouterLink class=" select-none p-2 m-2 border-solid border-2 bg-blue-600 border-sky-500 rounded-md font-semibold uppercase cursor-pointer opacity-60 hover:opacity-100 transition-all hover:scale-110 custom-op " to="/slurry" >
          SAATLİK ŞLAM
        </RouterLink>
        <RouterLink class=" select-none p-2 m-2 border-solid border-2 bg-blue-600 border-sky-500 rounded-md font-semibold uppercase cursor-pointer opacity-60 hover:opacity-100 transition-all hover:scale-110 custom-op " to="/ambar" >
          Ambar Pompa
        </RouterLink>
      </nav>
    </div>
    <div class=" grid gap-5 grid-cols-9 text-white font-sans font-semibold p-3">
      <a class=" border border-gray-400 rounded justify-center items-center text-center">BC1B-1: <strong class="underline">{{bc1b_1}}</strong></a>
      <a class=" border border-gray-400 rounded justify-center items-center text-center">BC1B-2: <strong class="underline">{{bc1b_2}}</strong></a>
      <a class=" border border-gray-400 rounded justify-center items-center text-center">D301-1: <strong class="underline">{{d301_1}}</strong></a>
      <a class=" border border-gray-400 rounded justify-center items-center text-center">D301-2: <strong class="underline">{{d301_2}}</strong></a>
      <a class=" border border-gray-400 rounded justify-center items-center text-center">D701: <strong class="underline">{{d701}}</strong></a>
      <a class=" border border-gray-400 rounded justify-center items-center text-center">D705: <strong class="underline">{{d705}}</strong></a>
      <a class=" border border-gray-400 rounded justify-center items-center text-center">D706: <strong class="underline">{{d706}}</strong></a>
      <a class=" border border-gray-400 rounded justify-center items-center text-center">D707: <strong class="underline">{{d707}}</strong></a>
      <a class=" border border-gray-400 rounded justify-center items-center text-center">D710: <strong class="underline">{{d710}}</strong></a>
    </div>
    <a v-on:click="exportToExcel" class=" cursor-pointer bg-green-700 text-white hover:bg-green-500 rounded p-1 m-1 top-0 right-0">Excel'e Aktar</a>
    <EasyDataTable buttons-pagination :headers="headers" :items="items" alternating table-border-color="#445269" row-border-color="#445269" header-background-color="#2d3a4f" header-font-color="#c1cad4" even-row-background-color="#4c5d7a" even-row-font-color="#fff" footer-background-color="#2d3a4f" footer-font-color="#c0c7d2" row-background-color="#2d3a4f" row-font-color="#c0c7d2" row-hover-background-color="#eee" row-hover-font-color="#2d3a4f" theme-color="#1d90ff"/>
  </div>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";
import * as XLSX from "xlsx";
import moment from "moment";
export default {
  name: "Pdc",
  data() {
    return {
      headers: [],
      items: [],
      bc1b_1: 0,
      bc1b_2: 0,
      d301_1: 0,
      d301_2: 0,
      d701: 0,
      d705: 0,
      d706: 0,
      d707: 0,
      d710: 0,
    };
  },
  setup() {},
  mounted() {
    this.headers.push(
      { text: "Tarih", value: "time" },
      { text: "Vardiya", value: "vardiya" },
      { text: "BC1B-1", value: "BC1B_PDC1" },
      { text: "BC1B-2", value: "BC1B_PDC2" },
      { text: "301-1", value: "D301_PDC1" },
      { text: "301-2", value: "D301_PDC2" },
      { text: "701 (Ceviz)", value: "D701" },
      { text: "705 (Fındık)", value: "D705" },
      { text: "706 (Toz)", value: "D706" },
      { text: "707 (Araürün)", value: "D707" },
      { text: "710 (Taş)", value: "D710" },
      { text: "Şlam (m³)", value: "Slurry" },
      { text: "Keson (m³)", value: "Keson" },
      { text: "kWh", value: "kWh" },
      { text: "kWh Vardiyalık", value: "kWhvard" }
    );

    axios.get("http://10.35.13.108:8001/api/getpdcdata").then((response) => {
      let jsondata = response.data;
      for (let i = 0; i < jsondata.length; i++) {
        this.items.push(jsondata[i]);
      }
    });
    axios.get("http://10.35.13.108:8001/api/getPLCData").then((response) => {
        let jsondata = response.data;
        this.bc1b_1 = jsondata.crusherpdc.bc1b_1;
        this.bc1b_2 = jsondata.crusherpdc.bc1b_2;
        this.d301_1 = jsondata.mainplcpdc.d301_1;
        this.d301_2 = jsondata.mainplcpdc.d301_2;
        this.d701 = jsondata.mainplcpdc.d701;
        this.d705 = jsondata.mainplcpdc.d705;
        this.d706 = jsondata.mainplcpdc.d706;
        this.d707 = jsondata.mainplcpdc.d707;
        this.d710 = jsondata.mainplcpdc.d710;
    });

    setInterval(() => {
      axios.get("http://10.35.13.108:8001/api/getPLCData").then((response) => {
        let jsondata = response.data;
        this.bc1b_1 = jsondata.crusherpdc.bc1b_1;
        this.bc1b_2 = jsondata.crusherpdc.bc1b_2;
        this.d301_1 = jsondata.mainplcpdc.d301_1;
        this.d301_2 = jsondata.mainplcpdc.d301_2;
        this.d701 = jsondata.mainplcpdc.d701;
        this.d705 = jsondata.mainplcpdc.d705;
        this.d706 = jsondata.mainplcpdc.d706;
        this.d707 = jsondata.mainplcpdc.d707;
        this.d710 = jsondata.mainplcpdc.d710;
      });
    }, 1000);
  },
  methods: {
    exportToExcel() {
      axios.get("http://10.35.13.108:8001/api/getpdcdata").then((response) => {
        var createXLSLFormatObj = [];
        var xlsHeader = [
          "Vardiya",
          "Tarih",
          "BC1B PDC 1",
          "BC1B PDC 2",
          "301 PDC 1",
          "301 PDC 2",
          "701 (Ceviz)",
          "705 (Fındık)",
          "706 (Toz)",
          "707 (Araürün)",
          "710 (Taş)",
          "Keson (m³)",
          "Şlam (m³)",
          "Harcanan Enerji (kWh)",
          "Harcanan Enerji Vardiyalık (kWh)",
        ];
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