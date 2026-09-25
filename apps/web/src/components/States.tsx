import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-navy-500">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-16 text-center">
      <p className="text-lg font-medium text-red-700">Something went wrong</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>
      <p className="mt-4 text-lg font-medium text-navy-900">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
}
