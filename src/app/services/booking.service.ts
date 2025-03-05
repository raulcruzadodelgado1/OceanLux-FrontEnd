import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de manejar las reservas de los usuarios.
 * Permite crear, obtener, actualizar y eliminar reservas, así como obtener información sobre los viajes.
 *
 * @example
 * this.bookingService.createReservation(reservation).subscribe(response => { ... });
 */
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  /**
   * URL base de la API para el manejo de las reservas. Debe ser cambiada según la configuración del servidor.
   */
  private apiUrl = 'http://localhost:8000/api/booking';

  /**
   * Constructor que inyecta el servicio HttpClient utilizado para realizar solicitudes HTTP.
   *
   * @param http Servicio HttpClient para realizar las solicitudes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Método para crear una nueva reserva.
   *
   * @param reservation Objeto que contiene los detalles de la reserva a crear.
   * @returns Un observable que emite la respuesta del backend tras la creación de la reserva.
   */
  createReservation(reservation: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/create`, reservation, { headers });
  }

  /**
   * Método para obtener las reservas pendientes de un usuario.
   *
   * @param userId ID del usuario cuyo listado de reservas pendientes se desea obtener.
   * @returns Un observable que emite una lista de reservas pendientes del usuario.
   */
  getPendingReservationsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending/${userId}`);
  }

  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  /**
   * Método para eliminar una reserva.
   *
   * @param id ID de la reserva a eliminar.
   * @returns Un observable que emite la respuesta del backend tras la eliminación de la reserva.
   */
  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  /**
   * Método para actualizar el estado de una reserva.
   *
   * @param bookingId ID de la reserva cuyo estado se desea actualizar.
   * @param status Nuevo estado de la reserva (por ejemplo, confirmado, cancelado).
   * @returns Un observable que emite la respuesta del backend tras la actualización del estado de la reserva.
   */
  updateReservationStatus(bookingId: number, status: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-status/${bookingId}`, { status });
  }

  /**
   * Método para obtener las reservas confirmadas de un usuario.
   *
   * @param userId ID del usuario cuyo listado de reservas confirmadas se desea obtener.
   * @returns Un observable que emite una lista de reservas confirmadas del usuario.
   */
  getConfirmedReservations(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/confirmed/${userId}`);
  }

  /**
   * Método para obtener los detalles de un viaje a partir de su ID.
   *
   * @param tripId ID del viaje del que se desea obtener los detalles.
   * @returns Un observable que emite los detalles del viaje solicitado.
   */
  getTripById(tripId: number): Observable<any> {
    return this.http.get(`/api/trip/${tripId}`);
  }

  /**
   * Método para calificar una reserva existente.
   *
   * @param bookingId ID de la reserva a calificar.
   * @param rate Calificación a asignar a la reserva (de 0 a 5).
   * @returns Un observable que emite la respuesta del backend tras actualizar la calificación.
   */
  rateReservation(bookingId: number, rate: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/rate/${bookingId}`, { rate });
  }
}
