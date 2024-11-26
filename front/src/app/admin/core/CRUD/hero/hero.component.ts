import { AfterViewInit, Component, inject } from '@angular/core';
import { Ihero } from '../../Models/hero';
import { CoreService } from '../../../../core/core.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements AfterViewInit {
  readHeroProp: Ihero = {
    image: '',
    description: '',
    isActive: true,
    title: '',
  };
  updateHeroProp: Ihero = {
    image: '',
    description: '',
    isActive: true,
    title: '',
  };
  flow = inject(CoreService);
  hero: Ihero[] = [
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

  SetReadHeroModal(hero: Ihero) {
    this.readHeroProp = hero;
  }
  SetUpdateHeroModal(hero: Ihero) {
    this.updateHeroProp = hero;
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
      if (this.updateHeroProp.image != '') {
        this.updateHeroProp.image = '';
      }
    }
  }

  viewAfter(updateHeroProp: any) {
    console.log(updateHeroProp, this.uploadedImage);
    debugger;
  }
}
