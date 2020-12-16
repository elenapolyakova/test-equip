<template lang="html">
  <div>
      <div class="action-panel-end">
           <div class="export-button"><i class="fa fa-file-excel" title="Экспорт в excel" @click="exportExcel"></i></div>
           <div class="export-button"><i class="fa fa-file-pdf" title="Экспорт в pdf" @click="exportPDF"></i></div>
      </div>
      
        <div class='title'>{{report_name}}</div>
        
             <DataTable
                :header-fields="headerFields"
                :data="eqData || []"
                :css="datatableCss"
                @on-update="dtUpdateSort"> 
            </DataTable>
        </div>
  </div>
</template>

<script>
//import html2canvas from "html2canvas";
import Loading from "vue-loading-overlay";
//import canvg from "canvg";

import api from "../utils/api";
import { saveAs } from "file-saver";
import { getEqReadiness } from "../utils/dictionary";
import { toCost } from "../utils/commonJS";
import ExcelJS from "exceljs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DataTable } from "v-datatable-light";

export default {
  name: "rWorkingEquip",
  components: {
    DataTable,

    Loading,
  },

  data() {
    return {
      report_name: "Перечень работающего оборудования",
      eqInitialList: [],
      eqData: [],
      devisionList: [],
      readinessList: [],
      locationList: [],
      isLoading: true,
      sort: "asc",
      headerFields: [
        { name: "number", label: "№", sortable: true },
        { name: "devisionName", label: "Подразделение", sortable: true },
        { name: "invNum", label: "Инвентарный номер", sortable: true },
        { name: "name", label: "Название оборудования", sortable: true },
        { name: "responsibleName", label: "Ответственный", sortable: true },
        { name: "location", label: "Месторасположение", sortable: true },
      ],
      datatableCss: {
        table: "table table-hover table-center eqworkinglist-table",
        theadTh: "header-item",
        tbodyTd: "body-item",
        tbodyTr: "body-row",
      },
    };
  },
  methods: {
    exportExcel: function () {
      let wb = new ExcelJS.Workbook();
      let workbookName = `${this.report_name}.xlsx`;
      let worksheetName = this.report_name;
      let ws = wb.addWorksheet(worksheetName);

      ws.columns = [
        {
          key: "number",
          header: "№",
          width: 7,
        },
        {
          key: "devisionName",
          header: "Подразделение",
          width: 20,
        },
        {
          key: "invNum",
          header: "Инвентарный номер",
          width: 15,
        },

        {
          key: "name",
          header: "Название оборудования",
          width: 50,
        },
        {
          key: "responsibleName",
          header: "Ответственный",
          width: 30,
        },
        {
          key: "location",
          header: "Месторасположение",
          width: 30,
        },
      ];
      ws.addRows(this.eqData);

      ws.views = [{ state: "frozen", ySplit: 1 }];
      for (let i = 1; i <= ws.columns.length; i++) {
        let cell = ws.getRow(1).getCell(i);
        cell.font = {
          bold: true,
          color: { argb: "000000" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "9cc2e5" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
      }
      for (let i = 2; i < this.eqData.length + 2; i++)
        for (let j = 1; j < ws.columns.length + 1; j++) {
          let cell = ws.getRow(i).getCell(j);

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { vertical: "middle", wrapText: true };
        }

      ws.autoFilter = {
        from: {
          row: 1,
          column: 1,
        },
        to: {
          row: this.eqData.length + 1,
          column: ws.columns.length,
        },
      };

      wb.xlsx.writeBuffer().then(function (buffer) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          workbookName
        );
      });
    },
    exportPDF: function () {
      var headers = [];
      var body = [];
      this.headerFields.forEach((hField) => {
        headers.push({ text: hField.label, style: "tableHeader" });
      });
      body.push(headers);

      this.eqData.forEach((dItem) => {
        let dataItem = [];
        this.headerFields.forEach((hField) => {
          dataItem.push({ text: dItem[hField.name], style: "defaultStyle" });
        });
        body.push(dataItem);
      });

      var docDefenition = {
        content: [
          { text: this.report_name, style: "header" },
          {
            table: {
              headerRows: 1,
              widths: [30, 80, 65, 260, 110, 160],

              body: body,
            },
          },
        ],

        styles: {
          header: { fontSize: 11, alignment: "center" },
          tableHeader: {
            alignment: "center",
            verticalAlign: "center",
            fontSize: 9,
            fillColor: "#9cc2e5",
            bold: true,
          },
          defaultStyle: {
            fontSize: 9,
            alignment: "center",
            color: "#000000",
            background: "#ffffff",
          },
        },
        pageOrientation: "landscape",
      };
      pdfMake.createPdf(docDefenition).download(this.report_name + ".pdf");
    },

    fillDict: function (list, key) {
      list = [];
      this.eqInitialList.forEach((item) => {
        if (!_.find(list, { name: item[key] }))
          list.push({ id: list.length, name: item[key] });
      });
      return list;
    },
    devisionName: function (_id) {
      let devisionItem = _.find(this.devisionList, { id: _id });
      return devisionItem ? devisionItem.name : "";
    },

    responsibleName: function (_id) {
      let responsibleItem = _.find(this.responsibleList, { id: _id });
      return responsibleItem ? responsibleItem.name : "";
    },
    initData: function () {
      this.isLoading = true;

      api()
        .get("/dictionary")
        .then((response) => {
          let dict = response.data;
          this.devisionList = dict.divisionList;
          this.responsibleList = dict.userList;
          this.responsibleList.forEach(
            (item) =>
              (item.name = `${item.us_surname} ${item.us_name} ${item.us_patname}`)
          );
          this.readinessList = getEqReadiness();
          api()
            .get("/rWorkingEq")
            .then((response) => {
              let data = response.data;
              let i = 0;
              data.forEach((item) => {
                let eqItem = {};
                eqItem.devision = item.id_dicdev;
                eqItem.devisionName = this.devisionName(eqItem.devision);
                eqItem.responsible = item.id_respose_man;
                eqItem.responsibleName = this.responsibleName(
                  eqItem.responsible
                );
                eqItem.name = item.eqname ? item.eqname.trim() : "";
                eqItem.location = item.eq_place ? item.eq_place.trim() : "";
                eqItem.invNum = item.inv_num ? item.inv_num.trim() : "";
                eqItem.number = item.card_num;
                this.eqInitialList.push(eqItem);
              });
              this.locationList = this.fillDict(this.locationList, "location");
              this.eqData = this.eqInitialList;
              this.$emit("resizeHeader");
              this.isLoading = false;
            })
            .catch((error) => {
              this.isLoading = false;
              this.$alert(
                "Ошибка при получении данных об оборудовании: " + error,
                "",
                "error",
                { allowOutsideClick: false }
              );
              //alert ('Ошибка при получении данных об оборудовании: ' + error);
            });
        })
        .catch((error) => {
          this.isLoading = false;
          this.$alert(
            "Ошибка при получении справочников: " + error,
            "",
            "error",
            { allowOutsideClick: false }
          );
          //alert ('Ошибка при получении справочников: ' + error);
        });
    },
    dtUpdateSort: function ({ sortField, sort }) {
      this.eqData = _.orderBy(this.eqData, [sortField], [sort]);
    },
  },
  mounted: function () {
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
</style>