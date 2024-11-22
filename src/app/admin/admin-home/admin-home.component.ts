
import { AfterViewInit, Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import { DataTable } from 'simple-datatables';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements AfterViewInit {


  initFirstChart() {
    const options = {
      // add data series via arrays, learn more here: https://apexcharts.com/docs/series/
      series: [
        {
          name: 'Developer Edition',
          data: [1500, 1418, 1456, 1526, 1356, 1256],
          color: '#1A56DB',
        },
        {
          name: 'Designer Edition',
          data: [643, 413, 765, 412, 1423, 1731],
          color: '#7E3BF2',
        },
      ],
      chart: {
        height: '100%',
        maxWidth: '100%',
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        dropShadow: {
          enabled: true,
        },
        toolbar: {
          show: true,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
        },
      },
      legend: {
        show: true,
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: '#1C64F2',
          gradientToColors: ['#1C64F2'],
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0,
        },
      },
      xaxis: {
        categories: [
          '01 February',
          '02 February',
          '03 February',
          '04 February',
          '05 February',
          '06 February',
          '07 February',
        ],
        labels: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
      },
      yaxis: {
        show: true,
        labels: {
          formatter: function (value) {
            return '$' + value;
          },
        },
      },
    };

    if (
      document.getElementById('data-series-chart') &&
      typeof ApexCharts !== 'undefined' &&
      typeof window !== 'undefined'
    ) {
      const chart = new ApexCharts(
        document.getElementById('data-series-chart'),
        options
      );
      chart.render();
    }
  }
  initSecondChart() {
    const getChartOptions = () => {
      return {
        series: [52.8, 26.8, 20.4],
        colors: ['#1C64F2', '#16BDCA', '#9061F9'],
        chart: {
          height: 420,
          width: '100%',
          type: 'pie',
        },
        stroke: {
          colors: ['white'],
          lineCap: '',
        },
        plotOptions: {
          pie: {
            labels: {
              show: true,
            },
            size: '100%',
            dataLabels: {
              offset: -25,
            },
          },
        },
        labels: ['Direct', 'Organic search', 'Referrals'],
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: 'Inter, sans-serif',
          },
        },
        legend: {
          position: 'bottom',
          fontFamily: 'Inter, sans-serif',
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value + '%';
            },
          },
        },
        xaxis: {
          labels: {
            formatter: function (value) {
              return value + '%';
            },
          },
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
          },
        },
      };
    };

    if (
      document.getElementById('pie-chart') &&
      typeof ApexCharts !== 'undefined' &&
      typeof window !== 'undefined'
    ) {
      const chart = new ApexCharts(
        document.getElementById('pie-chart'),
        getChartOptions()
      );
      chart.render();
    }
  }

  initThreeChart() {
    const options = {
      series: [
        {
          name: 'Income',
          color: '#31C48D',
          data: ['1420', '1620', '1820', '1420', '1650', '2120'],
        },
        {
          name: 'Expense',
          data: ['788', '810', '866', '788', '1100', '1200'],
          color: '#F05252',
        },
      ],
      chart: {
        sparkline: {
          enabled: true,
        },
        type: 'bar',
        width: '100%',
        height: 400,
        toolbar: {
          show: true,
        },
      },
      fill: {
        opacity: 1,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '100%',
          borderRadiusApplication: 'end',
          borderRadius: 6,
          dataLabels: {
            position: 'top',
          },
        },
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      dataLabels: {
        enabled: true,
      },
      tooltip: {
        shared: true,
        intersect: false,
        formatter: function (value) {
          return '$' + value;
        },
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: 'Inter, sans-serif',
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
          },
          formatter: function (value) {
            return '$' + value;
          },
        },
        categories: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: 'Inter, sans-serif',
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
          },
        },
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -20,
        },
      },
    };

    if (
      document.getElementById('bar-chart') &&
      typeof ApexCharts !== 'undefined' &&
      typeof window !== 'undefined'
    ) {
      const chart = new ApexCharts(
        document.getElementById('bar-chart'),
        options
      );
      chart.render();
    }
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      if (typeof window !== 'undefined') {
        this.initFirstChart();
        this.initSecondChart();
        this.initThreeChart();
        const dataTable = new DataTable('#sorting-table', {
          sortable: true,
        });
      }
    },100)
   
  }
}
