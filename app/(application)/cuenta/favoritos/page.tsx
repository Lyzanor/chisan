import { redirect } from "next/navigation";
import { FOLLOWING_PATH } from "@/lib/community/policy";

export default function FavoritesRedirect() { redirect(FOLLOWING_PATH); }
