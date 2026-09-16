"use client";

import { useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

type Photo = { src: StaticImageData; alt: string };

export function PhotoGallery({
  photos,
  caption,
  expandPrefix,
  closeLabel,
}: {
  photos: Photo[];
  caption: string;
  expandPrefix: string;
  closeLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Photo | null>(null);

  function open(photo: Photo) {
    setActive(photo);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <figure>
        {photos.map((photo, index) => (
          <button key={index} type="button" aria-label={`${expandPrefix}${photo.alt}`} onClick={() => open(photo)}>
            <Image src={photo.src} alt={photo.alt} sizes="(min-width: 640px) 160px, 30vw" />
          </button>
        ))}
        <figcaption>{caption}</figcaption>
      </figure>

      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        {active ? (
          <>
            <Image src={active.src} alt={active.alt} sizes="90vw" />
            <button type="button" onClick={() => dialogRef.current?.close()}>
              {closeLabel}
            </button>
          </>
        ) : null}
      </dialog>
    </>
  );
}
