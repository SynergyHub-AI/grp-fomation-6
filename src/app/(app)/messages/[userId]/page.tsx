"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

interface Message {
    _id: string;
    sender: string;
    content: string;
    createdAt: string;
}

interface UserProfile {
    _id: string;
    name: string;
    image?: string;
    jobTitle?: string;
}

export default function ChatPage() {
    const params = useParams();
    const userId = params.userId as string;
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // @ts-ignore
    const currentUserId = session?.user?.id || session?.user?._id;

    useEffect(() => {
        fetchChatHistory();
        // Fetch Basic User Details (Optional: Can be optimized)
        fetch(`/api/users/${userId}`).then(res => res.json()).then(data => setOtherUser(data));

        // Polling for new messages every 3 seconds
        const interval = setInterval(fetchChatHistory, 3000);
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChatHistory = async () => {
        try {
            const res = await fetch(`/api/messages/${userId}`);
            if (res.ok) {
                const data = await res.json();
                // Check if messages actually changed to avoid unnecessary re-renders/scrolls
                // Simplest way is comparison of length or last ID, but React state setter with same object ref won't trigger re-render anyway.
                // However, fetching creates new objects.
                // For now, just set it.
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Failed to fetch chat", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const tempContent = newMessage;
        setNewMessage(""); // Optimistic clear

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipientId: userId, content: tempContent }),
            });

            if (res.ok) {
                fetchChatHistory();
            } else {
                setNewMessage(tempContent); // Restore on error
            }
        } catch (error) {
            setNewMessage(tempContent);
            console.error("Failed to send", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!currentUserId) return null;

    return (
        <div className="h-[calc(100vh-100px)] max-w-4xl mx-auto flex flex-col md:flex-row gap-6 p-6">
            {/* Mobile: Back Button / Header */}
            <div className="md:hidden flex items-center gap-4 mb-4">
                <Link href="/messages" className="p-2 bg-secondary rounded-lg">
                    <ArrowLeft size={20} className="text-foreground" />
                </Link>
                {otherUser && <span className="text-foreground font-bold">{otherUser.name}</span>}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 rounded-xl flex flex-col overflow-hidden border border-border/50 dark:border-white/5 bg-card/80 dark:bg-white/5 backdrop-blur-xl">

                {/* Header */}
                <div className="p-4 border-b border-border/50 dark:border-white/5 bg-card/50 flex items-center gap-3">
                    {otherUser ? (
                        <>
                            <Image
                                src={otherUser.image || "https://placehold.co/150"}
                                alt={otherUser.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                                unoptimized
                            />
                            <div>
                                <h2 className="text-foreground font-semibold">{otherUser.name}</h2>
                                <p className="text-xs text-muted-foreground">{otherUser.jobTitle}</p>
                            </div>
                        </>
                    ) : (
                        <div className="h-10 w-32 bg-secondary animate-pulse rounded"></div>
                    )}
                </div>

                {/* Messages List */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent/20">
                    {loading && messages.length === 0 ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-full">
                            <p className="mb-2">No messages yet.</p>
                            <p className="text-sm">Say hello to start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender === currentUserId;
                            return (
                                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${isMe
                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                        : 'bg-secondary text-secondary-foreground rounded-bl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-border/50 dark:border-white/5 bg-card/50 flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-secondary/50 border border-border/50 text-foreground rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </form>

            </div>
        </div>
    );
}
