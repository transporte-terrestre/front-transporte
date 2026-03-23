import { Component, inject, signal, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '@service/admin/usuario.service';
import { ApiResponse, UsuarioResultDto } from 'api/backend.api';
import { FormsModule } from '@angular/forms';

export interface SignatureSelection {
  userId: number;
  nombreCompleto: string;
  firmaUrl: string;
  rolEnDocumento: 'planner' | 'supervisor';
}

@Component({
  selector: 'app-user-signature-select-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-signature-select-modal.html',
})
export class UserSignatureSelectModal implements OnInit {
  private usuarioService = inject(UsuarioService);

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
    this.selectedUserForFirma.set(user);
    this.loading.set(true);
    
    this.usuarioService.findFirmas(user.id)
      .then(firmas => {
        this.userFirmas.set(firmas);
        this.loading.set(false);
        
        if (firmas.length === 0) {
          alert('Este usuario no tiene firmas registradas.');
        } else if (firmas.length === 1) {
          this.chooseFirma(firmas[0]);
        }
      })
      .catch(err => {
        console.error('Error loading user firmas:', err);
        this.loading.set(false);
      });
  }

  chooseFirma(firma: any) {
    const user = this.selectedUserForFirma();
    if (!user) return;

    const selection: SignatureSelection = {
      userId: user.id,
      nombreCompleto: `${user.nombres} ${user.apellidos}`.toUpperCase(),
      firmaUrl: firma.url,
      rolEnDocumento: this.selectingFor()
    };

    if (this.selectingFor() === 'planner') {
      this.planner.set(selection);
    } else {
      this.supervisor.set(selection);
    }

    // Limpiar selección temporal
    this.selectedUserForFirma.set(null);
    this.userFirmas.set([]);
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
