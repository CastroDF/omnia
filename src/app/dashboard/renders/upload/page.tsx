'use client';

import { Container } from '@chakra-ui/react';
import UploadRenderForm from '@/components/UploadRenderForm';

export default function UploadPage() {
  return (
    <Container maxW='2xl' py={10}>
      <UploadRenderForm />
    </Container>
  );
}
