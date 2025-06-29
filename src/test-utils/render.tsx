import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

export function render(ui: React.ReactNode) {
  return rtlRender(<>{ui}</>, {
    wrapper: (props: React.PropsWithChildren) => (
      <ChakraProvider value={defaultSystem}>{props.children}</ChakraProvider>
    ),
  });
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
