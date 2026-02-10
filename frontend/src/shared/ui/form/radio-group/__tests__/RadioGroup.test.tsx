import { render, screen } from '@testing-library/react';

import { Radio, RadioGroup } from '../RadioGroup';

describe('RadioGroup', () => {
  it('renders options', () => {
    render(
      <RadioGroup label="Role">
        <Radio value="one">One</Radio>
      </RadioGroup>,
    );
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('One')).toBeInTheDocument();
  });
});
