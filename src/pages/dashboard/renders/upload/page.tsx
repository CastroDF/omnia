'use client';

import { Box, Heading } from '@chakra-ui/react';
import UploadRenderForm from '@/components/UploadRenderForm';

const UploadRenderPage: React.FC = () => {
  return (
    <Box p={ 8 }>
      <Heading size="lg" mb={ 6 }>Upload New Render</Heading>
      <UploadRenderForm />
    </Box>
  );
};

export default UploadRenderPage;
