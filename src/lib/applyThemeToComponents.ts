/**
 * Utility functions to apply the candidate dashboard theme to components
 * This file contains functions to replace common color classes with the candidate dashboard theme colors
 */

// Map of old color classes to new color classes
const colorMap = {
  // Background colors
  'bg-gray-900': 'bg-dark-primary',
  'bg-gray-800': 'bg-dark-secondary',
  'bg-gray-700': 'bg-border-dark',
  
  // Border colors
  'border-gray-700': 'border-border-dark',
  'border-gray-600': 'border-border-dark',
  
  // Text colors
  'text-gray-300': 'text-text-secondary',
  'text-gray-400': 'text-text-secondary',
  
  // Button colors
  'bg-blue-600': 'bg-emerald-green',
  'hover:bg-blue-700': 'hover:bg-green-dark',
  
  // Other common colors
  'text-blue-500': 'text-emerald-green',
  'hover:text-blue-400': 'hover:text-emerald-green',
  'hover:border-blue-500': 'hover:border-emerald-green',
};

/**
 * Replace color classes in a className string
 * @param className - The original className string
 * @returns The updated className string with candidate dashboard theme colors
 */
export function applyThemeToClassName(className: string): string {
  if (!className) return '';
  
  let updatedClassName = className;
  
  // Replace each old color class with its new equivalent
  Object.entries(colorMap).forEach(([oldClass, newClass]) => {
    updatedClassName = updatedClassName.replace(new RegExp(oldClass, 'g'), newClass);
  });
  
  return updatedClassName;
}

/**
 * Apply theme to a React component's props
 * @param props - The component props
 * @returns The updated props with candidate dashboard theme colors
 */
export function applyThemeToProps<T extends { className?: string }>(props: T): T {
  if (!props.className) return props;
  
  return {
    ...props,
    className: applyThemeToClassName(props.className)
  };
}

/**
 * Higher-order component to apply the candidate dashboard theme
 * @param Component - The component to wrap
 * @returns A new component with the candidate dashboard theme applied
 */
export function withCandidateDashboardTheme<T extends { className?: string }>(
  Component: React.ComponentType<T>
): React.FC<T> {
  return (props: T) => {
    const themedProps = applyThemeToProps(props);
    return <Component {...themedProps} />;
  };
} 