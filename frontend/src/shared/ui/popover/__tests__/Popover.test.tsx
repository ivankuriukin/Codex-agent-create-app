import { render, screen } from '@testing-library/react';
import { useRef } from 'react';

import { Popover } from '../Popover';

function Example() {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <button ref={ref} type="button">
        Trigger
      </button>
      <Popover isOpen onClose={() => {}} triggerRef={ref}>
        Popover content
      </Popover>
    </div>
  );
}

describe('Popover', () => {
  it('renders content', () => {
    render(<Example />);
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });
});
