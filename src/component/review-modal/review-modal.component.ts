import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css'],
  imports: [
    FormsModule,
    CommonModule // Agrega CommonModule aquí
  ],
  standalone: true // Asegúrate de que el componente sea standalone si estás usando Angular 14+
})
export class ReviewModalComponent {
  @Input() isOpen: boolean = false; // Para controlar la visibilidad del modal
  @Output() closeModal = new EventEmitter<void>(); // Para cerrar el modal

  rating: number = 0; // Variable para almacenar la valoración
  review: string = ''; // Variable para almacenar la reseña

  // Llamado al enviar la valoración
  submitReview() {
    // Aquí iría la lógica para enviar la valoración al backend
    console.log(`Valoración: ${this.rating}`);
    console.log(`Reseña: ${this.review}`);

    // Emitimos el evento para cerrar el modal
    this.closeModal.emit();
  }

  // Función para cerrar el modal
  close() {
    this.closeModal.emit();
  }
}
