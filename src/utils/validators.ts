/**
 * Form validation utilities for PDM UI Kit
 *
 * Pure validation functions and patterns that work with any form validation library.
 * These functions validate values directly and return true/false, making them framework-agnostic.
 */

export interface PdmValidationError {
  message: string;
  code: string;
}

/**
 * Validate email format
 *
 * @example
 * isValidEmail('user@example.com') // true
 */
export function isValidEmail(value: string): boolean {
  if (!value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Validate URL format
 *
 * @example
 * isValidUrl('https://example.com') // true
 */
export function isValidUrl(value: string): boolean {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate minimum length
 *
 * @example
 * hasMinLength('password', 8) // true if length >= 8
 */
export function hasMinLength(value: string, min: number): boolean {
  if (!value) return false;
  return String(value).length >= min;
}

/**
 * Validate maximum length
 *
 * @example
 * hasMaxLength('bio', 500) // true if length <= 500
 */
export function hasMaxLength(value: string, max: number): boolean {
  if (!value) return true;
  return String(value).length <= max;
}

/**
 * Validate that value only contains numbers
 *
 * @example
 * isNumeric('12345') // true
 */
export function isNumeric(value: string): boolean {
  if (!value) return false;
  return /^\d+$/.test(String(value));
}

/**
 * Validate that two values match (e.g., password confirmation)
 *
 * @example
 * valuesMatch(password, confirmPassword) // true if they match
 */
export function valuesMatch(value1: string, value2: string): boolean {
  if (!value1 || !value2) return false;
  return value1 === value2;
}

/**
 * Validate minimum value
 *
 * @example
 * isMinValue(age, 18) // true if age >= 18
 */
export function isMinValue(value: number, min: number): boolean {
  if (value === null || value === undefined) return false;
  return value >= min;
}

/**
 * Validate maximum value
 *
 * @example
 * isMaxValue(percentage, 100) // true if percentage <= 100
 */
export function isMaxValue(value: number, max: number): boolean {
  if (value === null || value === undefined) return false;
  return value <= max;
}

/**
 * Validate phone number format (basic international format)
 * Accepts: +1234567890, (123) 456-7890, 123-456-7890
 *
 * @example
 * isValidPhone('+1234567890') // true
 */
export function isValidPhone(value: string): boolean {
  if (!value) return false;
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(String(value).replace(/\s/g, ''));
}

/**
 * Check if value contains at least one uppercase letter
 *
 * @example
 * hasUppercase('Password') // true
 */
export function hasUppercase(value: string): boolean {
  if (!value) return false;
  return /[A-Z]/.test(value);
}

/**
 * Check if value contains at least one lowercase letter
 *
 * @example
 * hasLowercase('Password') // true
 */
export function hasLowercase(value: string): boolean {
  if (!value) return false;
  return /[a-z]/.test(value);
}

/**
 * Check if value contains at least one number
 *
 * @example
 * hasNumber('Pass123') // true
 */
export function hasNumber(value: string): boolean {
  if (!value) return false;
  return /\d/.test(value);
}

/**
 * Check if value contains at least one special character
 *
 * @example
 * hasSpecialChar('Pass@123') // true
 */
export function hasSpecialChar(value: string): boolean {
  if (!value) return false;
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
}

/**
 * Get user-friendly error message for validation failures
 *
 * @example
 * getErrorMessage('invalidEmail') // "Please enter a valid email address"
 */
export function getErrorMessage(errorCode: string, fieldName: string = 'Field'): string {
  const messages: Record<string, string> = {
    required: `${fieldName} is required`,
    invalidEmail: 'Please enter a valid email address',
    invalidUrl: 'Please enter a valid URL',
    invalidPhone: 'Please enter a valid phone number',
    notNumeric: `${fieldName} must contain only numbers`,
    noUppercase: `${fieldName} must contain at least one uppercase letter`,
    noLowercase: `${fieldName} must contain at least one lowercase letter`,
    noNumber: `${fieldName} must contain at least one number`,
    noSpecialChar: `${fieldName} must contain at least one special character`,
    fieldsDoNotMatch: 'Fields do not match',
  };

  return messages[errorCode] || 'Invalid input';
}
