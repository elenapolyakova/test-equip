<template lang="html">
 <div class="vld-parent">
    <loading :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="true"
        color='#337ab7'>
    </loading>
      <label v-if="!hasEquip()" class="equip-error">Необходимо выбрать оборудование</label>
      <div class="action-panel" v-if="hasEquip()">
        <div class="action-panel-btn">
            <button class="export-button" @click="exportExcel"><i class="fa fa-file-excel" title="Экспорт в excel"></i></button>
            <button class="export-button" @click="exportPDF"><i class="fa fa-file-pdf" title="Экспорт в pdf"></i></button>
        </div>
      </div>
      <div id="report" v-if="hasEquip()" class="report-container">
        <div class="header">
              <div class="logo"><img src="../logo.png" id="imgLogo"/> </div>
              <div class="header-devision">Подразделение:<span class="">{{eqData.devision}}</span><span>{{empty_underline}}</span></div>
        </div>
        <div class="title">{{report_name}}</span></div>
        <table class="table table-bordered table-hover table-striped table-center table-card" id="table-card">
            <thead class="hidden"><tr class="hidden"><th class="col_name"></th><th class="col_value"></th></tr> </thead>
            <tr><td colspan='2' class="tr_header">ОБЩИЕ СВЕДЕНИЯ</td></tr>
            <tr><td><div class="cell" style="height: 130px">Наименование:</div></td>
                <td><div class="cell">{{eqData.name}}</div></td></tr>
            <tr><td><div class="cell" style="height: 100px">Назначение:</div></td>
                <td><div class="cell">{{eqData.purpose}}</div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Инвентарный номер:</div></td>
                <td><div class="cell">{{eqData.invNum}}</div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Заводской номер:</div></td>
                <td><div class="cell">{{eqData.factNum}}</div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Год выпуска:</div></td>
                <td><div class="cell">{{eqData.factDate}}</div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Дата ввода в эксплуатацию:</div></td>
                <td><div class="cell">{{eqData.comDate}}</div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Год модернизации (при наличии):</div></td>
                <td><div class="cell">{{eqData.repDate}}</div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Техническое состояние: </div></td>
                <td><div class="cell">{{eqData.eqTechState}}</div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Наличие графика проведения ТО: </div></td>
                <td class="editable-td"><div class="cell"><textarea class="editable-cell"></textarea></div></td></tr>
            <tr><td colspan='2' class="tr_header">НАЛИЧИЕ ТЕХНИЧЕСКОЙ ДОКУМЕНТАЦИИ</td></tr>
            <tr><td><div class="cell" style="height: 25px">Паспорт: </div></td>
                <td><div class="cell link">
                    <a v-if="eqData.passPath !== ''" :href='eqData.passPath' target='_blank'> {{eqData.passport}}</a>
                    <p v-if="eqData.passPath == ''">{{eqData.passport}}</p>
                  </div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Руководство по эксплуатации: </div></td>
                <td><div class="cell link">
                    <a v-if="eqData.manualPath !== ''" :href='eqData.manualPath' target='_blank'> {{eqData.manual}}</a>
                    <p v-if="eqData.manualPath == ''">{{eqData.manual}}</p>
                  </div></td></tr>
            <tr><td colspan='2' class="tr_header">НАЛИЧИЕ МЕТРОЛОГИЧЕСКОЙ ДОКУМЕНТАЦИИ</td></tr>
            <tr><td><div class="cell" style="height: 60px">Программа и методика аттестации: </div></td>
                <td><div class="cell link">
                    <a v-if="eqData.attPath !== ''" :href='eqData.attPath' target='_blank'> {{eqData.attestat}}</a>
                    <p v-if="eqData.attPath == ''">{{eqData.attestat}}</p>
                  </div></td></tr>
            <tr><td><div class="cell" style="height: 80px">Аттестат, выданный при проведении первичной аттестации (свидетельство о поверке в случае, если средство испытаний является средством измерений): </div></td>
                <td><div class="cell">{{eqData.attestatDoc}}</div></td></tr>
            <tr><td><div class="cell" style="height: 70px">Протокол периодической аттестации (при наличии и в соответствии с межаттестационным интервалом): </div></td>
                <td><div class="cell">{{eqData.protocolDoc}}</div></td></tr>
            <tr><td><div class="cell" style="height: 40px">Срок действия документа о метрологическом обеспечении: </div></td>
                <td><div class="cell">{{eqData.atestatEnd}}</div></td></tr>
            <tr><td><div class="cell" style="height: 40px">Межаттестационный (межповерочный) интервал: </div></td>
                <td><div class="cell">{{eqData.calInterval}}</div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Место расположения: </div></td>
                <td><div class="cell">{{eqData.location}}</div></td></tr>
            <tr><td><div class="cell" style="height: 25px">Ответственный сотрудник/подразделения </div></td>
                <td><div class="cell">{{eqData.responsible}}</div></td></tr>
            <tr><td colspan='2' class="tr_header">ОСНОВНЫЕ ХАРАКТЕРИСТИКИ</td></tr>
            <tr><td><div class="cell" style="height: 40px">Технические характеристики (при отсутствии паспорта): </div></td>
                <td><div class="cell">{{eqData.passportChar}}</div></td></tr>
            <tr><td><div class="cell" style="height: 70px">Потребность в модернизации (при наличии) (заполняется руководителем подразделения): </div></td>
                <td class='editable-td' style="height: 70px"><div class="cell" style="height: 100%"><textarea class="editable-cell"></textarea></div></td></tr>
        </table>
        <div id="footer">
        <div class="footer-row">
            <div>Дата заполнения </div>
              <div class="underline footer-item" style="width:50px">"<input v-model="curDate.day"></input>"</div> 
              <div class="underline footer-item" style="width:150px"><input v-model="curDate.month"></input></div>
              <div class="footer-item">{{curDate.year}} г.</div>
        </div>
        <div class="footer-row">
            <div>Председатель Инвентаризационной комиссии </div>
              <div class ="footer-item fio">
                  <div class="underline" style="width:320px"><input v-model="chairman"></input></div> 
                  <div>Ф.И.О.</div>
              </div>
              <div> Подпись </div>
              <div class="underline footer-item" style="width:150px; height:26px"></div>

        </div>
        <div class="footer-row">
            <div>Руководитель подразделения АО "ВНИИЖТ"</div>
              <div class ="footer-item fio">
                  <div class="underline" style="width:320px"><input v-model="chief"></input></div> 
                  <div>Ф.И.О.</div>
              </div>
              <div> Подпись </div>
              <div class="underline footer-item" style="width:150px; height:26px"></div>

        </div>
        </div>
      </div>
      <img id="imgFooter" style="display:none"></img>
  </div>
</template>

