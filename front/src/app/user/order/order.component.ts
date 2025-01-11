import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import {
  Gearboxes,
  Getvehicals,
  ReadingDevice,
  VehicleModel,
} from '../core/Models/ReadOrder';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit, AfterViewInit {
  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  file?: File;
  vehicals: Getvehicals[] = [];
  VModel: VehicleModel[] = [];
  readingDevices: ReadingDevice[] = [];
  gearboxes: Gearboxes[] = [];
  carYears: number[] = [];
  toastr = inject(ToastrService);
  isLoadingVehicles = false;
  isLoadingModels = false;
  uploadProgress: number = 0;
  selectedCard: number = 0; // To track the selected card
  note: string = '';
  uploading: boolean = false;
  service = inject(UserService);
  logNote() {
    console.log(this.note);
  }
  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    // this.service.initalOrder().subscribe();
    this.fetchVehicles();
    this.fetchReadingDevices();
    const currentYear = new Date().getFullYear();
    this.carYears = Array.from(
      { length: currentYear - 1999 },
      (_, i) => 2000 + i
    );
  }
  selectCard(cardId: number): void {
    this.selectedCard = cardId; // Set the selected card to the clicked one
    this.toastr.info('Step one Finish', 'SUCCESS');
  }
  // Initialize all form groups
  private initializeForms(): void {
    this.step1Form = this.fb.group({
      orderName: ['', Validators.required],
      licencePlate: ['', Validators.required],
      vim: ['', [Validators.required, Validators.minLength(1)]],
      ecu: ['', Validators.required],
    });

    this.step2Form = this.fb.group({
      file: [null, Validators.required],
    });

    this.step3Form = this.fb.group({
      selectedVehicle: ['', Validators.required],
      selectedVehicleModel: ['', Validators.required],
      selectedReadingDevice: ['', Validators.required],
      selectedGearboxes: ['', Validators.required],
      selectedCarYear: ['', Validators.required],
    });
  }

  // Step completion handlers
  onStep1Complete(): void {
    if (this.step1Form.valid) {
      this.toastr.success('Step 1 completed successfully!', 'Success');
    }
  }

  onStep2Complete(): void {
    if (this.step2Form.valid) {
      this.toastr.success('Step 2 completed successfully!', 'Success');
    }
  }

  onStep3Complete(): void {
    if (this.step3Form.valid) {
      this.toastr.success('Step 3 completed successfully!', 'Success');
    }
  }

  // Fetch all vehicles
  private fetchVehicles(): void {
    this.isLoadingVehicles = true;
    this.service.Vehicles().subscribe({
      next: (res) => {
        this.vehicals = res;
        this.isLoadingVehicles = false;
      },
      error: (err) => {
        console.error('Error fetching vehicles:', err);
        this.isLoadingVehicles = false;
      },
    });
  }

  // Fetch vehicle models based on vehicle ID
  fetchVehicleModels(vehicleId: number): void {
    this.isLoadingModels = true;
    this.service.VehiclesModel(vehicleId).subscribe({
      next: (res) => {
        this.VModel = res;
        this.isLoadingModels = false;
      },
      error: (err) => {
        console.error('Error fetching vehicle models:', err);
        this.isLoadingModels = false;
      },
    });
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];
      const allowedExtensions = ['rar', 'zip'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      // Validate file extension
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        console.error('Invalid file type. Only RAR and ZIP files are allowed.');
        this.step2Form.patchValue({ file: null }); // Clear the file in the FormGroup
        this.uploadProgress = 0;
        this.uploading = false;
        return;
      }

      this.step2Form.patchValue({ file: file }); // Save the file in the FormGroup

      this.uploadProgress = 0;
      this.uploading = true;

      const reader = new FileReader();

      // Monitor file read progress
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          this.uploadProgress = Math.round((e.loaded / e.total) * 100);
        }
      };

      // File reading completed
      reader.onload = () => {
        this.uploadProgress = 100; // Fully "uploaded"
        this.uploading = false;
        this.onStep2Complete();
        console.log('File saved successfully:', file.name);
      };

      // File reading error
      reader.onerror = () => {
        this.uploading = false;
        console.error('Error reading file.');
      };

      // Start reading the file
      reader.readAsDataURL(file);
    }
  }
  // Fetch reading devices
  private fetchReadingDevices(): void {
    this.service.ReadingDevice().subscribe({
      next: (res) => {
        this.readingDevices = res;
      },
      error: (err) => {
        console.error('Error fetching reading devices:', err);
      },
    });
  }

  // Handle vehicle selection
  onVehicleSelect(vehicleId: number): void {
    this.fetchVehicleModels(vehicleId);
  }

  // File change handler
  onReadingDeviceChange(event: any): void {
    this.fetchGearboxes(event);
  }

  fetchGearboxes(id: number) {
    this.service.Gearboxes(id).subscribe({
      next: (res) => {
        this.gearboxes = res;
      },
    });
  }

  // Helper method for validation feedback
  isFieldInvalid(form: FormGroup, field: string): boolean {
    return (
      form.get(field)?.invalid &&
      (form.get(field)?.dirty || form.get(field)?.touched)
    );
  }

  onDoneClick(): void {
    // Get values from step1Form
    const step1Values = this.step1Form.value;

    // Get values from step2Form
    const step2Values = this.step2Form.value;

    // Get values from step3Form
    const step3Values = this.step3Form.value;

    // Get selectedCard and note
    const selectedCard = this.selectedCard;
    const note = this.note;

    // Create FormData
    const formData = new FormData();

    // Add values for CreateOrderDTO
    formData.append('Machine', selectedCard.toString());
    formData.append('VehicleType', step3Values.selectedVehicle);
    formData.append('ListprocessPricing', ''); // Provide the actual value if available
    formData.append('TotalPrice', '1'); // Replace with the actual price if available
    formData.append('VehicleBrandId', step3Values.selectedVehicleModel); // Assuming this is an ID
    formData.append('VehicleModelId', step3Values.selectedVehicleModel); // Assuming this is an ID
    formData.append('ReadingDeviceId', step3Values.selectedReadingDevice); // Assuming this is an ID
    formData.append('GearboxId', step3Values.selectedGearboxes); // Assuming this is an ID
    formData.append('AppUserId', 'user-id'); // Replace with the actual user ID if available
    formData.append('Notes', note);

    // Add values for CreateOrderItemDTO
    formData.append('orderItem.OrderName', step1Values.orderName);
    formData.append('orderItem.LicencePlate', step1Values.licencePlate);
    formData.append('orderItem.VIM', step1Values.vim);
    formData.append('orderItem.ECU', step1Values.ecu);

    // Add the file from step2Form
    if (step2Values.file) {
      formData.append('orderItem.File', step2Values.file);
    }
  }
}
