import { Component, inject, OnInit } from '@angular/core';
import {
  AddHomeAbout,
  ReadHomeAbout,
  UpdateHomeAbout,
} from '../../Models/homeAbout';
import { CoreService } from '../../../../core/core.service';
import { AdminService } from '../../../admin.service';
import { environment } from '../../../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-about',
  templateUrl: './home-about.component.html',
  styleUrl: './home-about.component.css',
})
export class HomeAboutComponent implements OnInit {
  baseUrl: string = environment.base;
  homeAbouts: ReadHomeAbout[] = [];
  AddhomeAbout: AddHomeAbout = new AddHomeAbout();
  readhomeAboutsModal = new ReadHomeAbout();
  _service = inject(AdminService);
  toastr = inject(ToastrService);

  selectedhomeAbouts: UpdateHomeAbout | null = null;
  openUpdateDailog = false;
  openDeleteDailog = false;
  openReadDailog = false;
  deleteById: number = 0;
  uploadProgress: number | null = null;
  progressPercentage: number = 45;

  ngOnInit(): void {
    this.getAll();
  }

  openReadModal(id: number) {
    this.openReadDailog = true;
    const model = this.homeAbouts.find((m) => m.id == id);
    this.readhomeAboutsModal.name = model.name;
    this.readhomeAboutsModal.description = model.description;
    this.readhomeAboutsModal.arabicName = model.arabicName;
    this.readhomeAboutsModal.arabicDescription = model.arabicDescription;
  }
  getAll() {
    this._service.gethomeAbouts().subscribe({
      next: (res) => {
        this.homeAbouts = res;
      },
    });
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
          this.AddhomeAbout.image = file; // Store image file (optional)
        }
      };

      xhr.send(formData);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.AddhomeAbout.name);
    formData.append('description', this.AddhomeAbout.description);
    formData.append('isActive', this.AddhomeAbout.isActive.toString());
    formData.append('arabicName', this.AddhomeAbout.arabicName);
    formData.append(
      'arabicDescription',
      this.AddhomeAbout.arabicDescription.toString()
    );

    if (this.AddhomeAbout.image) {
      formData.append('image', this.AddhomeAbout.image);
    }

    this._service.addAddhomeAbout(formData).subscribe(
      (response) => {
        document.getElementById('closeed')?.click();
        this.getAll();
        this.toastr.info('homeAbout added successfully!', "Success");
      },
      (error) => {
        this.toastr.error('Error adding homeAbout!', error.error.message);
      }
    );
  }

  loadhomeAboutsForUpdate(hero: ReadHomeAbout): void {
    this.selectedhomeAbouts = new UpdateHomeAbout(
      hero.id,
      hero.name,
      hero.arabicName,
      hero.arabicDescription,
      hero.description,
      null,
      hero.isActive
    );

    this.openUpdateDailog = !this.openUpdateDailog;
    // Simulate loading a hero for updating (replace with API call if needed)
  }
  onUpdateFile(event: any): void {
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
          this.selectedhomeAbouts.image = file; // Store image file (optional)
        }
      };

      xhr.send(formData);
    }
  }
  onUpdate(): void {
    if (!this.selectedhomeAbouts) {
      console.warn('No homeAbouts selected for update');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.selectedhomeAbouts.id.toString());
    formData.append('name', this.selectedhomeAbouts.name);
    formData.append('description', this.selectedhomeAbouts.description);
    formData.append('isActive', this.selectedhomeAbouts.isActive.toString());
    formData.append('arabicName', this.selectedhomeAbouts.arabicName);
    formData.append(
      'arabicDescription',
      this.selectedhomeAbouts.arabicDescription.toString()
    );

    // Conditionally append the image if it exists
    if (this.selectedhomeAbouts.image) {
      formData.append('image', this.selectedhomeAbouts.image);
    }

    this._service.updatehomeAbouts(formData).subscribe(
      (response) => {
        this.getAll();
        this.openUpdateDailog = false;
        console.log('homeAbouts updated successfully!', response);
        // Optionally show a success message using Toastr or another method
        this.toastr.warning('homeAbouts updated successfully!');
      },
      (error) => {
        console.error('Error updating homeAbouts!', error);
        // Optionally show an error message to the user
        this.toastr.error('Failed to update homeAbouts. Please try again.');
      }
    );
  }
  setIdAndOpenDelete(id: number) {
    this.openDeleteDailog = true;
    this.deleteById = id;
  }
  onDelete() {
    if (this.deleteById != 0) {
      this._service.deletehomeAbouts(this.deleteById).subscribe({
        next: (res) => {
          this.toastr.warning('homeAbouts delete successfully!');
          this.openDeleteDailog = false;
          this.getAll();
        },
        error: (err) => {
          this.toastr.error('Failed to delete hero. Please try again.');
        },
      });
    }
  }
}
