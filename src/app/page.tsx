'use client';

import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import type { Session } from 'next-auth';
import PricingSection from '@/components/PricingSection';
import ExamplesSection from '@/components/ExamplesSection';
import ButtonGradient from '@/components/ui/ButtonGradient';
import ButtonSecondary from '@/components/ui/ButtonSecondary';
import { useARCompatibility } from '@/hooks/useARCompatibility';

export default function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { isARSupported, supportMessage } = useARCompatibility();

  // Extract first name from session
  const getFirstName = (session: Session | null) => {
    if (!session?.user?.name)
      return session?.user?.email?.split('@')[0] || 'Usuario';
    return session.user.name.split(' ')[0];
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] text-white font-sans'>
      {/* Navigation */}
      <nav className='border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4'>
          <div className='flex justify-between items-center gap-2'>
            <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-white'>
              Omnia
            </h1>
            <div className='flex items-center gap-2 sm:gap-4'>
              {session ? (
                <>
                  <span className='text-white/80 text-sm sm:text-base hidden sm:inline'>
                    Hola, {getFirstName(session)}!
                  </span>
                  <span className='text-white/80 text-sm sm:hidden'>
                    {getFirstName(session)}
                  </span>
                  <ButtonGradient
                    size='sm'
                    className='sm:px-6 sm:py-3'
                    onClick={() => router.push('/dashboard')}
                  >
                    <span className='hidden sm:inline'>Ver Dashboard</span>
                    <span className='sm:hidden'>Dashboard</span>
                  </ButtonGradient>
                </>
              ) : (
                <ButtonSecondary
                  variant='outline'
                  size='sm'
                  className='sm:px-6 sm:py-3'
                  onClick={() => signIn()}
                >
                  Login
                </ButtonSecondary>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className='relative py-12 sm:py-20 lg:py-24 px-3 sm:px-6'>
        <div className='max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl'>
          <div className='inline-block text-xs sm:text-sm uppercase tracking-widest text-white/80 mb-4 sm:mb-6'>
            🚀 Realidad Aumentada Sin Apps
          </div>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6'>
            Muestra tus productos en{' '}
            <span className='text-[#00E0FF]'>Realidad Aumentada</span>
          </h2>
          <p className='text-base sm:text-lg text-white/70 mb-6 sm:mb-8 px-2'>
            Omnia convierte tus productos físicos en experiencias AR nativas
            para iOS y Android. Sin apps, sin descargas. Compartí un link y tus
            clientes verán tus productos en 3D.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
            {isARSupported ? (
              <ButtonGradient size='lg'>Solicitar Demo Gratis</ButtonGradient>
            ) : (
              <ButtonSecondary size='lg' variant='subtle' disabled>
                {supportMessage}
              </ButtonSecondary>
            )}
            <ButtonSecondary
              size='lg'
              variant='outline'
              onClick={() => {
                const examplesSection = document.getElementById('ejemplos');
                examplesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Ejemplos
            </ButtonSecondary>
          </div>
          <p className='mt-4 sm:mt-6 text-xs sm:text-sm text-white/60'>
            Más de 100+ empresas ya usan Omnia para sus productos
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className='py-12 sm:py-20 lg:py-24 px-3 sm:px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4'>
            ¿Cómo funciona?
          </h3>
          <p className='text-base sm:text-lg text-white/70 mb-8 sm:mb-12 px-2'>
            En solo 3 pasos, tus productos estarán disponibles en Realidad
            Aumentada.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8'>
            <div className='bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 hover:scale-105 transition-all duration-300'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#00E0FF] to-[#A9FFB0] rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto'>
                <span className='text-black text-lg sm:text-xl font-bold'>
                  1
                </span>
              </div>
              <h4 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center'>
                Subís tu producto
              </h4>
              <p className='text-white/70 text-center leading-relaxed text-sm sm:text-base'>
                Envianos fotos o el modelo 3D. Nosotros lo modelamos
                profesionalmente si es necesario.
              </p>
            </div>
            <div className='bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 hover:scale-105 transition-all duration-300'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#00E0FF] to-[#A9FFB0] rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto'>
                <span className='text-black text-lg sm:text-xl font-bold'>
                  2
                </span>
              </div>
              <h4 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center'>
                Obtenés tu link
              </h4>
              <p className='text-white/70 text-center leading-relaxed text-sm sm:text-base'>
                Te damos un link único que funciona en cualquier dispositivo
                (iOS 12+ / Android 8+).
              </p>
            </div>
            <div className='bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 hover:scale-105 transition-all duration-300'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#00E0FF] to-[#A9FFB0] rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto'>
                <span className='text-black text-lg sm:text-xl font-bold'>
                  3
                </span>
              </div>
              <h4 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center'>
                Tus clientes interactúan
              </h4>
              <p className='text-white/70 text-center leading-relaxed text-sm sm:text-base'>
                Ellos ven tu producto en 3D, lo rotan, lo escalan y lo
                visualizan en su entorno real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />
      <div id='ejemplos'>
        <ExamplesSection />
      </div>

      {/* Consulta Gratis */}
      <section className='py-12 sm:py-16 lg:py-20 px-3 sm:px-6'>
        <div className='max-w-3xl mx-auto text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8'>
          <h3 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4'>
            ¿No estás seguro si AR es para tu negocio?
          </h3>
          <p className='text-sm sm:text-base text-white/70 mb-6 px-2'>
            Conversemos sin compromiso. Te explicamos cómo funciona AR para tu
            industria específica.
          </p>
          <ButtonSecondary size='lg' variant='outline' className='px-6 sm:px-8'>
            📞 Consulta Gratis (15 min)
          </ButtonSecondary>
        </div>
      </section>

      {/* CTA */}
      <section className='py-12 sm:py-20 lg:py-24 bg-[#111] border-t border-white/10 px-3 sm:px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4'>
            ¿Listo para probar Omnia?
          </h3>
          <p className='text-base sm:text-lg text-white/70 mb-6 px-2'>
            En solo <span className='text-[#A9FFB0] font-semibold'>48hs</span>{' '}
            podés tener tu primer producto en AR online.
          </p>
          {isARSupported ? (
            <ButtonGradient
              size='lg'
              className='px-8 sm:px-12 py-4 sm:py-5 animate-pulse hover:animate-none'
            >
              Solicitar Demo Gratis
            </ButtonGradient>
          ) : (
            <ButtonSecondary
              size='lg'
              variant='subtle'
              className='px-8 sm:px-12 py-4 sm:py-5'
              disabled
            >
              {supportMessage}
            </ButtonSecondary>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 border-t border-white/10 text-center text-white/50 text-sm'>
        Omnia — Realidad Aumentada Sin Apps © 2024
      </footer>
    </div>
  );
}
