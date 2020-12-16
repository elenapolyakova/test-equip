<template lang="html">
  <div class="filter-plan-date-container">
      <div class="filter-item-container"> 
           <div class="filter-plan-label"><label class="mb-0">Подразделение</label></div>
           <div class="filter-item">
              <dynamic-select 
                    :options="devisionList"
                    option-value="id"
                    option-text="name"
                    placeholder=""
                    v-model="fData.devision"
                    @input="devisionSelected" />
            </div>
      </div>
      <div class="filter-item-container"> 
           <div class="filter-plan-label"><label class="mb-0">Наименование</label></div>
           <div class="filter-item">
              <dynamic-select 
                      :options="eqNameList"
                      option-value="id"
                      option-text="name"
                      placeholder=""
                      v-model="fData.eqName"
                       @input="eqNameSelected" 
                       :container="container"/>
            </div>
      </div>
      <div class="filter-item-container"> 
          <div class="filter-plan-label"><label class="mb-0">Инвентарный номер</label></div>
           <div class="filter-item">
              <dynamic-select 
                        :options="invNumList"
                        option-value="id"
                        option-text="name"
                        placeholder=""
                        v-model="fData.invNum" 
                         @input="invNumSelected"/>
            </div>
      </div>
       <!-- <div class="filter-smallitem-container"> 
          <div class="filter-plan-label"><label class="mb-0">Год</label></div>
           <div class="filter-smallitem">
              <dynamic-select 
                        :options="yearList"
                        option-value="id"
                        option-text="name"
                        placeholder=""
                         v-model="fData.year"
                       @input="invNumSelected"/>
            </div>
      </div>
      <div class="filter-smallitem-container"> 
          <div class="filter-plan-label"><label class="mb-0">Месяц</label></div>
           <div class="filter-smallitem">
              <dynamic-select 
                        :options="monthList"
                        option-value="id"
                        option-text="name"
                        placeholder=""
                        v-model="fData.month"
                         @input="invNumSelected"/>
            </div>
      </div> -->
 <div class="filter-smallitem-container"> 
          <div class="filter-plan-label"><label class="mb-0">Месяц</label></div>
           <div class="filter-smallitem"><date-picker v-model="Month"  type="month"  format="MMMM YYYY" :editable="false" popup-class='calPopup' @change="invNumSelected" name="Month"></date-picker>
           </div>
           </div>


  </div>
</template>

<script>
import DynamicSelect from "vue-dynamic-select";
import DatePicker from 'vue2-datepicker'
import api from "../utils/api";
import { getOrderTime, getOrderTimeHours } from "../utils/dictionary";
import { forMonth } from "../utils/commonJS";

