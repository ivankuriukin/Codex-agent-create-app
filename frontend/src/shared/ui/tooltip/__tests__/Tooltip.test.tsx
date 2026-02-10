import { render, screen } from '@testing-library/react';
import { render, screen } from '@testing-library/react';

import { Tooltip, TooltipTrigger } from '../Tooltip';

describe('Tooltip', () => {
  it('renders trigger', () => {
    render(
      <TooltipTrigger tooltip={<Tooltip>Tip</Tooltip>}>
        <button type="button">Hover</button>
      </TooltipTrigger>,
    );
    expect(screen.getByText('Hover')).toBeInTheDocument();
  });
});
