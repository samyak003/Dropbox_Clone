"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs"
import { useState } from "react";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useToast } from "./ui/use-toast";

export default function RenameModal() {
    const { toast } = useToast()
    const { user } = useUser()
    const [input, setInput] = useState("");
    const [isRenameModalOpen, setIsRenameModalOpen, fileId, fileName] = useAppStore(state => [
        state.isRenameModalOpen,
        state.setIsRenameModalOpen,
        state.fileId,
        state.fileName,
    ])

    const renameFile = async () => {
        if (!user || !fileId) return

        toast({
            variant: "default",
            description: "Renameing"
        })

        await updateDoc(doc(db, "users", user.id, "files", fileId), {
            fileName: input
        })
        toast({
            variant: "default",
            description: "Renamed Successfully"
        })

        setInput("")
        setIsRenameModalOpen(false)
    }
    return (
        <Dialog open={isRenameModalOpen} onOpenChange={(isOpen) => {
            setIsRenameModalOpen(isOpen)
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rename the file</DialogTitle>
                    <Input
                        id="link"
                        defaultValue={fileName}
                        onChange={e => setInput(e.target.value)}
                        onKeyDownCapture={e => {
                            if (e.key === "Enter") {
                                renameFile()
                            }
                        }}
                    />
                    <div className="flex justify-end space-x-2 py-3">
                        <Button className="px-3" size={"sm"} variant={"ghost"} onClick={() => setIsRenameModalOpen(false)}>
                            <span className="sr-only">Cancel</span>
                            <span>Cancel</span>
                        </Button>
                        <Button type="submit" className="px-3" size={"sm"} onClick={() => renameFile()}>
                            <span className="sr-only">Rename</span>
                            <span>Rename</span>
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}