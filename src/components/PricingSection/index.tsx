import { useState } from 'react';
import ButtonGradient from '@/components/ui/ButtonGradient';

interface Plan {
  name: string;
  price: string;
  features: string[];
  isPopular: boolean;
  subtitle?: string;
}

const PricingSection = () => {
  const [selectedHostingPlan, setSelectedHostingPlan] = useState<number>(1);
  const [selectedModelingPlan, setSelectedModelingPlan] = useState<number>(0);

  const hostingPlans = [
    {
      name: 'Básico',
      price: '$25 USD/mes',
      features: [
        'Hasta 5 modelos 3D',
        'Visor AR estándar',
        'Hosting incluido',
        'Soporte por email',
        '1GB de almacenamiento',
      ],
      isPopular: false,
    },
    {
      name: 'Pro',
      price: '$75 USD/mes',
      features: [
        'Hasta 25 modelos 3D',
        'Visor AR personalizado',
        'Analytics básico',
        'Soporte prioritario',
        '10GB de almacenamiento',
        'Custom domain',
      ],
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Modelos ilimitados',
        'White label completo',
        'API dedicada',
        'Soporte 24/7',
        'Almacenamiento ilimitado',
        'Integraciones avanzadas',
      ],
      isPopular: false,
    },
  ];

  const modelingPlans = [
    {
      name: 'Relevamiento + Modelado',
      price: 'Desde $75 USD',
      features: [
        'Modelado 3D profesional',
        'Texturas de alta calidad',
        'Optimización para AR',
        'Hasta 3 revisiones',
        'Entrega en 5 días hábiles',
      ],
      isPopular: true,
      subtitle: 'Por modelo 3D',
    },
  ];

  const renderPlanCard = (
    plan: Plan,
    index: number,
    isSelected: boolean,
    onSelect: (index: number) => void,
    service: string,
  ) => (
    <div
      key={`${service}-${index}`}
      onClick={() => onSelect(index)}
      className={`relative bg-white/5 backdrop-blur-md rounded-2xl border p-8 transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer ${
        isSelected
          ? 'border-[#A9FFB0] shadow-xl shadow-[#A9FFB0]/30 scale-105'
          : plan.isPopular
            ? 'border-[#00E0FF] shadow-lg shadow-[#00E0FF]/20'
            : 'border-white/10 hover:border-white/20'
      }`}
    >
      {plan.isPopular && (
        <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
          <span className='bg-gradient-to-r from-[#00E0FF] to-[#A9FFB0] text-black px-4 py-1 rounded-full text-sm font-semibold'>
            Más Popular
          </span>
        </div>
      )}

      <div className='text-center mb-8'>
        <h3 className='text-2xl font-bold mb-2'>{plan.name}</h3>
        {plan.subtitle && (
          <p className='text-white/60 text-sm mb-2'>{plan.subtitle}</p>
        )}
        <div className='text-3xl font-bold text-[#00E0FF] mb-4'>
          {plan.price}
        </div>
      </div>

      <ul className='space-y-4 mb-8'>
        {plan.features.map((feature: string, featureIndex: number) => (
          <li key={featureIndex} className='flex items-start gap-3'>
            <div className='w-5 h-5 bg-[#A9FFB0] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0'>
              <span className='text-black text-xs font-bold'>✓</span>
            </div>
            <span className='text-white/80'>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
          isSelected || plan.isPopular
            ? 'bg-gradient-to-r from-[#00E0FF] to-[#A9FFB0] text-black hover:opacity-90'
            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
        }`}
      >
        {isSelected
          ? '✓ Plan Seleccionado'
          : plan.price === 'Custom'
            ? 'Contactar'
            : 'Elegir Plan'}
      </button>
    </div>
  );

  return (
    <section className='py-24 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-20'>
          <h2 className='text-4xl font-bold mb-4'>Nuestros Servicios</h2>
          <p className='text-lg text-white/70 max-w-3xl mx-auto'>
            Elegí entre nuestros servicios de hosting para tus modelos 3D
            existentes o contrata nuestro servicio completo de relevamiento y
            modelado profesional.
          </p>
        </div>

        {/* Servicio 1: Hosting de modelos 3D */}
        <div className='mb-20'>
          <div className='text-center mb-12'>
            <h3 className='text-3xl font-bold mb-4'>Hosting de Modelos 3D</h3>
            <p className='text-lg text-white/60 max-w-2xl mx-auto'>
              Si ya tenés tus modelos 3D, nosotros los optimizamos y los
              hosteamos en nuestra plataforma AR.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {hostingPlans.map((plan, index) =>
              renderPlanCard(
                plan,
                index,
                selectedHostingPlan === index,
                setSelectedHostingPlan,
                'hosting',
              ),
            )}
          </div>
        </div>

        {/* Servicio 2: Relevamiento + Modelado 3D */}
        <div>
          <div className='text-center mb-12'>
            <h3 className='text-3xl font-bold mb-4'>
              Relevamiento + Modelado 3D Profesional
            </h3>
            <p className='text-lg text-white/60 max-w-2xl mx-auto'>
              Nuestro equipo se encarga de todo: desde el relevamiento hasta el
              modelo 3D final optimizado para AR.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-md mx-auto'>
            {modelingPlans.map((plan, index) =>
              renderPlanCard(
                plan,
                index,
                selectedModelingPlan === index,
                setSelectedModelingPlan,
                'modeling',
              ),
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className='text-center mt-16 pt-12 border-t border-white/10'>
          <h4 className='text-2xl font-bold mb-4'>
            ¿No estás seguro qué plan elegir?
          </h4>
          <p className='text-white/70 mb-6'>
            Hablemos sobre tu proyecto y te ayudamos a encontrar la mejor
            solución.
          </p>
          <ButtonGradient size='lg'>Consulta Gratis</ButtonGradient>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
