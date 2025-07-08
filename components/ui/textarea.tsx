import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Ajoutez ici d'autres props personnalisées si besoin
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={
          'border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
          (className || '')
        }
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea'; 