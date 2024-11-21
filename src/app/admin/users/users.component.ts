import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Dropdown } from 'flowbite';
import { DataTable } from 'simple-datatables';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements AfterViewInit {
  tableData = [
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      npmDownloads: 269000,
      growth: '49%',
    },
    {
      name: 'React',
      releaseDate: '2013/24/05',
      npmDownloads: 4500000,
      growth: '24%',
    },
    {
      name: 'Angular',
      releaseDate: '2010/20/09',
      npmDownloads: 2800000,
      growth: '17%',
    },
    {
      name: 'Vue',
      releaseDate: '2014/12/02',
      npmDownloads: 3600000,
      growth: '30%',
    },
    {
      name: 'Svelte',
      releaseDate: '2016/26/11',
      npmDownloads: 1200000,
      growth: '57%',
    },
    {
      name: 'Ember',
      releaseDate: '2011/08/12',
      npmDownloads: 500000,
      growth: '44%',
    },
    {
      name: 'Backbone',
      releaseDate: '2010/13/10',
      npmDownloads: 300000,
      growth: '9%',
    },
    {
      name: 'jQuery',
      releaseDate: '2006/28/01',
      npmDownloads: 6000000,
      growth: '5%',
    },
    {
      name: 'Bootstrap',
      releaseDate: '2011/19/08',
      npmDownloads: 1800000,
      growth: '12%',
    },
    {
      name: 'Foundation',
      releaseDate: '2011/23/09',
      npmDownloads: 700000,
      growth: '8%',
    },
    {
      name: 'Bulma',
      releaseDate: '2016/24/10',
      npmDownloads: 500000,
      growth: '7%',
    },
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      npmDownloads: 269000,
      growth: '49%',
    },
    {
      name: 'React',
      releaseDate: '2013/24/05',
      npmDownloads: 4500000,
      growth: '24%',
    },
    {
      name: 'Angular',
      releaseDate: '2010/20/09',
      npmDownloads: 2800000,
      growth: '17%',
    },
    {
      name: 'Vue',
      releaseDate: '2014/12/02',
      npmDownloads: 3600000,
      growth: '30%',
    },
    {
      name: 'Svelte',
      releaseDate: '2016/26/11',
      npmDownloads: 1200000,
      growth: '57%',
    },
    {
      name: 'Ember',
      releaseDate: '2011/08/12',
      npmDownloads: 500000,
      growth: '44%',
    },
    {
      name: 'Backbone',
      releaseDate: '2010/13/10',
      npmDownloads: 300000,
      growth: '9%',
    },
    {
      name: 'jQuery',
      releaseDate: '2006/28/01',
      npmDownloads: 6000000,
      growth: '5%',
    },
    {
      name: 'Bootstrap',
      releaseDate: '2011/19/08',
      npmDownloads: 1800000,
      growth: '12%',
    },
    {
      name: 'Foundation',
      releaseDate: '2011/23/09',
      npmDownloads: 700000,
      growth: '8%',
    },
    {
      name: 'Bulma',
      releaseDate: '2016/24/10',
      npmDownloads: 500000,
      growth: '7%',
    },
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      npmDownloads: 269000,
      growth: '49%',
    },
    {
      name: 'React',
      releaseDate: '2013/24/05',
      npmDownloads: 4500000,
      growth: '24%',
    },
    {
      name: 'Angular',
      releaseDate: '2010/20/09',
      npmDownloads: 2800000,
      growth: '17%',
    },
    {
      name: 'Vue',
      releaseDate: '2014/12/02',
      npmDownloads: 3600000,
      growth: '30%',
    },
    {
      name: 'Svelte',
      releaseDate: '2016/26/11',
      npmDownloads: 1200000,
      growth: '57%',
    },
    {
      name: 'Ember',
      releaseDate: '2011/08/12',
      npmDownloads: 500000,
      growth: '44%',
    },
    {
      name: 'Backbone',
      releaseDate: '2010/13/10',
      npmDownloads: 300000,
      growth: '9%',
    },
    {
      name: 'jQuery',
      releaseDate: '2006/28/01',
      npmDownloads: 6000000,
      growth: '5%',
    },
    {
      name: 'Bootstrap',
      releaseDate: '2011/19/08',
      npmDownloads: 1800000,
      growth: '12%',
    },
    {
      name: 'Foundation',
      releaseDate: '2011/23/09',
      npmDownloads: 700000,
      growth: '8%',
    },
    {
      name: 'Bulma',
      releaseDate: '2016/24/10',
      npmDownloads: 500000,
      growth: '7%',
    },
    {
      name: 'Flowbite',
      releaseDate: '2021/25/09',
      npmDownloads: 269000,
      growth: '49%',
    },
    {
      name: 'React',
      releaseDate: '2013/24/05',
      npmDownloads: 4500000,
      growth: '24%',
    },
    {
      name: 'Angular',
      releaseDate: '2010/20/09',
      npmDownloads: 2800000,
      growth: '17%',
    },
    {
      name: 'Vue',
      releaseDate: '2014/12/02',
      npmDownloads: 3600000,
      growth: '30%',
    },
    {
      name: 'Svelte',
      releaseDate: '2016/26/11',
      npmDownloads: 1200000,
      growth: '57%',
    },
    {
      name: 'Ember',
      releaseDate: '2011/08/12',
      npmDownloads: 500000,
      growth: '44%',
    },
    {
      name: 'Backbone',
      releaseDate: '2010/13/10',
      npmDownloads: 300000,
      growth: '9%',
    },
    {
      name: 'jQuery',
      releaseDate: '2006/28/01',
      npmDownloads: 6000000,
      growth: '5%',
    },
    {
      name: 'Bootstrap',
      releaseDate: '2011/19/08',
      npmDownloads: 1800000,
      growth: '12%',
    },
    {
      name: 'Foundation',
      releaseDate: '2011/23/09',
      npmDownloads: 700000,
      growth: '8%',
    },
    {
      name: 'Bulma',
      releaseDate: '2016/24/10',
      npmDownloads: 500000,
      growth: '7%',
    },
  ];
  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      if (typeof DataTable !== 'undefined') {
        const table = new DataTable('#export-table', {
          template: (options, dom) =>
            "<div class='" +
            options.classes.top +
            "'>" +
            "<div class='flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse w-full sm:w-auto'>" +
            (options.paging && options.perPageSelect
              ? "<div class='" +
                options.classes.dropdown +
                "'>" +
                '<label>' +
                "<select class='" +
                options.classes.selector +
                "'></select> " +
                options.labels.perPage +
                '</label>' +
                '</div>'
              : '') +
            "<button id='exportDropdownButton' type='button' class='flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto'>" +
            'Export as' +
            "<svg class='-me-0.5 ms-1.5 h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>" +
            "<path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7' />" +
            '</svg>' +
            '</button>' +
            "<div id='exportDropdown' class='z-10 hidden w-52 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700' data-popper-placement='bottom'>" +
            "<ul class='p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400' aria-labelledby='exportDropdownButton'>" +
            '<li>' +
            "<button id='export-csv' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'>" +
            "<svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>" +
            "<path fill-rule='evenodd' d='M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm1.018 8.828a2.34 2.34 0 0 0-2.373 2.13v.008a2.32 2.32 0 0 0 2.06 2.497l.535.059a.993.993 0 0 0 .136.006.272.272 0 0 1 .263.367l-.008.02a.377.377 0 0 1-.018.044.49.49 0 0 1-.078.02 1.689 1.689 0 0 1-.297.021h-1.13a1 1 0 1 0 0 2h1.13c.417 0 .892-.05 1.324-.279.47-.248.78-.648.953-1.134a2.272 2.272 0 0 0-2.115-3.06l-.478-.052a.32.32 0 0 1-.285-.341.34.34 0 0 1 .344-.306l.94.02a1 1 0 1 0 .043-2l-.943-.02h-.003Zm7.933 1.482a1 1 0 1 0-1.902-.62l-.57 1.747-.522-1.726a1 1 0 0 0-1.914.578l1.443 4.773a1 1 0 0 0 1.908.021l1.557-4.773Zm-13.762.88a.647.647 0 0 1 .458-.19h1.018a1 1 0 1 0 0-2H6.647A2.647 2.647 0 0 0 4 13.647v1.706A2.647 2.647 0 0 0 6.647 18h1.018a1 1 0 1 0 0-2H6.647A.647.647 0 0 1 6 15.353v-1.706c0-.172.068-.336.19-.457Z' clip-rule='evenodd'/>" +
            '</svg>' +
            '<span>Export CSV</span>' +
            '</button>' +
            '</li>' +
            '<li>' +
            "<button   id='export-json' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'>" +
            "<svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>" +
            "<path fill-rule='evenodd' d='M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm-.293 9.293a1 1 0 0 1 0 1.414L9.414 14l1.293 1.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 0Zm2.586 1.414a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414L14.586 14l-1.293-1.293Z' clip-rule='evenodd'/>" +
            '</svg>' +
            '<span>Export JSON</span>' +
            '</button>' +
            '</li>' +
            '<li>' +
           
            '</button>' +
            '</li>' +
            '<li>' +
            "<button id='export-sql' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'>" +
            "<svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>" +
            "<path d='M12 7.205c4.418 0 8-1.165 8-2.602C20 3.165 16.418 2 12 2S4 3.165 4 4.603c0 1.437 3.582 2.602 8 2.602ZM12 22c4.963 0 8-1.686 8-2.603v-4.404c-.052.032-.112.06-.165.09a7.75 7.75 0 0 1-.745.387c-.193.088-.394.173-.6.253-.063.024-.124.05-.189.073a18.934 18.934 0 0 1-6.3.998c-2.135.027-4.26-.31-6.3-.998-.065-.024-.126-.05-.189-.073a10.143 10.143 0 0 1-.852-.373 7.75 7.75 0 0 1-.493-.267c-.053-.03-.113-.058-.165-.09v4.404C4 20.315 7.037 22 12 22Zm7.09-13.928a9.91 9.91 0 0 1-.6.253c-.063.025-.124.05-.189.074a18.935 18.935 0 0 1-6.3.998c-2.135.027-4.26-.31-6.3-.998-.065-.024-.126-.05-.189-.074a10.163 10.163 0 0 1-.852-.372 7.816 7.816 0 0 1-.493-.268c-.055-.03-.115-.058-.167-.09V12c0 .917 3.037 2.603 8 2.603s8-1.686 8-2.603V7.596c-.052.031-.112.059-.165.09a7.816 7.816 0 0 1-.745.386Z'/>" +
            '</svg>' +
            '<span>Export SQL</span>' +
            '</button>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            (options.searchable
              ? "<div class='" +
                options.classes.search +
                "'>" +
                "<input class='" +
                options.classes.input +
                "' placeholder='" +
                options.labels.placeholder +
                "' type='search' title='" +
                options.labels.searchTitle +
                "'" +
                (dom.id ? " aria-controls='" + dom.id + "'" : '') +
                '>' +
                '</div>'
              : '') +
            '</div>' +
            "<div class='" +
            options.classes.container +
            "'" +
            (options.scrollY.length
              ? " style='height: " + options.scrollY + "; overflow-Y: auto;'"
              : '') +
            '></div>' +
            "<div class='" +
            options.classes.bottom +
            "'>" +
            (options.paging
              ? "<div class='" + options.classes.info + "'></div>"
              : '') +
            "<nav class='" +
            options.classes.pagination +
            "'></nav>" +
            '</div>',
        });
      }
      const $exportButton = document.getElementById('exportDropdownButton');
      const $exportDropdownEl = document.getElementById('exportDropdown');
      const dropdown = new Dropdown($exportDropdownEl, $exportButton);
      document.getElementById('export-json').addEventListener('click', () => {
        this.exportAsJson();
      });
      document.getElementById('export-csv').addEventListener('click', () => {
        this.exportDataToCSV();
      });
      document.getElementById('export-sql').addEventListener('click', () => {
        this.exportDataToSQL();
      });
    }
  }

  exportAsJson() {
    const tableData = this.tableData; // Get the table data as an array
    const json = JSON.stringify(tableData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
  }

  exportDataToCSV() {
    const ws = XLSX.utils.json_to_sheet(this.tableData);
    const wb = XLSX.utils.book_new();
    // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet JS');
    // Append the worksheet to the workbook
    XLSX.writeFile(wb, 'data.xlsx');
  }
  exportDataToSQL() {
    const tableName = 'your_table_name';
    const sqlStatements = this.tableData
      .map((row) => {
        return `INSERT INTO ${tableName} (name, releaseDate, npmDownloads, growth) VALUES ('${row.name}', '${row.releaseDate}', ${row.npmDownloads}, '${row.growth}');`;
      })
      .join('\n');
    this.downloadSQL(sqlStatements, 'data.sql');
  }
  downloadSQL(sqlContent: string, fileName: string) {
    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
}
