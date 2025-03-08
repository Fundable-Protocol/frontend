"use client";

import React from "react";
import { useIsMounted } from "@/lib/hooks/useIsMounted";

interface WithIsMountedOptions {
  fallback?: React.ReactNode;
}

/**
 * A higher-order component that delays rendering of the wrapped component until after mount.
 *
 * @param WrappedComponent - The component to wrap.
 * @param options - Optional options, including a fallback UI.
 * @returns A new component that renders the fallback until mounted.
 */
function withIsMounted<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: WithIsMountedOptions
): React.FC<P> {
  const { fallback = <div>Loading...</div> } = options || {};

  const ComponentWithIsMounted: React.FC<P> = (props) => {
    const { isMounted } = useIsMounted();

    if (!isMounted) return <>{fallback}</>;

    return <WrappedComponent {...props} />;
  };

  ComponentWithIsMounted.displayName = `withIsMounted(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithIsMounted;
}

export default withIsMounted;
