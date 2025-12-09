// components/checkout/sections/DeliveryMethods/DeliveryMethodsSkeleton.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const DeliveryMethodsSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);