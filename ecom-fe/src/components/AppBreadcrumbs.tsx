import { Link } from "react-router-dom";
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export interface CrumbItem {
  label: string;
  to?: string;
}

interface AppBreadcrumbsProps {
  items: CrumbItem[];
  className?: string;
}

const AppBreadcrumbs = ({ items, className }: AppBreadcrumbsProps) => {
  return (
    <UIBreadcrumb aria-label="Breadcrumb" className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, idx) => (
          <span key={`${item.label}-${idx}`} className="inline-flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.to && idx !== items.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={item.to}>{item.label}</Link>
                </BreadcrumbLink>
              ) : idx === items.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.to || "#"}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </UIBreadcrumb>
  );
};

export default AppBreadcrumbs;