<script>
   import html2canvas from 'html2canvas'
   import Loading from 'vue-loading-overlay';
   import api from "../utils/api";
   import { saveAs } from 'file-saver';
   import ExcelJS from 'exceljs'; 
   import {getEqReadiness} from '../utils/dictionary'
   import {formatDate} from '../utils/date'
   import { ofMonth } from "../utils/commonJS";
   import {endpoint} from '../utils/config'
   import pdfMake from 'pdfmake/build/pdfmake'
   import pdfFonts from 'pdfmake/build/vfs_fonts'
   const base64Img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIkAAABzCAYAAACsLSG2AAAgAElEQVR4Xu1dB5hU1dn+puzM9r4CRmMkoII9Eo0VVBDRiCKIERQLINKsFFGenyAoIihSlC6SiIglMZaggBo0llhQEVDsjba9z+7U/3nfe8/s3dmZ2TvLLrC7c5/HZ3H3llPe85X3+875LIFAICD65du9W7y7dkmgpkbEalW/jv9sLyOgQ8GaliYJ3bqJxeFgzy0ACXBiEZHKNWukat068RcXi1jwm/jVrkYAOLDbxXbEEZK9YIFYs7OJCw0kfr9YLBapWL6c//n27BGx2UR8vnY1Ru26sxAKFotYbDZJOO44yV29Wqy5ucRFfZCsWKGBZPduTd34/e163NpV540g6d5dcp98Uqw5OWFAYpQkeCgOkvaDE928sCQkiP244yQvoiSJg6T9gCK0p3GQtN+5N93zOEhMD1X7vTEOkvY796Z7HgeJ6aFqvzfGQdJ+5950z+MgMT1U7ffGOEja79yb7nkcJKaHqv3eGAdJ+5170z2Pg8T0ULXfG+Mgab9zb7rncZCYHqr2e2McJAdx7jH4VqtYkHphsUgwDTBKk5Dow/tUFB4/kTVWl0TY/B2Kg6T5x9TUG/V0C7/bLQEkcJnM9guCBJligYBY7XYRpBLiJ66WSAaLg8TUlDbvTZAatbUibrdYMjPFkp6uJXLFIA0CLpdIVZVIdTUlSwAgsVrFCsA0d75PHCTNO/+m3hYIMFc44cQTJbFnT0n4/e+ZP0oVYlKi+EpKxF9QIN5ffhFvfr54CwvFl59P6QL1xffhigF4EdseB4mpaW2em/TBDlRUiMXplLwXXpDEc86J/d0hQPIVFUnt++9L5bPPimvzZhGABRIKuchxkMQ+vgf1CagZi0U8v/4q6bfcIpkTJoj9t7/V7AiTEoTtt9uZqU4VZXgu4PGI97vvZO/551O62JCs7HTuv50SlyQHEDYGkGRNmCDpY8eK/aijYm+AUkvKjjF4N9jd4M/Pl339+4tnxw6xpKaKJTFx/3KS4yCJfY6a/IQRJJMnS/ro0U0DCUCBiVM/le0RCNBTQsJyzfvvS/HEieLZtk2sKSl19zel8XGQNGXUmviMPrH+igoardwJZ3aVa3tceH9ir16SeP75gt109YCiu8BQaVBhpTNmSOXTT4u/pEQDSlPd4zhImjjh+/OYz8cVD9VAj8bM9hQdYDBGbaecItkTJ4rzrLPECvcZl9GmARisVqn96CMpuf9+qXnzTbFlZpr7Trh+HVSQ4OOxGGz7MzHGZ5uLoWzKnmgjUwqgmO2TarPfL+7SUsm65RZJv/12SejSRXuDsS34htUqAbdbiqdOlcrly6mCaMSaAWRomw4qSODGN6XRZgc2wn30DJrBPWxK26Ey8G1un0UblG1hpk9QOQ6HeH78kfxK9uzZ4jzttIYgUTaKxSLl8+ZJ+YIFAjcZ+3fF4zHzpfr3HFSQuFziw6DpbGHsrY/hCb9fAl6viNcrVgx2ejp1fFMvvMsPsY6JNnOB4MJ3MUkAidstkpBgTpLgWWgUtN/pFO/u3ZLUp49kP/CAOE89NTxIdJVT9cILUjp/vri3bBF7hw4iYHpjvQ44SJTxVl4u/upqSRsxQpJ79RJrZqYWw2juSzf4fOXl4v7xRw5WzaZN4i0vlwTsjIfhqFae2W/7fOIpLJTMiRMl6eyzyW6SZo8EGMRY0D+XS0oeeEAq335bciZMkKTzzqM0Ab8R9jgP3QAF3+EtKZGypUvFvWmTiMslzosukqwoIAEI0a6a//yHIHG98YY4OnQQP44OifU64CCBivH5xFdYKHlr10riWWeJLSOj5c880SUJJtNfViaVa9dK+bJljH9Yk5PNxU70Fe3Oz5e0wYMlY9IkUuqmVIbFIjUffCC7Bw6U1NNPl+z588V+5JHmnrVaxfXqq1J4881UN/59+8TZp09UkCAuBAldu2WLlC5YINUvvCD2vLxWoG5gXMFYw8Tk5kqHjRs1xlFfyRDHpg7IAR8Qgy2jQvHGBQSRXfXyy1KxZIn4fv5ZA0o0+wCGoNcrgcpKMpl5zzwjjpNPpkFINzSMEUu7A7+3WqV6wwYpmjJF/Hv2SKf16+n+Mk0ggvFOvgNq2GKRqueek7JZs8T75Zdi7dBB3L/8Ikm9e0dXNzpI3J9/TpBUPfts6wEJ7YKKCnGcfjoH2gZ0K8s9Fm8nBpBw8o3kE0CGqHp+vlSsWiWVzzwjvl9+ERuAEs5OwbOQRIi4pqZK3oIFktSvn6aq1P2hXprh9zVvvy0l8+dL7bZtkjttmqQOGVL/O+E8PJ0oq3n3XSmfP1+qX31Vk7hOJ0GSbBYkW7dK2fz5jOu0GklCkFRWirNnT8ldtYqrkoIEv4dxhpXZ2IVJxkqx2YIJO2Ef0V3BoJutJk79tFrF8803UrZokVT94x/U9ZQoobYRpEhNjVhSUiTl6qvpVTQKbH2SPd9+K6WLFkn1W29J6uWXS/a0aVqbI0ifoH1ksTDCiwmuev55SjBrairB6v71V0luzHBVkqQ1goTqpqZG7J07S+rw4YwtYMD8Xq/YjziChiDZQSPlHIIArOiKZ57RRHU07wIgAfmUm8sTehKOPrruvcaVvnmzlC1cKK5//1usGRn1o6cACAxLu10SzztPsmfOZNuDqiQcOnXPAoZq2YoVUr52LW2X3KlT2Y6oz2IBgFn1+6V8+XL+5/3xR03K4bJa2zhI1IAiCFVdLf7aWg4ILriTyZdfTlGe8JvfaKs5FAA6cHDa0s9du2rSREVCI7mzgYDYu3SRjHHjJGPUqDp+RFchmviy0LArmTaNUVQrVKAhtwNthf2RefvtknT55VEBTHBDKuqeRf706WJxuyV7/HhJueaaxp/VJQzY0sJx4zQ7BAtJ2TztBiQKLAZjDy5q0sUXS96SJWLNyooOkj17ZNeJJ1JFMcoZLaurpkY8lZWUWrkPPqhJKV3CsBmYUATeamqk6sUXpXDMGLEmJmpqz2ajFwZdnj5unKRPmBA0ssMyxcq2slqZVLT7sssYYMuaOpXuclBFhWNqDSywv7xc9vTpI95t27T+JSXVpRPECJJaqBsYruvWtRKbJJKtYbGIr6KiaSBJTo4MEpBVBQVc1aCwM6dPDzvJylPyfv01jcSyZcvEcdRREigvJ5+C57ImTapzkyPR8UpF+v2yb/BgKd+0SbInTZLMESPElpOjgbMRm8tfWirFd90lFXBZk5II1iB/pHt/Mdkk27YRJHD5W4fh2twg8XjEApCEo9j1w/88xcWSPnKkZNx6q8ZphDMYdU8Jkqn2ww9l13nniePww8VbVESyL33UKHEcf3zjxiZsq6oqGsEF99wjNqdTcufMkZQrrqhTF5E8GTxbUUFXOf+WW8Rmt2tJzsarCSCp+fhjgqT6n/8U+2GHMa825utgkGkNGtlUSRINJAkJzPtEemAGbIkLLgjyDg1UhcGIde/YIbt79KCthLhI5r33SlKvXnXMbLhJ1r0hrHjP9u2yb8gQ2jbObt0ka/ZsSerbV+tyFIAAvCC+8ocPF/+PP9bZIUZbKwaQhGNcEzp00A5rjvVqcyDRB9JXViaWrCzJnjqVBrFytcNOlJpkr1dqPvxQdvfuLfbUVMl56CFJ6t8/+rMGW8Lz1VdSiqjrK69QiiDfAwfjJg8cWDctEfgU96efStnDD0slbAes+Eh2FuykX38Vp+JJ/vCHoNdTb+5V7AZE3KOPSu3nn0vCYYdpxn6sV5sCid4ZUO/e4mJKgfThw+tY3UhpCbq6AaeBAS1ZuVLyJk+WtNGjxdaxY2QpgL/oK937/fck5soeekhzox0O8UHV3Xor1ZVdud9Ge0Z5diUlUvHUU1IKDsXhoAptwNXoahI2iueHHyTxwgs1xjUSSHT7CMBjFLikRMspaUp8rK2BhNFZkHXnnCN5S5dqAFEGZRRmE9sTKp97TopmzBDnKadIx7VrOdmNPgvmtqiItHfZI4+Ir6BAbPDOAgGBNAM4MkaPpvtLV9aodnQ32/P99wzewXZIyMvTgoXqUm1WILHbxbN7t2SOGUMAhs0n0aUIXPeSe++VypUr6SHxPPimRL7bDEj0VQ3iy9Kxoxz27LPiwH4WlbMRCSAQBm63uF5/XUoWLmRCz+GLF4vjlFPq2NxotoTPJ9Wvv07Wtvbdd8WGnA2dPYbK8JWWStKFF0rGHXeQjKsHOh0kAFbF889L6aOPipSXR8yep6ufkEBPKW/hQnH06NHQVjLwNLUff1w/M60pUsQA6oN72G9zGK4WC8k5S1qaZE2ZIqnXX19nqEbSwWol79wpxXATN2yQvFGjJB2cRmOXng+CmE/xzJlStWaNFlsBKFVcCf9Gzgzc+wEDKNmYbqivdKN95C8spGdV8957jG0F/wbGV481WZOSaK/AxrF16lS3tdPYVl1qAviQIlVPP82AqgVtU+BtrG+hf28TkgT6v7KSXUu+5BLJe+KJuuhsJDsEA6ZLmcLJk6X8sccktV8/yVuzpk4sR3rWMMlFI0aQg2B6oAKAcZBtNrq2kAIpV14pOcuXa39VjK5RnSCIiHdHUgl6oDK428+47wbP4Hk4UTYb80eQughj2qbCHLGCI0TltV5JAj3v8ZD4gjGXs2yZ2EHrG0DQYGwMLm/Z9OlSumoVbZjcWbO0HA8VGAw3qIaYUtmDD0r5ypVkZW168K3BIzoIkOwDJhn2Sfodd2gsLxhjPKAmG5Os0gsiqDimECgVGmbF4+/ezz6TgjvvFO9XX2n37m+qZquWJBjkxETGgZxnnimZd9xB1jYo7htJVHa9/LIUzprFLZFZY8dKyiWXNG6o6gCDWiiePFngEWFlM9gYRQJg8jGBtg4dJPO22yR58OC6/TBh1EXERW80wkO+h60TIM3K//538W7frpUfMRNVb0zCtFqQnHCCNikejyScfLKkjhghKQMHht+LEjoIfr94CwqkYPx4Em7pQ4ZI6oABGnUeJfqs1AS8p4KRI6X27bd5PyfCRH4LgYJo95FHSnLfvpJ82WXcf8P9M025kOFXUiJwv92ffcYtFCDk8P9WtKk5ANKqDVeABBPj8Yjz7LPpOTB629i+WkyqzcaM89LVq8XZtask9+wpNhV5jmSHGFYw1AvcXSY2Y5tCNCkSZvJhP4Fsc/bqJQnHH6/xF7BpzG7RgCELFet2k4tBXxBI9H33nQTg/SAguL8qxtjuVitJEAWGu+twaGIbtmB1tWaLRAnAMes8IYFcCpOWQHzpUeCICcl4uV5mDsFC5LPwWZXyGKsUwDtwdAQArWwQkGhmM+8hkZDjgnRKfesonrU6nVqbmurFROpHqwcJBgWrCgSUWtGRpIE+2biPwEKmusulDbjhb9HsAZ79gbRFldsaK0DU/cr41NvOzDyzRBf6pwKAIMiU1IjmGTW1na1a3ShJgiiw2rejQBItlK8mQm2vxDPGTVKNPatiNSZsEFPzoru1BLgZSRL6fUPsyNT3mnJTW5AkzXZYS1MGsD08EwdJe5jl/exjHCT7OYDt4fFDCiR9+0re4sXc2Ew2MpyORtBM5bhGSzpqD5N3oPp4SIEEsRMEwTIyNJCEMyLjIDlQ0Kj7zqECEgTBkhCcW7aMkdxozKdv717ZdfLJdHuZJ9GcxNGBn4JD/4uHBEjAVVVVSeKf/iQZd98tFpVZHsEdxXaF/GuuIUhAIMV6UO6hPyuHWAsPFZBwZx82a7lcgqO0I5J/ILPAsgIcoJ+jEWeH2Fi32uYcMiDBCIKgAvMYjahS5BMYzzhADgzuDimQKArYLD19YIYo/pVDEiRmpiUOJDOj1Dz3HHIgaZ5uxd/SnCMQB0lzjmYbfVccJG10YpuzW3GQNOdottF3xUHSRie2ObsVB0lzjmYbfVccJG10YpuzW3GQNOdottF3xUHSRie2ObsVB0lzjmYbfVccJG10YpuzW3GQNOdottF3xUHSRie2Obulp2dgf5O9WzfJe/JJFpDgNtcALmxDtFikYuVKqVi+XHAaMzcRNfXUnOZsfPxdB2YEFEhsNu5dzn3iCbHm5DQESfnjj7OWG45uinWD9IHpSfwrLTYCSt1Akhx9NKuLYHN+UJKohGQcYFv94oviLyoytx2xxVocf/FBGQH9YD8Uu86aPp2VwHj+CbSNahAqJeCUQOSgmj4i4aD0Jv7RFhkBdW5bZiYPQeaRGzihwQiS4OH5LdKC+Etb1QgYdjHUBwmSk+Mpg61qLlussYadlfVB0mJfjL+4NY9AHCStefYOUNvDg0QdmtKY6jFzIIuRa4GbZebMMP280uAYGM8yxS8b+3ukwQt9Llz7jfeYbW+omg59rrG/G9sba9+M71bf3V+zIaT9DUGiW7g8e7SxS/etFRkXupGKdeZC32F2s5UBoDzclma24W1GAJt9pwKYalOk5xr7tqFP7Hto20LfG2axsU8mvt/o5rTQd+OdjS3uxuY1pD8NvRtssquqEu8PP4j3p5+0k5NDJwcHvGVnS8Ixx/BsMR5apzqtgKMDxPPdd3wPCvXYjjqKhRRZSizChZMGQOZ5tm7lOWco7GjH+fEoQaY3HgfmoRYuKlDhwH8HjsDEee/RLhzZ+csv4vn6a+4exP08W95wLhpOOvTu2SOeHTs40CiwBM4gWKE8ZFIVQFBRAu/GYXyoFIpCjcHKF4EAq4l6f/2VY4BqoWwvTlXAGOlMp5pYVt/4/ntSEbjHccIJWim6CJcbJzLu3csTGlAUAd/G+Hi++EKbN7OgUfdZrTxSlBW4dAne0LtBybpdu0iq1bz1lna2eQhIsMMfJxqi4iUa5jjtNFZSYIUGo3SxWlnbBSXhMaFJF10kyVdcITbUegk9kVlHv9/lEvcnn7A0B7aD4oDflL/8RWxHHMFhAn8D0JXNns3BwQCm33abOE46Kfww6kd3u7dvF9drr/EcVHwb57miergNp0PrBZ5Rldz1zjtStXo1+4FDhVlHB5vb1YCrr+jHdwdKS3mkeO1777EYEc6DR3sTzz5bO+IbVcc3bmTxAwAJYE8880xJGz687p2GhYVz7MsXLmTBJQAq9YYbxHnGGcHTJ9kOfexwTj3mCYAC2DAPKFeLahq1//tf3XiYkSw6SDCHqTfeyG9yAYWSaWp/Lk5ABkVf/dxz2gCmpNSXKCgloh+gj8P2E3v1YuO4MlXZUqwSq1XK5s6VKhRu3rtXUq69lsUQIR3qFVI0qAG817VpkxTfeitXMwo4Z0yYIPZjjgmCBCu94MYbxbdrF+MLOQsXatUhQi+9tCpOUa7829+0diAuBbA5HIxPOP/4RxEcnYkCCYWFLJtWNnMmGefU665jPRw7CgGE6Gl1tDdKyOLMevfWrbzH/rvfsb045JfHi6JM/Gef8dsAChYLSq/kzJ/PGAnPdlUARD3grVul4LrreB/GCCcwpFx1FReWkjyQYPh72QMPcKwCFRViP/ZYSb36akm84AIpGjNGIGHCHuNplC5hwIOgXiaKTF16qUamYf7rkWmqcBCK/yxbxqoMkCRYzZhYqh7YjS4XxTZUEsHi90sKTly+4QZxdO8eLB8PkKAoYuVTT/HkIg66ESThigdVVkrNm29K0dixBAkkDyQFSroqSYID9wtHjxbvt9+K7fDDJfuRR7SVG3JxIlEe/rXXGJOiFNG/icnLWbFCEk8/nRW9CZKiIh7JXXrffQQJVnvayJE8BrweSPRDgVlwcdIkqdm8OXh8KACQMXmyJPfrV+8MeXy78sknKc1wQaoSgJDAOA5UX8kASSEWAEIjPh+lXcrgwWwDi03iPlQlxdHhjz7KcU049lguQNwHlQcp7P7oo2CxbjUskHS4X51tj7FTrKq6B1Q82oWSdcrUiAySJUukau1aPps9f74k9emjFRACSGprBbZGxeOPi2vDBjYMx2RjMiFqMbmqIahSBbChcSnXXVdfkkQCyRtvaCDBYPbvz/p69q5d64Pk5psJUmvHjpIzbx47Fe6Cfi6ZOJGrmGXHdNGOAchZuVIDiZIkoSC56SaCBN/gatfLoSlbpOqll6T8kUfYDjXJUMEEySWXNCg0UPPOO1J6//082RljlDJokKSNGUObS6k8SpJhw7T4WSCgSZJBgzRJoh856vnySym4+mraHrDv0sePZ1kXxlogZSoqaAcFzQQ9JoPn0F7fvn0EXcY992jVvgz1kZU05AnWakFFlCQGkGQ9/DDPSWc9Ff2FWKFAZv7AgYKPQ9dm3Hkn9dlBBwlACilit7O8e8XixSz3oaFMM+YIkuXLJfGMMyJLknAgwTtw3nthoeQPGqQZ5arsiYhWRSsEJCo8FoDNs2EDixrg8GJMQtaDD0ryn//MGjkAAQAUFiQdO9I58P38s5TcfbdmA3m9rIuTdtNNtMmojpRbH0aVwIYpuvNO8f30Ew3ynCVLaBg3uEIMdFOSJGvuXEm++GINJLqtoVBdMHSouLdsYR0YVI6CSjmoIFFSTDfAi8ePp57n0eEOBws+M4CZmBg7SCBFYYxWVdHGAfjwLthiXL1ffkmpEFaS6BUsYB/VvPEGJ5oeyW9/y3rGKf37s33w2mBvNZAknToJjG8YtXAEsEChiqniYdtAZRolsypMqRBgsYj744+l6PbbCTSCZOlSSejePegyBwmGEP7IHEjmzKkHEiUa0cn8wYPprlLs3XWXpEWTJEOHUjTCvmlwqJ7S81VVmuE6fnzT1Q3q77pctC1QygQTmHzVVXRPUYoeXkysIFFSCKoVi6Jk0iTx7t5NNQzjF6sUKs0IkqAHp9xLABhGf0EB1Q6KGgFkKM2G6ujwegiSG24gmLHYUPEctgakHzyZikWL2B+42Nlz5/LbQUohEo+kAwV2UdFttwk8KBrPKKANgIVeTZEkQZsEVaP0yUTnaj/4QIqnTKG9Ad8/bezYoC5WEsdok0BvovAgDcFwbhnKp1VX0/UuGjUqdpCoAtE1NTRSYVSibc6zzqIRChcURY5YiixGSaJpKgttMaxmgA1GH2oCw16AGwxARgQJjbmAJmU9HnIx5YsXs6YfjGQABfYcJpzqprCQ92ZOmyaJF10k7g8/pDMBtQnVlDFlCj0olnILdc/DWmdCIDcASTh1E/K8KUmSqus8IlanjSEOXW++Sd0IgwkASB4wgAilKlIusDJc9+6lqwyXNlhBMwyCYVxCL2NA6AKbNVzh3ei2COwEWP6uV14hGNJhI1x6qbjWr6d0gaiOCSTgdQDg4mKphss7bx7VQWLPnpxEf3m5VCxZwvdHBYkOFBq+NpvAkC2bN088n35KvgflWhK6dpWKpUsp7WjcDhnCd9a+/z7VDCmH3r0la8YM7QRL2FcHHSRWKwkiTqwqduzzcWDofnXpIonnn89VAAZWWfkNvJt9+zgQTK6NVJZUJ4pQRg2EHsS1WZBAWnAiAd7166Vs1iyKZQATvAWYSLjilCTV1bGBBJLP76fkBCeCCQPBlnnffeRnPDt3cmLh3jYKEgqUALgHEm0AHMgvqAAY/xgjPxhUGLYWC8eeZVlKS+nNAERZs2axVnBAJwEbpe6VumkxSYJyGqgSAV9e50hYc0ZXOykDBhDtIIZApKl4RAOQ5OdrFL7xTNZQHarrbrjYrFXj88UGEq9XUAIVBB7EM6j3rPvv50RCNVSuWdMkkKCYEkALSgBgwGLBebRZ//d/nFR807QkUdIEdWxqawnoylWrSH5xbJxOgXGrvEiy2CjHgtLygYA4Tj1VchYtquNuQuyHCJqGv25RdQOdiJWIwfF+8w2tbLB59BRqa0m2pY8Zw59KSoTjSeCmOUAxQyqFVr/SfXmsIFDSGDzTkgRk2jnnkNWtQkl2VLyyWiX5yivplls7dSJHgtKoYClNS5Ibb5S0m2+mkQibAyoQKZ40+hYu1BaGwxEbSJT3BXWzebOUzp7NOAvAkHDSSZLQuTMlC0EhQgYVYIfn5Nm+nf+GIQtOiosyUkHHMGhpUZBkP/aYJPXsSXHIAkM1NfxZsXq1VD31FP8fVnbaLbfQ2o/kAsO2AS0fLRiHd9X+979SOGJEzIYrKfU5czS6Pi+PZWEBbqxOgISSJAaQpA4bRvYRgTmwmOBcwFLi9+mjR/MsWitAsmWLOUmihwkYEPX5JH/AAAIECwPSLhXsbna2RstDmsBwnTlTknr3lurnnxeUm8eFen5wJqBiKX1CQgaRpEnLgmTuXAa70DhF2DB+UFREnVr96qtcnWAGAQToTbq4CQlSz7u59lpJgwt8+OENig8oyQNVRhd43DhzIMnLYxwEUg5i27VxI+2F1JtvltRrryVAsNrQnphBMny4pI8cSSkCVUN3tU8fGqtQM6qAQu0nn4QFSaTSrrDnYBtV/+tfNFARmIPhDzDAvim86aYgSNJByw8aRI8MzHXFihVUPxhj2ETOU08VgRoneqzRtE3LqpsgmQZ3S4/EktG0WCjeEZ/x/vwzI6Zpo0bRHVa18+rR8gjwASQomBgaBdaZXKQpxAIS2AtZ993HSpcYRLQLxmrmvfdq+0b0cDfaEytIQJnDGK9at45GK9QlpCU8JVUAGgA0BRLd/QVA0D9INLC2UL0YMwbxcnMZDCRIdFqeIMHfcnIY2YXXhp9YgLCLIJkTunXTwNGIfdKikiSUcaXRCknhcFCKIGyP+EVy//4aSEAR6wUWWzp2A28CfAHSC+BSgkEEg8kAmyqVAvEeq7qBTdO/P1c6jUqbjTYOYzkAn8G2aBQkukcDr63mgw9IiDFq7PPxnYpiwDxD/RRcf31DxrVjR1b1hB1TPncuOR9Is9QhQyR50CDmvnBeokiTFgUJoqyIWoIPYRxCBwkGHlIE+hKJQo1KkhYI8MGohJvIFAB4Q5ddphF2qKejSz06FE0ACYKWiMYqNQOAIM+CKhexKx2E0UASXN0ejyZxFi9mlBu/d/ToIeljx2q5G/BikKAUCSSIAoNJLi5mNBnbcRlYPfpoqlUA2nrYYZraiZBW2qIgyZozpw4kKB5QViYIVrl37qRNwlvIJxoAAAO8SURBVGQai4WuMAaShFoYm6QlosAs4Agxa7MFjT8E7RRhpZR0ECSzZtUxrtFSBRQnFAjQu4HqwaqFG6+y8EyBRE+9BFMLnqZy5UqudqiZzL/+lUwrvT1DqgBpeZ1xDUaBVapAIEB3vGTCBKpYANjZowcj7LAbaYOFJoq1GE+ydCldRjQeehiWNNg+hJlhXCFIhDLtcDthX8CQIi1/5ZVaOqNeC7dZ1M0ddzTMJ9FTBTTyJsC/g3pPGTo0LAMZFiRIFUDSUYR8Eqp5u11TCcOGabaWLkX42XCSpEsX5oAwVQB2m81GNYGko8rVqynx4AAk9usnmXffrWXpqQtJR198IYXXX097hakCkydrNokxn8Tnk+r166XisceYU4OxhnfEeULqA1jY0ORxxZOEBPjCRoFDzN/Gk46QOQXxpT4KEgh5GSrXAKmMKSmaHYDUxJycoEoKTTpiZpoyXEP1p0pfRNIR8kkQ4PP7IycdjRrFXFAlWsFnIE3BjpC6Tnsb+wo+h4wrJAkKLUVLFZgxQ0vbRDl5MJyIn/Tq1dBzQLWNUMMVIFFJR2BNAwGpfuklAsT96aeURCDE8taupfEZTBbX2WZIB9okugvMpCOABP1Sak5Pg4Cng2g0x8FiEee550r2nDl0DFTCldGYpbppNpB8+y11J0id4KUsZzQ0KYl8AToM1YLVC1fMGEtQkqT0oYeket06SqDUoUM1F7ix9MWNG7X0RSQdXXyxZEyc2DB9cdgwTYohYbl7d6YpJPbtqxn5YXQy2gMvBV4F9Dr6gImCdFAphLCrgumLesez583TVC0Sl0Mz3BVIEHwDLY8ocOfOWuS2f39OHH4HEo5ZcT4fafvM6dPJOwWlksErAWkGjgjeIhYJ7kVMLGhjGaQ0gFQybRrDAXCRYVDD8wLLHO5COAGpjeinLS9PclevjpwbbHhB+Gz58nKN4UN2k3HAdbSjcjfT7pDP6nCwA8zugnTRJYzKx6zdupUsLXQn3EmwlKz8rdP6wbbokoSM6+7dWnTU72feA7wl5rLok4Q4huvtt5nbyXs6d9Yy1JWxGuIKqtXKTPgvviBgYeQxRU8vMw+DD0QeMt/hKVFkO52SeO659VzpeoOv94HZ/Tt2cGKZ4X7KKVw8uGCsgqUly4ux6tSJvAhDFCEqAe3EZCNdAGOGPsPewDOYB+MWDC5CGLrIrN+5k7EdSCYmWvfsyTEOBbUvP58mAsYNCzrpvPMa32XQYMN4WPzFf9neRyC+zbO9I8BE/+MgMTFI7f2W/wcCGwC1k6GQyAAAAABJRU5ErkJggg=="

   export default {
    name: "rEqCard",
     props:  { eqId: {type: Number, required: false}},
     components: {
       Loading
     },
     watch: {
        eqId(value) {
          if (this.hasEquip())
            this.initData();
        }
    },

    data() {
       return {
         report_name: 'Форма карточки учета средства испытаний, учетная карточка № ',
        empty_underline: "",
        eqDevisionList: [],
        responsibleList: [],
        eqReadinessList: [],
        eqData: {},
        curDate: {},
        isLoading: false,
        chairman: "",
        chief: ""
       }
    },
    methods: {
      initData: function(){
        let curIdEq = this.eqId;
        this.isLoading = true;

         api().
          get('/dictionary')
          .then(response => {
            let dict = response.data;
            this.eqDevisionList =  dict.divisionList;
            this.responsibleList = dict.userList;
            
            this.responsibleList.forEach(item => {
                let userDevision = this.eqDevisionName(item.id_dicdev_dicdevision)
                item.name =`${item.us_surname} ${item.us_name} ${item.us_patname}/${userDevision}`
              });
            this.eqReadinessList = getEqReadiness();
           
           api().
              get('/rEquipmentCard/' + curIdEq)
              .then(response => 
              {
                let data = response.data;
                data = data[0];
                    this.eqData.devisionId = data.id_dicdev_dicdevision;
                    this.eqData.devision = this.eqDevisionName(this.eqData.devisionId);
                    this.eqData.cardNum = data.card_num ? data.card_num.trim() : '';
                    this.eqData.name = data.eqname ? data.eqname.trim() : '';
                    this.eqData.purpose = data.eqpurpose ? data.eqpurpose.trim() : '';
                    this.eqData.invNum = data.inv_num ? data.inv_num.trim() : '';
                    this.eqData.factNum = data.fact_num ? data.fact_num.trim() : '';
                    this.eqData.factDate = data.fact_date ? (new Date(data.fact_date)).getFullYear() : '';
                    this.eqData.comDate = data.eq_comdate ? formatDate(new Date(data.eq_comdate)) : '';
                    this.eqData.repDate = data.rep_date ? (new Date(data.rep_date).getFullYear()) : ''; 
                    this.eqData.eqTechState = this.eqReadinessName(data.is_ready);
                    this.eqData.passport = data.passiddoc ? (data.passpath ? 'Доступен по ссылке в цифровом виде' : 'Есть') : 'Нет';
                    this.eqData.passPath = data.passpath && data.passpath !== '' ? `${endpoint}${data.passpath}` : '';
                    this.eqData.manual = data.manualiddoc ? (data.manualpath ? 'Доступен по ссылке в цифровом виде' : 'Есть'): 'Нет';
                    this.eqData.manualPath = data.manualpath && data.manualpath !== '' ? `${endpoint}${data.manualpath}` : '';
                    this.eqData.attestat = data.attiddoc ? (data.attpath ? 'Доступен по ссылке в цифровом виде' : 'Есть'): 'Нет';
                    this.eqData.attPath = data.attpath && data.attpath !== '' ? `${endpoint}${data.attpath}` : '';
                    this.eqData.attestatDoc = '';
                    this.eqData.protocolDoc = '';
                    this.eqData.atestatEnd = data.metdate ? formatDate(new Date(data.metdate)) : '';
                    this.eqData.calInterval = data.mpi_mai;
                    this.eqData.location = data.eq_place ? data.eq_place.trim() : '';
                    this.eqData.responsible = this.responsibleName(data.id_respose_man);
                    //this.eqData.userDevision
                    this.eqData.passportChar = data.eqpassport ? data.eqpassport.trim() : '';
                this.report_name += this.eqData.cardNum
                this.$emit('resizeHeader');
                this.isLoading = false;
             })
              .catch(error => 
              {
                this.isLoading = false;
                  alert ('Ошибка при получении данных об оборудовании: ' + error);
                  
              })
          })
          .catch(error => {
            this.isLoading = false;
            alert ('Ошибка при получении справочников: ' + error);
            
          });
        
      },
       eqDevisionName: function (_id){
        let devisionItem = _.find(this.eqDevisionList, {id: _id});
        return devisionItem ? devisionItem.name : '';
      },
      eqReadinessName: function (_id){
        let eqReadinessItem = _.find(this.eqReadinessList, {id: _id});
        return eqReadinessItem ? eqReadinessItem.name: '';
      },
      responsibleName: function (_id){
        let responsibleItem = _.find(this.responsibleList, {id: _id});
        return responsibleItem ? responsibleItem.name: '';
      },
      hasEquip: function(){
			return (this.eqId && this.eqId > -1);
		},
        exportExcel: function(){
        
        let wb = new ExcelJS.Workbook();
        let workbookName = `${this.report_name}.xlsx`;
        let worksheetName = 'Форма карточки учета';
        let ws = wb.addWorksheet(worksheetName);

        ws.pageSetup.margins = {
          left: 0.7, right: 0.5,
          top: 0.5, bottom: 0.5,
          header: 30, footer: 0
        };

        ws.getColumn(5).width = 6.5;
        ws.getColumn(6).width = 13;
        ws.pageSetup.printTitlesRow = '1:3';

       const imageLogo = wb.addImage({
           base64: base64Img,
           extension: 'png',
         });
         ws.addImage(imageLogo,  {
            tl: { col: 0, row: 0 },
            ext: { width: 76, height: 59 }
          });
         
          ws.mergeCells('E2:F3');
          ws.getCell('E2').style = {
            font: {
              size: 11,
              //underline: true
            },
            alignment: {
              horizontal: 'right', 
              vertical: 'bottom',
            }
          };
          ws.getCell('E2').value = 'Подразделение:';

         

           ws.mergeCells('G2:J3');
          ws.getCell('G2').style = {
            font: {
              size: 11,
              underline: true
            },
            alignment: {
              horizontal: 'left', 
              vertical: 'bottom',
              wrapText: true
            }
          };
          ws.getCell('G2').value = this.eqData.devision;

          ws.mergeCells('A4:J4');
          ws.getCell('A4').style = {
            font: {
              size: 11,
              bold: true
            },
            alignment: {
              horizontal: 'center', 
              wrapText: true
            }
          };
          ws.getCell('A4').value = this.report_name;

          let rowIndex = 4;
          let beginColIndex = 1, endColIndex = 10, medColIndex = 5;
          $('#table-card')[0].rows.forEach(row =>
          {
             
              if(!$(row).hasClass('hidden'))
              {
                  rowIndex++;
                  if ($(row.cells[0]).hasClass("tr_header"))
                  {
                     ws.mergeCells(rowIndex,beginColIndex, rowIndex, endColIndex );
                      let cell = ws.getRow(rowIndex).getCell(beginColIndex);
                      cell.style = {
                        font: {
                          size: 11,
                          bold: true
                        },
                        alignment: {
                          horizontal: 'center', 
                          vertical: 'top',
                          wrapText: true
                        }
                      };
                   
                     cell.value =  $(row.cells[0]).html();
                     cell.fill = {
                      type: "pattern",
                      pattern: "solid",
                      fgColor: { argb: "E3E3E3" }
                    };
                      ws.getRow(rowIndex).height = 27;

                  }
                  else {
                    ws.mergeCells(rowIndex,beginColIndex, rowIndex, medColIndex );
                      let cell = ws.getRow(rowIndex).getCell(beginColIndex);
                      cell.style = {
                        font: {
                          size: 11
                        },
                        alignment: {
                          horizontal: 'left', 
                          vertical: 'top',
                          wrapText: true
                        }
                      };
                   
                    let td = $(row.cells[0]).find('.cell');
                    let height = td.height()*0.9;
                    cell.value = td.html();
                    ws.getRow(rowIndex).height = height ;

                    ws.mergeCells(rowIndex,medColIndex+1, rowIndex, endColIndex );
                    cell = ws.getRow(rowIndex).getCell(medColIndex+1);
                    cell.style = {
                        font: {
                          size: 11
                        },
                        alignment: {
                          horizontal: 'left', 
                          vertical: 'top',
                          wrapText: true
                        }
                      };
                   
                  td =  $(row.cells[1]).find('.link');
                  if (td.length > 0) {
                      if (td.find('a').length > 0){

                           cell.value = { 
                             text: td.text(),
                             hyperlink: $(td.find('a')).attr('href')
                           };
                          cell.font = {
                            color: { argb: "0000FF" },
                            underline: true
                           }
                      }
                      else{ 
                          let value = td.text();
                         cell.value = value;
                      }
                     
                  }
                  else 
                  {
                    td = $(row.cells[1]).find('.cell');
                   let value = td.find('textarea')[0] ? td.find('textarea')[0].value : td.html();  
                   cell.value = value;
                  }

                  }
              }

          });

            ws.eachRow({ includeEmpty: false }, function(row, rowNumber) {
              if (rowNumber > 4 && rowNumber <= rowIndex)
              {
                    row.eachCell({ includeEmpty: false }, function(cell, colNumber) {
                      if (colNumber < 10)
                       cell.border = { top: {style: 'thin'}, 
                          left: {style: 'thin'}, 
                          bottom: {style: 'thin'}, 
                          right: {style: 'thin'}
                        };
                   
                  });
             }
            });

            rowIndex += 2;
            ws.mergeCells(rowIndex,1, rowIndex, 2);
            let cell = ws.getRow(rowIndex).getCell(1);
            cell.value = 'Дата заполнения';

            cell = ws.getRow(rowIndex).getCell(3);
            cell.value = `"     ${this.curDate.day}    "`;
            cell.border = {bottom: {style: 'thin'}};

             ws.mergeCells(rowIndex,4, rowIndex, 5);
            cell = ws.getRow(rowIndex).getCell(4);
            cell.value = this.curDate.month;
            cell.border = {bottom: {style: 'thin'}};

            cell = ws.getRow(rowIndex).getCell(6);
            cell.value = "2020г."

            rowIndex++;

             ws.mergeCells(rowIndex,1, rowIndex, 5);
             cell = ws.getRow(rowIndex).getCell(1);
            cell.value = 'Председатель Инвентаризационной комиссии';
            
             ws.mergeCells(rowIndex,6, rowIndex, 7);
             cell = ws.getRow(rowIndex).getCell(6);
             cell.value = this.chairman;
             cell.border = {bottom: {style: 'thin'}};

            cell = ws.getRow(rowIndex).getCell(8);
            cell.value = "Подпись";

             ws.mergeCells(rowIndex,9, rowIndex, 10);
             cell = ws.getRow(rowIndex).getCell(9);
             cell.border = {bottom: {style: 'thin'}};

             rowIndex++;
              ws.mergeCells(rowIndex,6, rowIndex, 7);
             cell = ws.getRow(rowIndex).getCell(6);
             cell.value = "Ф.И.О.";
             cell.style = {
                        font: {
                          size: 9
                        },
                        alignment: {
                          horizontal: 'center', 
                          vertical: 'top'
                        }
                      };
              ws.getRow(rowIndex).height = 11 ;

             rowIndex++;

             ws.mergeCells(rowIndex,1, rowIndex, 5);
             cell = ws.getRow(rowIndex).getCell(1);
            cell.value = 'Руководитель подразделения АО "ВНИИЖТ"';
            
             ws.mergeCells(rowIndex,6, rowIndex, 7);
             cell = ws.getRow(rowIndex).getCell(6);
             cell.value = this.chief;
             cell.border = {bottom: {style: 'thin'}};

            cell = ws.getRow(rowIndex).getCell(8);
            cell.value = "Подпись";

             ws.mergeCells(rowIndex,9, rowIndex, 10);
             cell = ws.getRow(rowIndex).getCell(9);
             cell.border = {bottom: {style: 'thin'}};

             rowIndex++;
              ws.mergeCells(rowIndex,6, rowIndex, 7);
             cell = ws.getRow(rowIndex).getCell(6);
             cell.value = "Ф.И.О.";
             cell.style = {
                        font: {
                          size: 9
                        },
                        alignment: {
                          horizontal: 'center', 
                          vertical: 'top'
                        }
                      };
              ws.getRow(rowIndex).height = 11 ;

        wb.xlsx.writeBuffer()
          .then(function(buffer) {
            saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              workbookName
            );
        });
  
           
        },
       

        exportPDF: function(){
          this.isLoading = true;
           var body = [];
           var row = [];
           var heights = [];


          $('#table-card')[0].rows.forEach(row =>
          {
              if(!$(row).hasClass('hidden'))
              {
                  var cRow = []
                  if ($(row.cells[0]).hasClass("tr_header"))
                  {
                    heights.push(15);
                     cRow.push({text: $(row.cells[0]).html(), style: 'tableHeader', colSpan: 2});    
                     cRow.push('');
                  }
                  else {
                   // doc.setFont("arial", "normal");
                     let cell = $(row.cells[0]).find('.cell');
                     let height = cell.height()/1.1;
                     heights.push(height);

                     cRow.push({text: cell.html(), style: 'row'});    



                    let td =  $(row.cells[1]).find('.link');
                    if (td.length > 0) {
                      if (td.find('a').length > 0){
                         cRow.push({text: td.text(), link:  $(td.find('a')).attr('href'), style: 'link'});   
                      }
                      else{ 
                          let value = td.text();
                          
                           cRow.push({text: value, style: 'row'});   
                      }
                   }
                  else 
                    {
                      td = $(row.cells[1]).find('.cell');
                      let value = td.find('textarea')[0] ? td.find('textarea')[0].value : td.html();  
                      cRow.push({text: value, style: 'row'});   
                    }
                  }
                  body.push(cRow);
              }

          });

          var docDefenition = {
          
            header: function(currentPage, pageCount, pageSize) {
                // you can apply any logic and return any valid pdfmake element
                 let devision = $(".header-devision")[0].innerText;
                return [{
                   columns: [
                      { image: base64Img, width: 65, margin: [40,20]},
                      { text: devision, width: '*', alignment: 'right', decoration: 'underline', margin: [20, 50, 40, 80], style: 'defaultStyle' }//,
                //  { canvas: [ { type: 'rect', x: 170, y: 32, w: 50, h:30 } ] }],
                   ]
                }]
              },
          
            content: [
                {text:this.report_name, style: 'header'},
                {
                  table: {
                    widths: [220, 280],
                    heights: heights,
                    body: body
                  }
               },
               {
                 text: ''
               },
               {
                table: {
                    widths: [100, 30, 65, 35],
                    body: [
                      [{text:'Дата заполнения', style:'row', border: [false, false, false, false]}, 
                       {text: `"  ${this.curDate.day}  "`,  style:'row',  alignment: 'center', border: [false, false, false, true]},
                       {text: this.curDate.month, style:'row', alignment: 'center', border: [false, false, false, true]},
                       {text: `${this.curDate.year} г.`, style:'row', alignment: 'left', border: [false, false, false, false]}
                      ]
                    ]
                }
               },
                {
                  table: {
                    widths: [230, 130, 50, 70],
                    body: [
                      [{text:'Председатель Инвентаризационной комиссии', style:'row', border: [false, false, false, false]}, 
                       {text: this.chairman,  style:'row',  alignment: 'center', border: [false, false, false, true]},
                       {text:'Подпись', style:'row', border: [false, false, false, false]},
                       {text: '',  border: [false, false, false, true]}
                      ],
                      [{text:'', border: [false, false, false, false]}, 
                       {text: 'Ф.И.0', alignment: 'center', fontSize: 8, border: [false, false, false, false]},
                       {text:'', border: [false, false, false, false]}, 
                       {text:'', border: [false, false, false, false]}],

                       [{text:'Руководитель подразделения АО "ВНИИЖТ"', style:'row', border: [false, false, false, false]}, 
                       {text: this.chief,  style:'row',  alignment: 'center', border: [false, false, false, true]},
                       {text:'Подпись', style:'row', border: [false, false, false, false]},
                       {text: '',  border: [false, false, false, true]}
                      ],
                      [{text:'', border: [false, false, false, false]}, 
                       {text: 'Ф.И.0', alignment: 'center', fontSize: 8, border: [false, false, false, false]},
                       {text:'', border: [false, false, false, false]}, 
                       {text:'', border: [false, false, false, false]}]
                    ]
                  }
               }],
        
            styles: {
              header: {fontSize: 12, alignment: 'center', bold:true },
              tableHeader: {alignment: 'center', verticalAlign: 'center', fontSize: 10, fillColor:"#E3E3E3", bold: true },
              row: {alignment: 'left', fontSize: 10, color: '#000000',  background: '#FFFFFF', fillColor: '#FFFFFF' },
              defaultStyle: {fontSize: 10, alignment: 'center', color: '#000000', background:'#ffffff' },
              link: {decoration: 'underline', color: '#0000FF', fontSize: 10}

            },
             pageMargins: [ 40, 80, 40, 60 ],
            
          }
           this.isLoading = false;
        pdfMake.createPdf(docDefenition).download(this.report_name + ".pdf");

          
        
         

        },
       renderFooter: async function(footerId){
           
       }
    },
    mounted: function(){
      window.html2canvas = html2canvas;
      let now = new Date();
      this.curDate = {
        day: now.getDate(),
        month: ofMonth(now.getMonth()), //now.toLocaleString('ru', { month: 'long'  }),
        year: now.getFullYear()
      }
      if (this.hasEquip())
            this.initData();
      //this.empty_underline = this.empty_underline.padEnd(40 - this.eqData.devision.length, '_'); 
    }
}

