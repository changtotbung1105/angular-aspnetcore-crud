import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  productService = inject(ProductService);

  productId = signal<number | null>(null);
  isEditMode = signal(false);
  submitting = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.productId.set(id);
      this.isEditMode.set(true);
      this.productService.getById(id).subscribe((product) => {
        this.form.patchValue(product);
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const value = this.form.getRawValue();

    const request$ = this.isEditMode()
      ? this.productService.update({ id: this.productId()!, ...value })
      : this.productService.create(value);

    request$.subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}