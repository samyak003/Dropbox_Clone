"use client"
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { addDoc, collection, doc, getAggregateFromServer, getDoc, serverTimestamp, sum, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import DropzoneComponent from 'react-dropzone'
import { db, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import ProcessDialog from './ProcessDialog'
import { useAppStore } from '@/store/store'
import { toast, useToast } from './ui/use-toast'
import { ToastAction } from './ui/toast'
import Link from 'next/link'
export default function Dropzone({ pro }: { pro: boolean }) {
    const [isProcessModalOpen, setIsProcessModalOpen] = useAppStore(state => [state.isProcessModalOpen, state.setIsProcessModalOpen])
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [percentage, setPercentage] = useState(0)
    const { user } = useUser();
    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader()
            console.log("Readed")
            reader.onabort = () => toast({ description: "File reading was aborted", variant: "destructive" })
            reader.onerror = () => toast({ description: "File reading was failed", variant: "destructive" })
            reader.onload = async () => {
                await uploadPost(file)
            }
            reader.readAsArrayBuffer(file)
        })
    }

    const uploadPost = async (selectedFile: File) => {
        if (loading) return;
        if (!user) return;

        setIsProcessModalOpen(true)
        setLoading(true)

        const storageUsed = await getAggregateFromServer(collection(db, "users", user.id, "files"), {
            storageUsed: sum("size"),
        })
        const userDoc = await getDoc(doc(db, `users/${user.id}`))
        if (userDoc.data()?.maxStorage < storageUsed.data().storageUsed + selectedFile.size) {
            console.log(pro)
            toast({
                variant: "destructive",
                action: !pro ? (<ToastAction altText="Buy Storage"><Link href="/pro">Buy Storage</Link></ToastAction>) : undefined,
                description: "Not enough storage available"
            })
            setIsProcessModalOpen(false)
            setLoading(false)
            return
        }

        const docRef = await addDoc(collection(db, "users", user.id, "files"), {
            userId: user.id,
            fileName: selectedFile.name,
            fullName: user.fullName,
            profileImg: user.imageUrl,
            timestamp: serverTimestamp(),
            type: selectedFile.type,
            size: selectedFile.size,
            available: false,
        });
        const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`)
        const uploadTask = uploadBytesResumable(imageRef, selectedFile)

        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                setPercentage((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

            },
            (error) => {
                toast({
                    variant: "destructive",
                    description: "Upload Failed!"
                })
                setIsProcessModalOpen(false)
                setLoading(false)
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateDoc(doc(db, "users", user.id, "files", docRef.id), {
                        downloadURL: downloadURL,
                        available: true
                    })
                });
                setIsProcessModalOpen(false)
                setPercentage(0)
                setLoading(false)
                toast({
                    variant: "success",
                    description: "Upload Successful!"
                })
            }
        );


    }

    const createToast = (message: string) => {
        toast({
            variant: "destructive",
            description: message == "file-too-large" ? "The file is too large" : message
        })
    }


    const maxsize = 1000000 //100mb

    return (
        <DropzoneComponent minSize={0} maxSize={!pro ? maxsize : undefined} multiple={false} onDropRejected={(message) => { createToast(message[0].errors[0].code) }} onFileDialogCancel={() => createToast("Operation cancelled")} onError={(e) => { createToast(e.message) }} onDrop={onDrop} >
            {({ getRootProps, getInputProps, isDragActive, isDragReject, fileRejections }) => {
                return (
                    <section>
                        <div {...getRootProps()} className={cn("w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center", isDragActive ? "bg-[#035FEE] text-while animate-pulse" : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400")}>
                            <input {...getInputProps()} />
                            {!isDragActive && "Click here or drop a file to upload!"}
                            {isDragActive && !isDragReject && "Drop to upload this file!"}

                        </div>
                        <ProcessDialog percentage={percentage} />
                    </section>
                )
            }}
        </DropzoneComponent>
    )
}