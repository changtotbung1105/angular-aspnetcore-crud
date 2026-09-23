import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, PagedResult } from '../shared/models/product.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/api/products`;

    products = signal<Product[]>([]);
    totalItems = signal(0);
    totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
    pageNumber = signal(1);
    pageSize = signal(10);

    load(page = this.pageNumber(), size = this.pageSize()) {
        this.http
            .get<PagedResult<Product>>(this.baseUrl, {
                params: { pageNumber: page, pageSize: size },
            })
            .subscribe((result) => {
                this.products.set(result.items);
                this.totalItems.set(result.totalItems);
                this.pageNumber.set(result.pageNumber);
                this.pageSize.set(result.pageSize);
            });
    }

    goToPage(page: number) {
        if (page < 1 || page > this.totalPages()) return;
        this.load(page, this.pageSize());
    }

    getById(id: number) {
        return this.http.get<Product>(`${this.baseUrl}/${id}`);
    }

    create(product: Omit<Product, 'id'>) {
        return this.http.post<Product>(this.baseUrl, product);
    }

    update(product: Product) {
        return this.http.put(`${this.baseUrl}/${product.id}`, product);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
