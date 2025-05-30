import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post-model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  
  id: string | null = null;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[];
  isImageModalVisible: boolean = false;
  
  routeSubcription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?: Subscription;
 
  
  constructor(private route: ActivatedRoute, private blogPostService: BlogPostService, private categoryService: CategoryService, private router: Router) {

  }
    
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.routeSubcription = this.route.paramMap.subscribe({
    next: (params) => {
        this.id = params.get('id');

        // Get Blog Post from API
        if (this.id) {
          this.getBlogPostSubscription = this.blogPostService.getBlogPostById(this.id).subscribe({
            next: (response) => {
              this.model = response;
              this.selectedCategories = response.categories.map(x => x.id);
            }
          });
        }
      }
    })
  }

  onFormSubmit(): void {
    // Convert this model to a Request Object
    if (this.model && this.id) {
      var UpdateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        publishedDate: this.model.publishedDate,
        title: this.model.title,
        urlHandle: this.model.urlHandle,
        categories: this.selectedCategories ?? []
      };

      this.updateBlogPostSubscription = this.blogPostService.updateBlogPost(this.id, UpdateBlogPost).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        }
      })
    }
  }

  onDelete(): void {
    if (this.id) {
      // call service and delete blog post
      this.deleteBlogPostSubscription = this.blogPostService.deleteBlogPost(this.id).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        }
      });
    }
  }

  openImageModal(): void {
    this.isImageModalVisible = true;
  }

  closeImageModal(): void {
    this.isImageModalVisible = false;
  }

  ngOnDestroy(): void {
    this.routeSubcription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
  }

}
