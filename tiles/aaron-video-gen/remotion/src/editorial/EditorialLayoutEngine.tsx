import React from "react";
import { Img } from "remotion";
import { editorial } from "./EditorialMotionSystem";

export type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type LayoutSlot = {
  rect: LayoutRect;
  maxItems?: number;
};

type EditorialLayout = {
  id: string;
  slots: Record<string, LayoutSlot>;
};

const canvas = { width: 1920, height: 1080 } as const;

const captionProtectedZone: LayoutRect = {
  x: 0,
  y: 910,
  width: canvas.width,
  height: canvas.height - 910,
};

/**
 * Registered layout recipes are the only coordinates scenes may use for their
 * primary information regions. Scene code may animate within a slot, but may
 * not invent a competing major region.
 */
export const editorialLayouts = {
  statement: {
    id: "statement",
    slots: {
      headline: {
        rect: { x: 176, y: 214, width: 1568, height: 300 },
        maxItems: 3,
      },
      supporting: {
        rect: { x: 336, y: 560, width: 1248, height: 88 },
        maxItems: 2,
      },
    },
  },
  "cover-hero": {
    id: "cover-hero",
    slots: {
      title: {
        rect: { x: 112, y: 535, width: 850, height: 332 },
        maxItems: 4,
      },
      brand: {
        rect: { x: 88, y: 56, width: 670, height: 92 },
        maxItems: 3,
      },
    },
  },
  "people-hero": {
    id: "people-hero",
    slots: {
      copy: {
        rect: { x: 112, y: 292, width: 620, height: 370 },
        maxItems: 3,
      },
      media: {
        rect: { x: 784, y: 214, width: 1024, height: 606 },
        maxItems: 1,
      },
      roles: {
        rect: { x: 112, y: 730, width: 620, height: 86 },
        maxItems: 4,
      },
    },
  },
  "decision-row": {
    id: "decision-row",
    slots: {
      header: {
        rect: { x: editorial.safe.left, y: editorial.safe.top, width: editorial.safe.width, height: 168 },
        maxItems: 2,
      },
      nodes: {
        rect: { x: editorial.safe.left, y: 340, width: editorial.safe.width, height: 144 },
        maxItems: 4,
      },
      detail: {
        rect: { x: 600, y: 620, width: 720, height: 158 },
        maxItems: 1,
      },
      outcome: {
        rect: { x: editorial.safe.left, y: 794, width: editorial.safe.width, height: 108 },
        maxItems: 2,
      },
    },
  },
  "ownership-map": {
    id: "ownership-map",
    slots: {
      header: {
        rect: { x: editorial.safe.left, y: editorial.safe.top, width: editorial.safe.width, height: 168 },
        maxItems: 2,
      },
      diagram: {
        rect: { x: 150, y: 332, width: 1620, height: 438 },
        maxItems: 7,
      },
      outcome: {
        rect: { x: editorial.safe.left, y: 824, width: editorial.safe.width, height: 62 },
        maxItems: 2,
      },
    },
  },
  "ownership-assets": {
    id: "ownership-assets",
    slots: {
      header: {
        rect: { x: editorial.safe.left, y: editorial.safe.top, width: editorial.safe.width, height: 168 },
        maxItems: 2,
      },
      assets: {
        rect: { x: editorial.safe.left, y: 324, width: 1040, height: 460 },
        maxItems: 7,
      },
      provider: {
        rect: { x: 1190, y: 324, width: 618, height: 460 },
        maxItems: 1,
      },
      outcome: {
        rect: { x: editorial.safe.left, y: 824, width: editorial.safe.width, height: 62 },
        maxItems: 2,
      },
    },
  },
  "media-split": {
    id: "media-split",
    slots: {
      header: {
        rect: { x: editorial.safe.left, y: editorial.safe.top, width: editorial.safe.width, height: 146 },
        maxItems: 2,
      },
      media: {
        rect: { x: editorial.safe.left, y: 318, width: 760, height: 420 },
        maxItems: 1,
      },
      analysis: {
        rect: { x: 948, y: 318, width: 860, height: 420 },
        maxItems: 4,
      },
      outcome: {
        rect: { x: editorial.safe.left, y: 810, width: editorial.safe.width, height: 90 },
        maxItems: 2,
      },
    },
  },
  "workflow-gates": {
    id: "workflow-gates",
    slots: {
      header: {
        rect: { x: editorial.safe.left, y: editorial.safe.top, width: editorial.safe.width, height: 146 },
        maxItems: 2,
      },
      gates: {
        rect: { x: editorial.safe.left, y: 318, width: editorial.safe.width, height: 320 },
        maxItems: 5,
      },
      workflowRail: {
        rect: { x: editorial.safe.left, y: 690, width: editorial.safe.width, height: 84 },
        maxItems: 8,
      },
      pattern: {
        rect: { x: 410, y: 820, width: 1100, height: 44 },
        maxItems: 5,
      },
    },
  },
  "split-loop": {
    id: "split-loop",
    slots: {
      stageLabel: {
        rect: { x: editorial.safe.left, y: editorial.safe.top, width: editorial.safe.width, height: 68 },
        maxItems: 2,
      },
      comparison: {
        rect: { x: editorial.safe.left, y: 318, width: editorial.safe.width, height: 420 },
        maxItems: 2,
      },
      outcome: {
        rect: { x: editorial.safe.left, y: 810, width: editorial.safe.width, height: 90 },
        maxItems: 3,
      },
    },
  },
} as const satisfies Record<string, EditorialLayout>;

