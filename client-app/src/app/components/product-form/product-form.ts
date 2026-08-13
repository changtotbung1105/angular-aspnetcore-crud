import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 thêm dòng này
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { NotificationService } from '../../services/notification'; 

@Component({
  selector: 'app-product-form',
   standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  form: FormGroup;
  isEdit = false;
  loading = signal(false);   // 
  saving = signal(false);    // 

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notification: NotificationService,   
    private route: ActivatedRoute,
    private router: Router
  ) {
      this.form = this.fb.group({
        id: [0],
        name: ['', [Validators.required, Validators.minLength(2)]],
        price: [0, [Validators.required, Validators.min(1)]],
        quantity: [0, [Validators.required, Validators.min(0)]]
      });
  }

hasError(field: string, errorType: string): boolean {
  const control = this.form.get(field);
  return !!(control && control.touched && control.hasError(errorType));
}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading.set(true);
      this.productService.getById(+id).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.notification.error('Không thể tải thông tin sản phẩm. Vui lòng thử lại.');
        }
      });
    }
  }

submit() {

  const value = this.form.value as any;
  this.saving.set(true);

  if (this.isEdit) {
    this.productService.update(value.id, value).subscribe({
      next: () => {
        this.saving.set(false);
        this.notification.success('Cập nhật sản phẩm thành công.');
        this.router.navigate(['/products']);
      },
      error: () => {
        this.saving.set(false);
        this.notification.error('Cập nhật sản phẩm thất bại. Vui lòng thử lại.');
      }
    });
  } else {
    this.productService.create(value).subscribe({
      next: () => {
        this.saving.set(false);
        this.notification.success('Tạo sản phẩm thành công.');
        this.router.navigate(['/products']);
      },
      error: () => {
        this.saving.set(false);
        this.notification.error('Tạo sản phẩm thất bại. Vui lòng thử lại.');
      }
    });
  }
}
}