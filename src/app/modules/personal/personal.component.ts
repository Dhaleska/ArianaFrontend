// src/app/modules/personal/personal.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalService } from '../../auth/services/personal.service';
import { Personal, PersonalRequest } from '../../auth/models/personal.model';
import { Cargo } from '../../auth/models/cargo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  personalForm: FormGroup;
  personalList: Personal[] = [];
  cargos: Cargo[] = [];
  supervisoresDisponibles: Personal[] = [];  // Lista dinámica según cargo
  trabajadoresLideres: Personal[] = [];      // Cache de trabajadores líderes
  jefeSistemas: Personal | null = null;      // Cache del jefe de sistemas
  loading = false;
  saving = false;
  
  // Para edición
  editingId: number | null = null;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private personalService: PersonalService
  ) {
    this.personalForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidoMaterno: ['', [Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(150)]],
      direccion: ['', [Validators.maxLength(300)]],
      fechaNacimiento: [''],
      cargoId: ['', [Validators.required]],
      supervisorId: ['']
    });

    // Escuchar cambios en el cargo para actualizar supervisores
    this.personalForm.get('cargoId')?.valueChanges.subscribe(cargoId => {
      this.onCargoChange(cargoId);
    });
  }

  ngOnInit(): void {
    this.loadCargos();
    this.loadPersonal();
    this.loadTrabajadoresLideres();
    this.loadJefeSistemas();
  }

  // Cargar lista de cargos para el select
  loadCargos(): void {
    this.personalService.getAllCargos().subscribe({
      next: (data) => {
        this.cargos = data;
      },
      error: (err) => {
        console.error('Error al cargar cargos:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los cargos',
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Cargar trabajadores líderes (supervisores para cargos normales)
  loadTrabajadoresLideres(): void {
    this.personalService.getTrabajadoresLideres().subscribe({
      next: (data) => {
        this.trabajadoresLideres = data;
      },
      error: (err) => {
        console.error('Error al cargar trabajadores líderes:', err);
      }
    });
  }

  // Cargar jefe de sistemas (supervisor para trabajadores líderes)
  loadJefeSistemas(): void {
    this.personalService.getJefeSistemas().subscribe({
      next: (data) => {
        this.jefeSistemas = data;
      },
      error: (err) => {
        console.error('Error al cargar jefe de sistemas:', err);
        this.jefeSistemas = null;
      }
    });
  }

  // Cuando cambia el cargo, actualizar la lista de supervisores
  onCargoChange(cargoId: number): void {
    // Resetear supervisor al cambiar cargo
    this.personalForm.patchValue({ supervisorId: '' }, { emitEvent: false });
    
    if (!cargoId) {
      this.supervisoresDisponibles = [];
      return;
    }

    // Buscar el nombre del cargo seleccionado
    const cargoSeleccionado = this.cargos.find(c => c.cargoId == cargoId);
    
    if (cargoSeleccionado?.nombreCargo === 'TRABAJADOR LIDER') {
      // Si es TRABAJADOR LIDER -> supervisor es JEFE DE SISTEMAS
      this.supervisoresDisponibles = this.jefeSistemas ? [this.jefeSistemas] : [];
    } else if (cargoSeleccionado?.nombreCargo === 'JEFE DE SISTEMAS') {
      // JEFE DE SISTEMAS no tiene supervisor
      this.supervisoresDisponibles = [];
    } else {
      // Cualquier otro cargo -> supervisores son TRABAJADORES LÍDERES
      this.supervisoresDisponibles = this.trabajadoresLideres;
    }
  }

  // Cargar lista de personal
  loadPersonal(): void {
    this.loading = true;
    this.personalService.getAllPersonal().subscribe({
      next: (data) => {
        this.personalList = data;
        this.loading = false;
        // Recargar listas de supervisores
        this.loadTrabajadoresLideres();
        this.loadJefeSistemas();
      },
      error: (err) => {
        console.error('Error al cargar personal:', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el personal',
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Guardar (crear o actualizar)
  onSubmit(): void {
    if (this.personalForm.invalid || this.saving) {
      this.markFormTouched();
      return;
    }

    this.saving = true;

    const supervisorValue = this.personalForm.value.supervisorId;

    const personalData: PersonalRequest = {
      dni: this.personalForm.value.dni,
      nombres: this.personalForm.value.nombres,
      apellidoPaterno: this.personalForm.value.apellidoPaterno,
      apellidoMaterno: this.personalForm.value.apellidoMaterno || '',
      telefono: this.personalForm.value.telefono || '',
      email: this.personalForm.value.email || '',
      direccion: this.personalForm.value.direccion || '',
      fechaNacimiento: this.personalForm.value.fechaNacimiento || undefined,
      cargoId: this.personalForm.value.cargoId,
      supervisorId: supervisorValue ? Number(supervisorValue) : undefined
    };

    if (this.isEditing && this.editingId) {
      this.updatePersonal(personalData);
    } else {
      this.createPersonal(personalData);
    }
  }

  // Crear nuevo personal
  private createPersonal(personalData: PersonalRequest): void {
    this.personalService.createPersonal(personalData).subscribe({
      next: (response) => {
        this.saving = false;
        this.resetForm();
        this.loadPersonal();
        
        Swal.fire({
          icon: 'success',
          title: '¡Registrado!',
          text: 'El personal se registró correctamente',
          confirmButtonColor: '#1e3a5f',
          timer: 2000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error('Error al crear:', err);
        this.saving = false;
        
        const errorMsg = err.error?.error || 'No se pudo registrar el personal';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Actualizar personal
  private updatePersonal(personalData: PersonalRequest): void {
    this.personalService.updatePersonal(this.editingId!, personalData).subscribe({
      next: (response) => {
        this.saving = false;
        this.resetForm();
        this.loadPersonal();
        
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'El personal se actualizó correctamente',
          confirmButtonColor: '#1e3a5f',
          timer: 2000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.saving = false;
        
        const errorMsg = err.error?.error || 'No se pudo actualizar el personal';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
          confirmButtonColor: '#1e3a5f'
        });
      }
    });
  }

  // Editar personal - cargar datos en formulario
  editPersonal(personal: Personal): void {
    this.isEditing = true;
    this.editingId = personal.personalId;
    
    // Primero cargar los supervisores según el cargo
    this.onCargoChange(personal.cargoId);
    
    this.personalForm.patchValue({
      dni: personal.dni,
      nombres: personal.nombres,
      apellidoPaterno: personal.apellidoPaterno,
      apellidoMaterno: personal.apellidoMaterno,
      telefono: personal.telefono,
      email: personal.email,
      direccion: personal.direccion,
      fechaNacimiento: personal.fechaNacimiento ? personal.fechaNacimiento.toString().split('T')[0] : '',
      cargoId: personal.cargoId,
      supervisorId: personal.supervisorId || ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    Swal.fire({
      icon: 'info',
      title: 'Modo edición',
      text: `Editando: ${personal.nombres} ${personal.apellidoPaterno}`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }

  // Eliminar personal con confirmación
  deletePersonal(personal: Personal): void {
    const nombreCompleto = `${personal.nombres} ${personal.apellidoPaterno}`;
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar a "${nombreCompleto}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmDelete(personal);
      }
    });
  }

  // Confirmar eliminación
  private confirmDelete(personal: Personal): void {
    this.personalService.deletePersonal(personal.personalId).subscribe({
      next: () => {
        this.loadPersonal();
        
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El personal se eliminó correctamente',
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
          text: 'Error al eliminar el personal',
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
    this.personalForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }

  // Marcar todos los campos como touched
  markFormTouched(): void {
    Object.keys(this.personalForm.controls).forEach(key => {
      this.personalForm.get(key)?.markAsTouched();
    });

    Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Por favor, completa los campos requeridos',
      confirmButtonColor: '#1e3a5f'
    });
  }

  // Obtener nombre del cargo por ID
  getCargoNombre(cargoId: number): string {
    const cargo = this.cargos.find(c => c.cargoId === cargoId);
    return cargo ? cargo.nombreCargo : '-';
  }

  // Getters para validación
  get dni() { return this.personalForm.get('dni'); }
  get nombres() { return this.personalForm.get('nombres'); }
  get apellidoPaterno() { return this.personalForm.get('apellidoPaterno'); }
  get apellidoMaterno() { return this.personalForm.get('apellidoMaterno'); }
  get telefono() { return this.personalForm.get('telefono'); }
  get email() { return this.personalForm.get('email'); }
  get direccion() { return this.personalForm.get('direccion'); }
  get fechaNacimiento() { return this.personalForm.get('fechaNacimiento'); }
  get cargoId() { return this.personalForm.get('cargoId'); }
  get supervisorId() { return this.personalForm.get('supervisorId'); }
}