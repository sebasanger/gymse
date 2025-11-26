import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly theme = 'dark';

  success(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      theme: this.theme,
      confirmButtonColor: '#3085d6',
    });
  }

  error(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      theme: this.theme,
      confirmButtonColor: '#d33',
    });
  }

  errorResponse(err: any, fallbackTitle = 'Error') {
    const mainMessage =
      err?.error?.message || err?.message || 'Ocurrió un error inesperado. Intenta nuevamente.';

    const validationErrors = err?.error?.errors;

    let fullMessage = mainMessage;

    if (validationErrors && typeof validationErrors === 'object') {
      const details = Object.entries(validationErrors)
        .map(([field, msg]) => `• ${field}: ${msg}`)
        .join('\n');

      fullMessage += '\n\n' + details;
    }

    return this.error(fallbackTitle, fullMessage);
  }

  warning(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      theme: this.theme,
      confirmButtonColor: '#fbc02d',
    });
  }

  info(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      theme: this.theme,
    });
  }

  confirm(title: string, text: string, confirmText = 'Sí', cancelText = 'Cancelar') {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      theme: this.theme,
    });
  }

  confirmDelete(title = '¿Estás seguro?') {
    return Swal.fire({
      title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, deshabilitar',
      cancelButtonText: 'Cancelar',
      theme: 'dark',
    });
  }

  confirmRecover(title = '¿Estás seguro?') {
    return Swal.fire({
      title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, habilitar',
      cancelButtonText: 'Cancelar',
      theme: 'dark',
    });
  }
}
