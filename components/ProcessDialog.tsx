"use client"

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/store/store"


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
