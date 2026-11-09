import { readFile } from "node:fs/promises";
import path from "node:path";
import { SignatureClient } from "./signature-client";

type Props = {
  className?: string;
};

export async function Signature({ className }: Props) {
  "use cache";
  const svg = await readFile(
    path.join(process.cwd(), "public", "signature.svg"),
    "utf8",
  );
  return <SignatureClient svg={svg} className={className} />;
}
