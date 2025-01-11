import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { AddHero, ReadHero, UpdateHero } from '../../Models/hero/heroCrud';
import { AdminService } from '../../../admin.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'], // Ensure it's 'styleUrls' instead of 'styleUrl'
})
export class HeroComponent implements OnInit {
  // Base URL for API calls
  baseUrl: string = environment.base;

  // List of heroes retrieved from the API
  Heros: ReadHero[] = [];

  // New hero to be added
  hero: AddHero = new AddHero();

  // Hero details for reading or displaying
  readHeroModal = new ReadHero();

  // Dependency injection for services
  private _service = inject(AdminService);
  private toastr = inject(ToastrService);

  // Selected hero for updating or deleting
  selectedHero: UpdateHero | null = null;

  // Modal/dialog control flags
  openUpdateDailog = false;
  openDeleteDailog = false;
  openReadDailog = false;

  // ID of hero to delete
  deleteById: number = 0;

  // File upload progress percentage
  uploadProgress: number | null = null;

  // Percentage for custom progress bar (example)
  progressPercentage: number = 45;

  ngOnInit(): void {
    // Load all heroes when the component is initialized
    this.getAll();
  }

  /**
   * Fetches all heroes from the server and stores them in the Heros array.
   */
  getAll() {
    this._service.getHeroSection().subscribe({
      next: (res) => {
        this.Heros = res; // تأكد من أن البيانات تُخزن هنا بنجاح

        this.toastr.info('All hero ready', 'Info');
      },
      error: (error) => {
        console.error('Failed to fetch heroes:', error);
        this.toastr.error('Failed to fetch heroes. Please try again.', 'Error');
      },
    });
  }

  /**
   * Opens the read dialog and loads hero details by ID.
   * @param id - Hero ID
   */
  openReadModal(id: number): void {
    this.openReadDailog = true;
    const model = this.Heros.find((m) => m.id === id);
    if (model) {
      this.readHeroModal = { ...model }; // Spread operator to copy object
    }
  }

  /**
   * Handles file input change for adding a new hero.
   * @param event - File input change event
   */
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file, (progress) => (this.uploadProgress = progress));
    }
  }

  /**
   * Handles file upload and progress tracking.
   * @param file - File to upload
   * @param progressCallback - Callback to update progress
   */
  private uploadFile(
    file: File,
    progressCallback: (progress: number) => void
  ): void {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.baseUrl}/upload-endpoint`, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        progressCallback((e.loaded / e.total) * 100);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        this.uploadProgress = 100;
        this.hero.image = file;
      }
    };

    xhr.send(formData);
  }

  /**
   * Submits the new hero form data to the server.
   */
  onSubmit(): void {
    const formData = this.createHeroFormData(this.hero);
    this._service.addHero(formData).subscribe(
      () => {
        this.getAll();
        document.getElementById('closeed')?.click(); // Close modal
        this.toastr.success('Hero added successfully!', 'Success');
      },
      (error) => {
        console.error('Error adding hero!', error);
        this.toastr.error('Error adding hero!', 'Error');
      }
    );
  }

  /**
   * Loads hero data into the update form.
   * @param hero - Hero to update
   */
  loadHeroForUpdate(hero: ReadHero): void {
    this.selectedHero = new UpdateHero(
      hero.id,
      hero.name,
      hero.arabicName,
      hero.arabicDescription,
      hero.description,
      null,
      hero.isActive
    );
    this.openUpdateDailog = true;
  }

  /**
   * Handles file input change for updating a hero.
   * @param event - File input change event
   */
  onUpdateFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file, (progress) => (this.uploadProgress = progress));
      if (this.selectedHero) {
        this.selectedHero.image = file;
      }
    }
  }

  /**
   * Submits the updated hero form data to the server.
   */
  onUpdate(): void {
    if (!this.selectedHero) {
      console.warn('No hero selected for update');
      return;
    }

    const formData = this.createHeroFormData(this.selectedHero);

    this._service.updateHero(formData).subscribe(
      () => {
        this.getAll();
        this.openUpdateDailog = false;
        this.toastr.success('Hero updated successfully!');
      },
      (error) => {
        console.error('Error updating hero!', error);
        this.toastr.error('Failed to update hero. Please try again.');
      }
    );
  }

  /**
   * Opens the delete confirmation dialog and sets the ID of the hero to delete.
   * @param id - Hero ID
   */
  setIdAndOpenDelete(id: number): void {
    this.openDeleteDailog = true;
    this.deleteById = id;
  }

  /**
   * Deletes a hero by its ID.
   */
  onDelete(): void {
    if (this.deleteById !== 0) {
      this._service.deleteHero(this.deleteById).subscribe({
        next: () => {
          this.toastr.warning('Hero deleted successfully!');
          this.openDeleteDailog = false;
          this.getAll();
        },
        error: (err) => {
          console.error('Error deleting hero!', err);
          this.toastr.error('Failed to delete hero. Please try again.');
        },
      });
    }
  }

  /**
   * Creates a FormData object from hero data.
   * @param hero - Hero object
   * @returns FormData object
   */
  private createHeroFormData(hero: AddHero | UpdateHero): FormData {
    const formData = new FormData();
    formData.append('name', hero.name);
    formData.append('description', hero.description);
    formData.append('arabicName', hero.arabicName);
    formData.append('arabicDescription', hero.arabicDescription);
    formData.append('isActive', hero.isActive.toString());
    if (hero.image) {
      formData.append('image', hero.image);
    }
    return formData;
  }
}
