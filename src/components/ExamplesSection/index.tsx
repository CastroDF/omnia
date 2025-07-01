import ButtonGradient from '@/components/ui/ButtonGradient';

const ExamplesSection = () => {
  const examples = [
    {
      category: 'Arquitectura',
      title: 'Departamento 2 Ambientes',
      subtitle: 'para inmobiliarias',
      description:
        'Visualiza departamentos completos antes de la construcción. Los clientes pueden recorrer cada ambiente y ver acabados en detalle.',
      accent: '#00E0FF',
    },
    {
      category: 'Muebles',
      title: 'Sofá Escandinavo',
      subtitle: 'para e-commerce',
      description:
        'Prueba cómo se ve el mueble en tu espacio real. Experimenta con diferentes colores y materiales antes de comprar.',
      accent: '#A9FFB0',
    },
    {
      category: 'Automotriz',
      title: 'BMW X3 2024',
      subtitle: 'para concesionarios',
      description:
        'Explora cada detalle del vehículo desde tu celular. Ve el interior, abre puertas y cambia colores en tiempo real.',
      accent: '#FF8FCF',
    },
  ];

  return (
    <section className='py-24 px-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold mb-4'>Ejemplos de Uso</h2>
          <p className='text-lg text-white/70 max-w-2xl mx-auto'>
            Descubre cómo diferentes industrias están usando Omnia para
            transformar sus ventas con Realidad Aumentada.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {examples.map((example, index) => (
            <div
              key={index}
              className='group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer flex flex-col h-full'
            >
              <div className='mb-6'>
                <div
                  className='inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4'
                  style={{
                    backgroundColor: `${example.accent}20`,
                    color: example.accent,
                  }}
                >
                  {example.category}
                </div>
                <h3 className='text-2xl font-bold mb-2'>{example.title}</h3>
                <p className='text-white/60 text-sm uppercase tracking-wide mb-4'>
                  {example.subtitle}
                </p>
              </div>

              <p className='text-white/80 leading-relaxed mb-6 flex-grow'>
                {example.description}
              </p>

              <div className='flex items-center gap-2 text-white/60 group-hover:text-white transition-colors mt-auto'>
                <span className='text-sm font-medium'>Ver Demo</span>
                <div
                  className='w-5 h-5 rounded-full flex items-center justify-center'
                  style={{ backgroundColor: example.accent }}
                >
                  <span className='text-black text-xs font-bold'>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='text-center mt-16'>
          <ButtonGradient size='lg'>Ver Todos los Ejemplos</ButtonGradient>
        </div>
      </div>
    </section>
  );
};

export default ExamplesSection;
