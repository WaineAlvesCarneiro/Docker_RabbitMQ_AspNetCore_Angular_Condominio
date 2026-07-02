import { Component, Output, EventEmitter, Input } from '@angular/core';

export interface TableFilters {
  [key: string]: string | number | undefined;
  pageSize?: number;
}

export interface FilterConfig {
  key: string;
  placeholder: string;
}

@Component({
  selector: 'app-table-filters',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.css'],
  standalone: false
})
export class TableFiltersComponent {
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() initialPageSize = 10;
  @Input() filtersConfig: FilterConfig[] = [];

  @Output() filtersChange = new EventEmitter<TableFilters>();

  filters: TableFilters = {};
  pageSize: number = this.initialPageSize;

  apply() {
    this.filtersChange.emit({ ...this.filters, pageSize: this.pageSize });
  }

  clear() {
    this.filters = {};
    this.pageSize = this.initialPageSize;
    this.apply();
  }
}
