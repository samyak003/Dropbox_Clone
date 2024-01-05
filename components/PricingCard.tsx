import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Plan } from "@/typings";

export default function PricingCard({ plan, userId }: { plan: Plan, userId: string }) {
    return (
        <Card className={cn("w-[380px]")}>
            <CardHeader>
                <p className={`text-[#0160FE] font-semibold text-lg`}>{plan.title}</p>
                <p className="text-5xl font-bold">₹{plan.price}</p>
                <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <hr className="p-2 w-[80%] mx-auto" />
            <CardContent className="grid gap-4">
                <div>
                    {plan.features.map((feature, index) => (
                        <div
                            key={index}
                            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                        >
                            <span className={`flex h-2 w-2 translate-y-1 rounded-full bg-[#0160FE]`} />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {feature}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <form action="/checkout-sessions" method="POST" className="w-full">
                    <input type="text" hidden value={userId} id="userId" name="userId" />
                    <Button type="submit" role="link" className="w-full" disabled={!plan.forSale || !userId}>
                        Buy Now
                    </Button>
                </form>
            </CardFooter>
        </Card >
    )
}