</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-wrap: nowrap;
  width: 100%
}
.logo
{
  margin-left: 20px;

}
 img {
    max-width: 100%;
    height: auto;
    width: auto\9; /* ie8 */
 }
.title{
    width:100%;
    font-size: 18px;
     font-weight: 600;
    text-align: center;
}
.cardNum-num{
    font-weight: 600;
  //  text-decoration:underline;

}
.action-panel {
    display:flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    padding-bottom: .5em;
    border-bottom: none;
    width: 100%;
}
.export-button {
     border: 1px solid #ced4da;
    position: relative;
    padding: .425em .5em;
    -moz-border-radius: .25em;
    -webkit-border-radius:  .25em;
    border-radius: .25em;
    cursor: pointer;
    margin: 10px;
    width: 50px;
    height: 3em;
}

.export-button i{
    color: #337ab7;
    font-size: 20pt;
}

.export-button i:hover {
    cursor: pointer;
    color: #ed9b19;
}

.action-panel-btn{
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    margin-right: 1.5em;
    margin-left: 1.5em;
    width: 130px;
}
.header-devision{
  text-align: right;
  vertical-align: text-bottom;
  width: calc(100% - 50px);
  padding-top: 65px;
  padding-left: 50%;
}
.table-card{
  table-layout: fixed;
}
.table-bordered td{
    border: 1px solid black;
}
.hidden{
  display:none;
}
.col_name{
  width:40%;
  min-width: 400px;
}
.col_value{
  width:60%;
  min-width: 600px;
}
.cell{
  text-align: left;
  vertical-align: top;

}
.table td{
  padding-top: 0!important;
}
.tr_header td{
  padding: .75em!important;
}
.tr_header{
  background-color: #E3E3E3;
  text-align: center;
  height: 50px;
  font-weight: 600;
}
.editable-cell{
  border: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.report-container {
  width: 1000px;
}
.footer-row {
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
}
.underline{
   border-bottom: 1px solid black;
}
.footer-row input{
  width: calc(100% - .75em);
  border: none;
  text-align: center;
  
}
.footer-item{
  margin-left: .25em;
}
.fio{
  display: block;
}
.fio div{
 width: 100%;
 text-align: center;
}
.equip-error
	{
		color: red;
		display: inline-block;
		font-size: small;
	}

@media screen and (max-width:1000px) {
 
    .action-panel {
      justify-content: flex-start;
    }

}

</style>