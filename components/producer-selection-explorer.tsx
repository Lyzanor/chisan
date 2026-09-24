"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowsInSimpleIcon, ArrowsOutSimpleIcon, MapTrifoldIcon, ImageIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { CatalogResultsSheet } from "@/components/catalog-results-sheet";
import { ProducerCollectionMap } from "@/components/map/producer-collection-map";
import { ProducerMapSelectionCard } from "@/components/map/producer-map-selection-card";
import { ProducerSelectionMap, type MapMessages, type ProducerMapFocusRequest } from "@/components/map/producers-map";
import { AnnotatedProducerImageView } from "@/components/annotated-producer-image";
import { imagePlacements, imageSelectionHref, resolveImageSelection, type AnnotatedProducerImage, type ImagePlacement } from "@/lib/annotated-producer-image";
import type { PublicSelectionShelf } from "@/lib/selection-shelf/policy";
import { hasProducerSelectionCoordinates, type ProducerMapMarker, type ProducerSelectionExplorerModel } from "@/lib/producer-selections";
import { catalogDescriptionPreview } from "@/lib/catalog-search";
import styles from "./producer-selection-explorer.module.css";

export type ProducerSelectionExplorerMessages = {
  producers: string;
  countLabels: Record<string, string>;
  map: MapMessages & { producerMap: string };
};
type ExplorerProps = {
  selection: ProducerSelectionExplorerModel;
  messages: ProducerSelectionExplorerMessages;
  shelf?: PublicSelectionShelf | null;
  plan?: AnnotatedProducerImage | null;
};
const searchable = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();

