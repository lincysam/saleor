export function transformSaleorCategory(node) {
  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    level: node.level,
    parentId: node.parent?.id || null,
    childrenRaw: node.children?.edges?.map(e => e.node) || []
  };
}

export function buildCategoryTree(categories) {
  const map = new Map();
  
  // Initialize all
  categories.forEach(cat => {
    map.set(cat.id, { ...cat, subcategories: [] });
  });

  let roots = [];

  // Link children to parents
  categories.forEach(cat => {
    if (cat.parentId) {
      map.get(cat.parentId).subcategories.push(map.get(cat.id));
    } else {
      roots.push(map.get(cat.id)); // level 0
    }
  });

  return roots;
}
