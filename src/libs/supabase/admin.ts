import { createClient } from "@supabase/supabase-js";

// 서버 전용 service_role 클라이언트 (RLS 우회).
// 클라이언트에 노출되면 안 되므로 API 라우트 안에서만 사용할 것.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase service_role 환경변수가 설정되지 않았습니다. (SUPABASE_SERVICE_ROLE_KEY)",
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
