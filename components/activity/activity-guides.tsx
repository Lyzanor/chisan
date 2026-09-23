import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { GuideCover } from "@/components/guides/guide-cover";
import {
  GUIDES_PATH,
  guidePath,
} from "@/lib/guides/catalog";
import { GUIDE_KINDS, type Guide } from "@/lib/guides/schema";
import styles from "./activity.module.css";

type ActivityGuidesProps = {
  guides: Guide[];
};

export function ActivityGuides({ guides }: ActivityGuidesProps) {
  if (!guides.length) return null;

  return (
    <section className={styles.section} data-reveal aria-labelledby="activity-guides-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className="chisan-eyebrow">Biblioteca Chisan</p>
          <h2 id="activity-guides-title">Guías destacadas</h2>
        </div>
        <Link href={GUIDES_PATH} className="chisan-link">
          Todas las guías <ArrowUpRightIcon className="chisan-arrow" size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className={styles.guidesGrid} data-reveal-stagger>
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={guidePath(guide.slug)}
            className={`chisan-card ${styles.guideCard}`}
          >
            <GuideCover guide={guide} compact />
            <div className={styles.guideBody}>
              <span className={styles.guideTopic}>{GUIDE_KINDS[guide.kind]} · {guide.topic}</span>
              <h3 className={styles.guideTitle}>{guide.title}</h3>
              <p className={styles.guideExcerpt}>{guide.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
