"use client"
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Plan } from '@/typings';
import PricingCard from '@/components/PricingCard';
import { ToastAction } from '@radix-ui/react-toast';
import Link from 'next/link';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);


export default function Pro() {
    const [plans, setPlans] = useState<Plan[]>([
        {
            title: "Free", price: "0", description: "Always at your fingertips. Enjoy basic file storage for free.", features: ["500MB storage", "File uploads upto 100mb", "Light Theme"], forSale: false
        },
        { title: "Pro", price: "1000", description: "More than storage, it's control. Take charge of your data with the Pro plan.", features: ["1GB storage", "No size restriction", "Light & Dark Mode"], forSale: true }
    ])
    const { user } = useUser()
    const { toast } = useToast()
    const updatePlan = () => {
        const updatedPlans = plans.map((plan, index) => {
            if (index === 1) {
                return { ...plan, forSale: false };
            }
            return plan;
        });

        setPlans(updatedPlans);
    }
    useEffect(() => {
        if (!user) return
        getDoc(doc(db, `users/${user.id}`)).then((snapshot) => {
            if (snapshot.exists() && snapshot?.data().pro) {
                updatePlan()
            }
        })
    }, [user])
    useEffect(() => {
        const unsubcribe = () => {
            const query = new URLSearchParams(window.location.search);
            if (query.get('success')) {
                updateDoc(doc(db, `users/${query.get("userId")}`), {
                    pro: true,
                    maxStorage: 1000000000,
                })
                updatePlan()
                toast({ variant: "success", description: 'Order placed!', action: <ToastAction altText='Go to Dashboard'><Link href="/dashboard">Go to Dashboard</Link></ToastAction> });
            }

            if (query.get('canceled')) {
                toast({ variant: "destructive", description: 'Order canceled' });
            }
        }
        return () => unsubcribe()
    }, [])
    return (
        <div className="p-4">
            <div className="container text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">Pricing</h1>
                <p className="text-lg">Get organized and access your files from anywhere, without breaking the bank.</p>
            </div>

            <div className="contaner flex flex-col md:flex-row  space-y-3 md:space-y-0 md:space-x-3 justify-center items-center m-auto">
                <PricingCard plan={plans[0]} userId={user?.id as string} />
                <PricingCard plan={plans[1]} userId={user?.id as string} />
            </div>
        </div>
    )
} 