export default {
  name: "filter-plan",
  props: {
    fData: { type: Object, required: true },
    isLoading: { type: Boolean },
  },
  components: {
    DynamicSelect,
    DatePicker,
  },
  data() {
    return {
      devisionList: [], //подразделения, в которых есть оборудования
      eqDevisionList: [], //полный справочник подразделений
      eqNameList: [],
      invNumList: [],
     // monthList: [],
     // yearList: [],
     Month: null,
      filterData: [],
      hasLoadFilterData: false,
      container: $("main"),
    };
  },
  methods: {
    devisionName: function (_id) {
      let devisionItem = _.find(this.eqDevisionList, { id: _id });
      return devisionItem ? devisionItem.name : "";
    },
    devisionSelected() {
      this.$emit("loading", true);
      this.eqNameList = [];
      this.invNumList = [];
      this.fData.eqName = {};
      this.fData.invNum = {};

      let index = 0;
      _.uniqBy(
        _.filter(this.filterData, { devision: this.fData.devision.id }),
        "eqName"
      ).forEach((eqName) => {
        let eqNameItem = {
          id: index++,
          name: eqName.eqName,
        };
        this.eqNameList.push(eqNameItem);
      });
      if (!this.hasLoadFilterData) {
        let selectedEq = null;
        if (this.fData.eqIdQ)
          selectedEq = _.find(this.filterData, { idEq: this.fData.eqIdQ });
        if (this.fData.invNumQ)
          selectedEq = _.find(this.filterData, { invNum: this.fData.invNumQ });
        if (selectedEq)
          this.fData.eqName = _.find(this.eqNameList, {
            name: selectedEq.eqName,
          });
      }
      this.$emit("loading", false);
    },
    eqNameSelected() {
      this.invNumList = [];
      this.fData.invNum = {};
      if (!this.fData.eqName) return;

      this.$emit("loading", true);
      this.invNumList = [];
      this.fData.invNum = null;
      _.uniqBy(
        _.filter(this.filterData, {
          devision: this.fData.devision.id,
          eqName: this.fData.eqName.name,
        }),
        "invNum"
      ).forEach((invNum) => {
        let invNumItem = {
          id: invNum.idEq,
          name: invNum.invNum,
        };
        this.invNumList.push(invNumItem);
      });
      if (this.invNumList.length === 1) {
        this.fData.invNum = this.invNumList[0];
      }

      if (!this.hasLoadFilterData) {
        let selectedEq = null;
        if (this.fData.eqIdQ)
          selectedEq = _.find(this.filterData, { idEq: this.fData.eqIdQ });
        if (this.fData.invNumQ)
          selectedEq = _.find(this.filterData, { invNum: this.fData.invNumQ });
        if (selectedEq)
          this.fData.invNum = _.find(this.invNumList, {
            name: selectedEq.invNum,
          });
        this.hasLoadFilterData = true;
      }

      this.$emit("loading", false);
    },

 
    invNumSelected() {
      if (!this.fData.invNum)
        this.$emit("filterData", {
          eqId: -1,
          orderTimeHours: 0,
          workingMode: 1,
          month: this.Month.getMonth(),
          year: this.Month.getFullYear(),
        });
      else {
        let selectedEq = _.find(this.filterData, {
          idEq: this.fData.invNum.id,
        });
        let hours = getOrderTimeHours(
          selectedEq.orderTime,
          selectedEq.workingMode
        );
        this.$emit("filterData", {
          eqId: this.fData.invNum.id,
          orderTimeHours: hours,
          workingMode: selectedEq.workingMode ? selectedEq.workingMode : 1,
          month: this.Month.getMonth(),
          year: this.Month.getFullYear(),
        });
      }
    },
  },
  created: function () {
    this.$emit("loading", true);

    let now = new Date();
      this.Month = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0); 
      
   /* let curYear = new Date().getFullYear();
    let curMonth = new Date().getMonth();

    for (var i = -5; i <= 0; i++) {
      let yearItem = {
        id: curYear + i,
        name: String(curYear + i),
      };
      this.yearList.push(yearItem);
    }

    for (var i = 1; i <= 12; i++) {
      let monthItem = {
        id: i,
        name: forMonth(i - 1),
      };
      this.monthList.push(monthItem);
    }

    this.fData.year = { id: curYear, name: String(curYear) };
    this.fData.month = {
      id: curMonth,
      name: this.monthList[curMonth - 1].name,
    };*/

    api()
      .get("/dictionary")
      .then((response) => {
        let dict = response.data;
        this.eqDevisionList = dict.divisionList;

        api()
          .get("/equipment") //все оборудование с подразделением, инв номером и наименованием
          .then((response) => {
            let data = response.data;
            data.forEach((item) => {
              let filterItem = {
                devision: item.id_dicdev_dicdevision,
                invNum: item.inv_num ? item.inv_num.trim() : "",
                eqName: item.eqname ? item.eqname.trim() : "",
                idEq: item.id_eq,
                orderTime: item.minworktime,
                workingMode: item.eq_worktime, //todo загружать из базы
              };
              this.filterData.push(filterItem);
            });
            _.uniqBy(this.filterData, "devision").forEach((devision) => {
              let devisionItem = {
                id: devision.devision,
                name: this.devisionName(devision.devision),
              };
              this.devisionList.push(devisionItem);
            });

            let selectedEq = null;
            if (this.fData.eqIdQ)
              selectedEq = _.find(this.filterData, { idEq: this.fData.eqIdQ });
            if (this.fData.invNumQ)
              selectedEq = _.find(this.filterData, {
                invNum: this.fData.invNumQ,
              });
            if (selectedEq)
              this.fData.devision = {
                id: selectedEq.devision,
                name: this.devisionName(selectedEq.devision),
              };
            this.$emit("loading", false);
          })
          .catch((error) => {
            this.$emit("loading", false);
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
        this.$emit("loading", false);
        this.$alert(
          "Ошибка при получении данных о подразделениях: " + error,
          "",
          "error",
          { allowOutsideClick: false }
        );
        //alert ('Ошибка при получении данных о подразделениях: ' + error);
      });
  },
  mounted: function () {},
};
</script>

<style lang="scss" scoped>
.filter-plan-date-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  max-width: calc(100vw - 100px);
  margin-bottom: 5px;
}
.filter-item-container {
  width: 350px;
  text-align: center;
}

.filter-smallitem-container {
  width: 250px;
  text-align: center;
}

.filter-item {
  display: block;
  width: 100%;
  min-width: 300px;
  padding-left: 15px;
  padding-right: 15px;
}
.filter-smallitem {
  display: block;
  width: 100%;
  min-width: 30px;
  padding-left: 15px;
  padding-right: 15px;
}
.filter-plan-label {
  display: inline-block;
  min-width: 120px;
  width: 100%;
  text-align: left;
  color: #000000;
  font-size: 12pt;
  padding-top: 0.5em;
  padding-left: 15px;
}
.filter-plan-item {
  display: block;
  width: 100%;
  min-width: 200px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 0.25em;
}
</style>