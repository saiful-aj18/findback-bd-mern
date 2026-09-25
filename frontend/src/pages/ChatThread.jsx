import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../api/socket";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ChatThread() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("item") || undefined;
  const navigate = useNavigate();
  const { user: me } = useAuth();

  const [peer, setPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [peerRes, messagesRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/chat/${userId}`),
        ]);
        if (!ignore) {
          setPeer(peerRes.data.user);
          setMessages(messagesRes.data.messages || []);
        }
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Couldn't load this conversation.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [userId]);

  useEffect(() => {
    const socket = getSocket();
    const onNewMessage = (msg) => {
      if (String(msg.sender?._id) === String(userId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("newMessage", onNewMessage);
    return () => socket.off("newMessage", onNewMessage);
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    try {
      const { data } = await api.post(`/chat/${userId}`, { text: trimmed, item: itemId });
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      setError(err.response?.data?.message || "Message failed to send.");
      setText(trimmed);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="app-shell flex h-screen flex-col lg:max-w-2xl">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-gray-100 bg-white/95 px-3 py-2.5 backdrop-blur safe-top">
        <button
          onClick={() => navigate("/chat")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          aria-label="Back to chats"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {peer?.avatar ? (
            <img src={peer.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            peer?.fullName?.[0]?.toUpperCase() || "U"
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-gray-900">{peer?.fullName || "..."}</p>
          <p className="text-[11px] text-brand-600">Online</p>
        </div>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="space-y-3">
            <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-gray-100" />
            <div className="ml-auto h-10 w-2/3 animate-pulse rounded-2xl bg-brand-50" />
          </div>
        )}

        {!loading && error && messages.length === 0 && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-center text-sm text-rose-600">{error}</p>
        )}

        {!loading &&
          messages.map((m) => {
            const mine = String(m.sender?._id || m.sender) === String(me?._id);
            return (
              <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                    mine
                      ? "rounded-br-sm bg-brand-700 text-white"
                      : "rounded-bl-sm bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                  <div className={`mt-1 text-[10px] ${mine ? "text-brand-100" : "text-gray-400"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSend}
        className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-3 safe-bottom"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
