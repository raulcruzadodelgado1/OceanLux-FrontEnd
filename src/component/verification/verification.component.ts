import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {HeaderComponent} from '../header/header.component';
import {ToastComponent} from '../toast/toast.component';
import {NgIf} from '@angular/common';

/**
 * Componente de verificación de cuenta.
 * Muestra una animación en caso de éxito o un mensaje de error en caso de fallo.
 */
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  imports: [
    HeaderComponent,
    RouterLink,
    NgIf
  ]
})
export class VerificationComponent implements OnInit {

  /**
   * Referencia al componente Toast para mostrar notificaciones.
   */
  @ViewChild(ToastComponent) toast!: ToastComponent;

  /**
   * Controla la visualización de la animación de éxito.
   */
  showAnimation = false;

  /**
   * URL del backend para la verificación de la cuenta.
   */
  backendUrl = 'http://localhost:8000/api/user/verify';

  /**
   * Constructor del componente de verificación.
   * @param route Permite el acceso a los parámetros de la URL.
   * @param http Cliente HTTP para realizar peticiones al servidor.
   * @param router Permite la navegación programática entre rutas.
   */
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  /**
   * Método de inicialización del componente.
   * Suscribe a los parámetros de la URL y ejecuta la verificación si hay un token.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      console.log('Token recibido:', token); // Depuración en consola

      // Mostrar el HTML siempre, sin importar si el token es válido o no
      this.showAnimation = true;

      if (token) {
        this.verifyAccount(token);
      }
    });
  }


  /**
   * Verifica la cuenta utilizando el token recibido como parámetro.
   * @param token El token de verificación recibido a través de la URL.
   */
  verifyAccount(token: string) {
    this.http.get(`${this.backendUrl}?token=${token}`).subscribe({
      next: () => {
        this.showAnimation = true;
      },
      error: () => {
        this.toast.addMessage('info', 'Rejected', 'You have rejected');
      }
    });
  }
}
