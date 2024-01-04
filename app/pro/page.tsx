import { BellRing, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"

type plan = {
    title: string,
    price: string,
    description: string,
    features: string[],
    forSale: boolean,
}

function PricingCard({ plan }: { plan: plan }) {
    return (
        <Card className={cn("w-[380px]")}>
            <CardHeader>
                <p className="text-[#0160FE] font-semibold text-lg">{plan.title}</p>
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
                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
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
                <Button className="w-full" disabled={!plan.forSale}>
                    Buy Now
                </Button>
            </CardFooter>
        </Card>
    )
}

const plans: plan[] = [
    {
        title: "Free", price: "0", description: "Always at your fingertips. Enjoy basic file storage for free.", features: ["500MB storage", "File uploads upto 100mb", "Light Theme"], forSale: false
    },
    { title: "Pro", price: "1000", description: "More than storage, it's control. Take charge of your data with the Pro plan.", features: ["1GB storage", "No size restriction", "Light & Dark Mode"], forSale: true }
]

export default function Pro() {
    return (
        <div className="p-4">
            <div className="container text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">Pricing</h1>
                <p className="text-lg">Get organized and access your files from anywhere, without breaking the bank.</p>
            </div>

            <div className="contaner flex space-x-3 justify-center items-center mx-auto">
                <PricingCard plan={plans[0]} />
                <PricingCard plan={plans[1]} />
            </div>
        </div>
    )
}