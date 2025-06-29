# Omnia UI Library

Una librería de componentes UI reutilizables para la aplicación Omnia, construida con Chakra UI y TypeScript.

## 📁 Estructura

```
src/ui/
├── button/           # Componente Button personalizado
├── card/            # Componente Card con Root, Body, Header
├── hero/            # Componente Hero para landing pages
├── section/         # Componente Section para layouts
├── testimonial/     # Componente Testimonial para reviews
└── index.ts         # Export centralizado
```

## 🚀 Componentes Disponibles

### Button

Componente de botón personalizado con soporte para iconos y variantes.

```tsx
import { Button } from '@/ui';

<Button variant='primary' size='lg' leftIcon={<FiUser />}>
  Click me
</Button>;
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'solid'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `leftIcon`: React.ReactElement
- `rightIcon`: React.ReactElement

### Card

Componente de tarjeta con estructura Root, Body y Header.

```tsx
import { Card } from '@/ui';

<Card.Root>
  <Card.Header>
    <Heading>Card Title</Heading>
  </Card.Header>
  <Card.Body>
    <Text>Card content goes here</Text>
  </Card.Body>
</Card.Root>;
```

### Hero

Componente para secciones hero de landing pages.

```tsx
import { Hero } from '@/ui';

<Hero
  badge='🚀 New Feature'
  title='Welcome to Omnia'
  subtitle='AR technology for your business'
  primaryCta={{
    text: 'Get Started',
    onClick: () => console.log('clicked'),
  }}
/>;
```

### Section

Componente para crear secciones con padding y background consistentes.

```tsx
import { Section } from '@/ui';

<Section bg='gray.50' py={20}>
  <Heading>Section Content</Heading>
</Section>;
```

### Testimonial

Componente para mostrar testimonios de clientes.

```tsx
import { Testimonial } from '@/ui';

<Testimonial
  text='Amazing product!'
  author='John Doe'
  role='CEO'
  company='Tech Corp'
  rating={5}
/>;
```

## 🎨 Storybook

Para ver todos los componentes en acción, ejecuta:

```bash
npm run storybook
```

Esto abrirá Storybook en `http://localhost:6006` donde podrás:

- Ver todas las variantes de cada componente
- Interactuar con los controles
- Copiar código de ejemplo
- Probar diferentes configuraciones

## 🎯 Casos de Uso

### Landing Page

```tsx
import { Hero, Section, Card, Button } from '@/ui';

export default function LandingPage() {
  return (
    <>
      <Hero
        title='AR Technology'
        subtitle='Transform your business'
        primaryCta={{ text: 'Get Demo', onClick: handleDemo }}
      />

      <Section bg='gray.50'>
        <Card.Root>
          <Card.Body>
            <Text>Feature content</Text>
          </Card.Body>
        </Card.Root>
      </Section>
    </>
  );
}
```

### Dashboard

```tsx
import { Card, Button } from '@/ui';

export default function Dashboard() {
  return (
    <Card.Root>
      <Card.Header>
        <Heading>Dashboard</Heading>
      </Card.Header>
      <Card.Body>
        <Button variant='primary'>Action</Button>
      </Card.Body>
    </Card.Root>
  );
}
```

## 🔧 Personalización

### Colores de Marca

Para personalizar los colores, modifica el tema de Chakra UI en `src/components/ui/provider.tsx`:

```tsx
const customTheme = {
  colors: {
    brand: {
      50: '#f0f9ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
  },
};
```

### Nuevos Componentes

Para agregar un nuevo componente:

1. Crea la carpeta: `src/ui/component-name/`
2. Crea el componente: `ComponentName.tsx`
3. Crea el index: `index.ts`
4. Agrega las stories: `stories/ComponentName.stories.tsx`
5. Exporta desde `src/ui/index.ts`

## 📝 Convenciones

- **Nombres**: PascalCase para componentes, camelCase para props
- **Imports**: Usar imports nombrados desde `@/ui`
- **Props**: Extender interfaces de Chakra UI cuando sea posible
- **Stories**: Crear stories para todas las variantes importantes
- **Comentarios**: Solo en inglés

## 🚀 Próximos Pasos

- [ ] Agregar tests unitarios con Jest
- [ ] Implementar sistema de tokens de diseño
- [ ] Crear componentes adicionales (Modal, Form, etc.)
- [ ] Agregar documentación de accesibilidad
- [ ] Implementar modo oscuro
