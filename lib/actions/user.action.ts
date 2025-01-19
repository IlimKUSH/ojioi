"use server";

import {signInFormSchema} from "@/lib/validators";
import {signIn, signOut} from "@/auth";
import {isRedirectError} from "next/dist/client/components/redirect-error";

export async function signInWithCredentials(prevState: unknown, formData: FormData) {

    try {
        const user = signInFormSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
        })

        await signIn("credentials", user);

        return { success: true, message: "Signed in successfully" };
    } catch (e) {
        if (isRedirectError(e)) {
            throw e;
        }

        return { success: false, message: "Invalid credentials" };
    }

}

export async function signOutUser() {
    await signOut();
}
