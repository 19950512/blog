import type { Metadata } from "next";
import { SobreContent } from "@/components/pages/sobre-content";
import { sobreMetadata } from "@/lib/metadata";

export const metadata: Metadata = sobreMetadata("pt-br");

export default function Page() {
  return <SobreContent locale="pt-br" />;
}
