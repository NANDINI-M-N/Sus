
import { Button } from '@/components/ui/button';

const SkipLink = () => {
  const skipToContent = () => {
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={skipToContent}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-tech-green text-dark-primary"
      onFocus={(e) => e.target.classList.remove('sr-only')}
      onBlur={(e) => e.target.classList.add('sr-only')}
    >
      Skip to main content
    </Button>
  );
};

export default SkipLink;
