import { render, screen } from '@testing-library/react';

import { TelegramIcon } from '../TelegramIcon';
import { TelegramLoginButton } from '../TelegramLoginButton';
import { TelegramLoginWidget } from '../TelegramLoginWidget';

describe('Telegram', () => {
  it('renders components', () => {
    const { container } = render(
      <div>
        <TelegramIcon />
        <TelegramLoginButton redirectPath="/" />
        <TelegramLoginWidget redirectPath="/" />
      </div>,
    );
    expect(container.querySelector('svg')).toBeTruthy();
    expect(screen.getByText('Login with Telegram')).toBeInTheDocument();
    expect(container.querySelector('div')).toBeTruthy();
  });
});
