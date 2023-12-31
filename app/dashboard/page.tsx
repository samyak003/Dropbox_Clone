import Dropzone from "@/components/Dropzone"
import TableWraper from "@/components/Table/TableWrapper"
import { db } from "@/firebase"
import { FileType } from "@/typings"
import { auth } from "@clerk/nextjs"
import { collection, getDocs } from "firebase/firestore"
export default async function Dashboard() {
    const { userId } = auth()
    const docResults = await getDocs(collection(db, "users", userId!, "files"))

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
            <Dropzone />
            <section className="container space-y-5">
                <h1 className="font-bold">All files</h1>
                <div className="">
                    <TableWraper skeletonFiles={skeletonFiles} />
                </div>
            </section>
        </div>

    )
}