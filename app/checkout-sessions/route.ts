import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
	const userId = (await req.formData()).get("userId");
	if (!userId)
		return NextResponse.json({ message: "Invalid user id" }, { status: 404 });
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
			success_url: `http://localhost:8000/pro/?success=true&userId=${userId}`,
			cancel_url: `http://localhost:8000/pro/?canceled=true`,
			billing_address_collection: "required",
		});
		return NextResponse.redirect(session.url, 303);
	} catch (error) {
		const { message }: any = error;
		return NextResponse.json({ message }, { status: error.statusCode });
	}
}
