import Image from "next/image";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { UserAvatar } from "./account/user-avatar";
import { listHomeCommunity } from "@/lib/accounts/home-community";
import styles from "./home.module.css";

export async function HomeCommunity() {
  // Account-service availability must not take the public catalog offline.
  const members = await listHomeCommunity().catch(() => {
    console.warn("Home community is temporarily unavailable.");
    return [];
  });
  return (
    <section className={styles.communityPanel} aria-labelledby="home-community-title">
      <div className={styles.communityIntro}>
        <p className="chisan-eyebrow">Una comunidad que va creciendo</p>
        <h2 id="home-community-title">{members.length ? "Confían en nosotros" : "Una comunidad en construcción"}</h2>
        <p>{members.length
          ? "Productores con titularidad verificada y personas que comparten su perfil en Chisan."
          : "Sigue a los productores que te importan y comparte tu propia selección."}</p>
      </div>
      {members.length ? (
        <div className={styles.community} data-reveal-stagger>
          {members.map((member) => (
            <Link key={`${member.kind}:${member.key}`} className="chisan-card" href={member.href}>
              {member.kind === "user" ? (
                <UserAvatar name={member.name} src={member.image} size={64} />
              ) : member.image ? (
                <Image
                  src={member.image}
                  alt=""
                  width={320}
                  height={240}
                  sizes="(max-width: 700px) 45vw, 240px"
                />
              ) : null}
              <span>
                <strong>{member.name}</strong>
                <small>{member.place}</small>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <Link className="chisan-link" href="/registro">
          Forma parte de Chisan <ArrowUpRightIcon className="chisan-arrow" size={16} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}
