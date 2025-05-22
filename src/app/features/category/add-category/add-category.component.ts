import { Component, OnDestroy } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnDestroy{

  model: AddCategoryRequest;
  private addCategorySubscription?: Subscription;

  constructor(private categoryService: CategoryService) {
    this.model = {
      name: '',
      urlHandle: ''
    };
  }

  onSubmit() {
    this.addCategorySubscription = this.categoryService.addCategory(this.model).subscribe({
      next: (response) => {
        console.log('Category added successfully');
        // Optionally, reset the form or navigate to another page
      },
      error: (error) => {
        console.error('Error adding category', error);
        // Handle error appropriately
      }
    });
  }
    ngOnDestroy(): void {
      this.addCategorySubscription?.unsubscribe();
      // Unsubscribe to prevent memory leaks
  }
}
