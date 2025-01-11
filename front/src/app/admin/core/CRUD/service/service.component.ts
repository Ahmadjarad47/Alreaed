import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { IService } from '../../Models/service'; // واجهة الخدمة
import { AdminService } from '../../../admin.service'; // خدمة التواصل مع الخادم
import { ToastrService } from 'ngx-toastr'; // مكتبة الإشعارات

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent implements OnInit {
  // رابط قاعدة البيانات
  baseUrl: string = environment.base;

  // قائمة الخدمات
  services: IService[] = [];

  // الكائن المستخدم لإضافة خدمة جديدة
  currentService: IService = new IService();

  // كائن الخدمة لعرض تفاصيل الخدمة في نافذة القراءة
  modalService: IService = new IService();

  // كائن الخدمة المحدد للتحديث
  selectedService: IService | null = null;

  // حالات فتح أو إغلاق النوافذ المختلفة
  openUpdateDialog = false;
  openDeleteDialog = false;
  openReadDialog = false;

  // معرّف الخدمة المراد حذفها
  deleteById: number = 0;

  // تقدم التحميل (في حال كان هناك عملية رفع ملفات)
  uploadProgress: number | null = null;

  // حقن الخدمات اللازمة
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);

  /**
   * عند تهيئة المكون يتم استدعاء هذه الدالة لتحميل جميع الخدمات من الخادم.
   */
  ngOnInit(): void {
    this.loadAllServices();
  }

  /**
   * تحميل جميع الخدمات من الخادم.
   */
  loadAllServices(): void {
    this.adminService.getServiceeAbouts().subscribe({
      next: (res) => (this.services = res), // تعيين النتائج إلى قائمة الخدمات
      error: () => this.toastr.error('فشل في تحميل الخدمات. حاول مجددًا.'), // عرض رسالة خطأ عند الفشل
    });
  }

  /**
   * فتح نافذة قراءة التفاصيل الخاصة بخدمة معينة.
   * @param id معرّف الخدمة
   */
  openReadModal(id: number): void {
    this.modalService =
      this.services.find((service) => service.id === id) || new IService();
    this.openReadDialog = true;
  }

  /**
   * إرسال طلب لإضافة خدمة جديدة إلى الخادم.
   */
  onSubmit(): void {
    const formData = this.buildFormData(this.currentService); // بناء النموذج لإرساله

    this.adminService.addService(formData).subscribe({
      next: () => {
        this.loadAllServices(); // إعادة تحميل الخدمات بعد الإضافة
        this.toastr.success('تم إضافة الخدمة بنجاح!');
        this.currentService = new IService(); // إعادة تعيين النموذج
        document.getElementById("closeds")?.click();
      },
      error: () => this.toastr.error('فشل في إضافة الخدمة. حاول مجددًا.'),
    });
  }

  /**
   * تحميل بيانات خدمة معينة لفتح نافذة التحديث.
   * @param service كائن الخدمة المراد تحديثها
   */
  loadServiceForUpdate(service: IService): void {
    this.selectedService = { ...service }; // نسخ الكائن لتجنب التعديل المباشر
    this.openUpdateDialog = true;
  }

  /**
   * إرسال طلب لتحديث بيانات الخدمة المحددة.
   */
  onUpdate(): void {
    if (!this.selectedService) return;

    const formData = this.buildFormData(this.selectedService);

    this.adminService.updateService(formData).subscribe({
      next: () => {
        this.loadAllServices(); // إعادة تحميل الخدمات بعد التحديث
        this.toastr.success('تم تحديث الخدمة بنجاح!');
        this.openUpdateDialog = false; // إغلاق نافذة التحديث
      },
      error: () => this.toastr.error('فشل في تحديث الخدمة. حاول مجددًا.'),
    });
  }

  /**
   * تعيين معرّف الخدمة المراد حذفها وفتح نافذة التأكيد.
   * @param id معرّف الخدمة
   */
  setIdAndOpenDelete(id: number): void {
    this.deleteById = id;
    this.openDeleteDialog = true;
  }

  /**
   * إرسال طلب لحذف الخدمة المحددة من الخادم.
   */
  onDelete(): void {
    if (this.deleteById === 0) return;

    this.adminService.deleteService(this.deleteById).subscribe({
      next: () => {
        this.loadAllServices(); // إعادة تحميل الخدمات بعد الحذف
        this.toastr.success('تم حذف الخدمة بنجاح!');
        this.openDeleteDialog = false; // إغلاق نافذة الحذف
      },
      error: () => this.toastr.error('فشل في حذف الخدمة. حاول مجددًا.'),
    });
  }

  /**
   * بناء كائن FormData لإرساله إلى الخادم.
   * @param service كائن الخدمة
   * @returns كائن FormData يحتوي على بيانات الخدمة
   */
  private buildFormData(service: IService): FormData {
    const formData = new FormData();

    formData.append('id', service.id.toString()); // اسم الخدمة
    formData.append('name', service.name); // اسم الخدمة
    formData.append('description', service.description); // وصف الخدمة
    formData.append('isActive', service.isActive.toString()); // حالة تفعيل الخدمة
    formData.append('arabicName', service.arabicName.toString()); // حالة تفعيل الخدمة
    formData.append('arabicDescription', service.arabicDescription.toString()); // حالة تفعيل الخدمة
    return formData;
  }
}
