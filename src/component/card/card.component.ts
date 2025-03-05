import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trip } from '../../app/model/trip';
import {TripService} from '../../app/services/trip.service';
import {ReviewModalComponent} from '../review-modal/review-modal.component';

/**
 * Componente que representa una tarjeta con los detalles de un viaje.
 * Este componente permite visualizar información del viaje y determinar si la fecha del viaje ha pasado.
 *
 * @example
 * <app-card [trip]="trip" [shopped]="true"></app-card>
 */
@Component({
  selector: 'app-card',
  imports: [
    NgIf,
    RouterLink,
    DatePipe,
    NgClass,
    ReviewModalComponent
  ],
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
  /**
   * Propiedad de entrada que indica si el viaje ha sido comprado o no.
   *
   * @default false
   */
  @Input() shopped: boolean = false;

  /**
   * Propiedad de entrada que recibe un objeto `Trip` con los detalles del viaje.
   */
  @Input() trip!: Trip;

  @Output() openModalEvent = new EventEmitter<void>();

  /**
   * Variable para almacenar la cantidad de valoraciones del viaje.
   */
  ratingsCount: number = 0;

  /**
   * Variable para almacenar la media de valoraciones del viaje.
   */
  ratingsAverage: number = 0;

  hasReviewed: boolean = false;

  isModalOpen: boolean = false;

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.getRatingsCount();
    this.getRatingsAverage();
    this.isModalOpen = false;
  }

  openModal() {
    this.openModalEvent.emit();
  }


  /**
   * Método que verifica si la fecha del viaje ha pasado o no.
   *
   * @param dateString Fecha del viaje en formato de cadena.
   * @returns `true` si la fecha ha pasado, `false` si no.
   */
  isPastDate(dateString: string): boolean {
    const tripDate = new Date(dateString);
    const today = new Date();
    return tripDate < today;
  }

// Método para obtener la cantidad de valoraciones
  getRatingsCount(): void {
    if (this.trip.id) {
      this.tripService.getTripRatingsCount(this.trip.id).subscribe(
        (response) => {
          this.ratingsCount = response.ratings_count;
        },
        (error) => {
          console.error('Error al obtener la cantidad de valoraciones:', error);
        }
      );
    } else {
      console.error('El ID del viaje no está definido.');
    }
  }

  /**
   * Método para obtener la media de valoraciones del viaje.
   */
  getRatingsAverage(): void {
    if (this.trip.id) {  // Verificamos si `trip.id` está definido
      this.tripService.getTripRatingsAverage(this.trip.id).subscribe(
        (response) => {
          this.ratingsAverage = response.average_rating ?? 0; // Usamos 0 si no hay valoraciones
        },
        (error) => {
          console.error('Error al obtener la media de valoraciones:', error);
        }
      );
    } else {
      console.error('El ID del viaje no está definido.');
    }
  }

  closeReviewModal() {
    this.isModalOpen = false;
  }

  openReviewModal() {
    console.log('Abriendo modal...');  // Depuración
    this.isModalOpen = true;
  }
}
