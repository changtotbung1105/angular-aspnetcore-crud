import { Component, OnInit,  signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { NotificationService } from '../../services/notification'; 
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
   products = signal<Product[]>([]);
   loading = signal(false);
  searchTerm = signal('');
    currentPage = signal(1);
  pageSize = signal(5);
  totalPages = signal(0);
  totalItems = signal(0);
  pageNumbers = computed(() => {
  const total = this.totalPages();
  const current = this.currentPage();
  const delta = 2; // hiện 2 trang trước và 2 trang sau trang hiện tại

  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
  
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.products();
    return this.products().filter(p => p.name.toLowerCase().includes(term));
  });

  constructor(private productService: ProductService, private notification: NotificationService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.productService.getAll(this.currentPage(), this.pageSize()).subscribe({
      next: (result) => {
        this.products.set(result.items);
        this.totalItems.set(result.totalItems);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);   // 👈 lỗi cũng phải tắt spinner, không thì kẹt mãi
         this.notification.error('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');   // 👈 thêm
      }
    });
  }
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadProducts();
  }
  deleteProduct(id: number) {
    if (confirm('Xác nhận xóa?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.notification.success('Đã xóa sản phẩm.');   // 👈 thêm
          this.loadProducts();
        },
        error: () => {
          this.notification.error('Xóa thất bại. Vui lòng thử lại.');   // 👈 thêm
        }
      });
    }
  }
}
