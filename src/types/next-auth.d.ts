import "next-auth"
import { JWT } from "next-auth/jwt"
import { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface User {
        _id?: string,
        username?: string,
        isVerified?: boolean,
        isAccptedMssg?: boolean,
    }
    interface Session {
        user: {
            _id?: string,
            username?: string,
            isVerified?: boolean,
            isAccptedMssg?: boolean,
        } & DefaultSession["user"] // default session m key hogi hogi user naam se.
    }
}
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string,
        username?: string,
        isVerified?: boolean,
        isAccptedMssg?: boolean,
    }
}