import React from 'react';
import { render } from '@testing-library/react';

const AllTheProviders = (props: { children: React.ReactNode }) => {
  return <div>{props.children}</div>;
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
