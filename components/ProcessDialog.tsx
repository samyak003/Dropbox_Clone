"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/store/store"
import { useEffect } from "react"


export default function ProcessDialog({ percentage }: { percentage: number }) {
    const [isProcessModalOpen, setIsProcessModalOpen] = useAppStore(state => [state.isProcessModalOpen, state.setIsProcessModalOpen])



    return (
        <AlertDialog open={isProcessModalOpen} onOpenChange={(isOpen) => {
            setIsProcessModalOpen(isOpen)
        }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Uploading...</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Progress value={percentage} />
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    )
}
