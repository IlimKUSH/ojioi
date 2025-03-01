"use server"

import {CartItem} from "@/types";
import {cookies} from "next/headers";
import {auth} from "@/auth";
import {convertToObject, formatErrors} from "@/lib/utils";
import {prisma} from "@/db/prisma";
import {cartItemSchema} from "@/lib/validators";

export async function addItemToCart(data: CartItem) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart session not found!')

        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : null;

        const cart = await getMyCart();

        const item = cartItemSchema.parse(data)

        const product = await prisma.product.findFirst({
            where: { id: item.productId }
        })

        //     ToDo/Remvoe
        console.log({
            'Session Cart ID': sessionCartId,
            'User ID': userId,
            'Item parsed': item,
            'Product found': product,
        });

        return {
            success: true,
            message: "Item added to cart",
        }

    } catch (error) {
        return {
            success: false,
            message: formatErrors(error),
        }
    }


}


export async function getMyCart() {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found!')

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : null;

    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    })

    if (!cart) return null;

    return convertToObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    })
}

