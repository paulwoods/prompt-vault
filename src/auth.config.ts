import type {NextAuthConfig} from "next-auth"

export const authConfig = {
    providers: [],
    callbacks: {
        authorized({auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            const isOnAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")

            if (isOnDashboard) {
                return isLoggedIn;
                 // Redirect unauthenticated users to login page
            } else if (isOnAuthPage) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }
                return true
            }
            return true
        },
        async session({session, token}) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig
