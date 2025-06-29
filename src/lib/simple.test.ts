import { describe, it, expect } from 'vitest';

// Simple utility functions to test
export const add = (a: number, b: number): number => a + b;
export const multiply = (a: number, b: number): number => a * b;
export const isEven = (n: number): boolean => n % 2 === 0;
export const formatName = (firstName: string, lastName: string): string =>
  `${firstName} ${lastName}`;
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

describe('Utility Functions', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add two negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should add positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6);
      expect(multiply(-2, -3)).toBe(6);
    });
  });

  describe('isEven', () => {
    it('should return true for even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(0)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
      expect(isEven(5)).toBe(false);
    });
  });

  describe('formatName', () => {
    it('should format first and last name', () => {
      expect(formatName('John', 'Doe')).toBe('John Doe');
    });

    it('should handle empty strings', () => {
      expect(formatName('', 'Doe')).toBe(' Doe');
      expect(formatName('John', '')).toBe('John ');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email@domain.org')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });
  });
});
