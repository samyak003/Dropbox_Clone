"use client"
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useUser } from "@clerk/nextjs"
import { useAppStore } from "@/store/store"
import { db, storage } from "@/firebase"
import { deleteObject, ref } from "firebase/storage"
import { deleteDoc, doc } from "firebase/firestore"
import { useToast } from "./ui/use-toast"

export function DeleteModal() {
    const { user } = useUser()
    const { toast } = useToast()
    const [isDeleteModalOpen, setIsDeleteModalOpen, fileId] = useAppStore(state => [state.isDeleteModalOpen, state.setIsDeleteModalOpen, state.fileId])
    async function deleteFile() {
        if (!user || !fileId) return
        toast({
            variant: "destructive",
            description: "Deleting"
        })
        const fileRef = ref(storage, `users/${user.id}/files/${fileId}`)
        try {
            deleteObject(fileRef).then(async () => {
                deleteDoc(doc(db, "users", user.id, "files", fileId))
                toast({
                    variant: "destructive",
                    description: "Delete Successful"
                })
            }).finally(() => {
                setIsDeleteModalOpen(false)
            })
        }
        catch (error) {
            setIsDeleteModalOpen(false)
        }

    }
    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={(isOpen) => {
            setIsDeleteModalOpen(isOpen)
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete this file.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 py-3">
                    <Button size="sm" className="px-3 flex-1" variant={"ghost"} onClick={() => { setIsDeleteModalOpen(false) }}>
                        <span className="sr-only">Cancel</span>
                        <span>Cancel</span>
                    </Button>
                    <Button type="submit" size="sm" className="px-3 flex-1" onClick={() => { deleteFile() }} variant={"destructive"}>
                        <span className="sr-only">Delete</span>
                        <span>Delete</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
