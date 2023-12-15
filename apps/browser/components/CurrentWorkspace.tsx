import React from "react";
import { InMemoryFile } from "@nerfzael/memory-fs";
import clsx from "clsx";

import FileIcon from "./FileIcon";
import { DownloadSimple, FilePlus } from "@phosphor-icons/react";
import Button from "./Button";
import { useUploadFiles } from "@/lib/hooks/useUploadFile";
import { useAtom } from "jotai";
import { userFilesAtom } from "@/lib/store";
import { useDownloadWorkspaceAsZip } from "@/lib/hooks/useDownloadWorkspaceAsZip";

// TODO(cbrzn): Update when supabase bucket workspace is attached
const loadedWorkspace = true;

function CurrentWorkspace() {
  const { getRootProps, getInputProps, isDragAccept, open } = useUploadFiles();
  const [userFiles] = useAtom(userFilesAtom);
  const downloadFilesAsZip = useDownloadWorkspaceAsZip()

  function getFileType(path: InMemoryFile["path"]) {
    const index = path.lastIndexOf(".");
    return path.substring(index + 1);
  }

  return (
    <div className="p-2">
      <div className="flex w-full items-center justify-between space-x-1 px-2">
        <div className="text-xs uppercase tracking-widest text-zinc-500">
          Current Workspace
        </div>
        {loadedWorkspace && (
          <div className="flex items-center space-x-1">
            <Button variant="icon" onClick={open}>
              <FilePlus size={18} weight="bold" />
            </Button>
            <input {...getInputProps()} />
            {userFiles.length !== 0 && (
              <Button
                variant="icon"
                className="text-zinc-500 hover:text-cyan-500"
                onClick={downloadFilesAsZip}
              >
                <DownloadSimple size={18} weight="bold" />
              </Button>
            )}
          </div>
        )}
      </div>
      {loadedWorkspace ? (
        <>
          <div className="relative h-full max-h-[24vh] overflow-y-auto">
            {userFiles.length === 0 ? (
              <div
                className="mt-1 flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed border-zinc-500 p-7 text-center transition-colors duration-300 hover:border-cyan-500 hover:bg-zinc-950 hover:text-cyan-500"
                onClick={open}
              >
                <FilePlus size={24} className="text-[currentColor]" />
                <p className="leading-regular text-xs text-zinc-500">
                  You currently have no files in your workspace. Drop or click
                  here to add them.
                </p>
              </div>
            ) : (
              <>
                <div
                  {...getRootProps({
                    className: clsx(
                      "dropzone group h-full space-y-1 overflow-y-auto rounded-lg border-2 border-solid border-zinc-900 p-[6px] transition-all duration-100 ease-in-out",
                      {
                        "cursor-pointer !border-dashed !border-cyan-500 !bg-zinc-950":
                          isDragAccept,
                      }
                    ),
                  })}
                >
                  {userFiles.map((file, i) => {
                    return (
                      <div
                        key={i}
                        className={clsx(
                          "flex w-full cursor-pointer items-center space-x-2 rounded p-1 text-sm text-cyan-500 transition-colors duration-300",
                          {
                            "hover:bg-zinc-800 hover:text-white": !isDragAccept,
                          }
                        )}
                      >
                        <FileIcon fileType={getFileType(file.path)} />
                        <div className="w-full overflow-x-hidden text-ellipsis whitespace-nowrap">
                          {file.path}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="m-2 mt-1 h-[20vh] w-[calc(100%-1rem)] animate-pulse rounded-lg bg-zinc-700" />
      )}
    </div>
  );
}

export default CurrentWorkspace;
