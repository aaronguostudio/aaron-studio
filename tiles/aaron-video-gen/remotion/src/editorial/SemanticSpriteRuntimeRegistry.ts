export interface SemanticSpriteRuntimeAsset {
  assetId: string;
  staticFilePath: string;
  sha256: string;
  visibleFromSec: number;
  visibleUntilSec: number;
  enterDurationSec: number;
  exitDurationSec: number;
  translateY: number;
  exitTranslateY: number;
  maxOpacity: number;
}

export interface SemanticSpriteRuntimeComposition {
  compositionId: string;
  fps: number;
  assets: Record<string, SemanticSpriteRuntimeAsset>;
}

export type SemanticSpriteRuntimeRegistry = Record<
  string,
  SemanticSpriteRuntimeComposition
>;

const authorityLedgerAssetId = "generated:authority-ledger-v1";
const authorityLedgerLongformAssetId =
  "generated:authority-ledger-longform-v1";

export const semanticSpriteRuntimeRegistry: SemanticSpriteRuntimeRegistry = {
  AuthorityBoundaryConceptPrototype: {
    compositionId: "AuthorityBoundaryConceptPrototype",
    fps: 30,
    assets: {
      [authorityLedgerAssetId]: {
        assetId: authorityLedgerAssetId,
        staticFilePath: "authority-boundary/sprites/authority-ledger-v1.png",
        sha256: "5b642f943c86e93f954e501d4f153bd84191552bc975f719caa48494dcba1295",
        visibleFromSec: 20.7,
        visibleUntilSec: 23.9,
        enterDurationSec: 0.4,
        exitDurationSec: 11 / 30,
        translateY: 10,
        exitTranslateY: 6,
        maxOpacity: 0.95,
      },
    },
  },
  AuthorityBoundaryFinalVideo: {
    compositionId: "AuthorityBoundaryFinalVideo",
    fps: 30,
    assets: {
      [authorityLedgerAssetId]: {
        assetId: authorityLedgerAssetId,
        staticFilePath: "authority-boundary/sprites/authority-ledger-v1.png",
        sha256: "5b642f943c86e93f954e501d4f153bd84191552bc975f719caa48494dcba1295",
        visibleFromSec: 20.7,
        visibleUntilSec: 23.9,
        enterDurationSec: 0.4,
        exitDurationSec: 11 / 30,
        translateY: 10,
        exitTranslateY: 6,
        maxOpacity: 0.95,
      },
    },
  },
  AuthorityBoundaryLongformFinal: {
    compositionId: "AuthorityBoundaryLongformFinal",
    fps: 30,
    assets: {
      [authorityLedgerLongformAssetId]: {
        assetId: authorityLedgerLongformAssetId,
        staticFilePath:
          "authority-boundary/sprites/authority-ledger-longform-v1.png",
        sha256: "b0ed04130bcc40a509b727145430eba4f6870f1e951cabaf01196c25f2c3c881",
        visibleFromSec: 395.551375,
        visibleUntilSec: 408.1,
        enterDurationSec: 0.4,
        exitDurationSec: 11 / 30,
        translateY: 10,
        exitTranslateY: 6,
        maxOpacity: 0.88,
      },
    },
  },
};

export const AUTHORITY_BOUNDARY_CONCEPT_RUNTIME =
  semanticSpriteRuntimeRegistry.AuthorityBoundaryConceptPrototype;

export const AUTHORITY_LEDGER_RUNTIME_ASSET =
  AUTHORITY_BOUNDARY_CONCEPT_RUNTIME.assets[authorityLedgerAssetId];

export const AUTHORITY_BOUNDARY_FINAL_RUNTIME =
  semanticSpriteRuntimeRegistry.AuthorityBoundaryFinalVideo;

export const AUTHORITY_LEDGER_FINAL_RUNTIME_ASSET =
  AUTHORITY_BOUNDARY_FINAL_RUNTIME.assets[authorityLedgerAssetId];

export const AUTHORITY_BOUNDARY_LONGFORM_RUNTIME =
  semanticSpriteRuntimeRegistry.AuthorityBoundaryLongformFinal;

export const AUTHORITY_LEDGER_LONGFORM_RUNTIME_ASSET =
  AUTHORITY_BOUNDARY_LONGFORM_RUNTIME.assets[authorityLedgerLongformAssetId];
