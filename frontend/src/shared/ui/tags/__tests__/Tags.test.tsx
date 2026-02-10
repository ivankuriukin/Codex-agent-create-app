import { render, screen } from '@testing-library/react';

import { Tag, Tags } from '../Tags';

describe('Tags', () => {
  it('renders tags', () => {
    render(
      <Tags>
        <Tag>One</Tag>
        <Tag>Two</Tag>
      </Tags>,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
