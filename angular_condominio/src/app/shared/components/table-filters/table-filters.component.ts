import { Component, Output, EventEmitter, Input } from '@angular/core';

export interface TableFilters {
  search?: string;
  pageSize?: number;
}

@Component({
  selector: 'app-table-filters',
  standalone: false,
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.css']
})
export class TableFiltersComponent {
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() initialPageSize = 10;
  @Output() filtersChange = new EventEmitter<TableFilters>();

  search: string = '';
  pageSize: number = this.initialPageSize;

  apply() {
    this.filtersChange.emit({ search: this.search, pageSize: this.pageSize });
  }

  clear() {
    this.search = '';
    this.pageSize = this.initialPageSize;
    this.apply();
  }
}
