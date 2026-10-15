import Link from "next/link";

type BackLinkProps = {
  href: string;
  label: string;
};

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link href={href} className="text-sm underline">
      {label}
    </Link>
  );
}
