import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationMeta } from '@interface/admin/cliente.interface';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class PaginationComponent {
  meta = input.required<PaginationMeta | null>();
  currentPage = input.required<number>();
  pageSize = input.required<number>();

  pageChange = output<number>();
  pageSizeChange = output<number>();

  goToPage(page: number) {
    if (page >= 1 && page <= (this.meta()?.totalPages || 1)) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(+select.value);
  }

  getPageNumbers(): (number | string)[] {
    const total = this.meta()?.totalPages || 1;
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  }

  getStartItem(): number {
    const meta = this.meta();
    if (!meta || meta.total === 0) return 0;
    return (meta.page - 1) * meta.limit + 1;
  }

  getEndItem(): number {
    const meta = this.meta();
    if (!meta || meta.total === 0) return 0;
    return Math.min(meta.page * meta.limit, meta.total);
  }
}
