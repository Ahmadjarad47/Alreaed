import { Component, inject, OnInit } from '@angular/core';
import {
  AddSubService,
  ReadSubService,
  UpdateSubService,
} from '../../Models/SubService';
import { environment } from '../../../../../environments/environment.development';
import { AdminService } from '../../../admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subservice',
  templateUrl: './subservice.component.html',
  styleUrls: ['./subservice.component.css'], // Fixed typo for multiple styles
})
export class SubserviceComponent implements OnInit {
  baseUrl: string = environment.base; // Base URL for API requests
  SubServices: ReadSubService[] = []; // List of all SubServices
  SubService: AddSubService = new AddSubService(); // New SubService instance
  readSubServiceModal = new ReadSubService(); // SubService details for viewing
  _service = inject(AdminService); // AdminService injection
  toastr = inject(ToastrService); // ToastrService injection

  selectedSubService: UpdateSubService | null = null; // Selected SubService for update
  openUpdateDialog = false; // Controls Update Modal visibility
  openDeleteDialog = false; // Controls Delete Modal visibility
  openReadDialog = false; // Controls Read Modal visibility
  deleteById: number = 0; // ID of SubService to delete
  uploadProgress: number | null = null; // Upload progress
  progressPercentage: number = 45; // Default progress for demo

  ngOnInit(): void {
    this.getAll(); // Fetch all SubServices on component load
  }

  /**
   * Opens the Read Modal and populates data.
   * @param id - ID of the SubService to read
   */
  openReadModal(id: number): void {
    this.openReadDialog = true;
    const model = this.SubServices.find((m) => m.id === id);
    if (model) {
      this.readSubServiceModal.name = model.name;
      this.readSubServiceModal.description = model.description;
    }
  }

  /**
   * Fetches all SubServices from the API.
   */
  getAll(): void {
    this._service.getSubServiceeAbouts().subscribe({
      next: (res) => {
        this.SubServices = res;
      },
      error: (err) => {
        console.error('Error fetching SubServices', err);
        this.toastr.error('خطأ في تحميل الخدمات الفرعية');
      },
    });
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
          this.SubService.image = file;
          this.toastr.success('تم تحميل الملف بنجاح');
        } 
      };

    

      xhr.send(formData);
    }
  }

  /**
   * Submits a new SubService to the API.
   */
  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.SubService.name);
    formData.append('description', this.SubService.description);
    formData.append('isActive', this.SubService.isActive.toString());
    formData.append('arabicName', this.SubService.arabicName);
    formData.append('arabicDescription', this.SubService.arabicDescription);

    if (this.SubService.image) {
      formData.append('image', this.SubService.image);
    }

    this._service.addSubService(formData).subscribe({
      next: (response) => {
        this.getAll();
        document.getElementById('close-modal').click();
        this.toastr.success('تم إضافة الخدمة الفرعية بنجاح!');
      },
      error: (error) => {
        console.error('Error adding SubService', error);
        this.toastr.error('فشل في إضافة الخدمة الفرعية.');
      },
    });
  }

  /**
   * Prepares a SubService for update.
   * @param SubService - SubService data to load
   */
  loadSubServiceForUpdate(SubService: any): void {
    this.selectedSubService = new UpdateSubService(
      SubService.id,
      SubService.name,
      SubService.arabicName,
      SubService.arabicDescription,
      SubService.description,
      null,
      SubService.isActive
    );
    this.openUpdateDialog = true;
  }

  /**
   * Handles file upload for updating SubService.
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
          this.selectedSubService!.image = file;
          this.toastr.success('تم تحديث الملف بنجاح');
        } 
      };

     

      xhr.send(formData);
    }
  }

  /**
   * Updates an existing SubService.
   */
  onUpdate(): void {
    if (!this.selectedSubService) {
      console.warn('No SubService selected for update');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.selectedSubService.id.toString());
    formData.append('name', this.selectedSubService.name);
    formData.append('description', this.selectedSubService.description);
    formData.append('isActive', this.selectedSubService.isActive.toString());
    formData.append('arabicName', this.selectedSubService.arabicName);
    formData.append('arabicDescription', this.selectedSubService.arabicDescription);

    if (this.selectedSubService.image) {
      formData.append('image', this.selectedSubService.image);
    }

    this._service.updateSubService(formData).subscribe({
      next: (response) => {
        this.getAll();
        this.openUpdateDialog = false;
        this.toastr.success('تم تحديث الخدمة الفرعية بنجاح!');
      },
      error: (error) => {
        console.error('Error updating SubService', error);
        this.toastr.error('فشل في تحديث الخدمة الفرعية.');
      },
    });
  }

  /**
   * Opens Delete Modal with selected SubService ID.
   * @param id - SubService ID
   */
  setIdAndOpenDelete(id: number): void {
    this.openDeleteDialog = true;
    this.deleteById = id;
  }

  /**
   * Deletes the selected SubService.
   */
  onDelete(): void {
    if (this.deleteById) {
      this._service.deleteSubService(this.deleteById).subscribe({
        next: () => {
          this.toastr.info('تم حذف الخدمة الفرعية بنجاح!');
          this.openDeleteDialog = false;
          this.getAll();
        },
        error: (err) => {
          console.error('Error deleting SubService', err);
          this.toastr.error('فشل في حذف الخدمة الفرعية.');
        },
      });
    }
  }
}
