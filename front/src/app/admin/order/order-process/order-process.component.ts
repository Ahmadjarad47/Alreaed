import { Component, inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { AdminService } from '../../admin.service';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from '../../../core/core.service';
import { Paging } from '../../core/Models/OrderModels';
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
import { OrderAccept } from '../../core/Models/OrderAccept';
declare var Dropdown: any;
@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrl: './order-process.component.css',
})
export class OrderProcessComponent {
  // State to manage whether the sidebar is open or closed
  public isSidebarClosed = false;
  public isOpenDailogAaView = false;
  public isOpenDailogColorView = false;
  public isEditorLoaded = false;
  public orderAccept = new OrderAccept();
  public search: string = '';
  // Dependency injections using Angular's inject function
  private adminService = inject(AdminService); // Admin service for API calls
  private toastr = inject(ToastrService); // Toastr service for notifications
  private coreService = inject(CoreService); // Core service for additional utilities

  uploadProgress: number | null = null;
  progressPercentage: number = 45;
  Orders: Paging = new Paging(); // Initialize with an empty object or array

  /**
   * Angular lifecycle hook: Runs after the component is initialized.
   * Used here to load initial data.
   */
  ngOnInit(): void {
    this.loadOrders(); // Fetch the initial set of orders
    this.toastr.info('Orders in process is loaded', 'SUCCESS');
  }

  /**
   * Angular lifecycle hook: Runs after the component's view is initialized.
   * Used here to subscribe to state changes and initialize UI libraries.
   */
  ngAfterViewInit(): void {
    this.subscribeToSidebarChanges(); // Listen for sidebar state changes
    this.debounce(() => {
      this.coreService.loadFlowbite((m) => m.initFlowbite());
    }, 1000); // Initialize Flowbite with debounce
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.uploadProgress = 0;

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'your-upload-endpoint', true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          this.uploadProgress = (e.loaded / e.total) * 100;
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          this.uploadProgress = 100; // Fully uploaded
          this.orderAccept.file = file; // Store image file (optional)
        }
      };

      xhr.send(formData);
    }
  }

  public onMessageAndFileSubmit() {
    this.orderAccept.message = document.getElementById(
      'wysiwyg-text-example'
    ).innerHTML;

    const formData = new FormData();
    formData.append('id', this.orderAccept.id.toString());
    formData.append('file', this.orderAccept.file);
    formData.append('message', this.orderAccept.message);
    this.adminService.AcceptOrderAndSetNewFile(formData).subscribe({
      next: (res) => {
        this.toastr.info('Order Change Success and Accepted', 'SUCCESS');
      },
      error(err) {
        console.log(err);
      },
    });
  }
  public SearchUsingWord() {
    this.Orders.search = this.search;
    this.loadOrders();
  }
  /**
   * Fetches all orders that are currently in process and updates the state.
   */
  private loadOrders(): void {
    this.adminService.getInProcessOrders(this.Orders).subscribe({
      next: (res: Paging) => {
        console.log('Orders fetched successfully:', res); // Log successful API response
        this.Orders = res; // Update the orders state
  
      },
      error: (err) => {
        console.error('Error fetching orders:', err); // Log any errors
        this.toastr.error('Failed to load orders.', 'Error'); // Show an error notification
      },
    });
  }

  public onChangePage(event: number): void {
    if (this.Orders.pageNumber !== event) {
      this.Orders.pageNumber = event; // Update the current page number
      this.loadOrders(); // Reload orders data for the new page
    }
  }
  /**
   * Subscribes to sidebar state changes and updates the component state accordingly.
   */
  private subscribeToSidebarChanges(): void {
    this.adminService.isOpen$.subscribe((isOpen: boolean) => {
      this.isSidebarClosed = isOpen; // Update sidebar state
    });
  }

  /**
   * Downloads a file from the given file path.
   * @param filePath - The relative path of the file to download.
   */
  public downloadFile(filePath: string): void {
    const downloadUrl = `${environment.base}${filePath}`; // Construct the full download URL
    const anchor = document.createElement('a'); // Create a hidden anchor element
    anchor.href = downloadUrl; // Set the download URL
    anchor.download = ''; // Optional: Specify a custom file name
    document.body.appendChild(anchor); // Append the anchor to the DOM
    anchor.click(); // Trigger the download
    document.body.removeChild(anchor); // Clean up by removing the anchor
  }

  /**
   * Utility function to delay the execution of a function.
   * @param func - The function to execute.
   * @param wait - The delay time in milliseconds.
   */
  private debounce(func: () => void, wait: number): void {
    setTimeout(() => func(), wait); // Execute the function after the specified delay
  }

  /**
   * Initializes any editor components used in the component.
   */
  public initializeEditor(): void {
    if (this.isEditorLoaded != true) {
      // this.InitEditor(); // Initialize editors
      this.toastr.info('Editor Initial sucess', 'SUCCESS');
      this.isEditorLoaded = true;
      return;
    }
    this.toastr.error('Editor Initial already', 'ERROR');
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
