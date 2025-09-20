/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  AlertCircleIcon,
  FileUpIcon,
  FileIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  FileArchiveIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Attachment } from "@/types";
import Cookies from "js-cookie";
import { FaRegFilePdf } from "react-icons/fa6";
import { FaRegFileWord } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegFileExcel } from "react-icons/fa";
import { BsFiletypeXls } from "react-icons/bs";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 10;
const getFileIcon = (file: { file: { type: string; name: string } }) => {
  const { type, name } = file.file;

  if (type.includes("pdf") || name.endsWith(".pdf")) {
    return <FaRegFilePdf className="size-4 opacity-60" />;
  } else if (type.includes("word")) {
    return <FaRegFileWord className="size-4 opacity-60" />;
  } else if (name.endsWith(".doc") || name.endsWith(".docx")) {
    return <IoDocumentTextOutline className="size-4 opacity-60" />;
  } else if (
    type.includes("zip") ||
    type.includes("archive") ||
    name.endsWith(".zip") ||
    name.endsWith(".rar")
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />;
  } else if (type.includes("excel")) {
    return <FaRegFileExcel className="size-4 opacity-60" />;
  } else if (name.endsWith(".xls") || name.endsWith(".xlsx")) {
    return <BsFiletypeXls className="size-4 opacity-60" />;
  } else if (type.includes("video/")) {
    return <VideoIcon className="size-4 opacity-60" />;
  } else if (type.includes("audio/")) {
    return <HeadphonesIcon className="size-4 opacity-60" />;
  } else if (
    type.startsWith("image/") ||
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".gif") ||
    name.endsWith(".webp") ||
    name.endsWith(".svg")
  ) {
    return <ImageIcon className="size-4 opacity-60" />;
  }
  return <FileIcon className="size-4 opacity-60" />;
};

