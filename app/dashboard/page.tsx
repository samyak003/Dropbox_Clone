import Dropzone from "@/components/Dropzone"
import TableWraper from "@/components/Table/TableWrapper"
import { db } from "@/firebase"
import { FileType } from "@/typings"
import { auth } from "@clerk/nextjs"
import { collection, count, doc, getAggregateFromServer, getDoc, getDocs, query, runTransaction, sum, where } from "firebase/firestore"
export default async function Dashboard() {
    const { userId } = auth()
    try {
        const userDocRef = doc(db, `users/${userId}`)
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                transaction.set(userDocRef, { maxStorage: 500000000, pro: false })
            }
        });
        console.log("Transaction successfully committed!");
    } catch (e) {
        console.log("Transaction failed: ", e);
    }
    const docResults = await getDocs(query(collection(db, "users", userId!, "files"), where("available", "==", true)))
    const storageUsed = await getAggregateFromServer(collection(db, "users", userId!, "files"), {
        storageUsed: sum("size"),
        count: count()
    })
    const userDocRef: any = await getDoc(doc(db, "users", userId!))
    const maxStorage = userDocRef.data().maxStorage
    const pro = userDocRef.data().pro
    const skeletonFiles: FileType[] = docResults.docs.map(doc => ({
        id: doc.id,
        fileName: doc.data().fileName || doc.id,
        timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
        fullName: doc.data().fullName,
        downloadURL: doc.data().downloadURL,
        type: doc.data().type,
        size: doc.data().size,

    }))

    return (
        <div className="boder-t">
            <Dropzone pro={pro} />
            <section className="container my-4">
                <h1 className="font-bold">All files</h1>
                <div className="">
                    <TableWraper skeletonFiles={skeletonFiles} skeletonStorageDetails={{ storageUsed: storageUsed.data().storageUsed, maxStorage: maxStorage, count: storageUsed.data().count }} />
                </div>
            </section>
        </div>

    )
}