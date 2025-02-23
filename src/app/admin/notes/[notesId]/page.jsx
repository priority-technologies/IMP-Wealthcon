"use client";

import NotesSinglePage from "@/components/NotesSinglePage/NotesSinglePage";

export default function page({ params: { notesId } }) {
  return <NotesSinglePage notesId={notesId} admin={true} />;
}
