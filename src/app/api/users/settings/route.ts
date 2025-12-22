import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PUT: Update Password
export async function PUT(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        // @ts-ignore
        const userId = session.user.id || session.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user has a password (might be OAuth only)
        if (user.password) {
            if (!currentPassword) {
                return NextResponse.json({ error: "Current password is required" }, { status: 400 });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
            }
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Password Update Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// PATCH: Update Preferences or Deactivate
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id || session.user._id;
        const body = await req.json();

        // 1. Deactivate Account
        if (body.action === 'deactivate') {
            await User.findByIdAndUpdate(userId, { isActive: false });
            return NextResponse.json({ message: "Account deactivated" });
        }

        // 2. Update Preferences
        if (body.preferences) {
            await User.findByIdAndUpdate(userId, { preferences: body.preferences });
            return NextResponse.json({ message: "Preferences updated" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Settings Update Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// DELETE: Delete Account
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const userId = session.user.id || session.user._id;

        await User.findByIdAndDelete(userId);

        return NextResponse.json({ message: "Account deleted" });

    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
