import { readFile } from "node:fs/promises";
import path from "node:path";

type Props = {
  className?: string;
};

export async function Signature({ className }: Props) {
  "use cache";
  const svg = await readFile(
    path.join(process.cwd(), "public", "signature.svg"),
    "utf8",
  );
  return (
    <div
      className={className}
      role="img"
      aria-label="Allekirjoitus: Oskari Alamäki"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
