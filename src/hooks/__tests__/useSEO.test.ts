/**
 * useSEO Hook Tests
 */

import { renderHook } from '@testing-library/react';
import { useSEO } from '../useSEO';

// Mock document
Object.defineProperty(document, 'title', {
  writable: true,
  value: ''
});

Object.defineProperty(document, 'querySelector', {
  writable: true,
  value: jest.fn(() => ({
    setAttribute: jest.fn(),
    getAttribute: jest.fn(() => ''),
    content: ''
  }))
});

describe('useSEO Hook', () => {
  test('sets page title', () => {
    renderHook(() => useSEO({
      title: 'Test Page Title'
    }));
    
    expect(document.title).toBe('Test Page Title | MP Barbers');
  });

  test('sets meta description', () => {
    const querySelector = document.querySelector as jest.Mock;
    const mockElement = {
      setAttribute: jest.fn(),
      content: ''
    };
    querySelector.mockReturnValue(mockElement);
    
    renderHook(() => useSEO({
      title: 'Test',
      description: 'Test description'
    }));
    
    expect(mockElement.setAttribute).toHaveBeenCalledWith('content', 'Test description');
  });
});
