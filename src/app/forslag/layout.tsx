import type { Metadata } from "next";
import "./forslag.css";

export const metadata: Metadata = {
  title: "Designförslag",
  robots: { index: false, follow: false },
};

export default function ForslagLayout({ children }: LayoutProps<"/forslag">) {
  return children;
}