export type EditorialLayoutId = keyof typeof editorialLayouts;

export const layoutStyle = (rect: LayoutRect): React.CSSProperties => ({
  position: "absolute",
  left: rect.x,
  top: rect.y,
  width: rect.width,
  height: rect.height,
});

export const rectsOverlap = (a: LayoutRect, b: LayoutRect): boolean =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

export const validateEditorialLayouts = (): string[] => {
  const issues: string[] = [];
  const workflow = editorialLayouts["workflow-gates"].slots;
  const coverHero = editorialLayouts["cover-hero"].slots;
  const splitLoop = editorialLayouts["split-loop"].slots;
  const mediaSplit = editorialLayouts["media-split"].slots;
  const peopleHero = editorialLayouts["people-hero"].slots;
  const decisionRow = editorialLayouts["decision-row"].slots;
  const ownershipMap = editorialLayouts["ownership-map"].slots;
  const ownershipAssets = editorialLayouts["ownership-assets"].slots;

  const checks: Array<[string, LayoutRect, LayoutRect]> = [
    ["workflow gates / rail", workflow.gates.rect, workflow.workflowRail.rect],
    ["cover hero brand / title", coverHero.brand.rect, coverHero.title.rect],
    ["cover hero title / captions", coverHero.title.rect, captionProtectedZone],
    ["workflow rail / pattern", workflow.workflowRail.rect, workflow.pattern.rect],
    ["workflow pattern / captions", workflow.pattern.rect, captionProtectedZone],
    ["split loop comparison / outcome", splitLoop.comparison.rect, splitLoop.outcome.rect],
    ["split loop outcome / captions", splitLoop.outcome.rect, captionProtectedZone],
    ["media split media / analysis", mediaSplit.media.rect, mediaSplit.analysis.rect],
    ["media split media / outcome", mediaSplit.media.rect, mediaSplit.outcome.rect],
    ["media split analysis / outcome", mediaSplit.analysis.rect, mediaSplit.outcome.rect],
    ["media split outcome / captions", mediaSplit.outcome.rect, captionProtectedZone],
    ["people hero copy / media", peopleHero.copy.rect, peopleHero.media.rect],
    ["people hero roles / captions", peopleHero.roles.rect, captionProtectedZone],
    ["decision row nodes / detail", decisionRow.nodes.rect, decisionRow.detail.rect],
    ["decision row detail / outcome", decisionRow.detail.rect, decisionRow.outcome.rect],
    ["decision row outcome / captions", decisionRow.outcome.rect, captionProtectedZone],
    ["ownership map diagram / outcome", ownershipMap.diagram.rect, ownershipMap.outcome.rect],
    ["ownership map outcome / captions", ownershipMap.outcome.rect, captionProtectedZone],
    ["ownership assets / provider", ownershipAssets.assets.rect, ownershipAssets.provider.rect],
    ["ownership assets / outcome", ownershipAssets.assets.rect, ownershipAssets.outcome.rect],
    ["ownership provider / outcome", ownershipAssets.provider.rect, ownershipAssets.outcome.rect],
    ["ownership assets outcome / captions", ownershipAssets.outcome.rect, captionProtectedZone],
  ];

  for (const [name, first, second] of checks) {
    if (rectsOverlap(first, second)) {
      issues.push(`${name} overlap`);
    }
  }

  return issues;
};

