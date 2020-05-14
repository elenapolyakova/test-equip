<template lang="html">
  <div>
    <p>Отчет {{ report_name }}</p>
  </div>
</template>

<script>


  export default {
    name: "report",
    props: ['id'],
    data() {
      return {
        report_name: '',
        reportsList: []
      }
    },
    methods: {
      getReport(id){
        let report = this.reportsList.filter(report => {return report.id == id});
        if (report.length > 0)
          this.report_name = report[0].name;
        else this.report_name = "не найден"
        
      }
    },
    created: function() {
        this.reportsList.push({ id: '1', name: 'Каталог оборудования'});
        this.reportsList.push({ id: '2', name: 'Использование оборудования'});
        this.getReport(this.id);
    },
    watch: {
      '$route'() {
          this.getReport(this.id);
      }
    }

  }
</script>

<style lang="scss" scoped>
  
</style>