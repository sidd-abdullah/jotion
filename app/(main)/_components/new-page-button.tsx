"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PlusCircleIcon } from "lucide-react";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const NewPageButton = () => {
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div
      onClick={onCreate}
      role="button"
      className="px-4 py-2 text-sm w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium rounded-md"
    >
      <PlusCircleIcon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      <span className="truncate">New Page</span>
    </div>
  );
};

export default NewPageButton;
