import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import { CategoryCard } from "@/components/CategoryCard";
import { findCategoryByPath } from "@/data/categories";
import { Card, CardContent } from "@/components/ui/card";

const Category = () => {
  const { "*": pathMatch } = useParams();
  const fullPath = `/category/${pathMatch}`;
  
  const { category, breadcrumbs } = findCategoryByPath(fullPath);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Category not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <AppBreadcrumbs items={breadcrumbs.map(item => ({ label: item.label, to: item.path }))} className="mb-6" />

        {category.subcategories && category.subcategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.subcategories.map((subcat) => (
              <CategoryCard
                key={subcat.id}
                name={subcat.name}
                path={subcat.path}
                image={subcat.image}
                itemCount={subcat.subcategories?.length}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">Product {item}</h3>
                    <p className="text-lg font-bold text-primary">$99.99</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="text-sm text-muted-foreground">(128)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
