import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import {compareSync} from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";

export const config = {
	pages: {
		signIn: "/sign-in",
		error: "sign-in"
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			credentials: {
				email: { type: "email" },
				password: { type: "password" }
			},
			async authorize(credentals) {
				if (credentals == null) return null;
				
				// Find user in database
				const user = await prisma.user.findFirst({
					where: {
						email: credentals.email as string
					},
				});
				
				// Check if user exists and of the password matches
				if (user && user.password) {
					const isMatch = compareSync(credentals.password as string, user.password);
					
					// If password us correct, return user
					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						}
					}
				}
				// If user does not exist or password does not match return null
				return null;
				
			}
		})
	],
	callbacks: {
		async session({ session, user, trigger, token }: any) {
			// Set the user ID form the token
			session.user.id = token.sub;
			
			// If there is an update, set the username
			if (trigger === "update") {
				session.user.name = user.name;
			}
			
			return session
		},
	}
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config)

