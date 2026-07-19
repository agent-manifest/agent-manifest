// Stable catalog of the 73 ratified ASV-* rules (Gate B §F–§Q). Single source of
// truth for a rule's level and default severity, so every diagnostic is emitted
// consistently and test coverage can be asserted against it.

export const LEVELS = Object.freeze({
  WORK: 'work',
  VERSION: 'version',
  ARTIFACT: 'artifact',
  RELATION: 'relation',
  CORPUS: 'corpus',
  EXPORTS: 'exports',
  WEB: 'web',
  SCHOLAR: 'scholar',
  RELEASE: 'release',
  WITHDRAWN: 'withdrawn',
  PROVENANCE: 'provenance'
});

const E = 'ERROR';
const W = 'WARNING';
const I = 'INFO';

/** rule_id -> { level, severity (default), summary } */
export const RULES = Object.freeze({
  // --- Work (14) ---
  'ASV-WORK-001': { level: LEVELS.WORK, severity: E, summary: 'id present, opaque, unique, not reassigned from a withdrawn Work' },
  'ASV-WORK-002': { level: LEVELS.WORK, severity: E, summary: 'slug format, uniqueness, no year/version/type/status token' },
  'ASV-WORK-003': { level: LEVELS.WORK, severity: E, summary: 'title present and coherent across surfaces/exports' },
  'ASV-WORK-004': { level: LEVELS.WORK, severity: E, summary: '>=1 author, all human, ORCID checksum valid' },
  'ASV-WORK-005': { level: LEVELS.WORK, severity: E, summary: 'single type in enum; external discrepancy as provenance' },
  'ASV-WORK-006': { level: LEVELS.WORK, severity: E, summary: 'status enum, Work-level only' },
  'ASV-WORK-007': { level: LEVELS.WORK, severity: E, summary: 'language BCP-47 valid on the surface (not enc)' },
  'ASV-WORK-008': { level: LEVELS.WORK, severity: E, summary: 'abstract present, prerendered, not gated' },
  'ASV-WORK-009': { level: LEVELS.WORK, severity: E, summary: 'doi_concept valid and distinct from every doi_version' },
  'ASV-WORK-010': { level: LEVELS.WORK, severity: E, summary: 'isbn present and valid when type=book' },
  'ASV-WORK-011': { level: LEVELS.WORK, severity: E, summary: '>=1 license with valid SPDX' },
  'ASV-WORK-012': { level: LEVELS.WORK, severity: E, summary: 'visibility enum; never noindex on public' },
  'ASV-WORK-013': { level: LEVELS.WORK, severity: W, summary: 'external_urls vs repositories separated (non-code vs code)' },
  'ASV-WORK-014': { level: LEVELS.WORK, severity: E, summary: 'no impossible cross-field states' },

  // --- Version (6) ---
  'ASV-VER-001': { level: LEVELS.VERSION, severity: E, summary: 'vN present, monotonic, unique, no gaps' },
  'ASV-VER-002': { level: LEVELS.VERSION, severity: E, summary: 'version date ISO, mandatory' },
  'ASV-VER-003': { level: LEVELS.VERSION, severity: E, summary: 'doi_version valid, distinct from concept, only in Version' },
  'ASV-VER-004': { level: LEVELS.VERSION, severity: E, summary: 'exactly one current Version per Work' },
  'ASV-VER-005': { level: LEVELS.VERSION, severity: E, summary: 'Work/Version stay distinct records (invariant SSOT)' },
  'ASV-VER-006': { level: LEVELS.VERSION, severity: W, summary: 'changelog append-only' },

  // --- Artifact (6) ---
  'ASV-ART-001': { level: LEVELS.ARTIFACT, severity: E, summary: 'artifact belongs to exactly one Version' },
  'ASV-ART-002': { level: LEVELS.ARTIFACT, severity: E, summary: 'kind in enum' },
  'ASV-ART-003': { level: LEVELS.ARTIFACT, severity: E, summary: 'PDF co-located with its landing subdirectory' },
  'ASV-ART-004': { level: LEVELS.ARTIFACT, severity: E, summary: 'PDF <= 5 MB' },
  'ASV-ART-005': { level: LEVELS.ARTIFACT, severity: E, summary: 'checksum present and matching (fixity)' },
  'ASV-ART-006': { level: LEVELS.ARTIFACT, severity: E, summary: 'text_extractable (conceptual; INFO in current pass)' },

  // --- Relations (7) ---
  'ASV-REL-001': { level: LEVELS.RELATION, severity: E, summary: 'predicate within allowed vocabulary; no generic relatedWork' },
  'ASV-REL-002': { level: LEVELS.RELATION, severity: E, summary: 'inverse relation mandatory' },
  'ASV-REL-003': { level: LEVELS.RELATION, severity: E, summary: 'relation target exists' },
  'ASV-REL-004': { level: LEVELS.RELATION, severity: E, summary: 'no invalid cycles in acyclic relations' },
  'ASV-REL-005': { level: LEVELS.RELATION, severity: E, summary: 'implements is the only proprietary predicate' },
  'ASV-REL-006': { level: LEVELS.RELATION, severity: E, summary: 'no ams:supersedes; use DataCite Obsoletes/IsObsoletedBy' },
  'ASV-REL-007': { level: LEVELS.RELATION, severity: E, summary: 'translations reciprocal, modeled as translation not version' },

  // --- Corpus (4) ---
  'ASV-CORP-001': { level: LEVELS.CORPUS, severity: E, summary: 'global uniqueness of id, slug, doi_version' },
  'ASV-CORP-002': { level: LEVELS.CORPUS, severity: W, summary: 'tier assignment coherent with AS-3/AS-4/AS-5/V6' },
  'ASV-CORP-003': { level: LEVELS.CORPUS, severity: E, summary: 'objects without DOI are not modeled as Works' },
  'ASV-CORP-004': { level: LEVELS.CORPUS, severity: E, summary: 'independent corpus (e.g. AGTS) never a layer/dependency' },

  // --- Exports (3) ---
  'ASV-EXP-001': { level: LEVELS.EXPORTS, severity: E, summary: 'CSL-JSON as canonical derived representation' },
  'ASV-EXP-002': { level: LEVELS.EXPORTS, severity: E, summary: 'field identity across all export formats' },
  'ASV-EXP-003': { level: LEVELS.EXPORTS, severity: E, summary: 'generated fields never hand-edited (reproducible)' },

  // --- Web / canonical / JSON-LD (14) ---
  'ASV-WEB-001': { level: LEVELS.WEB, severity: E, summary: '/works/<slug> self-canonical' },
  'ASV-WEB-002': { level: LEVELS.WEB, severity: E, summary: '/works/<slug>/vN historical self-canonical' },
  'ASV-WEB-003': { level: LEVELS.WEB, severity: E, summary: 'current version not duplicated at /vN' },
  'ASV-WEB-004': { level: LEVELS.WEB, severity: E, summary: 'translations self-canonical + reciprocal hreflang' },
  'ASV-WEB-005': { level: LEVELS.WEB, severity: E, summary: 'faceted views noindex,follow without cross canonical' },
  'ASV-WEB-006': { level: LEVELS.WEB, severity: E, summary: 'no cross-domain canonical to Zenodo/external' },
  'ASV-WEB-007': { level: LEVELS.WEB, severity: E, summary: 'human version signposting on current landing (acta §5.B)' },
  'ASV-WEB-008': { level: LEVELS.WEB, severity: W, summary: 'signposting baseline in HTML <link>' },
  'ASV-WEB-009': { level: LEVELS.WEB, severity: W, summary: 'rel=alternate to exports' },
  'ASV-WEB-010': { level: LEVELS.WEB, severity: E, summary: 'previous alias resolved by 301' },
  'ASV-WEB-011': { level: LEVELS.WEB, severity: W, summary: 'online DOI resolution: separable, cacheable, non-blocking' },
  'ASV-WEB-020': { level: LEVELS.WEB, severity: E, summary: 'JSON-LD @type matches canonical type' },
  'ASV-WEB-021': { level: LEVELS.WEB, severity: E, summary: 'JSON-LD includes DOI/ORCID/inLanguage/sameAs/relations' },
  'ASV-WEB-022': { level: LEVELS.WEB, severity: W, summary: 'rel=alternate machine-readable present' },

  // --- Google Scholar (6) ---
  'ASV-SCH-001': { level: LEVELS.SCHOLAR, severity: E, summary: 'citation_title present and equal to title' },
  'ASV-SCH-002': { level: LEVELS.SCHOLAR, severity: E, summary: 'citation_author per human author' },
  'ASV-SCH-003': { level: LEVELS.SCHOLAR, severity: E, summary: 'citation_publication_date present (YYYY/MM/DD)' },
  'ASV-SCH-004': { level: LEVELS.SCHOLAR, severity: E, summary: 'citation_pdf_url present and co-located' },
  'ASV-SCH-005': { level: LEVELS.SCHOLAR, severity: E, summary: 'metadata matches PDF (conceptual)' },
  'ASV-SCH-006': { level: LEVELS.SCHOLAR, severity: E, summary: 'abstract visible + no noindex on public Works' },

  // --- Release atomic (4) ---
  'ASV-RLS-001': { level: LEVELS.RELEASE, severity: E, summary: 'outgoing version frozen/validated at /vN before publish' },
  'ASV-RLS-002': { level: LEVELS.RELEASE, severity: E, summary: '/vN verifies content, checksum, DOI, canonical' },
  'ASV-RLS-003': { level: LEVELS.RELEASE, severity: E, summary: 'atomic replacement of the current version' },
  'ASV-RLS-004': { level: LEVELS.RELEASE, severity: E, summary: 'safe abort preserves the previous public version' },

  // --- Withdrawn (4) ---
  'ASV-WD-001': { level: LEVELS.WITHDRAWN, severity: E, summary: 'status=withdrawn at Work level' },
  'ASV-WD-002': { level: LEVELS.WITHDRAWN, severity: E, summary: 'public self-canonical tombstone, not 404' },
  'ASV-WD-003': { level: LEVELS.WITHDRAWN, severity: E, summary: 'no automatic unlisted/noindex from withdrawal' },
  'ASV-WD-004': { level: LEVELS.WITHDRAWN, severity: E, summary: 'excluded from active indexes/feeds; kept in historical sitemap' },

  // --- Provenance / authorship (5) ---
  'ASV-PROV-001': { level: LEVELS.PROVENANCE, severity: E, summary: '100% human authorship' },
  'ASV-PROV-002': { level: LEVELS.PROVENANCE, severity: E, summary: 'record creator separate from intellectual author' },
  'ASV-PROV-003': { level: LEVELS.PROVENANCE, severity: E, summary: 'build activity separate; tool never author/contributor' },
  'ASV-PROV-004': { level: LEVELS.PROVENANCE, severity: W, summary: 'technical assistance only as a non-authorial note' },
  'ASV-PROV-005': { level: LEVELS.PROVENANCE, severity: E, summary: 'external discrepancies as provenance, no simultaneous types' }
});

export const RULE_IDS = Object.freeze(Object.keys(RULES));

export function ruleMeta(ruleId) {
  const meta = RULES[ruleId];
  if (!meta) throw new Error(`Unknown rule id: ${ruleId}`);
  return meta;
}
