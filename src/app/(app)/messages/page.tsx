"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

interface Conversation {
    _id: string; // User ID of the other person
    name: string;
    email: string;
    image?: string;
    lastMessage: string;
    lastMessageTime: string;
    isRead: boolean;
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/messages");
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full p-10">
                <Loader2 className="animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 p-6">
            {/* Sidebar: Conversation List */}
            <div className="w-full md:w-1/3 rounded-xl overflow-hidden flex flex-col border border-border/50 dark:border-white/5 bg-card/80 dark:bg-white/5 backdrop-blur-xl">
                <div className="p-4 border-b border-border/50 dark:border-white/5">
                    <h2 className="text-xl font-bold font-headline">Messages</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            No conversations yet. Connect with someone to start chatting!
                        </div>
                    ) : (
                        <div className="divide-y divide-border/50 dark:divide-white/5">
                            {conversations.map((conv) => (
                                <Link
                                    key={conv._id}
                                    href={`/messages/${conv._id}`}
                                    className={`block p-4 hover:bg-secondary/50 dark:hover:bg-white/5 transition ${!conv.isRead ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={conv.image || "https://placehold.co/150"}
                                            alt={conv.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className={`text-sm font-medium truncate ${!conv.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {conv.name}
                                                </h3>
                                                {conv.lastMessageTime && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: false })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs truncate ${!conv.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                                                {conv.lastMessage || "Started a conversation"}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Area: Placeholder */}
            <div className="hidden md:flex flex-1 rounded-xl items-center justify-center text-muted-foreground border border-border/50 dark:border-white/5 bg-card/80 dark:bg-white/5 backdrop-blur-xl">
                Select a conversation to start chatting
            </div>
        </div>
    );
}
