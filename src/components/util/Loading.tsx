// Properties accepted by the loading component.
type LoadingProps = {
  
  // Optional loading message displayed to the user.
  label?: string;
};

// Reusable loading component displayed during async operations.
export const Loading = ({
  label = "Loading...",
}: LoadingProps) => (
  
  // Loading message container.
  <div className="rounded-2xl border border-stone-200 bg-white px-4 py-6 text-center text-sm text-stone-500 shadow-sm">
    
    {/* Loading message text */}
    {label}
  </div>
);