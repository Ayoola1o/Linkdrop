import { redirect } from 'next/navigation';

export default function HomePage() {
  // The actual feed content is in (main)/page.tsx
  // This root page.tsx just redirects to it if needed,
  // or Next.js might handle (main)/page.tsx as the root automatically.
  // For explicit routing, let's redirect.
  // However, Next.js App Router with route groups: (main)/page.tsx will serve content for '/'.
  // So, this file might not be strictly necessary if (main)/page.tsx is the intended root.
  // Let's keep it simple: (main)/page.tsx is the effective root.
  // This file can be empty or provide a very minimal loading/redirect state if there was complex logic.
  // For now, an empty component is fine as (main)/page.tsx should render at '/'.
  return null; 
}