function ProducerSelectionExplorerView({ selection, messages, shelf, plan, selectedKey, pointId }: ExplorerProps & { selectedKey: string; pointId: string }) {
  const root = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLElement>(null);
  const [emphasis, setEmphasis] = useState<"both" | "image" | "map">("both");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [choices, setChoices] = useState<string[] | null>(null);
  const [focusVersion, setFocusVersion] = useState(0);
  useEffect(() => {
    if (open) sheet.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus({ preventScroll: true });
  }, [open]);
  const image = plan ?? shelf;
  const isPlan = Boolean(plan);
  const itemsByKey = useMemo(() => new Map(selection.items.map((item) => [item.key, item])), [selection.items]);
  const placements = useMemo(() => image ? imagePlacements(image, new Set(itemsByKey.keys())) : [], [image, itemsByKey]);
  const selected = itemsByKey.get(selectedKey);
  const physical = resolveImageSelection(placements, selected?.key ?? "", pointId);
  const activePlacements = physical.placement ? [physical.placement] : physical.appearances;
  const selectedIds = activePlacements.map((group) => group.id);
  const points = useMemo(() => selection.items.flatMap((item): ProducerMapMarker[] => hasProducerSelectionCoordinates(item)
    ? [{ ...item, latitude: item.latitude, longitude: item.longitude }] : []), [selection.items]);
  const focusRequest = useMemo<ProducerMapFocusRequest | undefined>(() => points.some((point) => point.key === selectedKey)
    ? { key: selectedKey, requestId: focusVersion, behavior: "select" } : undefined, [points, selectedKey, focusVersion]);

  const updateSelection = useCallback((key: string, point = "") => {
    const href = imageSelectionHref(selection.canonicalPath, key, point);
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== href) window.history.pushState(null, "", href);
    setFocusVersion((version) => version + 1);
  }, [selection.canonicalPath]);
  const selectProducer = useCallback((key: string) => {
    if (!itemsByKey.has(key)) return;
    updateSelection(key);
  }, [itemsByKey, updateSelection]);
  const clearSelection = useCallback(() => updateSelection(""), [updateSelection]);

  function finishChoice(key: string, point = "") {
    updateSelection(key, point);
    setOpen(false);
    setChoices(null);
    setQuery("");
    requestAnimationFrame(() => sheet.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }));
  }
  function choosePlacements(groups: ImagePlacement[]) {
    if (groups.length === 1 && groups[0].points.length === 1) {
      const point = groups[0].points[0];
      updateSelection(point.producerKey, point.id);
      return;
    }
    if (groups.length === 1) updateSelection("", groups[0].id);
    setChoices(groups.map((group) => group.id));
    setQuery("");
    setOpen(true);
  }
  const terms = searchable(query).trim().split(/\s+/).filter(Boolean);
  const visiblePlacements = placements.filter((group) => (!choices || choices.includes(group.id)) && terms.every((term) =>
    searchable([isPlan ? `Puesto ${group.marker}` : `Posición ${group.marker}`, ...group.points.flatMap((point) => [point.label, itemsByKey.get(point.producerKey)?.name ?? "", itemsByKey.get(point.producerKey)?.city ?? ""])].join(" ")).includes(term)));
  const withoutPosition = selection.items.filter((item) => !placements.some((group) => group.points.some((point) => point.producerKey === item.key))
    && !choices && terms.every((term) => searchable(`${item.name} ${item.city}`).includes(term)));
  const imageTitle = isPlan ? "En la feria" : "En la imagen";
  const placementTitle = (group: ImagePlacement) => `${isPlan ? "Puesto" : "Posición"} ${group.marker}`;
  const countLabel = messages.countLabels[String(selection.items.length)] ?? `${selection.items.length} productores`;
  const missingCoordinates = Boolean(selected && !hasProducerSelectionCoordinates(selected));
  const positionLabel = physical.point && !isPlan ? physical.point.label
    : activePlacements.length === 1 ? placementTitle(activePlacements[0])
      : activePlacements.length ? `${activePlacements.length} ${isPlan ? "puestos" : "posiciones"}` : "Sin posición señalada";

  if (!image) return <section ref={root}><ProducerCollectionMap items={selection.items} selectedKey={selected?.key ?? ""} onSelect={selectProducer} onClear={clearSelection}
    initialFocusKeys={selection.initialFocusKeys} messages={messages.map} relatedSurfaceRef={root} /></section>;

  return <section ref={root} className={styles.explorer} aria-label="Presencia y origen de los productores">
    <div className={styles.workspace} data-emphasis={emphasis} data-has-selection={Boolean(selected)}>
      <div className={styles.panels} inert={open}>
        <section className={styles.panel} data-panel="image" aria-label={imageTitle}>
          <button type="button" className={styles.panelHeading} aria-expanded={emphasis === "image"} onClick={() => setEmphasis(emphasis === "image" ? "both" : "image")}>
            <span><ImageIcon size={18} aria-hidden="true" />{imageTitle}</span>
            <span>{emphasis === "image" ? "Ver ambos" : "Ampliar"}{emphasis === "image" ? <ArrowsInSimpleIcon size={18} aria-hidden="true" /> : <ArrowsOutSimpleIcon size={18} aria-hidden="true" />}</span>
          </button>
          <div className={styles.panelBody} inert={emphasis === "map"}>
            <AnnotatedProducerImageView image={image} placements={placements} selectedIds={selectedIds} focusId={`${selectedKey}:${pointId}:${focusVersion}`} isPlan={isPlan} onChoose={choosePlacements} />
          </div>
        </section>
        <section className={`${styles.panel} ${styles.mapPanel}`} data-panel="map" aria-label={messages.map.producerMap}>
          <button type="button" className={styles.panelHeading} aria-expanded={emphasis === "map"} onClick={() => setEmphasis(emphasis === "map" ? "both" : "map")}>
            <span><MapTrifoldIcon size={18} aria-hidden="true" />Origen</span>
            <span>{emphasis === "map" ? "Ver ambos" : "Ampliar"}{emphasis === "map" ? <ArrowsInSimpleIcon size={18} aria-hidden="true" /> : <ArrowsOutSimpleIcon size={18} aria-hidden="true" />}</span>
          </button>
          <div className={styles.panelBody} inert={emphasis === "image"}>
            <ProducerSelectionMap points={points} selectedKey={selected?.key} focusRequest={focusRequest} focusPaddingBottom={24}
              initialFocusKeys={selection.initialFocusKeys} onSelectKey={selectProducer} messages={messages.map} />
            {missingCoordinates ? <p className={styles.coordinateNotice} role="status">{selected?.name}: ubicación exacta pendiente{selected?.city ? ` · ${selected.city}` : ""}.</p> : null}
          </div>
          <div className={styles.selectionCard} inert={open || emphasis === "image"} aria-live="polite" aria-atomic="true">
            {selected ? <>
              <span className={styles.position}>{positionLabel}</span>
              <ProducerMapSelectionCard producer={{ ...selected, description: catalogDescriptionPreview(selected.description), location: selected.city }} />
              {physical.appearances.length > 1 ? <label className={styles.appearances}>En la imagen
                <select aria-label={`Posición de ${selected.name}`} value={physical.point?.id ?? ""} onChange={(event) => updateSelection(selected.key, event.target.value)}>
                  <option value="">Todas las posiciones ({physical.appearances.length})</option>
                  {physical.appearances.flatMap((group) => group.points.filter((point) => point.producerKey === selected.key).map((point) => <option key={point.id} value={point.id}>{isPlan ? placementTitle(group) : point.label}</option>))}
                </select>
              </label> : null}
            </> : <>
              <div className={styles.identity}>
                {physical.placement ? <><strong>{placementTitle(physical.placement)}</strong><span>{new Set(physical.placement.points.map((point) => point.producerKey)).size} productores comparten esta posición</span></>
                  : <><strong>{countLabel}</strong><span>{isPlan ? "Elige un puesto o un productor" : "Toca un producto para descubrir su origen"}</span></>}
              </div>
              {physical.placement ? <button type="button" className="chisan-button" onClick={() => choosePlacements([physical.placement!])}>Elegir productor</button> : null}
            </>}
          </div>
        </section>
      </div>
      <CatalogResultsSheet viewerRef={sheet} open={open} onOpenChange={(value) => { setOpen(value); if (!value) { setChoices(null); setQuery(""); } }}
        label={`Buscar · ${countLabel}`} closeLabel="Volver a la imagen y al mapa" title={messages.producers} showLabel>
        <label className={styles.search}><MagnifyingGlassIcon size={20} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isPlan ? "Nombre o número de puesto" : "Productor o producto"} aria-label={isPlan ? "Buscar expositor o puesto" : "Buscar productor o producto"} /></label>
        {choices ? <button type="button" className={`chisan-button ${styles.allChoices}`} onClick={() => setChoices(null)}>Ver todas las posiciones</button> : null}
        <div className={styles.results}>
          {visiblePlacements.map((group) => <section key={group.id} className={styles.resultGroup}>
            <h3>{placementTitle(group)}</h3>
            {group.points.map((point) => {
              const item = itemsByKey.get(point.producerKey)!;
              return <button key={point.id} type="button" className={styles.result} aria-pressed={selected?.key === item.key && (!pointId || physical.point?.id === point.id)} onClick={() => finishChoice(item.key, point.id)}>
                <strong>{item.name}</strong><span>{!isPlan && point.label !== item.name ? `${point.label} · ` : ""}{item.city}</span>
              </button>;
            })}
          </section>)}
          {withoutPosition.map((item) => <button key={item.key} type="button" className={styles.result} onClick={() => finishChoice(item.key)}><strong>{item.name}</strong><span>{item.city} · Sin posición señalada</span></button>)}
          {!visiblePlacements.length && !withoutPosition.length ? <p>No hay coincidencias. Prueba otro nombre.</p> : null}
        </div>
      </CatalogResultsSheet>
    </div>
    {!isPlan ? <p className={styles.note}>{image.preview ? "Propuesta pendiente de confirmación." : image.updatedOn ? `Imagen publicada el ${image.updatedOn}.` : ""} La imagen no indica existencias actuales.</p> : null}
  </section>;
}

function ProducerSelectionExplorerFromSearchParams(props: ExplorerProps) {
  const searchParams = useSearchParams();
  return <ProducerSelectionExplorerView {...props} selectedKey={searchParams.get("highlight")?.trim() ?? ""} pointId={searchParams.get("point")?.trim() ?? ""} />;
}

export function ProducerSelectionExplorer(props: ExplorerProps) {
  return <Suspense fallback={<ProducerSelectionExplorerView {...props} selectedKey="" pointId="" />}><ProducerSelectionExplorerFromSearchParams {...props} /></Suspense>;
}
