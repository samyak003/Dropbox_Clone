"use client"

import { COLOR_EXTENSION_MAP } from "@/constant";
import { FileType } from "@/typings"
import { ColumnDef } from "@tanstack/react-table"
import { PencilIcon, TrashIcon } from "lucide-react";
import prettyBytes from "pretty-bytes"
import { FileIcon, defaultStyles } from 'react-file-icon';
import { Button } from "../ui/button";
import { useAppStore } from "@/store/store";
import { DeleteModal } from "../DeleteModal";

const FileName = ({ props }: { props: any }) => {
    const [setFileId, setFileName, setIsRenameModalOpen, fileId] = useAppStore(state => [state.setFileId, state.setFilename, state.setIsRenameModalOpen, state.fileId])
    const openRenameModal = (fileId: string, fileName: string) => {
        setFileId(fileId);
        setFileName(fileName);
        setIsRenameModalOpen(true);
    }
    return (
        <p className="underline flex items-center text-blue-500 hover:cursor-pointer" onClick={() => { openRenameModal(props.row.original.id as string, props.renderValue() as string) }} >
            {props.renderValue() as string}
            <PencilIcon size={15} className="ml-2" />
        </p>
    )
}

const DeleteFile = ({ props }: { props: any }) => {
    const [setIsDeleteModalOpen, setFileId] = useAppStore(state => [state.setIsDeleteModalOpen, state.setFileId])

    const openDeleteModal = (fileId: string) => {
        setFileId(fileId);
        setIsDeleteModalOpen(true);
    }
    return <Button variant={"outline"} onClick={() => {
        openDeleteModal(props.renderValue() as string)
    }}>
        <TrashIcon size={20} />
    </Button>
}

export const columns: ColumnDef<FileType>[] = [
    {
        accessorKey: "type",
        header: "type",
        cell: ({ renderValue, ...props }) => {
            const type = renderValue() as string;
            const extension: string = type.split("/")[1];

            return (
                <div className="w-10">
                    <FileIcon
                        extension={extension}
                        label={COLOR_EXTENSION_MAP[extension]}
                        // @ts-ignore
                        {...defaultStyles[extension]}
                    />
                </div>
            )
        }
    },
    {
        accessorKey: `fileName`,
        header: "Filename",
        cell: (props) => {

            return (
                <FileName props={props} />
            )
        }
    },
    {
        accessorKey: "timestamp",
        header: "Date Added",
        cell: ({ renderValue, ...props }) => {
            return <div className="flex flex-col">
                <div className="text-sm">
                    {(renderValue() as Date).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                    {(renderValue() as Date).toLocaleTimeString()}
                </div>
            </div>
        }

    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ renderValue, ...props }) => {
            return <span>{prettyBytes(renderValue() as number)}</span>
        }
    },
    {
        accessorKey: "downloadURL",
        header: "Link",
        cell: ({ renderValue, ...props }) => {
            return <a href={renderValue() as string} target="_blank" className="underline text-blue-600 hover:text-blue-600">Download</a>
        }
    },
    {
        accessorKey: "id",
        header: "Delete",
        cell: (props) => {
            return (
                <DeleteFile props={props} />
            )
        }
    }
]
