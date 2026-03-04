import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { useRef, useEffect, useState } from 'react';

interface ExtrasSectionProps {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
}

export function ExtrasSection({ id, title, subtitle, icon, badge, children }: ExtrasSectionProps) {
  const { expandedExtra, setExpandedExtra } = useCustomStudioStore();
  const isOpen = expandedExtra === id;
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isOpen]);

  const toggle = () => {
    setExpandedExtra(isOpen ? null : id);
  };

  return (
    <div ref={sectionRef} className="scroll-mt-24">
      <div
        className={cn(
          'border rounded-2xl transition-colors duration-200',
          isOpen ? 'border-primary/30 bg-card' : 'border-border bg-card hover:border-primary/20'
        )}
      >
        {/* Header - always visible */}
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 p-4 md:p-5 text-left"
        >
          <div className={cn(
            'p-2 rounded-xl transition-colors shrink-0',
            isOpen ? 'bg-primary/10' : 'bg-muted'
          )}>
            <div className={cn(
              'w-5 h-5',
              isOpen ? 'text-primary' : 'text-muted-foreground'
            )}>
              {icon}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{title}</h3>
              {badge && !isOpen && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            {!isOpen && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>

          <ChevronDown className={cn(
            'w-5 h-5 text-muted-foreground transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180'
          )} />
        </button>

        {/* Content */}
        {isOpen && (
          <div className="px-4 pb-5 md:px-5 md:pb-6 pt-1">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtrasSection;
