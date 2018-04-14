export const digitRegex = /^\d*\.?\d+$/;

export function errorMessage(errors: any): string {
  if (errors['required']) {
    return 'поле обязательно для заполнения';
  }

  if (errors['min']) {
    return `минимальное значение ${errors['min']['min']}`;
  }

  if (errors['max']) {
    return `максимальное значение ${errors['max']['max']}`;
  }

  if (errors['minlength']) {
    return `минимальная длина — ${errors['minlength']['requiredLength']}`;
  }

  if (errors['maxlength']) {
    return `максимальная длина — ${errors['maxlength']['requiredLength']}`;
  }

  if (errors['pattern'] && errors['pattern']['requiredPattern'] === digitRegex.toString()) {
    return `разрешены лишь цифры`;
  }
}
