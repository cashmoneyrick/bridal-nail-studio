import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface ReviewSectionProps {
  icon: string;
  title: string;
  summary: string;
  onEdit: () => void;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  value: string;
}

export const ReviewSection = ({
  icon,
  title,
  summary,
  onEdit,
  children,
  value,
}: ReviewSectionProps) => {
  return (
    <AccordionItem value={value} className="border border-border rounded-lg overflow-hidden bg-card w-full">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 min-h-[56px] w-full">
        <div className="flex items-start gap-3 text-left flex-1 min-w-0 overflow-hidden">
          <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="font-semibold text-foreground text-base">{title}</p>
            <p className="text-sm text-muted-foreground truncate max-w-full">{summary}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-4 pb-4 pt-2 space-y-4">
          {children}
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="w-full min-h-[44px] text-sm font-medium"
          >
            Edit {title}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ReviewSection;
