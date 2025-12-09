import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Category } from '@/redux/product/product.types';

interface AllCategoriesViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

export const AllCategoriesView = ({ open, onOpenChange, categories }: AllCategoriesViewProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full p-0 flex flex-col">
        <SheetHeader className="border-b px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <SheetTitle className="text-lg">All Categories</SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="py-2">
            {categories.map((category) => {
              const catExpanded = expandedCategories.includes(category.id);
              const hasSubcategories = category.subcategories && category.subcategories.length > 0;

              return (
                <div key={category.id} className="border-b border-border/30 last:border-0">
                  <Collapsible open={catExpanded} onOpenChange={() => toggleCategory(category.id)}>
                    <div className="flex items-center">
                      {hasSubcategories ? (
                        <CollapsibleTrigger className="flex-1 flex items-center justify-between px-4 py-4 hover:bg-muted/50 active:bg-muted transition-colors text-left">
                          <span className="text-sm font-medium text-foreground">{category.name}</span>
                          <ChevronRight
                            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                              catExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </CollapsibleTrigger>
                      ) : (
                        <Link
                          to={`/category/${category.id}`}
                          className="flex-1 px-4 py-4 hover:bg-muted/50 active:bg-muted transition-colors block"
                          onClick={handleLinkClick}
                        >
                          <span className="text-sm font-medium text-foreground">{category.name}</span>
                        </Link>
                      )}
                    </div>

                    {hasSubcategories && (
                      <CollapsibleContent>
                        <div className="bg-muted/30">
                          {category.subcategories!.map((sub) => {
                            const subExpanded = expandedSubcategories.includes(sub.id);
                            const hasNestedSubs = sub.subcategories && sub.subcategories.length > 0;

                            return (
                              <div key={sub.id} className="border-b border-border/20 last:border-0">
                                <Collapsible open={subExpanded} onOpenChange={() => toggleSubcategory(sub.id)}>
                                  <div className="flex items-center">
                                    {hasNestedSubs ? (
                                      <CollapsibleTrigger className="flex-1 flex items-center justify-between px-6 py-3 hover:bg-muted/50 active:bg-muted transition-colors text-left">
                                        <span className="text-sm text-foreground/90">{sub.name}</span>
                                        <ChevronRight
                                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                                            subExpanded ? 'rotate-90' : ''
                                          }`}
                                        />
                                      </CollapsibleTrigger>
                                    ) : (
                                      <Link
                                        to={`/category/${category.id}/${sub.id}`}
                                        className="flex-1 px-6 py-3 hover:bg-muted/50 active:bg-muted transition-colors block"
                                        onClick={handleLinkClick}
                                      >
                                        <span className="text-sm text-foreground/90">{sub.name}</span>
                                      </Link>
                                    )}
                                  </div>

                                  {hasNestedSubs && (
                                    <CollapsibleContent>
                                      <div className="bg-muted/40">
                                        {sub.subcategories!.map((nestedSub) => (
                                          <Link
                                            key={nestedSub.id}
                                            to={`/category/${category.id}/${sub.id}/${nestedSub.id}`}
                                            className="block px-8 py-3 hover:bg-muted/50 active:bg-muted transition-colors"
                                            onClick={handleLinkClick}
                                          >
                                            <span className="text-sm text-foreground/80">{nestedSub.name}</span>
                                          </Link>
                                        ))}
                                      </div>
                                    </CollapsibleContent>
                                  )}
                                </Collapsible>
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
