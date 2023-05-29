import { ApplicationError } from '@/protocols';

export function CannotActivityBookingError(): ApplicationError {
  return {
    name: 'CannotActivityBookingError',
    message: 'Cannot booking this activity! Overcapacity!',
  };
}
