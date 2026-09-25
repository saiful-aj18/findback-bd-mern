import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import AppLayout from "../components/AppLayout";
import TopBar from "../components/TopBar";
import { timeAgo } from "../utils/time";
import api from "../api/axios";

export default function ChatList() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Arrived here from an Item Details "Message" button — jump straight into
  // that thread instead of showing the conversation list.
  useEffect(() => {
    const withUser = params.get("with");
    if (withUser) {
      const item = params.get("item");
      navigate(`/chat/${withUser}${item ? `?item=${item}` : ""}`, { replace: true });
    }
  }, [params, navigate]);

  useEffect(() => {
    if (params.get("with")) return;
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/chat/conversations");
        if (!ignore) setConversations(data.conversations || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Couldn't load messages.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [params]);

  if (params.get("with")) return null;

  return (
    <AppLayout>
      <TopBar title="Chat" back />

      <div className="px-5 py-3">
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 px-4 py-14 text-center">
            <MessageCircle size={26} className="text-gray-300" />
            <p className="text-sm text-gray-400">
              No conversations yet. Message someone from an item's details page to start one.
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-1">
            {conversations.map((c) => (
              <Link
                key={c.user._id}
                to={`/chat/${c.user._id}`}
                className="flex items-center gap-3 rounded-2xl px-2 py-3 hover:bg-gray-50"
              >
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {c.user.avatar ? (
                    <img src={c.user.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    c.user.fullName?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-gray-900">{c.user.fullName}</p>
                    <span className="shrink-0 text-[11px] text-gray-400">{timeAgo(c.lastTime)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-gray-500">{c.lastMessage}</p>
                    {c.unread > 0 && (
                      <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
