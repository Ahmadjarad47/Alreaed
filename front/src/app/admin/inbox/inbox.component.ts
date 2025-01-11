import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
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
import { ReadMessage } from '../core/Models/Message';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

declare var Dropdown: any;
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent implements AfterViewInit, OnInit {
  isOpenDailogColorView = false;
  isOpenDailogAaView = false;
  openColor = false;
  idDeleteMessage = 0;
  toast = inject(ToastrService);

  Messages: ReadMessage[] = [];
  _service = inject(AdminService);
  flow = inject(CoreService);
  constructor(public sanitizer: DomSanitizer) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.flow.loadFlowbite((f) => {
        f.initModals();
      });
    }, 1000);

    this.InitEditor();
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this._service.getAllMessages().subscribe({
      next: (res) => {
        this.Messages = res;
        console.log(res);
      },
    });
  }
  logcontent() {
    var editorDiv = document.querySelector('#wysiwyg-text-example');

    // Get the inner HTML, which includes tags like <p> and <br>
    var content = editorDiv.innerHTML;
    console.log(content);
  }
  onDeleteMessageSubmit() {
    this._service.DeleteMessageFromAdmin(this.idDeleteMessage).subscribe({
      next: (res) => {
        this.toast.info('Message Was Deleted Successfuly', 'SUCCESS');
        this.getAll();
      },
      error: (err) => {
        this.toast.warning('Something whent wrong ', 'ERROR');
      },
    });
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
