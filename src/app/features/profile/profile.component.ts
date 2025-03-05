import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../component/header/header.component';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BookingService } from '../../services/booking.service';
import { CardComponent } from '../../../component/card/card.component';

/**
 * @description
 * Componente que gestiona la visualización y edición del perfil del usuario, así como la gestión de sus reservas y la posibilidad de cambiar la contraseña.
 *
 * @exports
 * - `ProfileComponent`: Componente para mostrar y editar el perfil del usuario, incluyendo la gestión de reservas y cambio de contraseña.
 */
@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    ButtonModule,
    CommonModule,
    DialogModule,
    FormsModule,
    InputText,
    ToastModule,
    CardComponent
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  displayBookingModal: boolean = false;

  selectedBooking: any; // Variable para almacenar la reserva seleccionada

  /**
   * @description
   * Información del usuario autenticado obtenida a través del servicio `AuthService`.
   */
  user: any;

  /**
   * @description
   * Controla la visibilidad del modal de edición del perfil.
   */
  displayModal: boolean = false;

  /**
   * @description
   * Controla la visibilidad del modal de cambio de contraseña.
   */
  displayChangePasswordModal: boolean = false;

  /**
   * @description
   * Datos del usuario que se están editando en el modal.
   */
  editedUser: any = {};

  /**
   * @description
   * Validación del número de teléfono ingresado.
   */
  dniValid: boolean = true;
  phoneValid: boolean = true;
  emailValid: boolean = true;
  birthdateValid: boolean = true;

  /**
   * @description
   * Mensaje de error en caso de que ocurra un problema con los datos del perfil.
   */
  errorMessage: string = '';

  /**
   * @description
   * Datos para el cambio de contraseña, incluyendo la contraseña anterior, nueva y confirmación.
   */
  changePasswordData: any = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  /**
   * @description
   * Controla la validación de las contraseñas coincidentes.
   */
  passwordsMismatch: boolean = false;

  /**
   * @description
   * Lista de los viajes reservados por el usuario.
   */
  tripsBooked: any[] = [];

  /**
   * @description
   * Constructor que inyecta los servicios necesarios: `AuthService`, `MessageService` y `BookingService`.
   *
   * @param authService - Servicio que gestiona la autenticación del usuario.
   * @param messageService - Servicio para mostrar mensajes emergentes.
   * @param bookingService - Servicio que gestiona las reservas de los viajes.
   */
  constructor(private authService: AuthService, private messageService: MessageService, private bookingService: BookingService) {}

  /**
   * @description
   * Método que se ejecuta al inicializar el componente. Obtiene la información del usuario autenticado y, si está disponible, carga sus viajes reservados.
   */
  ngOnInit(): void {
    this.authService.getAuthenticatedUser().subscribe({
      next: (data) => {
        this.user = data;
        this.editedUser = { ...data };
        if (this.user?.id) {
          this.getTripsBooked();
        }
      },
      error: (error) => {
        console.error('Error obteniendo el usuario', error);
      }
    });
  }

  // Este método se llama cuando se hace clic en el botón de la card
  showBookingModal(): void {
    this.displayBookingModal = true; // Muestra el modal
  }

  // Método para cerrar el modal
  hideBookingModal(): void {
    this.displayBookingModal = false; // Oculta el modal
  }

  /**
   * @description
   * Muestra el modal de edición del perfil.
   */
  showModal(): void {
    this.displayModal = true;
  }

  /**
   * @description
   * Oculta el modal de edición del perfil.
   */
  hideModal(): void {
    this.displayModal = false;
  }

  /**
   * @description
   * Valida los datos del formulario antes de guardarlos.
   *
   * @returns `true` si el formulario es válido, `false` si contiene errores.
   */
  validateForm(): boolean {
    let isValid = true;

    if (!this.validatePhoneNumber()) {
      isValid = false;
    }

    if (!this.validateEmail()) {
      isValid = false;
    }

    if (!this.validateBirthdate()) {
      isValid = false;
    }

    return isValid;
  }

  /**
   * @description
   * Valida el número de teléfono ingresado por el usuario.
   *
   * @returns `true` si el teléfono es válido, `false` si no lo es.
   */
  validatePhoneNumber(): boolean {
    const phonePattern = /^[0-9]{9,15}$/;
    this.phoneValid = phonePattern.test(this.editedUser.client.phone_number);
    return this.phoneValid;
  }

  /**
   * @description
   * Valida la dirección de correo electrónico ingresada por el usuario.
   *
   * @returns `true` si el correo es válido, `false` si no lo es.
   */
  validateEmail(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailValid = emailPattern.test(this.editedUser.email);
    return this.emailValid;
  }

  /**
   * @description
   * Valida la fecha de nacimiento del usuario.
   *
   * @returns `true` si la edad del usuario es mayor de 18 años, `false` si no lo es.
   */
  validateBirthdate(): boolean {
    const today = new Date();
    const birthdate = new Date(this.editedUser.client.birthdate);
    const age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    const birthdateValid = age > 18 || (age === 18 && m >= 0);
    this.birthdateValid = birthdateValid;
    return birthdateValid;
  }

  /**
   * @description
   * Obtiene la URL para el avatar del usuario usando sus iniciales.
   *
   * @param username - Nombre de usuario del usuario autenticado.
   *
   * @returns La URL generada para el avatar.
   */
  getAvatarUrl(username: string): string {
    if (!username) {
      return `https://ui-avatars.com/api/?name=XX&background=0D8ABC&color=fff`;
    }
    const initials = username.substring(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff`;
  }

  /**
   * @description
   * Guarda los cambios realizados en el perfil del usuario si el formulario es válido.
   */
  saveChanges(): void {
    if (this.validateForm()) {
      this.authService.getAuthenticatedUser().subscribe({
        next: () => {
          this.authService.updateUser(this.editedUser).subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario actualizado correctamente.',
              });
              this.displayModal = false;
            },
            error: (error) => {
              if (error.status === 400 && error.error.error === 'El nombre de usuario ya está en uso') {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'El nombre de usuario ya está en uso. Elige otro.',
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Ocurrió un error al actualizar el usuario.',
                });
              }
              console.error('Error updating user:', error);
            },
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo obtener la información del usuario.',
          });
          console.error('Error getting user:', error);
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor, corrige los errores en el formulario antes de guardar.',
      });
    }
  }

  /**
   * @description
   * Muestra el modal para cambiar la contraseña del usuario.
   */
  showChangePasswordModal(): void {
    this.displayChangePasswordModal = true;
    this.changePasswordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
    this.passwordsMismatch = false;
  }

  /**
   * @description
   * Oculta el modal para cambiar la contraseña.
   */
  hideChangePasswordModal(): void {
    this.displayChangePasswordModal = false;
  }

  /**
   * @description
   * Cambia la contraseña del usuario después de validar el formulario de cambio de contraseña.
   */
  changePassword(): void {
    if (!this.validatePassWordForm()) {
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.changePasswordData;

    this.authService.changePassword(oldPassword, newPassword, confirmPassword).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Contraseña cambiada',
          detail: 'Tu contraseña ha sido cambiada correctamente.',
        });
        this.hideChangePasswordModal();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al cambiar la contraseña.',
        });
        console.error('Error cambiando la contraseña:', error);
      }
    });
  }

  /**
   * @description
   * Valida el formulario de cambio de contraseña para asegurarse de que las contraseñas coinciden.
   *
   * @returns `true` si las contraseñas coinciden, `false` si no lo hacen.
   */
  validatePassWordForm(): boolean {
    let isValid = true;

    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmPassword) {
      isValid = false;
      this.passwordsMismatch = true;
    } else {
      this.passwordsMismatch = false;
    }

    return isValid;
  }

  /**
   * @description
   * Obtiene las reservas confirmadas del usuario autenticado.
   */
  getTripsBooked(): void {
    if (!this.user?.id) return;

    this.bookingService.getConfirmedReservations(this.user.id).subscribe({
      next: (trips) => {
        this.tripsBooked = trips;

        this.tripsBooked.forEach((booking, index) => {
          this.bookingService.getTripById(booking.trip_id).subscribe({
            next: (trip) => {
              this.tripsBooked[index].trip = trip;
            },
            error: (error) => {
              console.error(`Error obteniendo trip con ID ${booking.trip_id}:`, error);
            }
          });
        });
      },
      error: (error) => {
        console.error('Error obteniendo las reservas:', error);
      }
    });
  }
}
