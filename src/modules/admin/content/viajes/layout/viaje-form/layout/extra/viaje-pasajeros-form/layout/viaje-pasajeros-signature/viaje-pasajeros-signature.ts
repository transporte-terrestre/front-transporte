import { Component, inject, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '@service/admin/usuario.service';
import { UsuarioResultDto } from '@api/backend.api';
import { SignatureSelection } from '@template/manifiesto-pasajeros.template';

@Component({
  selector: 'app-viaje-pasajeros-signature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viaje-pasajeros-signature.html',
})
export class ViajePasajerosSignature implements OnInit {
  private usuarioService = inject(UsuarioService);

  onSelected = output<SignatureSelection>();
  onCancel = output<void>();

  usuarios = signal<any[]>([]);
  selectedUsuario = signal<any | null>(null);
  userFirmas = signal<any[]>([]);
  selectedFirma = signal<any | null>(null);
  loading = signal(false);
  searchQuery = signal('');

  async ngOnInit() {
    await this.loadUsuarios();
  }

  async loadUsuarios() {
    this.loading.set(true);
    try {
      const data = await this.usuarioService.findAll({
        limit: 100,
        page: 1,
      });
      this.usuarios.set(data.data);
    } catch (error) {
      console.error('Error cargando usuarios', error);
    } finally {
      this.loading.set(false);
    }
  }

  filteredUsuarios() {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.usuarios();
    return this.usuarios().filter(u =>
      `${u.nombres} ${u.apellidos}`.toLowerCase().includes(query) ||
      u.roles?.some((r: any) => (typeof r === 'string' ? r : r.name).toLowerCase().includes(query))
    );
  }

  async selectUsuario(u: any) {
    if (this.loading()) return;
    this.selectedUsuario.set(u);
    this.loading.set(true);
    try {
      const firmas = await this.usuarioService.findFirmas(u.id);
      this.userFirmas.set(firmas);
      this.selectedFirma.set(firmas && firmas.length > 0 ? firmas[0] : null);
    } catch (error) {
      console.error('Error fetching firmas:', error);
      this.userFirmas.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  confirmSelection() {
    const u = this.selectedUsuario();
    if (!u) return;

    const firma = this.selectedFirma();
    this.onSelected.emit({
      userId: u.id,
      nombreCompleto: `${u.nombres} ${u.apellidos}`.trim().toUpperCase(),
      firmaUrl: firma?.url || '',
      rolEnDocumento: (typeof u.roles?.[0] === 'string' ? u.roles[0] : (u.roles?.[0] as any)?.name || 'USUARIO').toUpperCase(),
      empresa: u.empresa || ''
    });
  }

  getInitials(u: any) {
    return ((u.nombres?.[0] || '') + (u.apellidos?.[0] || '')).toUpperCase();
  }

  getRoleName(u: any) {
    const role = u.roles?.[0];
    if (!role) return 'Usuario';
    return typeof role === 'string' ? role : (role as any).name;
  }
}
