"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, UserPlus, MessageSquare } from "lucide-react";

interface ConnectionRequest {
    _id: string;
    sender: { _id: string; name: string; email: string; image?: string; jobTitle?: string };
    recipient: { _id: string; name: string; email: string; image?: string; jobTitle?: string };
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
}

export default function NetworkPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConnections();
    }, [session]);

    const fetchConnections = async () => {
        try {
            const res = await fetch("/api/connections");
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests);
            }
        } catch (error) {
            console.error("Failed to fetch connections", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (requestId: string, action: "accept" | "reject") => {
        try {
            const res = await fetch("/api/connections/respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, action }),
            });

            if (res.ok) {
                fetchConnections(); // Refresh list
            }
        } catch (error) {
            console.error("Failed to respond", error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading network...</div>;
    }

    // Filter requests
    // @ts-ignore
    const myId = session?.user?.id || session?.user?._id;

    const pendingRequests = requests.filter(
        (req) => req.status === "pending" && req.recipient._id === myId
    );

    const myConnections = requests.filter(
        (req) => req.status === "accepted"
    );

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">My Network</h1>

            {/* Pending Invitations */}
            {pendingRequests.length > 0 && (
                <div className="rounded-2xl border border-border/50 dark:border-white/5 bg-card/80 dark:bg-white/5 p-6 backdrop-blur-xl shadow-sm">
                    <h2 className="text-xl font-semibold font-headline mb-4">Invitations</h2>
                    <div className="space-y-4">
                        {pendingRequests.map((req) => (
                            <div key={req._id} className="flex items-center justify-between bg-secondary/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 dark:border-white/5 hover:border-primary/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={req.sender.image || "https://placehold.co/150"}
                                        alt={req.sender.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover border-2 border-border/50"
                                    />
                                    <div>
                                        <h3 className="font-medium text-foreground">{req.sender.name}</h3>
                                        <p className="text-sm text-muted-foreground">{req.sender.jobTitle || "No Title"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleResponse(req._id, "accept")}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-lg shadow-blue-500/20"
                                        title="Accept"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleResponse(req._id, "reject")}
                                        className="p-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-full transition"
                                        title="Ignore"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Accepted Connections */}
            <div className="rounded-2xl border border-border/50 dark:border-white/5 bg-card/80 dark:bg-white/5 p-6 backdrop-blur-xl shadow-sm">
                <h2 className="text-xl font-semibold font-headline mb-4">Your Connections ({myConnections.length})</h2>

                {myConnections.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>You don't have any connections yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myConnections.map((req) => {
                            const otherUser = req.sender._id === myId ? req.recipient : req.sender;
                            return (
                                <div key={req._id} className="flex items-center justify-between bg-secondary/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 dark:border-white/5 hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/profile/${otherUser._id}`}>
                                            <Image
                                                src={otherUser.image || "https://placehold.co/150"}
                                                alt={otherUser.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full object-cover cursor-pointer border-2 border-border/50"
                                            />
                                        </Link>
                                        <div>
                                            <Link href={`/profile/${otherUser._id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                                                {otherUser.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">{otherUser.jobTitle || "No Title"}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/messages/${otherUser._id}`}
                                        className="p-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition"
                                    >
                                        <MessageSquare size={18} />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
