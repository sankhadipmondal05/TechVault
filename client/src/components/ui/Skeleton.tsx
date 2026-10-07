import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-shimmer rounded-md', className)}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl neu-card p-4 space-y-4">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-6 w-5/6 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>
      <div className="pt-2 flex justify-between items-center border-t border-border/50">
        <Skeleton className="h-4 w-1/4 rounded" />
        <Skeleton className="h-4 w-1/4 rounded" />
      </div>
    </div>
  );
};
