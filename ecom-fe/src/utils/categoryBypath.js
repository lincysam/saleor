export function categoryByPath(tree, fullPath) {
  const slugPath = fullPath.replace("/category/", "").split("/");

  let current = null;
  let breadcrumbs = [];

  slugPath.reduce((parentList, slug) => {
    const found = parentList.find(c => c.slug === slug);
    if (found) {
      current = found;
      breadcrumbs.push({
        label: found.name,
        path: `/category/${slugPath.slice(0, breadcrumbs.length + 1).join("/")}`
      });
      return found.subcategories;
    }
    return [];
  }, tree);

  return { category: current, breadcrumbs };
}
