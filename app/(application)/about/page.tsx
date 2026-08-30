import { permanentRedirect } from "next/navigation";

export default function AboutPage() {
  permanentRedirect("/how-we-work");
}
