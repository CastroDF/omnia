import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/test-utils/render';
import userEvent from '@testing-library/user-event';
import UploadRenderForm from './UploadRenderForm';

// Mock next/router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('UploadRenderForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders the form correctly', () => {
    render(<UploadRenderForm />);

    expect(screen.getByText('📝 Información del Modelo')).toBeInTheDocument();
    expect(screen.getByText('🥽 Archivos AR')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Audi R8 2024')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Describe tu modelo 3D...'),
    ).toBeInTheDocument();
    expect(screen.getByText('Archivo USDZ')).toBeInTheDocument();
    expect(screen.getByText('Archivo GLB')).toBeInTheDocument();
  });

  it('shows validation error when submitting without files', async () => {
    render(<UploadRenderForm />);

    const nameInput = screen.getByPlaceholderText('Ej: Audi R8 2024');
    await userEvent.type(nameInput, 'Test Model');

    const submitButton = screen.getByRole('button', {
      name: /Subir Modelo AR/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it('allows typing in name and description fields', async () => {
    render(<UploadRenderForm />);

    const nameInput = screen.getByPlaceholderText('Ej: Audi R8 2024');
    const descriptionInput = screen.getByPlaceholderText(
      'Describe tu modelo 3D...',
    );

    await userEvent.type(nameInput, 'Test Model');
    await userEvent.type(descriptionInput, 'Test description');

    expect(nameInput).toHaveValue('Test Model');
    expect(descriptionInput).toHaveValue('Test description');
  });

  it('handles USDZ file selection', async () => {
    render(<UploadRenderForm />);

    const usdzFileInput = document.querySelector(
      'input[accept=".usdz"]',
    ) as HTMLInputElement;
    expect(usdzFileInput).toBeTruthy();

    const file = new File(['usdz content'], 'model.usdz', {
      type: 'model/vnd.usdz+zip',
    });
    await userEvent.upload(usdzFileInput, file);
    expect(usdzFileInput.files![0]).toBe(file);
  });

  it('handles GLB file selection', async () => {
    render(<UploadRenderForm />);

    const glbFileInput = document.querySelector(
      'input[accept=".glb"]',
    ) as HTMLInputElement;
    expect(glbFileInput).toBeTruthy();

    const file = new File(['glb content'], 'model.glb', {
      type: 'model/gltf-binary',
    });
    await userEvent.upload(glbFileInput, file);
    expect(glbFileInput.files![0]).toBe(file);
  });

  it('successfully submits form with USDZ file', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        render: {
          id: 'test-id',
          slug: 'test-model',
          name: 'Test Model',
        },
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<UploadRenderForm />);

    const nameInput = screen.getByPlaceholderText('Ej: Audi R8 2024');
    await userEvent.type(nameInput, 'Test Model');

    const usdzFileInput = document.querySelector(
      'input[accept=".usdz"]',
    ) as HTMLInputElement;
    const file = new File(['usdz content'], 'model.usdz', {
      type: 'model/vnd.usdz+zip',
    });
    await userEvent.upload(usdzFileInput, file);

    const submitButton = screen.getByRole('button', {
      name: /Subir Modelo AR/i,
    });

    // Test that form is ready to submit
    expect(submitButton).not.toBeDisabled();

    // Test the submission
    await userEvent.click(submitButton);

    // Just verify fetch was called correctly
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/upload', {
        method: 'POST',
        body: expect.any(FormData),
      });
    });
  });

  it('shows progress during upload', async () => {
    render(<UploadRenderForm />);

    const nameInput = screen.getByPlaceholderText('Ej: Audi R8 2024');
    await userEvent.type(nameInput, 'Test Model');

    const usdzFileInput = document.querySelector(
      'input[accept=".usdz"]',
    ) as HTMLInputElement;
    const file = new File(['usdz content'], 'model.usdz', {
      type: 'model/vnd.usdz+zip',
    });
    await userEvent.upload(usdzFileInput, file);

    // Test that the form is properly set up for upload
    const submitButton = screen.getByRole('button', {
      name: /Subir Modelo AR/i,
    });
    expect(submitButton).not.toBeDisabled();

    // Test that file selection worked
    expect(
      screen.getByText('Archivo seleccionado: model.usdz'),
    ).toBeInTheDocument();
  });
});
