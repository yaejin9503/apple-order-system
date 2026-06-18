"use client";

import { Bell, BellOff } from "lucide-react";
import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

type Status = "checking" | "unsupported" | "denied" | "subscribed" | "off";

export default function PushSubscribeButton() {
  const [status, setStatus] = useState<Status>("checking");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    setStatus(sub ? "subscribed" : "off");
  };

  useEffect(() => {
    refresh();
  }, []);

  const subscribe = async () => {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        alert("VAPID 공개키가 설정되지 않았습니다.");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const subJson = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          userAgent: navigator.userAgent,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        alert(`구독 저장 실패: ${data.error}`);
        await sub.unsubscribe();
        return;
      }
      setStatus("subscribed");
    } catch (err) {
      console.error(err);
      alert(`알림 구독 실패: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  const unsubscribe = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus("off");
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  if (status === "checking") return null;

  if (status === "unsupported") {
    return (
      <div className="text-xs text-gray-500 px-3 py-2">
        이 브라우저는 웹푸시를 지원하지 않습니다.
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="text-xs text-red-600 font-bold px-3 py-2">
        알림이 차단됨 — 브라우저 설정에서 허용해주세요.
      </div>
    );
  }

  const isOn = status === "subscribed";
  return (
    <button
      onClick={isOn ? unsubscribe : subscribe}
      disabled={busy}
      className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-full text-sm font-bold transition-colors disabled:opacity-50 ${
        isOn
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-white border-2 border-gray-300 text-gray-700 hover:border-green-400"
      }`}
    >
      {isOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
      <span className="hidden sm:inline">
        {isOn ? "알림 ON" : "알림 받기"}
      </span>
    </button>
  );
}
