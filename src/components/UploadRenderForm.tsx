'use client';

import React, { useState } from 'react';
import {
  Stack,
  Input,
  Button,
  Heading
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';

const UploadRenderForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [objFile, setObjFile] = useState<File | null>(null);
  const [mtlFile, setMtlFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !objFile || !mtlFile) {
      toaster.create({
        title: 'Missing fields',
        description: 'Please fill in all fields and upload both files.',
        type: 'warning'
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('obj', objFile);
      formData.append('mtl', mtlFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const { objUrl, mtlUrl } = await uploadRes.json();

      const saveRes = await fetch('/api/renders', {
        method: 'POST',
        body: JSON.stringify({
          title,
          objUrl,
          mtlUrl,
          userId: 'mock-user-id' // replace with session user ID
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!saveRes.ok) throw new Error('Failed to save render');

      toaster.create({
        title: 'Render uploaded',
        description: 'Your render was successfully saved.',
        type: 'success'
      });

      setTitle('');
      setObjFile(null);
      setMtlFile(null);
    } catch (err: any) {
      console.error(err);
      toaster.create({
        title: 'Upload error',
        description: err.message || 'Something went wrong.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack as='form' gap={ 4 } onSubmit={ handleSubmit } maxW='md' mx='auto' mt={ 8 }>
      <Heading size='md'>Upload new render</Heading>

      <Input
        type='text'
        placeholder='Render title'
        value={ title }
        onChange={ (e) => setTitle(e.target.value) }
        required
      />

      <Input
        type='file'
        accept='.obj'
        onChange={ (e) => setObjFile(e.target.files?.[0] || null) }
        required
      />

      <Input
        type='file'
        accept='.mtl'
        onChange={ (e) => setMtlFile(e.target.files?.[0] || null) }
        required
      />

      <Button type='submit' colorScheme='teal' loading={ loading }>
        Upload
      </Button>
    </Stack>
  );
};

export default UploadRenderForm;
