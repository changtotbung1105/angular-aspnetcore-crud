import { Component, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { ProductService } from '../../../core/product';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',

})
export class ProductList implements OnInit {
  productService = inject(ProductService);

  pagesToShow = computed<(number | string)[]>(() => {
    const total = this.productService.totalPages();
    const current = this.productService.pageNumber();
    const delta = 1; // số trang liền kề mỗi bên trang hiện tại

    const range: number[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    const result: (number | string)[] = [];
    let last = 0;
    for (const page of range) {
      if (last && page - last === 2) {
        result.push(last + 1); // chỉ cách 1 trang thì hiện luôn, khỏi cần "..."
      } else if (last && page - last > 2) {
        result.push('...');
      }
      result.push(page);
      last = page;
    }

    return result;
  });

  ngOnInit(): void {
    this.productService.load();
  }

  delete(id: number) {
    this.productService.delete(id).subscribe(() => this.productService.load());
  }
}
