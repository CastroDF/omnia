import {
  Box,
  Container,
  Stack,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  BoxProps,
} from '@chakra-ui/react';
import React from 'react';

export interface HeroProps extends BoxProps {
  title: string;
  subtitle: string;
  badge?: string;
  primaryCta?: {
    text: string;
    onClick: () => void;
  };
  secondaryCta?: {
    text: string;
    onClick: () => void;
  };
  stats?: string;
  bgGradient?: string;
  color?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  badge,
  primaryCta,
  secondaryCta,
  stats,
  bgGradient = 'linear(to-br, blue.600, purple.700)',
  color = 'white',
  ...props
}) => {
  return (
    <Box bgGradient={bgGradient} color={color} py={20} {...props}>
      <Container maxW='7xl'>
        <Stack gap={8} align='center' textAlign='center'>
          {badge && (
            <Badge
              colorScheme='whiteAlpha'
              px={4}
              py={2}
              borderRadius='full'
              fontSize='sm'
            >
              {badge}
            </Badge>
          )}

          <VStack gap={4} maxW='4xl'>
            <Heading size='4xl' fontWeight='bold' lineHeight='shorter'>
              {title}
            </Heading>

            <Text
              fontSize='xl'
              color={color === 'white' ? 'blue.100' : 'gray.600'}
              maxW='3xl'
            >
              {subtitle}
            </Text>
          </VStack>

          {(primaryCta || secondaryCta) && (
            <HStack gap={4} flexWrap='wrap' justify='center'>
              {primaryCta && (
                <Button
                  size='lg'
                  colorScheme='yellow'
                  color='black'
                  fontWeight='bold'
                  onClick={primaryCta.onClick}
                >
                  {primaryCta.text}
                </Button>
              )}

              {secondaryCta && (
                <Button
                  size='lg'
                  variant='outline'
                  borderColor={color}
                  color={color}
                  _hover={{
                    bg: color === 'white' ? 'whiteAlpha.200' : 'gray.100',
                  }}
                  onClick={secondaryCta.onClick}
                >
                  {secondaryCta.text}
                </Button>
              )}
            </HStack>
          )}

          {stats && (
            <Text
              fontSize='sm'
              color={color === 'white' ? 'blue.200' : 'gray.500'}
            >
              {stats}
            </Text>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