export const Step10 = () => {
  const { control, getValues } = useFormContext();
  const attachmentMeta = getValues("attachmentMeta") || {};
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const token = Cookies.get("token");

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const downloadFile = async (attachment: Attachment) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/files/${attachment.id}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = attachment.filename_download || attachment.id;
      const match = contentDisposition?.match(/filename="(.+)"/);
      if (match) filename = match[1];

      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    } catch {
      toast.error("Download failed.");
    }
  };

  const uploadFile = async (file: File, typeOfAttachment: string) => {
    const formData = new FormData();
    const renamedFile = new File([file], file.name, { type: file.type });
    formData.append("file", renamedFile);
    formData.append("typeOfAttachment", typeOfAttachment);
    formData.append("filename_download", file.name);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/upload`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );
      const data = await res.json();
      if (!res.ok || !data?.attachment?.id) {
        toast.error("Upload failed.");
        return null;
      }
      toast.success("File uploaded successfully!");
      return data.attachment;
    } catch {
      toast.error("Upload error.");
      return null;
    }
  };

  const corpHook = useFileUpload({ maxSize: MAX_SIZE });
  const anotherHook = useFileUpload({ maxSize: MAX_SIZE, multiple: true });
  const imgHook = useFileUpload({
    multiple: true,
    maxFiles: MAX_FILES,
    maxSize: MAX_SIZE,
    accept: "image/*",
  });

  const renderUploader = (
    fieldPath: string,
    hook: ReturnType<typeof useFileUpload>,
    {
      multiple = false,
      label,
      attachmentType,
    }: {
      multiple?: boolean;
      label: string;
      attachmentType: string;
    }
  ) => (
    <FormField
      control={control}
      name={fieldPath as any}
      render={({ field }) => {
        const { files, isDragging } = hook[0];
        const {
          openFileDialog,
          handleDragEnter,
          handleDragLeave,
          handleDragOver,
          handleDrop,
          getInputProps,
          clearFiles,
        } = hook[1];

        useEffect(() => {
          if (!files.length) return;
          (async () => {
            const uploaded: any[] = [];
            const newPreviews: Record<string, string> = {};

            for (const f of files) {
              if (!(f.file instanceof File)) continue;
              const result = await uploadFile(f.file, attachmentType);
              if (result) {
                uploaded.push({
                  id: result.id,
                  filename_download: result.filename_download,
                  type: result.type,
                  size: result.filesize,
                });

                if (
                  attachmentType === "FlowMeterImages" &&
                  f.file.type.startsWith("image/")
                ) {
                  newPreviews[result.id] = URL.createObjectURL(f.file);
                }
              }
            }

            const newIds = uploaded.map((f) => f.id);
            setUploadedFiles((prev) => ({
              ...prev,
              ...Object.fromEntries(uploaded.map((f) => [f.id, f])),
            }));

            if (
              attachmentType === "FlowMeterImages" &&
              Object.keys(newPreviews).length
            ) {
              setPreviews((prev) => ({ ...prev, ...newPreviews }));
            }

            if (!multiple) {
              field.onChange(newIds[0] || "");
            } else {
              const existing = Array.isArray(field.value) ? field.value : [];
              const merged = Array.from(new Set([...existing, ...newIds]));
              field.onChange(merged);
            }
            clearFiles();
          })();
        }, [files]);

        const deleteFile = async (id: string) => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/attachment/${id}`,
              {
                credentials: "include",
                headers: { Authorization: token ? `Bearer ${token}` : "" },
                method: "DELETE",
              }
            );
            if (!res.ok) throw new Error();
            toast.success("File deleted successfully!");

            if (previews[id]) {
              URL.revokeObjectURL(previews[id]);
              setPreviews((prev) => {
                const n = { ...prev };
                delete n[id];
                return n;
              });
            }
          } catch {
            toast.error("Delete failed.");
          }
        };

        const fieldIds: string[] = Array.isArray(field.value)
          ? field.value
          : field.value
          ? [field.value]
          : [];
        const hasFiles = fieldIds.length > 0;
        const isFlow = attachmentType === "FlowMeterImages";
        const scrollClass =
          isFlow && fieldIds.length > 6 ? "max-h-[520px] overflow-y-auto" : "";

        return (
          <FormItem className="h-full">
            <FormLabel>
              {label} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div
                className={`flex flex-col gap-2 ${isFlow ? "" : "h-[250px]"}`}
              >
                {/* Drop area */}
                <div
                  role="button"
                  onClick={openFileDialog}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-dragging={isDragging || undefined}
                  className="border-green-500 hover:bg-accent/50 data-[dragging=true]:bg-accent/50 
                 flex flex-col items-center justify-center rounded-xl border border-dashed p-4 
                 h-[160px] shrink-0"
                >
                  <input
                    {...getInputProps()}
                    className="sr-only"
                    aria-label="Upload file"
                    disabled={!multiple && files.length > 0}
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="bg-background mb-2 flex size-11 items-center justify-center rounded-full border">
                      <FileUpIcon className="size-4 opacity-60" />
                    </div>
                    <p className="mb-1.5 text-sm font-medium">Upload File</p>
                    <p className="text-muted-foreground text-xs">
                      Drag & drop or click to browse (max.{" "}
                      {formatBytes(MAX_SIZE)})
                    </p>
                  </div>
                </div>

                {/* Files list / grid */}
                {hasFiles &&
                  (isFlow ? (
                    <div className={`border rounded-lg p-2 ${scrollClass}`}>
                      <div className="grid grid-cols-3 gap-4">
                        {fieldIds.map((id) => {
                          const att = uploadedFiles[id] || {
                            id,
                            type: "",
                            filename_download: attachmentMeta[id] || id,
                            size: 0,
                          };

                          const name = att.filename_download || "";
                          const hasLocalPreview = Boolean(previews[id]);
                          const looksLikeImageByExt =
                            /\.(png|jpe?g|gif|webp|svg)$/i.test(name);
                          const looksLikeImageByType = (
                            att.type || ""
                          ).startsWith("image/");
                          const isImage =
                            hasLocalPreview ||
                            looksLikeImageByType ||
                            looksLikeImageByExt;

                          const src =
                            previews[id] ||
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/files/${att.id}`;

                          return (
                            <div
                              key={id}
                              className="bg-background relative flex flex-col rounded-md border overflow-hidden"
                            >
                              <div className="bg-accent relative aspect-square">
                                {isImage ? (
                                  <>
                                    <img
                                      src={src}
                                      alt={name}
                                      className="absolute inset-0 w-full h-full object-cover"
                                      loading="lazy"
                                      onError={(e) => {
                                        if (!hasLocalPreview) {
                                          (
                                            e.currentTarget as HTMLImageElement
                                          ).style.display = "none";
                                        }
                                      }}
                                    />
                                  </>
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    {getFileIcon({
                                      file: { type: att.type || "", name },
                                    })}
                                  </div>
                                )}
                                <Button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    await deleteFile(id);
                                    setTimeout(() => {
                                      const updated = fieldIds.filter(
                                        (v) => v !== id
                                      );
                                      field.onChange(updated);
                                    }, 0);
                                  }}
                                  size="icon"
                                  className="absolute top-2 right-2 z-10 size-7 rounded-full bg-white text-foreground shadow-md hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-ring"
                                  aria-label="Remove image"
                                >
                                  <XIcon className="size-4" />
                                </Button>
                              </div>

                              <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
                                <Button
                                  type="button"
                                  variant="link"
                                  className="truncate p-0 text-[13px] font-medium text-blue-600 hover:underline"
                                  onClick={() => downloadFile(att)}
                                >
                                  {name || id}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`space-y-2 border rounded-lg p-1 ${
                        fieldIds.length > 1
                          ? "overflow-y-auto max-h-[80px]"
                          : ""
                      }`}
                    >
                      {fieldIds.map((id) => {
                        const att = uploadedFiles[id] || {
                          id,
                          type: "",
                          filename_download: attachmentMeta[id] || id,
                          size: 0,
                        };
                        return (
                          <div
                            key={id}
                            className="bg-background flex items-center justify-between gap-2 rounded border p-2 pe-3"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded border">
                                {getFileIcon({
                                  file: {
                                    type: att.type || "",
                                    name: att.filename_download || id,
                                  },
                                })}
                              </div>
                              <div className="flex min-w-0 flex-col gap-0.5">
                                <Button
                                  type="button"
                                  variant="link"
                                  className="p-0 text-[13px] font-medium text-blue-600 hover:underline"
                                  onClick={() => downloadFile(att)}
                                >
                                  {att.filename_download || id}
                                </Button>
                                <p className="text-muted-foreground text-xs">
                                  {att.size ? formatBytes(att.size) : ""}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-muted-foreground/80 hover:text-foreground size-6 hover:bg-transparent"
                              onClick={async (e) => {
                                e.preventDefault();
                                await deleteFile(id);
                                setTimeout(() => {
                                  const updated = fieldIds.filter(
                                    (v) => v !== id
                                  );
                                  field.onChange(updated);
                                }, 0);
                              }}
                              aria-label="Remove file"
                            >
                              <XIcon className="size-4" aria-hidden="true" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="lg:col-span-1">
      {renderUploader("attachments.0.CollaborationCertificate", corpHook, {
        label: "Collaboration Certificate",
        attachmentType: "CollaborationCertificate",
      })}
    </div>

    <div className="lg:col-span-1">
      {renderUploader("attachments.0.AnotherFile", anotherHook, {
        label: "Another File",
        multiple: true,
        attachmentType: "AnotherFile",
      })}
    </div>

    <div className="col-span-1 lg:col-span-2">
      {renderUploader("attachments.0.FlowMeterImages", imgHook, {
        label: "Flow-meter Images",
        multiple: true,
        attachmentType: "FlowMeterImages",
      })}
    </div>
  </div>
  );
};
