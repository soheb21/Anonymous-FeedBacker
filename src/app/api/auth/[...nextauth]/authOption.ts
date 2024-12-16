import bcrypt from 'bcryptjs';
import UserModel from '@/model/User';
import dbconnect from '@/lib/dbconnect';
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth"


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text " },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbconnect();
                try {
                    const user = await UserModel.findOne({ $or: [{ email: credentials.identifier }, { username: credentials.identifier }] })
                    if (!user) {
                        throw new Error("User not found!")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify this email!")
                    }
                    else {
                        const isMatch = await bcrypt.compare(credentials.password, user.password);
                        if (!isMatch) {
                            throw new Error("Invalid Password");
                        } else {
                            return user;
                        }
                    }
                } catch (err: any) {
                    throw new Error(err)
                }

            }

        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAccptedMssg = user.isAccptedMssg;
            }
            return token
        },
        async session({ session, token, user }) {
            if (user) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAccptedMssg = token.isAccptedMssg;
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET


}