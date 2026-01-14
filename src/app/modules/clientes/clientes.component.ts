// src/app/modules/clientes/clientes.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../auth/services/cliente.service';
import { Cliente, ClienteRequest } from '../../auth/models/cliente.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  clienteForm: FormGroup;
  clientes: Cliente[] = [];
  loading = false;
  saving = false;
  
  // Para edición
  editingId: number | null = null;
  isEditing = false;

  // Tipos de documento disponibles
  tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'RUC', label: 'RUC' },
    { value: 'PASAPORTE', label: 'Pasaporte' }
  ];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {
    this.clienteForm = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      razonSocial: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      nombreComercial: ['', [Validators.maxLength(200)]],
      telefono: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(150)]],
      direccion: ['', [Validators.maxLength(300)]],
      contactoNombre: ['', [Validators.maxLength(150)]],
      contactoTelefono: ['', [Validators.maxLength(20)]],
      contactoEmail: ['', [Validators.email, Validators.maxLength(150)]],
      observaciones: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  // Cargar lista de clientes
  loadClientes(): void {
    this.loading = true;
    this.clienteService.getAllClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los clientes',
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Guardar (crear o actualizar)
  onSubmit(): void {
    if (this.clienteForm.invalid || this.saving) {
      this.markFormTouched();
      return;
    }

    this.saving = true;

    const clienteData: ClienteRequest = {
      tipoDocumento: this.clienteForm.value.tipoDocumento,
      numeroDocumento: this.clienteForm.value.numeroDocumento,
      razonSocial: this.clienteForm.value.razonSocial,
      nombreComercial: this.clienteForm.value.nombreComercial || '',
      telefono: this.clienteForm.value.telefono || '',
      email: this.clienteForm.value.email || '',
      direccion: this.clienteForm.value.direccion || '',
      contactoNombre: this.clienteForm.value.contactoNombre || '',
      contactoTelefono: this.clienteForm.value.contactoTelefono || '',
      contactoEmail: this.clienteForm.value.contactoEmail || '',
      observaciones: this.clienteForm.value.observaciones || ''
    };

    if (this.isEditing && this.editingId) {
      this.updateCliente(clienteData);
    } else {
      this.createCliente(clienteData);
    }
  }

  // Crear nuevo cliente
  private createCliente(clienteData: ClienteRequest): void {
    this.clienteService.createCliente(clienteData).subscribe({
      next: (response) => {
        this.saving = false;
        this.resetForm();
        this.loadClientes();
        
        Swal.fire({
          icon: 'success',
          title: '¡Registrado!',
          text: 'El cliente se registró correctamente',
          confirmButtonColor: '#1e3a5f',
          timer: 2000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error('Error al crear:', err);
        this.saving = false;
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el cliente',
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Actualizar cliente
  private updateCliente(clienteData: ClienteRequest): void {
    this.clienteService.updateCliente(this.editingId!, clienteData).subscribe({
      next: (response) => {
        this.saving = false;
        this.resetForm();
        this.loadClientes();
        
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'El cliente se actualizó correctamente',
          confirmButtonColor: '#1e3a5f',
          timer: 2000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.saving = false;
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el cliente',
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Editar cliente - cargar datos en formulario
  editCliente(cliente: Cliente): void {
    this.isEditing = true;
    this.editingId = cliente.clienteId;
    
    this.clienteForm.patchValue({
      tipoDocumento: cliente.tipoDocumento,
      numeroDocumento: cliente.numeroDocumento,
      razonSocial: cliente.razonSocial,
      nombreComercial: cliente.nombreComercial,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      contactoNombre: cliente.contactoNombre,
      contactoTelefono: cliente.contactoTelefono,
      contactoEmail: cliente.contactoEmail,
      observaciones: cliente.observaciones
    });

    // Scroll al formulario en móviles
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Toast informativo
    Swal.fire({
      icon: 'info',
      title: 'Modo edición',
      text: `Editando: ${cliente.razonSocial}`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }

  // Eliminar cliente con confirmación
  deleteCliente(cliente: Cliente): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el cliente "${cliente.razonSocial}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmDelete(cliente);
      }
    });
  }

  // Confirmar eliminación
  private confirmDelete(cliente: Cliente): void {
    this.clienteService.deleteCliente(cliente.clienteId).subscribe({
      next: () => {
        this.loadClientes();
        
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El cliente se eliminó correctamente',
          confirmButtonColor: '#1e3a5f',
          timer: 2000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        
        Swal.fire({
          icon: 'error',
          title: 'No se pudo eliminar',
          text: 'Error al eliminar el cliente',
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Cancelar edición
  cancelEdit(): void {
    Swal.fire({
      title: '¿Cancelar edición?',
      text: 'Los cambios no guardados se perderán',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1e3a5f',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Seguir editando'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetForm();
      }
    });
  }

  // Resetear formulario
  resetForm(): void {
    this.clienteForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }

  // Marcar todos los campos como touched para mostrar errores
  markFormTouched(): void {
    Object.keys(this.clienteForm.controls).forEach(key => {
      this.clienteForm.get(key)?.markAsTouched();
    });

    Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Por favor, completa los campos requeridos',
      confirmButtonColor: '#1e3a5f'
    });
  }

  // Getters para validación
  get tipoDocumento() { return this.clienteForm.get('tipoDocumento'); }
  get numeroDocumento() { return this.clienteForm.get('numeroDocumento'); }
  get razonSocial() { return this.clienteForm.get('razonSocial'); }
  get nombreComercial() { return this.clienteForm.get('nombreComercial'); }
  get telefono() { return this.clienteForm.get('telefono'); }
  get email() { return this.clienteForm.get('email'); }
  get direccion() { return this.clienteForm.get('direccion'); }
  get contactoNombre() { return this.clienteForm.get('contactoNombre'); }
  get contactoTelefono() { return this.clienteForm.get('contactoTelefono'); }
  get contactoEmail() { return this.clienteForm.get('contactoEmail'); }
  get observaciones() { return this.clienteForm.get('observaciones'); }
}