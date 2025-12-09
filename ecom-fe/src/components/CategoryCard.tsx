import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  path: string;
  image: string;
  itemCount?: number;
}

export const CategoryCard = ({ name, path, image, itemCount }: CategoryCardProps) => {
  return (
    <Link to={path}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden bg-muted">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold" style={{ fontSize: 'var(--text-base)' }}>{name}</h3>
                {itemCount && (
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 'var(--text-sm)' }}>{itemCount} items</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
