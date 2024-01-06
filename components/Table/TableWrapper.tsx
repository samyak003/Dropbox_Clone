"use client"

import { FileType } from "@/typings";
import { Button } from "../ui/button";
import { DataTable } from "./Table";
import { columns } from "./columns";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, count, doc, getAggregateFromServer, getDoc, orderBy, query, sum, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useCollection, } from "react-firebase-hooks/firestore"
import { Skeleton } from "../ui/skeleton";
import prettyBytes from "pretty-bytes";
import { StorageProgress } from "../ui/storage_progress";

type storage_details = {
    maxStorage: number,
    count: number,
    storageUsed: number,
}

export default function TableWraper({ skeletonFiles, skeletonStorageDetails }: { skeletonFiles: FileType[], skeletonStorageDetails: { storageUsed: number, maxStorage: number, count: number } }) {
    const { user } = useUser();
    const [initialFiles, setInitialFiles] = useState<FileType[]>([])
    const [sort, setSort] = useState<"asc" | "desc">("desc")
    const [storageDetails, setStorageDetails] = useState<storage_details>({
        maxStorage: 0,
        count: 0,
        storageUsed: 0,
    })
    const [docs] = useCollection(
        user && query(collection(db, "users", user.id, "files"), where("available", "==", true), orderBy("timestamp", sort)),
    )

    useEffect(() => {
        if (!user) return
        const unsubscribe = async () => {
            const s1 = await getAggregateFromServer(collection(db, "users", user!.id, "files"), {
                storageUsed: sum("size"),
                count: count(),
            })
            const s2 = await getDoc(doc(db, "users", user!.id))

            setStorageDetails({ maxStorage: s2.data()?.maxStorage, count: s1.data().count, storageUsed: s1.data().storageUsed })
        }
        unsubscribe()
    }, [initialFiles])


    useEffect(() => {
        if (!docs) return
        const files: FileType[] = docs.docs.map((doc) => ({
            id: doc.id,
            fileName: doc.data().fileName || doc.id,
            timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
            fullName: doc.data().fullName,
            downloadURL: doc.data().downloadURL,
            type: doc.data().type,
            size: doc.data().size,
        }))
        setInitialFiles(files)
    }, [docs])

    if (docs?.docs.length === undefined) return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center">
                <div className="">
                    <Skeleton className="w-60 h-12" />
                </div>
                <div className="">
                    <Button variant={"outline"} className="ml-auto w-36 h-10 mb-2" onClick={() => setSort(sort === "desc" ? "asc" : "desc")}><Skeleton className="h-5 w-full" /></Button>
                    <Skeleton className="w-12 h-4 my-2" />
                </div>
            </div>
            <div className="border rounded-lg">
                {skeletonFiles.map(file => (
                    <div className="flex items-center space-x-4 p-5 w-full" key={file.id}>
                        <Skeleton className="h-12 w-12" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ))}
                {skeletonFiles.length === 0 && (
                    <div className="flex items-center space-x-4 p-5 w-full">
                        <Skeleton className="h-12 w-12" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="flex flex-col space-y-5 pb-10">
            <div className="flex justify-center text-center sm:justify-between items-center flex-wrap space-y-4 space-x-4">
                <div className="w-fit">
                    <p className="my-2">Strorage Used : {prettyBytes(storageDetails.storageUsed || 0)} out of {prettyBytes(storageDetails.maxStorage || 0)}</p>
                    <StorageProgress value={(storageDetails.storageUsed / storageDetails.maxStorage) * 100} />
                </div>
                <div className="">
                    <Button variant={"outline"} className="w-fit" onClick={() => setSort(sort === "desc" ? "asc" : "desc")}>Sort By {sort === "desc" ? "Newest" : "Oldest"}</Button>
                    <p className="my-2">Total Files : {storageDetails.count}</p>

                </div>

            </div>
            <DataTable columns={columns} data={initialFiles} />
        </div>
    )
}