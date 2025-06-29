import { VStack, HStack, Text, Icon } from '@chakra-ui/react';
import React from 'react';
import { FiStar } from 'react-icons/fi';

export interface TestimonialProps {
  text: string;
  author: string;
  role: string;
  rating?: number;
  company?: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  text,
  author,
  role,
  rating = 5,
  company,
}) => {
  return (
    <VStack gap={4} align='start'>
      <HStack>
        {[...Array(rating)].map((_, i) => (
          <Icon key={i} as={FiStar} color='yellow.400' />
        ))}
      </HStack>

      <Text fontSize='sm' color='gray.600'>
        &ldquo;{text}&rdquo;
      </Text>

      <VStack gap={1} align='start'>
        <Text fontWeight='bold'>{author}</Text>
        <Text fontSize='sm' color='gray.500'>
          {role}
          {company && ` - ${company}`}
        </Text>
      </VStack>
    </VStack>
  );
};

// English-only comments as per user rules.
