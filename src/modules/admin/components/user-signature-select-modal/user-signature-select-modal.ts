import { Component, inject, signal, OnInit, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '@service/admin/usuario.service';
import { ApiResponse, UsuarioResultDto } from '@api/backend.api';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@service/toast.service';

export interface SignatureSelection {
  userId: number;
  nombreCompleto: string;
  firmaUrl: string;
  rolEnDocumento: 'planner' | 'supervisor';
  empresa: string;
}

@Component({
  selector: 'app-user-signature-select-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-signature-select-modal.html',
})
export class UserSignatureSelectModal implements OnInit {
  variant = input<'modal' | 'inline'>('modal');
  show = input<boolean>(false);
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);

  onSelected = output<SignatureSelection[]>();
  onClose = output<void>();

  users = signal<any[]>([]);
  loading = signal(false);
  searchTerm = signal('');

  // We allow selecting two signatures
  planner = signal<SignatureSelection | null>(null);
  supervisor = signal<SignatureSelection | null>(null);

  selectingFor = signal<'planner' | 'supervisor'>('planner');
  showUserList = signal(true);

  selectedUserForFirma = signal<any | null>(null);
  userFirmas = signal<any[]>([]);
  userNoFirmasId = signal<number | null>(null);
  loadingFirmasUserId = signal<number | null>(null);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.usuarioService.findAll({ 
      page: 1, 
      limit: 100, 
      search: this.searchTerm() || undefined 
    }).then(response => {
      this.users.set(response.data);
      this.loading.set(false);
    }).catch(err => {
      console.error('Error loading users:', err);
      this.loading.set(false);
    });
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
    this.loadUsers();
  }

  selectUser(user: any) {
    // If already selected and have results (signatures or known no signatures), don't fetch again
    if (this.selectedUserForFirma()?.id === user.id && (this.userFirmas().length > 0 || this.userNoFirmasId() === user.id)) {
      return;
    }

    // Clear previous signatures if selecting a DIFFERENT user to avoid stale thumbnails
    if (this.selectedUserForFirma()?.id !== user.id) {
      this.userFirmas.set([]);
    }

    this.selectedUserForFirma.set(user);
    this.loadingFirmasUserId.set(user.id);

    this.usuarioService.findFirmas(user.id)
      .then(firmas => {
        this.userFirmas.set(firmas);
        this.loadingFirmasUserId.set(null);

        if (firmas.length === 0) {
          // Show in-card alert
          this.userNoFirmasId.set(user.id);
          setTimeout(() => {
            if (this.userNoFirmasId() === user.id) {
              this.userNoFirmasId.set(null);
            }
          }, 3000);
        } else {
          // Select the first one by default but don't clear the selection
          // so the user can see/change them "below"
          this.chooseFirma(firmas[0], false);
        }
      })
      .catch(err => {
        console.error('Error loading user firmas:', err);
        this.loadingFirmasUserId.set(null);
      });
  }

  chooseFirma(firma: any, clear = true) {
    const user = this.selectedUserForFirma();
    if (!user) return;

    const selection: SignatureSelection = {
      userId: user.id,
      nombreCompleto: `${user.nombres} ${user.apellidos}`.toUpperCase(),
      firmaUrl: firma.url,
      rolEnDocumento: this.selectingFor(),
      empresa: user.empresa || 'TRANSPORTES LINEA S.A.'
    };

    if (this.selectingFor() === 'planner') {
      this.planner.set(selection);
    } else {
      this.supervisor.set(selection);
    }

    if (clear) {
      // Limpiar selección temporal
      this.selectedUserForFirma.set(null);
      this.userFirmas.set([]);
    }
  }

  confirm() {
    const results: SignatureSelection[] = [];
    if (this.planner()) results.push(this.planner()!);
    if (this.supervisor()) results.push(this.supervisor()!);
    
    if (results.length === 0) {
      alert('Debe seleccionar al menos una firma.');
      return;
    }

    this.onSelected.emit(results);
  }

  cancel() {
    this.onClose.emit();
  }
}
