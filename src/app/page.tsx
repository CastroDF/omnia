'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Card,
  Grid,
  VStack,
  HStack,
  Badge,
  Icon,
  SimpleGrid,
  Input,
  Textarea,
  Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  FiCheck,
  FiUpload,
  FiShare2,
  FiSmartphone,
  FiEye,
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiStar,
  FiArrowRight,
  FiUser,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    const subject = encodeURIComponent(
      'Consulta sobre Omnia AR - ' + formData.company,
    );
    const body = encodeURIComponent(`
Hola! Me interesa Omnia para mi negocio.

Nombre: ${formData.name}
Empresa: ${formData.company}
Email: ${formData.email}

Mensaje:
${formData.message}

Saludos!
    `);

    window.open(
      `mailto:castrodiegofernando00@gmail.com?subject=${subject}&body=${body}`,
    );
  };

  return (
    <Box>
      {/* Top Navigation */}
      <Box
        bg='white'
        borderBottom='1px'
        borderColor='gray.200'
        position='sticky'
        top={0}
        zIndex={1000}
      >
        <Container maxW='7xl'>
          <Flex justify='space-between' align='center' py={4}>
            <Heading size='lg' color='blue.600'>
              Omnia
            </Heading>
            <Button variant='ghost' onClick={() => router.push('/dashboard')}>
              <Icon as={FiUser} mr={2} />
              Dashboard
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        bg='gradient-to-br'
        bgGradient='linear(to-br, blue.600, purple.700)'
        color='white'
        py={20}
      >
        <Container maxW='7xl'>
          <Stack gap={8} align='center' textAlign='center'>
            <Badge
              colorScheme='whiteAlpha'
              px={4}
              py={2}
              borderRadius='full'
              fontSize='sm'
            >
              🚀 Realidad Aumentada Sin Apps
            </Badge>

            <VStack gap={4} maxW='4xl'>
              <Heading size='4xl' fontWeight='bold' lineHeight='shorter'>
                Muestra tus productos en{' '}
                <Text as='span' color='yellow.300'>
                  Realidad Aumentada
                </Text>{' '}
                desde cualquier navegador
              </Heading>

              <Text fontSize='xl' color='blue.100' maxW='3xl'>
                Omnia convierte tus productos físicos en experiencias AR nativas
                para iOS y Android. Sin apps, sin descargas. Solo compartí un
                link y tus clientes verán tus productos en 3D.
              </Text>
            </VStack>

            <HStack gap={4} flexWrap='wrap' justify='center'>
              <Button
                size='lg'
                colorScheme='yellow'
                color='black'
                fontWeight='bold'
                onClick={() =>
                  document
                    .getElementById('contacto')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Solicitar Demo Gratis
                <Icon as={FiArrowRight} ml={2} />
              </Button>
              <Button
                size='lg'
                variant='outline'
                borderColor='white'
                color='white'
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() =>
                  document
                    .getElementById('ejemplos')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Ver Ejemplos
              </Button>
            </HStack>

            <Text fontSize='sm' color='blue.200'>
              💼 Más de 100+ empresas ya usan Omnia para sus productos
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Como Funciona */}
      <Box py={20} bg='gray.50'>
        <Container maxW='7xl'>
          <VStack gap={12}>
            <VStack gap={4} textAlign='center'>
              <Heading size='2xl'>¿Cómo funciona?</Heading>
              <Text fontSize='lg' color='gray.600' maxW='2xl'>
                En solo 3 pasos, tus productos estarán disponibles en Realidad
                Aumentada
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w='full'>
              <VStack textAlign='center' gap={4}>
                <Box
                  bg='blue.500'
                  color='white'
                  w={16}
                  h={16}
                  borderRadius='full'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  fontSize='2xl'
                >
                  <Icon as={FiUpload} />
                </Box>
                <Heading size='lg'>1. Subís tu producto</Heading>
                <Text color='gray.600'>
                  Envianos fotos de tu producto o modelo 3D. Nosotros nos
                  encargamos del modelado profesional si es necesario.
                </Text>
              </VStack>

              <VStack textAlign='center' gap={4}>
                <Box
                  bg='green.500'
                  color='white'
                  w={16}
                  h={16}
                  borderRadius='full'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  fontSize='2xl'
                >
                  <Icon as={FiEye} />
                </Box>
                <Heading size='lg'>2. Creamos tu visor AR</Heading>
                <Text color='gray.600'>
                  Generamos un visor AR optimizado con tu marca, compatible con
                  iOS (Quick Look) y Android (Scene Viewer).
                </Text>
              </VStack>

              <VStack textAlign='center' gap={4}>
                <Box
                  bg='purple.500'
                  color='white'
                  w={16}
                  h={16}
                  borderRadius='full'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  fontSize='2xl'
                >
                  <Icon as={FiShare2} />
                </Box>
                <Heading size='lg'>3. Compartís y vendés</Heading>
                <Text color='gray.600'>
                  Recibís un link público que podés integrar en tu web, redes
                  sociales o enviar por WhatsApp a tus clientes.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Ejemplos */}
      <Box py={20} id='ejemplos'>
        <Container maxW='7xl'>
          <VStack gap={12}>
            <VStack gap={4} textAlign='center'>
              <Heading size='2xl'>Ejemplos en acción</Heading>
              <Text fontSize='lg' color='gray.600' maxW='2xl'>
                Mira cómo diferentes industrias usan Omnia para mostrar sus
                productos
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w='full'>
              <Card.Root>
                <Card.Body>
                  <VStack gap={4} align='start'>
                    <Box
                      w='full'
                      h='200px'
                      bg='gray.200'
                      borderRadius='md'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Text color='gray.500' fontSize='lg'>
                        🏠 Arquitectura
                      </Text>
                    </Box>
                    <Badge colorScheme='blue'>Inmobiliaria</Badge>
                    <Heading size='md'>Departamento 2 Ambientes</Heading>
                    <Text color='gray.600' fontSize='sm'>
                      Los clientes pueden visualizar el departamento en AR antes
                      de visitarlo físicamente.
                    </Text>
                    <Button size='sm' variant='outline' w='full'>
                      Ver en AR →
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root>
                <Card.Body>
                  <VStack gap={4} align='start'>
                    <Box
                      w='full'
                      h='200px'
                      bg='gray.200'
                      borderRadius='md'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Text color='gray.500' fontSize='lg'>
                        💺 Muebles
                      </Text>
                    </Box>
                    <Badge colorScheme='green'>E-commerce</Badge>
                    <Heading size='md'>Sofá Escandinavo</Heading>
                    <Text color='gray.600' fontSize='sm'>
                      Permite a los compradores ver cómo queda el mueble en su
                      living antes de comprar.
                    </Text>
                    <Button size='sm' variant='outline' w='full'>
                      Ver en AR →
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root>
                <Card.Body>
                  <VStack gap={4} align='start'>
                    <Box
                      w='full'
                      h='200px'
                      bg='gray.200'
                      borderRadius='md'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Text color='gray.500' fontSize='lg'>
                        🚗 Automotriz
                      </Text>
                    </Box>
                    <Badge colorScheme='purple'>Concesionario</Badge>
                    <Heading size='md'>BMW X3 2024</Heading>
                    <Text color='gray.600' fontSize='sm'>
                      Los clientes exploran el vehículo en detalle desde su
                      celular antes de la visita.
                    </Text>
                    <Button size='sm' variant='outline' w='full'>
                      Ver en AR →
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Beneficios */}
      <Box py={20} bg='gray.50'>
        <Container maxW='7xl'>
          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
            gap={12}
            alignItems='center'
          >
            <VStack gap={6} align='start'>
              <Heading size='2xl'>¿Por qué elegir Omnia?</Heading>

              <VStack gap={4} align='start'>
                <HStack>
                  <Icon as={FiSmartphone} color='green.500' />
                  <Text>
                    <strong>AR Nativo:</strong> Funciona en todos los celulares
                    sin apps adicionales
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FiTrendingUp} color='blue.500' />
                  <Text>
                    <strong>Más Ventas:</strong> 67% más conversión con
                    productos en 3D/AR
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FiClock} color='purple.500' />
                  <Text>
                    <strong>Rápido Setup:</strong> Tu producto AR listo en
                    24-48hs
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FiDollarSign} color='yellow.500' />
                  <Text>
                    <strong>ROI Comprobado:</strong> Reduce devoluciones hasta
                    64%
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FiCheck} color='green.500' />
                  <Text>
                    <strong>Fácil Integración:</strong> Shopify, WooCommerce,
                    Tiendanube
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FiShare2} color='red.500' />
                  <Text>
                    <strong>Viralizable:</strong> Se comparte 3x más que fotos
                    tradicionales
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            <Box bg='white' p={8} borderRadius='xl' shadow='lg'>
              <VStack gap={6}>
                <Heading size='lg' textAlign='center'>
                  🎯 Casos de Uso Principales
                </Heading>

                <VStack gap={3} w='full'>
                  <Box p={4} bg='blue.50' borderRadius='md' w='full'>
                    <Text fontWeight='bold' color='blue.800'>
                      🏗️ Arquitectura & Inmobiliario
                    </Text>
                    <Text fontSize='sm' color='blue.600'>
                      Renders de obra, departamentos, casas
                    </Text>
                  </Box>

                  <Box p={4} bg='green.50' borderRadius='md' w='full'>
                    <Text fontWeight='bold' color='green.800'>
                      🛋️ Muebles & Decoración
                    </Text>
                    <Text fontSize='sm' color='green.600'>
                      Sofás, mesas, lámparas, deco
                    </Text>
                  </Box>

                  <Box p={4} bg='purple.50' borderRadius='md' w='full'>
                    <Text fontWeight='bold' color='purple.800'>
                      ⚙️ Productos Industriales
                    </Text>
                    <Text fontSize='sm' color='purple.600'>
                      Maquinaria, herramientas, tech
                    </Text>
                  </Box>

                  <Box p={4} bg='orange.50' borderRadius='md' w='full'>
                    <Text fontWeight='bold' color='orange.800'>
                      🎨 Arte & Educación
                    </Text>
                    <Text fontSize='sm' color='orange.600'>
                      Esculturas, modelos científicos
                    </Text>
                  </Box>
                </VStack>
              </VStack>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Precios */}
      <Box py={20}>
        <Container maxW='7xl'>
          <VStack gap={12}>
            <VStack gap={4} textAlign='center'>
              <Heading size='2xl'>Paquetes y Precios</Heading>
              <Text fontSize='lg' color='gray.600' maxW='2xl'>
                Soluciones flexibles para cada tipo de negocio
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w='full'>
              <Card.Root>
                <Card.Body p={8}>
                  <VStack gap={6}>
                    <VStack gap={2}>
                      <Heading size='lg' color='blue.600'>
                        Básico
                      </Heading>
                      <Text fontSize='3xl' fontWeight='bold'>
                        $75 USD
                      </Text>
                      <Text color='gray.600'>por producto</Text>
                    </VStack>

                    <VStack gap={3} align='start' w='full'>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Modelado 3D básico</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Visor AR estándar</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Hosting 6 meses</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Soporte por email</Text>
                      </HStack>
                    </VStack>

                    <Button w='full' colorScheme='blue' variant='outline'>
                      Elegir Básico
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root borderWidth={2} borderColor='purple.500'>
                <Card.Body p={8}>
                  <VStack gap={6}>
                    <Badge colorScheme='purple' mb={2}>
                      Más Popular
                    </Badge>
                    <VStack gap={2}>
                      <Heading size='lg' color='purple.600'>
                        Profesional
                      </Heading>
                      <Text fontSize='3xl' fontWeight='bold'>
                        $150 USD
                      </Text>
                      <Text color='gray.600'>por producto</Text>
                    </VStack>

                    <VStack gap={3} align='start' w='full'>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Modelado 3D premium</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Visor personalizado</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Hosting 1 año</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Integración e-commerce</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Soporte prioritario</Text>
                      </HStack>
                    </VStack>

                    <Button w='full' colorScheme='purple'>
                      Elegir Profesional
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root>
                <Card.Body p={8}>
                  <VStack gap={6}>
                    <VStack gap={2}>
                      <Heading size='lg' color='yellow.600'>
                        Enterprise
                      </Heading>
                      <Text fontSize='3xl' fontWeight='bold'>
                        Custom
                      </Text>
                      <Text color='gray.600'>consultar</Text>
                    </VStack>

                    <VStack gap={3} align='start' w='full'>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Catálogo completo</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>White label</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>API dedicada</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Soporte 24/7</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheck} color='green.500' />
                        <Text>Setup personalizado</Text>
                      </HStack>
                    </VStack>

                    <Button w='full' colorScheme='yellow' color='black'>
                      Contactar
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonios */}
      <Box py={20} bg='gray.50'>
        <Container maxW='7xl'>
          <VStack gap={12}>
            <VStack gap={4} textAlign='center'>
              <Heading size='2xl'>Lo que dicen nuestros clientes</Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8} w='full'>
              <Card.Root>
                <Card.Body>
                  <VStack gap={4} align='start'>
                    <HStack>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FiStar} color='yellow.400' />
                      ))}
                    </HStack>
                    <Text fontSize='sm' color='gray.600'>
                      &ldquo;Omnia revolucionó nuestras ventas. Los clientes
                      ahora pueden ver los muebles en su casa antes de comprar.
                      Las devoluciones bajaron 60%.&rdquo;
                    </Text>
                    <VStack gap={1} align='start'>
                      <Text fontWeight='bold'>María González</Text>
                      <Text fontSize='sm' color='gray.500'>
                        Directora - Muebles del Sur
                      </Text>
                    </VStack>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root>
                <Card.Body>
                  <VStack gap={4} align='start'>
                    <HStack>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FiStar} color='yellow.400' />
                      ))}
                    </HStack>
                    <Text fontSize='sm' color='gray.600'>
                      &ldquo;Como arquitecto, mostrar mis renders en AR cambió
                      todo. Los clientes entienden mejor los proyectos y cierro
                      ventas más rápido.&rdquo;
                    </Text>
                    <VStack gap={1} align='start'>
                      <Text fontWeight='bold'>Arq. Carlos Mendez</Text>
                      <Text fontSize='sm' color='gray.500'>
                        Estudio Mendez & Asociados
                      </Text>
                    </VStack>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root>
                <Card.Body>
                  <VStack gap={4} align='start'>
                    <HStack>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FiStar} color='yellow.400' />
                      ))}
                    </HStack>
                    <Text fontSize='sm' color='gray.600'>
                      &ldquo;Implementamos Omnia en nuestro e-commerce y las
                      conversiones subieron 40%. Es increíble ver tu auto en AR
                      antes de comprarlo.&rdquo;
                    </Text>
                    <VStack gap={1} align='start'>
                      <Text fontWeight='bold'>Javier Ruiz</Text>
                      <Text fontSize='sm' color='gray.500'>
                        Gerente - AutoPlaza Online
                      </Text>
                    </VStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* FAQ */}
      <Box py={20}>
        <Container maxW='4xl'>
          <VStack gap={12}>
            <VStack gap={4} textAlign='center'>
              <Heading size='2xl'>Preguntas Frecuentes</Heading>
            </VStack>

            <VStack gap={6} w='full'>
              <Card.Root w='full'>
                <Card.Body>
                  <VStack gap={3} align='start'>
                    <Text fontWeight='bold'>¿Qué necesito para empezar?</Text>
                    <Text color='gray.600'>
                      Solo fotos de alta calidad de tu producto desde diferentes
                      ángulos. Si ya tenés un modelo 3D (.obj, .glb, .usdz),
                      mejor aún. Nosotros nos encargamos del resto.
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root w='full'>
                <Card.Body>
                  <VStack gap={3} align='start'>
                    <Text fontWeight='bold'>
                      ¿Funciona en todos los celulares?
                    </Text>
                    <Text color='gray.600'>
                      Sí. Usamos tecnologías nativas: Quick Look para iOS
                      (iPhone/iPad) y Scene Viewer para Android. No se requieren
                      apps adicionales.
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root w='full'>
                <Card.Body>
                  <VStack gap={3} align='start'>
                    <Text fontWeight='bold'>¿Cuánto tarda el proceso?</Text>
                    <Text color='gray.600'>
                      El modelado 3D toma 24-48hs. Una vez aprobado, el visor AR
                      está listo inmediatamente. Podés empezar a compartir el
                      link ese mismo día.
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root w='full'>
                <Card.Body>
                  <VStack gap={3} align='start'>
                    <Text fontWeight='bold'>
                      ¿Puedo integrar en mi tienda online?
                    </Text>
                    <Text color='gray.600'>
                      Absolutamente. Omnia se integra fácil con Shopify,
                      WooCommerce, Tiendanube y cualquier plataforma mediante un
                      simple botón &ldquo;Ver en AR&rdquo;.
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root w='full'>
                <Card.Body>
                  <VStack gap={3} align='start'>
                    <Text fontWeight='bold'>
                      ¿Hay límite de visualizaciones?
                    </Text>
                    <Text color='gray.600'>
                      No. Una vez creado tu producto AR, puede ser visto
                      ilimitadas veces. Solo pagás por el setup inicial y
                      hosting anual.
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Contacto */}
      <Box
        py={20}
        bg='gradient-to-br'
        bgGradient='linear(to-br, blue.600, purple.700)'
        color='white'
        id='contacto'
      >
        <Container maxW='4xl'>
          <VStack gap={12}>
            <VStack gap={4} textAlign='center'>
              <Heading size='2xl'>
                ¿Listo para potenciar tus ventas con AR?
              </Heading>
              <Text fontSize='lg' color='blue.100' maxW='2xl'>
                Contanos sobre tu producto y te enviaremos una propuesta
                personalizada en 24hs
              </Text>
            </VStack>

            <Card.Root w='full' maxW='2xl'>
              <Card.Body p={8}>
                <Box as='form' onSubmit={handleSubmit}>
                  <VStack gap={6}>
                    <Grid
                      templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                      gap={4}
                      w='full'
                    >
                      <Box>
                        <Text mb={2} fontWeight='bold' color='gray.700'>
                          Nombre *
                        </Text>
                        <Input
                          required
                          value={formData.name}
                          onChange={e =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder='Tu nombre completo'
                        />
                      </Box>
                      <Box>
                        <Text mb={2} fontWeight='bold' color='gray.700'>
                          Email *
                        </Text>
                        <Input
                          type='email'
                          required
                          value={formData.email}
                          onChange={e =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder='tu@empresa.com'
                        />
                      </Box>
                    </Grid>

                    <Box w='full'>
                      <Text mb={2} fontWeight='bold' color='gray.700'>
                        Empresa *
                      </Text>
                      <Input
                        required
                        value={formData.company}
                        onChange={e =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder='Nombre de tu empresa'
                      />
                    </Box>

                    <Box w='full'>
                      <Text mb={2} fontWeight='bold' color='gray.700'>
                        Mensaje
                      </Text>
                      <Textarea
                        value={formData.message}
                        onChange={e =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder='Contanos qué productos querés mostrar en AR y tus objetivos...'
                        rows={4}
                      />
                    </Box>

                    <Button
                      type='submit'
                      size='lg'
                      colorScheme='purple'
                      w='full'
                    >
                      Enviar Consulta
                      <Icon as={FiArrowRight} ml={2} />
                    </Button>

                    <Text fontSize='sm' color='gray.500' textAlign='center'>
                      📧 También podés escribirnos directo a:
                      castrodiegofernando00@gmail.com
                    </Text>
                  </VStack>
                </Box>
              </Card.Body>
            </Card.Root>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box py={12} bg='gray.900' color='white'>
        <Container maxW='7xl'>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            align='center'
            gap={6}
          >
            <VStack gap={2} align={{ base: 'center', md: 'start' }}>
              <Heading size='lg'>Omnia AR</Heading>
              <Text color='gray.400'>Realidad Aumentada para negocios</Text>
            </VStack>

            <VStack gap={2} align={{ base: 'center', md: 'end' }}>
              <Text color='gray.400'>Contacto</Text>
              <Text>castrodiegofernando00@gmail.com</Text>
              <Text color='gray.500' fontSize='sm'>
                🇦🇷 Buenos Aires, Argentina
              </Text>
            </VStack>
          </Stack>

          <Box my={8} h='1px' bg='gray.700' />

          <Text textAlign='center' color='gray.500' fontSize='sm'>
            © 2024 Omnia AR. Todos los derechos reservados.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
