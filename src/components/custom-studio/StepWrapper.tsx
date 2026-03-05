interface StepWrapperProps {
  children: React.ReactNode;
  onBack?: () => void;
}

export function StepWrapper({ children, onBack }: StepWrapperProps) {
  return (
    <div className="w-full max-w-lg mx-auto px-5 py-10">
      {onBack && (
        <button
          onClick={onBack}
          className="font-studio-body text-sm text-studio-taupe hover:text-foreground transition-colors duration-200 mb-8"
        >
          &larr; Back
        </button>
      )}
      {children}
    </div>
  );
}

export default StepWrapper;
