import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import { Trip } from '../model/trip';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con los viajes.
 *
 * Este servicio proporciona métodos para crear, obtener, actualizar y eliminar viajes
 * utilizando la API en el backend. Además, permite obtener todos los viajes disponibles.
 *
 * @example
 * this.tripService.createTrip(newTrip).subscribe(response => { ... });
 * this.tripService.getTripById(1).subscribe(response => { ... });
 * this.tripService.deleteTrip(1).subscribe(response => { ... });
 */
@Injectable({
  providedIn: 'root'
})
export class TripService {
  /**
   * URL base de la API para las operaciones relacionadas con los viajes.
   */
  private apiUrl = 'http://localhost:8000/api/trip';

  /**
   * Inyección del servicio `HttpClient` para realizar las peticiones HTTP.
   */
  private http = inject(HttpClient);

  /**
   * Método para crear un nuevo viaje.
   *
   * @param trip Objeto `Trip` con la información del viaje a crear.
   * @returns Un observable con la respuesta de la creación del viaje.
   */
  createTrip(trip: Trip): Observable<Trip> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Trip>(`${this.apiUrl}/create`, trip, { headers });
  }

  /**
   * Método para obtener un viaje por su ID.
   *
   * @param id El ID del viaje a obtener.
   * @returns Un observable con el objeto `Trip` correspondiente al ID.
   */
  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  /**
   * Método para obtener todos los viajes disponibles.
   *
   * @returns Un observable con un array de objetos `Trip` que representan todos los viajes.
   */
  allTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/list`);
  }

  /**
   * Método para eliminar un viaje por su ID.
   *
   * @param id El ID del viaje a eliminar.
   * @returns Un observable con la respuesta de la eliminación del viaje.
   */
  deleteTrip(id: number): Observable<Trip> {
    return this.http.delete<Trip>(`${this.apiUrl}/${id}`);
  }

  /**
   * Método para actualizar un viaje existente.
   *
   * @param id El ID del viaje a actualizar.
   * @param trip Objeto `Trip` con los nuevos datos del viaje.
   * @returns Un observable con el viaje actualizado.
   */
  updateTrip(id: number, trip: Trip): Observable<Trip> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, trip, { headers });
  }

  /**
   * Método para obtener la cantidad de valoraciones de un viaje.
   *
   * @param tripId El ID del viaje para el cual obtener la cantidad de valoraciones.
   * @returns Un observable con la cantidad de valoraciones.
   */
  getTripRatingsCount(tripId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${tripId}/ratings/count`);
  }

  /**
   * Método para obtener el promedio de las valoraciones de un viaje.
   *
   * @param tripId El ID del viaje para el cual obtener el promedio de las valoraciones.
   * @returns Un observable con el promedio de las valoraciones.
   */
  getTripRatingsAverage(tripId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${tripId}/ratings`)
      .pipe(
        // En caso de que no haya valoraciones, la respuesta será 0
        map(response => {
          if (response.average_rating === undefined) {
            return { average_rating: 0 };
          }
          return response;
        })
      );
  }

  rateBooking(bookingId: number, rate: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { rate: rate };
    return this.http.post<any>(`${this.apiUrl}/booking/${bookingId}/rate`, body, { headers }).pipe(
      catchError(error => {
        console.error('Error rating booking:', error);
        return of({ message: 'Failed to rate booking' }); // Devuelve un mensaje de error en caso de fallo
      })
    );
  }
}
