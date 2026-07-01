import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() totalCount: number = 0;
  @Input() pageIndex: number = 0; // zero-based
  @Input() pageSize: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalCount / this.pageSize) : 0;
  }

  get pages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    for (let i = 0; i < total; i++) pages.push(i);
    return pages;
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.pageChange.emit(page);
  }

  previous() {
    if (this.pageIndex > 0) this.goToPage(this.pageIndex - 1);
  }

  next() {
    if (this.pageIndex < this.totalPages - 1) this.goToPage(this.pageIndex + 1);
  }
}
