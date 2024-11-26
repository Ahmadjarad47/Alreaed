import { Component, inject } from '@angular/core';
import { IhomeAbout } from '../../Models/homeAbout';
import { CoreService } from '../../../../core/core.service';

@Component({
  selector: 'app-home-about',
  templateUrl: './home-about.component.html',
  styleUrl: './home-about.component.css'
})
export class HomeAboutComponent {
  readhomeAboutProp: IhomeAbout = {
    image: '',
    description: '',
    isActive: true,
    title: '',
  };
  updatehomeAboutProp: IhomeAbout = {
    image: '',
    description: '',
    isActive: true,
    title: '',
  };
  flow = inject(CoreService);
  homeAbout: IhomeAbout[] = [
    {
      image:
        'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png',
      description:
        'From checkout to global sales tax compliance, streamline your payment stack with our advanced solutions.',
      isActive: true,
      title: 'Payments Tool for Software Companies',
    },
  ];
  uploadedImage: string | null = null;
  ngAfterViewInit(): void {
    this.flow.loadFlowbite((f) => {
      f.initFlowbite();
    });
  }

  SetReadhomeAboutModal(homeAbout: IhomeAbout) {
    this.readhomeAboutProp = homeAbout;
  }
  SetUpdatehomeAboutModal(homeAbout: IhomeAbout) {
    this.updatehomeAboutProp = homeAbout;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.uploadedImage = reader.result as string; // Set the image data URL
      };

      reader.readAsDataURL(file); // Read the file as a data URL
      if (this.updatehomeAboutProp.image != '') {
        this.updatehomeAboutProp.image = '';
      }
    }
  }

  viewAfter(updatehomeAboutProp: any) {
    console.log(updatehomeAboutProp, this.uploadedImage);
    debugger;
  }
}
