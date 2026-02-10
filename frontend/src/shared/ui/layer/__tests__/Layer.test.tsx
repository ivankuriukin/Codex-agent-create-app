import { render, screen } from '@testing-library/react';

import { Footer, Header, Main, Slider } from '../Layer';

describe('Layer', () => {
  it('renders sections', () => {
    render(
      <div>
        <Header>Header</Header>
        <Main>Main</Main>
        <Slider>Slider</Slider>
        <Footer>Footer</Footer>
      </div>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Slider')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
