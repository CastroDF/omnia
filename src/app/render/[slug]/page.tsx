'use client';

import { Box, Heading } from '@chakra-ui/react';

interface RenderPageProps {
  params: { slug: string };
}

const RenderPage: React.FC<RenderPageProps> = ({ params }) => {
  return (
    <Box p={ 8 }>
      <Heading size="lg">Render: { params.slug }</Heading>
      {/* Aquí va el visor 3D con Three.js */ }
    </Box>
  );
};

export default RenderPage;
