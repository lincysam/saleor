export interface Category {
  id: string;
  name: string;
  path: string;
  image: string;
  subcategories?: Category[];
}

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    path: "/category/electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    subcategories: [
      {
        id: "smartphones",
        name: "Smartphones & Accessories",
        path: "/category/electronics/smartphones",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
        subcategories: [
          {
            id: "iphones",
            name: "iPhones",
            path: "/category/electronics/smartphones/iphones",
            image: "https://images.unsplash.com/photo-1592286927505-2c1e6d8f5b81?w=400&h=400&fit=crop"
          },
          {
            id: "android",
            name: "Android Phones",
            path: "/category/electronics/smartphones/android",
            image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop"
          },
          {
            id: "cases",
            name: "Phone Cases & Covers",
            path: "/category/electronics/smartphones/cases",
            image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop"
          }
        ]
      },
      {
        id: "laptops",
        name: "Laptops & Computers",
        path: "/category/electronics/laptops",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop"
      },
      {
        id: "audio",
        name: "Audio & Headphones",
        path: "/category/electronics/audio",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
      }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    path: "/category/fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
    subcategories: [
      {
        id: "mens",
        name: "Men's Clothing",
        path: "/category/fashion/mens",
        image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=400&fit=crop"
      },
      {
        id: "womens",
        name: "Women's Clothing",
        path: "/category/fashion/womens",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop"
      }
    ]
  },
  {
    id: "home",
    name: "Home & Kitchen",
    path: "/category/home",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop"
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    path: "/category/sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop"
  }
];

export const findCategoryByPath = (path: string): { category: Category | null; breadcrumbs: Array<{ label: string; path: string }> } => {
  const pathParts = path.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; path: string }> = [];
  
  let currentCategories = categories;
  let category: Category | null = null;
  let currentPath = '';
  
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i] === 'category') continue;
    
    const found = currentCategories.find(cat => cat.id === pathParts[i]);
    if (found) {
      currentPath = found.path;
      breadcrumbs.push({ label: found.name, path: currentPath });
      category = found;
      currentCategories = found.subcategories || [];
    }
  }
  
  return { category, breadcrumbs };
};
