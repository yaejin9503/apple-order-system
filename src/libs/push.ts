import webpush from "web-push";
import { createAdminClient } from "@/src/libs/supabase/admin";

let configured = false;

function configure() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

  if (!publicKey || !privateKey) {
    throw new Error("VAPID 환경변수가 설정되지 않았습니다.");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export async function sendPushToAll(payload: PushPayload) {
  configure();
  const supabase = createAdminClient();
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (error) {
    console.error("구독 조회 실패:", error);
    return { sent: 0, failed: 0 };
  }

  if (!subs || subs.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const payloadStr = JSON.stringify(payload);
  let sent = 0;
  let failed = 0;
  const staleEndpoints: string[] = [];

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payloadStr,
        );
        sent++;
      } catch (err: any) {
        failed++;
        // 410 Gone / 404 Not Found = 구독이 만료되었거나 사용자가 권한을 해제함
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          staleEndpoints.push(sub.endpoint);
        } else {
          console.error("푸시 전송 실패:", err?.statusCode, err?.body);
        }
      }
    }),
  );

  if (staleEndpoints.length > 0) {
    await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", staleEndpoints);
  }

  return { sent, failed };
}
