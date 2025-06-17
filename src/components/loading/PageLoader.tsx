
import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  text?: string;
}

const PageLoader = ({ text = "Loading..." }: PageLoaderProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary">
      <div className="text-center">
        <LoadingSpinner size="xl" text={text} />
      </div>
    </div>
  );
};

export default PageLoader;
