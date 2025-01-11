import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import * as XLSX from 'xlsx';
declare var simpleDatatables: any;
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { Bold } from '@tiptap/extension-bold';
import { CoreService } from '../../core/core.service';
import { ReturnUserDTO, UserBlock, UserRole } from '../core/Models/User';
import { AdminService } from '../admin.service';
import { environment } from '../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddMessageFromAdmin, ReadMessage } from '../core/Models/Message';
declare var Dropdown: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, AfterViewInit {
  // Base URL from environment
  base = environment.base;

  // Flags to manage dialog visibility for various views
  isOpenDailogColorView = false;
  isOpenDailogAaView = false;
  isOpenDailogExportsView = false;
  openColor = false;
  role = new UserRole();
  isblock = false;
  // Dependency injection for services
  private flow = inject(CoreService); // Service to manage Flowbite UI components
  private _service = inject(AdminService); // Service to interact with backend APIs
  private toast = inject(ToastrService); // Service to display toast notifications
  private router = inject(Router);
  private navbarToggle=inject(AdminService)
  isSidebarClosed=false
  // Data model for blocking a user
  blocker: UserBlock = new UserBlock();
  message: AddMessageFromAdmin = new AddMessageFromAdmin();

  // Table data to display users
  tableData: ReturnUserDTO[] = [];

  // Current date used for lockout comparison
  currentDate: Date = new Date();

  /**
   * Lifecycle hook that initializes the component's data.
   */
  ngOnInit(): void {
    this.initializeTable(); // Load the initial table data
  }

  /**
   * Lifecycle hook that runs after the component's view has been initialized.
   */
  ngAfterViewInit(): void {
    this.initializeFlowbiteComponents(); // Initialize Flowbite UI components
    this._service.isOpen$.subscribe(p=>{
      this.isSidebarClosed=p;
    })
  
  }

  /**
   * Initializes the user table by fetching all users.
   */
  initializeTable(): void {
    this.getAllUsers(); // Fetch all users from the backend
    setTimeout(() => {
      const s = this.inItDateTable();
      this.initializeFlowbiteComponents();
      this.initializeEditor()
    }, 1000);
  }

  /**
   * Fetches all users from the backend and updates the table data.
   */
  getAllUsers(): void {
    this._service.getAllUsers().subscribe({
      next: (users) => {
        this.tableData = users;
        this.toast.info('Users loaded successfully!', 'Success'); // Show success notification
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.toast.error(
          'Failed to load users. Please try again later.',
          'Error'
        ); // Show error notification
      },
    });
  }

  onChangeRoleSubmit() {
    this._service.changeRole(this.role).subscribe({
      next: (res) => {
        console.log(res);
        this.toast.info('Role changed successfully!', 'Success'); // Show success notification
        this.getAllUsers(); // Refresh the user table after changing the role
        document.getElementById('closeModalRoles').click();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /**
   * Checks if the user is currently locked out by comparing the lockout date with the current date.
   * @param lockoutEnd - The lockout end date as a string or Date object
   * @returns true if the user is locked out, false otherwise
   */
  isLockedOut(lockoutEnd: Date | string): boolean {
    return new Date(lockoutEnd) > this.currentDate;
  }

  /**
   * Refreshes the data table by reloading the user data.
   */
  refreshDataTable(): void {
    this.inItDateTable();
    this.toast.info('Data table refreshed.', 'Info'); // Show info notification
    this.initializeFlowbiteComponents(); // Reinitialize UI components if necessary
  }

  /**
   * Sets the email address for the blocker and initializes Flowbite components.
   * @param email - The email address of the user to block
   */
  setEmail(email: string): void {
    const user = this.tableData.find((user) => user.email === email);

    this.isblock = this.isLockedOut(user.lockoutEnd);
    this.blocker.email = user.email;
    this.toast.info(`Email set to ${email}`, 'Info'); // Show info notification
  }

  /**
   * Submits the block request to the backend to block the user.
   */

  onBlockSubmit(): void {
    if (!this.blocker.email) {
      this.toast.warning('Please select a user to block.', 'Warning');
      return;
    }

    // Validate blockAt date

    this._service.blockUser(this.blocker).subscribe({
      next: (res) => {
        console.log('User blocked successfully:', res);
        this.toast.info(
          `User ${this.blocker.email} blocked successfully!`,
          'Success'
        );
        this.getAllUsers();
        document.getElementById('closeBlocker').click();
        this.router
          .navigateByUrl('/RefreshComponent', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/admin/users']);
          });
      },
      error: (err) => {
        console.error('Failed to block user:', err);
        this.toast.error('Failed to block user. Please try again.', 'Error');
      },
    });
  }

  /**
   * Helper function to validate if a given date string is a valid date
   */
  isValidDate(date: string): boolean {
    // Check if date is not empty and is a valid date
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
  }

  onUnBlockSubmit(): void {
    this._service.unblockUser(this.blocker.email).subscribe({
      next: (res) => {
        console.log('User unblocked successfully:', res);
        this.toast.info(
          `User ${this.blocker.email} unblocked successfully!`,
          'Success'
        );

        this.getAllUsers();
        document.getElementById('closeBlocker').click();
        this.router
          .navigateByUrl('/RefreshComponent', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/admin/users']);
          });
      },
      error: (err) => {
        console.error('Failed to unblock user:', err);
        this.toast.error('Failed to unblock user. Please try again.', 'Error');
      },
    });
  }
  /**
   * Initializes Flowbite UI components (modals, datepickers, etc.).
   */
  private initializeFlowbiteComponents(): void {
    this.flow.loadFlowbite((flowbite) => {
      flowbite.initModals(); // Initialize modals
      flowbite.initDatepickers(); // Initialize datepickers
    });
  }

  /**
   * Initializes any editor components used in the component.
   */
  private initializeEditor(): void {
    this.InitEditor(); // Initialize editors
  }
  /**
   * send Message for user
   */
  onMessageSubmit() {
    this.message.Content = document.getElementById(
      'wysiwyg-text-example'
    ).innerHTML;

    this._service.addNewMessageFromAdmin(this.message).subscribe({
      next: (res) => {
        this.toast.info('Message Send Success', 'SUCCESS');
      },
      error: (err) => {
        console.log(err);
        this.toast.error('Something whent wrong', 'ERROR');
      },
    });
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
      .map((row: ReturnUserDTO) => {
        return `INSERT INTO ${tableName} (userName, email, phoneNumber, createAt, city, emailConfirmed, lockoutEnd) VALUES ('${
          row.userName
        }', '${row.email}', '${
          row.phoneNumber
        }', '${row.createAt.toISOString()}', '${row.city}', ${
          row.emailConfirmed
        }, '${row.lockoutEnd.toISOString()}');`;
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

  inItDateTable() {
    if (typeof window !== 'undefined') {
      if (typeof simpleDatatables.DataTable !== 'undefined') {
        var table = new simpleDatatables.DataTable('#export-table', {
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
            "<div id='exportDropdown'  class='z-10 hidden  w-52 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700' data-popper-placement='bottom'>" +
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
            "<button id='export-json' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'>" +
            "<svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>" +
            "<path fill-rule='evenodd' d='M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm-.293 9.293a1 1 0 0 1 0 1.414L9.414 14l1.293 1.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 0Zm2.586 1.414a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414L14.586 14l-1.293-1.293Z' clip-rule='evenodd'/>" +
            '</svg>' +
            '<span>Export JSON</span>' +
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
      console.log(dropdown);

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
    return table;
  }

  InitEditor() {
    if (
      document.getElementById('wysiwyg-text-example') &&
      typeof window !== 'undefined'
    ) {
      const FontSizeTextStyle = TextStyle.extend({
        addAttributes() {
          return {
            fontSize: {
              default: null,
              parseHTML: (element) => element.style.fontSize,
              renderHTML: (attributes) => {
                if (!attributes['fontSize']) {
                  // Use bracket notation here
                  return {};
                }
                return { style: 'font-size: ' + attributes['fontSize'] }; // Use bracket notation here
              },
            },
          };
        },
      });
      const CustomBold = Bold.extend({
        // Override the renderHTML method
        renderHTML({ HTMLAttributes }) {
          return [
            'span',
            { ...HTMLAttributes, style: 'font-weight: bold;' },
            0,
          ];
        },
        // Ensure it doesn't exclude other marks
        excludes: '',
      });

      // tip tap editor setup
      const editor = new Editor({
        element: document.querySelector('#wysiwyg-text-example'),
        extensions: [
          // Exclude the default Bold mark
          StarterKit.configure({ bold: false }),

          // Include the custom Bold extension
          CustomBold,
          Highlight,
          Underline,
          Subscript,
          Superscript,
          TextStyle,
          FontSizeTextStyle,
          Color,
          FontFamily,
        ],
      });
      // set up custom event listeners for the buttons
      document
        .getElementById('toggleBoldButton')
        .addEventListener('click', () =>
          editor.chain().focus().toggleBold().run()
        );
      document
        .getElementById('toggleItalicButton')
        .addEventListener('click', () =>
          editor.chain().focus().toggleItalic().run()
        );
      document
        .getElementById('toggleUnderlineButton')
        .addEventListener('click', () =>
          editor.chain().focus().toggleUnderline().run()
        );
      document
        .getElementById('toggleStrikeButton')
        .addEventListener('click', () =>
          editor.chain().focus().toggleStrike().run()
        );
      document
        .getElementById('toggleSubscriptButton')
        .addEventListener('click', () =>
          editor.chain().focus().toggleSubscript().run()
        );
      document
        .getElementById('toggleSuperscriptButton')
        .addEventListener('click', () =>
          editor.chain().focus().toggleSuperscript().run()
        );
      document
        .getElementById('toggleHighlightButton')
        .addEventListener('click', () => {
          const isHighlighted = editor.isActive('highlight');
          // when using toggleHighlight(), judge if is is already highlighted.
          editor
            .chain()
            .focus()
            .toggleHighlight({
              color: isHighlighted ? undefined : '#ffc078', // if is already highlighted，unset the highlight color
            })
            .run();
        });

      document
        .getElementById('toggleCodeButton')
        .addEventListener('click', () => {
          editor.chain().focus().toggleCode().run();
        });

      const textSizeDropdown = new Dropdown(
        document.getElementById('textSizeDropdown')
      );

      // Loop through all elements with the data-text-size attribute
      document.querySelectorAll('[data-text-size]').forEach((button) => {
        button.addEventListener('click', () => {
          const fontSize = button.getAttribute('data-text-size');

          // Apply the selected font size via pixels using the TipTap editor chain
          editor.chain().focus().setMark('textStyle', { fontSize }).run();

          // Hide the dropdown after selection
          textSizeDropdown.hide();
        });
      });

      // Listen for color picker changes
      const colorPicker = document.getElementById('color') as HTMLInputElement;

      colorPicker.addEventListener('input', (event) => {
        const selectedColor = (event.target as HTMLInputElement).value;

        // Apply the selected color to the selected text
        editor.chain().focus().setColor(selectedColor).run();
      });

      document.querySelectorAll('[data-hex-color]').forEach((button) => {
        button.addEventListener('click', () => {
          const selectedColor = button.getAttribute('data-hex-color');

          // Apply the selected color to the selected text
          editor.chain().focus().setColor(selectedColor).run();
        });
      });

      document.getElementById('reset-color').addEventListener('click', () => {
        editor.commands.unsetColor();
      });

      const fontFamilyDropdownElement =
        document.getElementById('fontFamilyDropdown');

      if (fontFamilyDropdownElement) {
        // Initialize the dropdown instance for the font family dropdown
        const fontFamilyDropdown = new Dropdown(fontFamilyDropdownElement);

        // Loop through all elements with the data-font-family attribute
        document.querySelectorAll('[data-font-family]').forEach((button) => {
          button.addEventListener('click', () => {
            const fontFamily = button.getAttribute('data-font-family');

            // Apply the selected font size via pixels using the TipTap editor chain
            editor.chain().focus().setFontFamily(fontFamily).run();

            // Hide the dropdown after selection
            fontFamilyDropdown.hide();
          });
        });
      }
    }
  }
}
