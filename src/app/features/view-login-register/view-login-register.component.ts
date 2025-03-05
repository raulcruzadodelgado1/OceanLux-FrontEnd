import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../component/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NgClass, NgIf } from '@angular/common';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../model/User';
import { MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import { EmailService } from '../../services/email.service';
import { InputText } from 'primeng/inputtext';

/**
 * @description
 * Componente de la vista de inicio de sesión y registro. Permite a los usuarios iniciar sesión o registrarse proporcionando información como nombre, correo electrónico, contraseña, etc.
 *
 * @exports
 * - `ViewLoginRegisterComponent`: Componente que gestiona el inicio de sesión y el registro de usuarios.
 */
@Component({
  selector: 'app-view-login-register',
  standalone: true,
  imports: [
    RouterModule,
    SidebarComponent,
    FormsModule,
    SelectButtonModule,
    NgIf,
    Password,
    Button,
    InputText,
    HttpClientModule,
    NgClass,
    Toast,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './view-login-register.component.html',
})
export class ViewLoginRegisterComponent implements OnInit {

  /**
   * @description
   * Opciones para el selector de estado que permite al usuario elegir entre 'Iniciar sesión' y 'Registrarse'.
   */
  stateOptions: any[] = [
    { label: 'Iniciar sesión', value: 'login' },
    { label: 'Registrarse', value: 'register' },
  ];

  /**
   * @description
   * Datos del usuario para el registro o inicio de sesión. Contiene el nombre de usuario, la contraseña, el correo electrónico y la información adicional del cliente.
   */
  userData = {
    username: '',
    password: '',
    email: '',
    client: {
      name: '',
      surname: '',
      birthdate: '',
      dni: '',
      address: '',
      phone_number: null
    }
  };

  /**
   * @description
   * Validaciones de los campos de correo electrónico, DNI, fecha de nacimiento y número de teléfono.
   * Los valores pueden ser `true`, `false`, o `null` si no hay un valor para validar.
   */
  emailValid: boolean | null = null;
  dniValid: boolean | null = null;
  birthdateValid: boolean | null = null;
  phoneValid: boolean | null = null;

  /**
   * @description
   * Forma activa, ya sea 'login' (inicio de sesión) o 'register' (registro).
   */
  activeForm: string = 'login';

  /**
   * @description
   * Datos del usuario para el inicio de sesión.
   */
  user: User = { username: '', password: '' };

  /**
   * @description
   * Mensaje de error cuando el inicio de sesión falla.
   */
  errorMessage: string = '';

  /**
   * @description
   * Mensaje de verificación cuando el registro es exitoso.
   */
  verificationMessage: string = '';

  /**
   * @description
   * Constructor que inyecta los servicios necesarios, como `AuthService`, `Router`, `MessageService` y `EmailService`.
   *
   * @param authService - Servicio que gestiona la autenticación de usuarios.
   * @param router - El router de Angular que permite redirigir al usuario después del inicio de sesión.
   * @param messageService - Servicio que muestra mensajes emergentes de éxito o error.
   * @param emailService - Servicio que gestiona el envío de correos electrónicos, como el correo de verificación.
   */
  constructor(private authService: AuthService, private router: Router, private messageService: MessageService, private emailService: EmailService) {}

  /**
   * @description
   * Método de inicialización del componente. No realiza ninguna acción adicional en este caso.
   */
  ngOnInit() {}

  /**
   * @description
   * Valida el número de teléfono utilizando una expresión regular. El número debe ser entre 9 y 15 dígitos.
   */
  validatePhoneNumber() {
    const phoneRegex = /^[0-9]{9,15}$/;

    if (!this.userData.client.phone_number) {
      this.phoneValid = null;
      return;
    }

    this.phoneValid = phoneRegex.test(this.userData.client.phone_number);
  }

  /**
   * @description
   * Valida el correo electrónico utilizando una expresión regular.
   *
   * @returns {void}
   */
  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailValid = emailPattern.test(this.userData.email);
  }

  /**
   * @description
   * Valida el DNI utilizando una expresión regular.
   * El DNI debe tener 8 dígitos seguidos de una letra.
   *
   * @returns {void}
   */
  validateDNI() {
    const dniPattern = /^[0-9]{8}[A-Za-z]$/;
    this.dniValid = dniPattern.test(this.userData.client.dni);
  }

  /**
   * @description
   * Valida la fecha de nacimiento del usuario. Asegura que la edad sea mayor o igual a 18 años.
   *
   * @returns {void}
   */
  validateBirthdate() {
    if (!this.userData.client.birthdate) {
      this.birthdateValid = null;
      return;
    }

    const birthdate = new Date(this.userData.client.birthdate);
    const today = new Date();

    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const dayDiff = today.getDate() - birthdate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      this.birthdateValid = age - 1 >= 18;
    } else {
      this.birthdateValid = age >= 18;
    }
  }

  /**
   * @description
   * Actualiza la contraseña del usuario cuando cambia en el formulario.
   *
   * @param event - El evento que contiene el nuevo valor de la contraseña.
   */
  updatePassword(event: any) {
    this.userData.password = event.target.value;
  }

  /**
   * @description
   * Registra un nuevo usuario en la plataforma. Si la información está incompleta, muestra un mensaje de error.
   * Luego, envía un correo de verificación al usuario si el registro es exitoso.
   */
  register() {
    if (!this.userData.username || !this.userData.password || !this.userData.email ||
      !this.userData.client.name || !this.userData.client.surname ||
      !this.userData.client.birthdate || !this.userData.client.dni ||
      !this.userData.client.address || !this.userData.client.phone_number) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Completa todos los campos' });
      return;
    }

    this.authService.register(this.userData).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro exitoso' });

        if (response.id) { // 🔹 Usamos 'id' en vez de 'user_id'
          this.sendVerificationEmail(response.id);
        } else {
          console.error("❌ No se recibió un ID en la respuesta del backend.");
        }

        this.resetForm();
        this.activeForm = 'login';
      },
      error: (error) => {
        console.error('❌ Error en el registro:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en el registro' });
        this.userData.password = '';
      }
    });
  }

  /**
   * @description
   * Envía un correo electrónico de verificación al usuario después de un registro exitoso.
   *
   * @param userId - El ID del usuario para enviar el correo de verificación.
   */
  sendVerificationEmail(userId: number): void {
    this.emailService.sendVerificationEmail(userId).subscribe({
      next: response => console.log('✅ Verification email sent:', response),
      error: error => console.error('❌ Error sending verification email:', error)
    });
  }

  /**
   * @description
   * Restablece el formulario de registro a su estado inicial.
   */
  resetForm() {
    this.userData = {
      username: '',
      password: '',
      email: '',
      client: {
        name: '',
        surname: '',
        birthdate: '',
        dni: '',
        address: '',
        phone_number: null
      }
    };
  }

  /**
   * @description
   * Inicia sesión con el usuario proporcionado. Si el inicio de sesión falla, muestra un mensaje de error.
   */
  login() {
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.authService.login(this.user).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}
