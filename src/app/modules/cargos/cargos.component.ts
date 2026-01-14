// src/app/modules/cargos/cargos.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargoService } from '../../auth/services/cargo.service';
import { Cargo, CargoRequest } from '../../auth/models/cargo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss']
})
export class CargosComponent implements OnInit {

  cargoForm: FormGroup;
  cargos: Cargo[] = [];
  loading = false;
  saving = false;
  
  // Para edición
  editingId: number | null = null;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private cargoService: CargoService
  ) {
    this.cargoForm = this.fb.group({
      nombreCargo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(200)]],
      sueldo: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadCargos();
  }

  // Cargar lista de cargos
  loadCargos(): void {
    this.loading = true;
    this.cargoService.getAllCargos().subscribe({
      next: (data) => {
        this.cargos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar cargos:', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los cargos',
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Guardar (crear o actualizar)
  onSubmit(): void {
    if (this.cargoForm.invalid || this.saving) {
      this.markFormTouched();
      return;
    }

    this.saving = true;

    const cargoData: CargoRequest = {
      nombreCargo: this.cargoForm.value.nombreCargo,
      descripcion: this.cargoForm.value.descripcion || '',
      sueldo: this.cargoForm.value.sueldo
    };

    if (this.isEditing && this.editingId) {
      this.updateCargo(cargoData);
    } else {
      this.createCargo(cargoData);
    }
  }

  // Crear nuevo cargo
  private createCargo(cargoData: CargoRequest): void {
    this.cargoService.createCargo(cargoData).subscribe({
      next: (response) => {
        this.saving = false;
        this.resetForm();
        this.loadCargos();
        
        Swal.fire({
          icon: 'success',
          title: '¡Registrado!',
          text: 'El cargo se registró correctamente',
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
          text: 'No se pudo registrar el cargo',
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Actualizar cargo
  private updateCargo(cargoData: CargoRequest): void {
    this.cargoService.updateCargo(this.editingId!, cargoData).subscribe({
      next: (response) => {
        this.saving = false;
        this.resetForm();
        this.loadCargos();
        
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'El cargo se actualizó correctamente',
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
          text: 'No se pudo actualizar el cargo',
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Editar cargo - cargar datos en formulario
  editCargo(cargo: Cargo): void {
    this.isEditing = true;
    this.editingId = cargo.cargoId;
    
    this.cargoForm.patchValue({
      nombreCargo: cargo.nombreCargo,
      descripcion: cargo.descripcion,
      sueldo: cargo.sueldo
    });

    // Scroll al formulario en móviles
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Toast informativo
    Swal.fire({
      icon: 'info',
      title: 'Modo edición',
      text: `Editando: ${cargo.nombreCargo}`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }

  // Eliminar cargo con confirmación
  deleteCargo(cargo: Cargo): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el cargo "${cargo.nombreCargo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmDelete(cargo);
      }
    });
  }

  // Confirmar eliminación
  private confirmDelete(cargo: Cargo): void {
    this.cargoService.deleteCargo(cargo.cargoId).subscribe({
      next: () => {
        this.loadCargos();
        
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El cargo se eliminó correctamente',
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
          text: 'El cargo puede tener personal asignado',
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
    this.cargoForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }

  // Marcar todos los campos como touched para mostrar errores
  markFormTouched(): void {
    Object.keys(this.cargoForm.controls).forEach(key => {
      this.cargoForm.get(key)?.markAsTouched();
    });

    Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Por favor, completa los campos requeridos',
      confirmButtonColor: '#1e3a5f'
    });
  }

  // Getters para validación
  get nombreCargo() { return this.cargoForm.get('nombreCargo'); }
  get descripcion() { return this.cargoForm.get('descripcion'); }
  get sueldo() { return this.cargoForm.get('sueldo'); }
}