import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

interface CustomError extends Error {
	statusCode?: number;
}

export async function POST(req: Request) {
	const userId = (await req.formData()).get("userId");
	if (!userId) {
		return NextResponse.json({ message: "Invalid user id" }, { status: 404 });
	}

	try {
		// Create Checkout Sessions from body params.
		const session = await stripe.checkout.sessions.create({
			currency: "inr",
			line_items: [
				{
					price: "price_1OUsa3SIrFtnuq2SvnqhwsyJ",
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `https://dropboxclone.samyak003.in/pro/?success=true&userId=${userId}`,
			cancel_url: `https://dropboxclone.samyak003.in/pro/?canceled=true`,
			billing_address_collection: "required",
		});

		return NextResponse.redirect(session.url, 303);
	} catch (error) {
		const { message, statusCode }: CustomError = error as CustomError;
		return NextResponse.json({ message }, { status: statusCode || 500 });
	}
}
