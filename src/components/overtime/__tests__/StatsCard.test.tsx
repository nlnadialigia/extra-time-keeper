import { render, screen } from '@testing-library/react';
import { StatsCard } from '@/components/overtime/StatsCard';
import { Clock } from 'lucide-react';

describe('StatsCard', () => {
  const defaultProps = {
    title: 'Test Title',
    value: '8h 30min',
    subtitle: 'Test subtitle',
    icon: Clock,
    variant: 'extra' as const,
  };

  it('renders title and value correctly', () => {
    render(<StatsCard {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('8h 30min')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('applies negative styling when isNegative is true', () => {
    render(<StatsCard {...defaultProps} isNegative={true} />);
    
    const subtitle = screen.getByText('Test subtitle');
    expect(subtitle).toHaveClass('text-red-600', 'font-bold');
  });

  it('does not apply negative styling when isNegative is false', () => {
    render(<StatsCard {...defaultProps} isNegative={false} />);
    
    const subtitle = screen.getByText('Test subtitle');
    expect(subtitle).not.toHaveClass('text-red-600');
  });
});
