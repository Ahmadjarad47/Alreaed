import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import {
  CreateHomeProduct,
  ReadHomeProduct,
  UpdateHomeProduct,
} from '../../Models/homeProduct';
import { AdminService } from '../../../admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-product',
  templateUrl: './home-product.component.html',
  styleUrl: './home-product.component.css',
})
export class HomeProductComponent implements OnInit {
  baseUrl: string = environment.base; // Base URL for API requests
  HomeProducts: ReadHomeProduct[] = []; // List of all HomeProducts
  HomeProduct: CreateHomeProduct = new CreateHomeProduct(); // New HomeProduct instance
  readHomeProductModal = new ReadHomeProduct(); // HomeProduct details for viewing
  _service = inject(AdminService); // AdminService injection
  toastr = inject(ToastrService); // ToastrService injection

  selectedHomeProduct = new UpdateHomeProduct(); // Selected HomeProduct for update
  openUpdateDialog = false; // Controls Update Modal visibility
  openDeleteDialog = false; // Controls Delete Modal visibility
  openReadDialog = false; // Controls Read Modal visibility
  deleteById: number = 0; // ID of HomeProduct to delete
  uploadProgress: number | null = null; // Upload progress
  progressPercentage: number = 45; // Default progress for demo

  ngOnInit(): void {
    this.getAll(); // Fetch all HomeProducts on component load
  }
  // Add an item to the list
  addListItem() {
    this.HomeProduct.list.push('');
  }

  // Remove an item from the list
  removeListItem(index: number) {
    this.HomeProduct.list.splice(index, 1);
  }

  // Add an item to the Arabic list
  addArabicListItem() {
    this.HomeProduct.arabicList.push('');
  }

  // Remove an item from the Arabic list
  removeArabicListItem(index: number) {
    this.HomeProduct.arabicList.splice(index, 1);
  }
  /**
   * Opens the Read Modal and populates data.
   * @param id - ID of the HomeProduct to read
   */
  openReadModal(id: number): void {
    this.openReadDialog = true;
    const model = this.HomeProducts.find((m) => m.id === id);
  }

  /**
   * Fetches all HomeProducts from the API.
   */
  getAll(): void {
    this._service.getHomeProduct().subscribe({
      next: (res) => {
        this.HomeProducts = res;
      },
      error: (err) => {
        console.error('Error fetching HomeProducts', err);
        this.toastr.error('خطأ في تحميل الخدمات الفرعية');
      },
    });
  }
  trackByIndex(index: number, item: any): number {
    return index;
  }
  /**
   * Handles file upload and displays progress.
   * @param event - File input event
   */
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadProgress = 0;

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `----`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          this.uploadProgress = (e.loaded / e.total) * 100;
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          this.uploadProgress = 100;
          this.HomeProduct!.image = file;
          this.toastr.success('تم تحميل الملف بنجاح');
        }
      };

      xhr.send(formData);
    }
  }

  /**
   * Submits a new HomeProduct to the API.
   */
  onSubmit(): void {
    const formData = new FormData();

    formData.append('name', this.HomeProduct.name);
    formData.append('description', this.HomeProduct.description);
    formData.append('arabicName', this.HomeProduct.arabicName);
    formData.append('arabicDescription', this.HomeProduct.arabicDescription);
    formData.append('titleList', this.HomeProduct.titleList);

    formData.append('list', this.HomeProduct.list.join(','));
    formData.append('arabicTitleList', this.HomeProduct.arabicTitleList);
    formData.append('arabicList', this.HomeProduct.arabicList.join(','));

    formData.append('isActive', this.HomeProduct.isActive.toString());

    if (this.HomeProduct.image) {
      formData.append('image', this.HomeProduct.image);
    }

    this._service.addHomeProduct(formData).subscribe({
      next: (response) => {
        this.getAll();
        document.getElementById('close-modal').click();
        this.toastr.success('تم إضافة الخدمة الفرعية بنجاح!');
      },
      error: (error) => {
        console.error('Error adding HomeProduct', error);
        this.toastr.error('فشل في إضافة الخدمة الفرعية.');
      },
    });
  }

  /**
   * Prepares a HomeProduct for update.
   * @param HomeProduct - HomeProduct data to load
   */
  loadHomeProductForUpdate(homeproduct: any): void {
    this.selectedHomeProduct = homeproduct;
    this.selectedHomeProduct.list = homeproduct.list.split(',');
    this.selectedHomeProduct.arabicList = homeproduct.arabicList.split(',');

    this.openUpdateDialog = true;
  }

  /**
   * Handles file upload for updating HomeProduct.
   * @param event - File input event
   */
  onUpdateFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadProgress = 0;

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `---`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          this.uploadProgress = (e.loaded / e.total) * 100;
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          this.uploadProgress = 100;
          this.selectedHomeProduct!.image = file;
          this.toastr.success('تم تحديث الملف بنجاح');
        }
      };

      xhr.send(formData);
    }
  }

  /**
   * Updates an existing HomeProduct.
   */
  onUpdate(): void {
    if (!this.selectedHomeProduct) {
      console.warn('No HomeProduct selected for update');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.selectedHomeProduct.id.toString());
    formData.append('name', this.selectedHomeProduct.name);
    formData.append('description', this.selectedHomeProduct.description);
    formData.append('arabicName', this.selectedHomeProduct.arabicName);
    formData.append(
      'arabicDescription',
      this.selectedHomeProduct.arabicDescription
    );
    formData.append('titleList', this.selectedHomeProduct.titleList);
    formData.append(
      'arabicTitleList',
      this.selectedHomeProduct.arabicTitleList
    );

    formData.append('list', this.selectedHomeProduct.list.join(','));
    formData.append(
      'arabicList',
      this.selectedHomeProduct.arabicList.join(',')
    );

    formData.append('isActive', this.selectedHomeProduct.isActive.toString());

    if (this.selectedHomeProduct.image) {
      formData.append('image', this.selectedHomeProduct.image);
    }

    this._service.updateHomeProduct(formData).subscribe({
      next: (response) => {
        this.getAll();
        this.openUpdateDialog = false;
        this.toastr.success('تم تحديث الخدمة الفرعية بنجاح!');
      },
      error: (error) => {
        console.error('Error updating HomeProduct', error);
        this.toastr.error('فشل في تحديث الخدمة الفرعية.');
      },
    });
  }

  /**
   * Opens Delete Modal with selected HomeProduct ID.
   * @param id - HomeProduct ID
   */
  setIdAndOpenDelete(id: number): void {
    this.deleteById = id;
    debugger;
    this.openDeleteDialog = true;
  }

  /**
   * Deletes the selected HomeProduct.
   */
  onDelete(): void {
    if (this.deleteById) {
      this._service.deleteHomeProduct(this.deleteById).subscribe({
        next: () => {
          this.toastr.info('تم حذف الخدمة الفرعية بنجاح!');
          this.openDeleteDialog = false;
          this.openUpdateDialog = false;
          this.getAll();
        },
        error: (err) => {
          console.error('Error deleting HomeProduct', err);
          this.toastr.error('فشل في حذف الخدمة الفرعية.');
        },
      });
    }
  }
}
