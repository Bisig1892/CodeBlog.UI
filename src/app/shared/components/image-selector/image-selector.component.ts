import { Component } from '@angular/core';
import { ImageService } from './image.service';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent {

  private file?: File;
  fileName: string = '';
  title: string = '';

  constructor(private imageService: ImageService) {

  }

  selectImage(image: BlogImage): void {
    this.imageService.selectImage(image);
  }

  onFileUploadChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }

  uploadImage(): void {
    if (this.file && this.fileName !== '' && this.title !== '') {
      // Image service to upload the image
      this.imageService.uploadImage(this.file, this.fileName, this.title)
      .subscribe({
        next: (response) => {
          console.log('Upload success:', response);
        },
        error: (err) => {
          console.error('Upload error:', err);
          if (err.error && typeof err.error === 'object') {
            for (const key in err.error) {
              console.error(`${key}: ${err.error[key]}`);
            }
          } else {
            console.error('Raw error:', err.error);
          }
        }
      });
    }
  }

}
