"use client"
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import DropzoneComponent from 'react-dropzone'
import { db, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
export default function Dropzone() {
    const [loading, setLoading] = useState(false)
    const { isLoaded, isSignedIn, user } = useUser();
    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader()

            reader.onabort = () => console.log("File reading was aborted")
            reader.onerror = () => console.log("File reading was failed")
            reader.onload = async () => {
                await uploadPost(file)
            }
            reader.readAsArrayBuffer(file)
        })
    }

    const uploadPost = async (selectedFile: File) => {
        if (loading) return;
        if (!user) return;


        setLoading(true)
        const docRef = await addDoc(collection(db, "users", user.id, "files"), {
            userId: user.id,
            fileName: selectedFile.name,
            fullName: user.fullName,
            profileImg: user.imageUrl,
            timestamp: serverTimestamp(),
            type: selectedFile.type,
            size: selectedFile.size

        });

        const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`)
        await uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
                downloadURL: downloadURL,
            })
        })
        setLoading(false)

    }

    const maxsize = 20971520 //20MB

    return (
        <DropzoneComponent minSize={0} maxSize={maxsize} onDrop={onDrop}>
            {({ getRootProps, getInputProps, isDragActive, isDragReject, fileRejections }) => {

                const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxsize
                return (
                    <section>
                        <div {...getRootProps()} className={cn("w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center", isDragActive ? "bg-[#035FEE] text-while animate-pulse" : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400")}>
                            <input {...getInputProps()} />
                            {!isDragActive && "Click here or drop a file to upload!"}
                            {isDragActive && !isDragReject && "Drop to upload this file!"}
                            {isDragReject && "File type not accepted, sorry ! "}
                            {isFileTooLarge && <div className="text-danger mt-2">
                                File is too large
                            </div>}
                        </div>
                    </section>
                )
            }}
        </DropzoneComponent>
    )
}