export const validateLayoutItemCount = (
  layoutId: EditorialLayoutId,
  slot: string,
  itemCount: number,
): string | null => {
  const definition: EditorialLayout = editorialLayouts[layoutId];
  const slotDefinition = definition.slots[slot];
  if (!slotDefinition) return `Unknown ${layoutId} slot: ${slot}`;
  if (
    slotDefinition.maxItems !== undefined &&
    itemCount > slotDefinition.maxItems
  ) {
    return `${layoutId}.${slot} supports at most ${slotDefinition.maxItems} items, received ${itemCount}`;
  }
  return null;
};

type EditorialStatementProps = {
  eyebrow?: string;
  title: React.ReactNode;
  supporting?: React.ReactNode;
  opacity?: number;
  transform?: string;
};

export const EditorialStatement: React.FC<EditorialStatementProps> = ({
  eyebrow,
  title,
  supporting,
  opacity = 1,
  transform,
}) => {
  const layout = editorialLayouts.statement.slots;
  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform }}>
      <div
        style={{
          ...layoutStyle(layout.headline.rect),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {eyebrow ? (
          <div
            style={{
              color: editorial.color.signal,
              fontSize: editorial.type.label,
              fontWeight: 760,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            marginTop: eyebrow ? 24 : 0,
            color: editorial.color.text,
            fontSize: 96,
            lineHeight: 0.98,
            fontWeight: 830,
            letterSpacing: 0,
          }}
        >
          {title}
        </div>
      </div>
      {supporting ? (
        <div
          style={{
            ...layoutStyle(layout.supporting.rect),
            color: editorial.color.muted,
            fontSize: editorial.type.body,
            fontWeight: 560,
            lineHeight: 1.35,
            textAlign: "center",
          }}
        >
          {supporting}
        </div>
      ) : null}
    </div>
  );
};

type EditorialMediaSplitProps = {
  src: string;
  sourceLabel?: string;
  eyebrow?: string;
  title: React.ReactNode;
  copy: React.ReactNode;
  points?: string[];
  outcome?: React.ReactNode;
  opacity?: number;
  transform?: string;
};

/**
 * A fixed evidence/media slot with an unframed analysis column. It is intended
 * for a short reset in attention, not a second card grid.
 */
export const EditorialMediaSplit: React.FC<EditorialMediaSplitProps> = ({
  src,
  sourceLabel,
  eyebrow,
  title,
  copy,
  points = [],
  outcome,
  opacity = 1,
  transform,
}) => {
  const layout = editorialLayouts["media-split"].slots;
  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform }}>
      <div
        style={{
          ...layoutStyle(layout.media.rect),
          overflow: "hidden",
          backgroundColor: editorial.color.surface,
          border: `1px solid ${editorial.color.lineStrong}`,
          borderRadius: editorial.radius,
        }}
      >
        <Img
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {sourceLabel ? (
          <div
            style={{
              position: "absolute",
              left: 20,
              bottom: 18,
              padding: "8px 10px",
              backgroundColor: "rgba(9, 12, 11, 0.82)",
              color: editorial.color.text,
              fontSize: editorial.type.micro,
              fontWeight: 720,
              textTransform: "uppercase",
            }}
          >
            {sourceLabel}
          </div>
        ) : null}
      </div>
      <div
        style={{
          ...layoutStyle(layout.analysis.rect),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {eyebrow ? (
          <div
            style={{
              color: editorial.color.signal,
              fontSize: editorial.type.label,
              fontWeight: 760,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            marginTop: eyebrow ? 20 : 0,
            color: editorial.color.text,
            fontSize: editorial.type.sceneTitle,
            fontWeight: 820,
            lineHeight: 1.02,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 28,
            maxWidth: 760,
            color: editorial.color.muted,
            fontSize: editorial.type.body,
            lineHeight: 1.4,
            fontWeight: 560,
          }}
        >
          {copy}
        </div>
        {points.length ? (
          <div style={{ marginTop: 28, display: "grid", gap: 10 }}>
            {points.map((point, index) => (
              <div
                key={point}
                style={{
                  display: "grid",
                  gridTemplateColumns: "30px 1fr",
                  gap: 12,
                  color: editorial.color.text,
                  fontSize: 22,
                  fontWeight: 680,
                }}
              >
                <span style={{ color: editorial.color.signal }}>
                  0{index + 1}
                </span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {outcome ? (
        <div
          style={{
            ...layoutStyle(layout.outcome.rect),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: `2px solid ${editorial.color.signal}`,
            color: editorial.color.text,
            fontSize: 30,
            fontWeight: 740,
            textAlign: "center",
          }}
        >
          {outcome}
        </div>
      ) : null}
    </div>
  );
};
