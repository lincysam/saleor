// components/checkout/sections/CheckoutForm/CollapseSection.tsx
import React from "react";

interface CollapseSectionProps {
  children: React.ReactNode;
  collapse: boolean;
}

export const CollapseSection: React.FC<CollapseSectionProps> = ({ children, collapse }) => {
  if (collapse) {
    return null;
  }

  return <>{children}</>;
};