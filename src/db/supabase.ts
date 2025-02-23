import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        async setAll(cookiesToSet) {
          try {
            const resolvedCookiesStore = await cookieStore;

            for (const { name, value, options } of cookiesToSet) {
              resolvedCookiesStore.set(name, value, options);
            }
          } catch (error) {
            console.error('Error setting cookies:', error);
          }
        },
      },
    },
  );
};
