// ASV-WEB-* rules over declared surface directives (single record).
// Faceted-view rule ASV-WEB-005 has no facet surface in Gate C and is deferred
// (documented in docs/GATE-C.md). Cross-record ASV-WEB-004 lives in corpus.js.

import { diag, SEVERITY } from '../diagnostics.js';
import { worksUrl, isTextual, currentVersion, TYPE_TO_JSONLD, BASE_URL } from '../lib/canonical.js';
import { isSurfaceLanguageValid } from '../lib/bcp47.js';
import { classifyDoiResolution } from '../lib/remote.js';

const HOST = 'agent-manifest-spec.org';

function host(url) {
  try { return new URL(url).host; } catch { return null; }
}

export function validateWeb(work, ctx) {
  const out = [];
  const p = ctx.wpath;
  const slug = work.slug;
  const web = work.web;
  const isPublic = work.visibility === 'public';
  const cur = currentVersion(work);

  // ASV-WEB-011 — optional online DOI resolution is offline/skipped here (INFO)
  if (work.doi_concept || cur?.doi_version) {
    const r = classifyDoiResolution({ mode: 'offline' });
    out.push(diag('ASV-WEB-011', { severity: SEVERITY.INFO, path: `${p}`, message: r.reason, remediation: 'Online resolution is a separate, cacheable, non-blocking check', evidence: r }));
  }

  if (web) {
    // ASV-WEB-001 / ASV-WEB-006 — self-canonical, no cross-domain
    if (web.canonical) {
      const h = host(web.canonical);
      if (h && h !== HOST) {
        out.push(diag('ASV-WEB-006', { path: `${p}.web.canonical`, message: `Cross-domain canonical to external host: ${web.canonical}`, remediation: `Canonical must stay on ${HOST}; link Zenodo as sameAs`, evidence: web.canonical }));
      } else if (slug && web.canonical !== worksUrl(slug)) {
        out.push(diag('ASV-WEB-001', { path: `${p}.web.canonical`, message: `Current landing not self-canonical: ${web.canonical}`, remediation: `Set canonical to ${worksUrl(slug)}`, evidence: web.canonical }));
      }
    }

    // ASV-WEB-007 — human version signposting on current public landing
    if (isPublic && cur && web.version_signposted !== true) {
      out.push(diag('ASV-WEB-007', { path: `${p}.web.version_signposted`, message: 'Current landing missing version signposting (vN + DOI + immutable-cite guidance)', remediation: 'Show current vN, its DOI, and immutable-cite guidance (acta §5.B)' }));
    }

    // ASV-WEB-008 — signposting baseline (WARNING)
    if (!Array.isArray(web.signposting) || web.signposting.length === 0) {
      out.push(diag('ASV-WEB-008', { severity: SEVERITY.WARNING, path: `${p}.web.signposting`, message: 'Signposting baseline (<link>) absent', remediation: 'Emit cite-as/describedby/author/type/item as HTML <link>' }));
    }

    // ASV-WEB-010 — previous alias resolved by 301
    (web.alias_redirects ?? []).forEach((a, i) => {
      if (a.status !== 301) out.push(diag('ASV-WEB-010', { path: `${p}.web.alias_redirects[${i}]`, message: `Alias '${a.from}' resolves with ${a.status}, not 301`, remediation: 'Configure a 301 from the previous alias to the canonical URL', evidence: a.status }));
    });

    // ASV-WEB-020 — JSON-LD @type matches canonical type
    if (web.jsonld_type && TYPE_TO_JSONLD[work.type] && web.jsonld_type !== TYPE_TO_JSONLD[work.type]) {
      out.push(diag('ASV-WEB-020', { path: `${p}.web.jsonld_type`, message: `JSON-LD @type '${web.jsonld_type}' incoherent with type '${work.type}'`, remediation: `Use @type ${TYPE_TO_JSONLD[work.type]}`, evidence: web.jsonld_type }));
    }

    // ASV-WEB-021 — JSON-LD includes DOI/inLanguage/sameAs (and valid language)
    if (web.jsonld) {
      const j = web.jsonld;
      if (!j.identifier) out.push(diag('ASV-WEB-021', { path: `${p}.web.jsonld.identifier`, message: 'JSON-LD missing identifier (DOI)', remediation: 'Populate identifier from the canonical DOI' }));
      if (!Array.isArray(j.sameAs) || j.sameAs.length === 0) out.push(diag('ASV-WEB-021', { path: `${p}.web.jsonld.sameAs`, message: 'JSON-LD missing sameAs', remediation: 'Include Zenodo/profile sameAs links' }));
      if (j.inLanguage && !isSurfaceLanguageValid(j.inLanguage)) out.push(diag('ASV-WEB-021', { path: `${p}.web.jsonld.inLanguage`, message: `JSON-LD inLanguage invalid: ${j.inLanguage}`, remediation: "Use BCP-47 (not 'enc')", evidence: j.inLanguage }));
    }

    // ASV-WEB-009 / ASV-WEB-022 — rel=alternate to exports (WARNING)
    if (work.exports && (!Array.isArray(web.alternates) || web.alternates.length === 0)) {
      out.push(diag('ASV-WEB-009', { severity: SEVERITY.WARNING, path: `${p}.web.alternates`, message: 'Exports not linked via rel=alternate', remediation: 'Link each export with rel=alternate and its MIME type' }));
      out.push(diag('ASV-WEB-022', { severity: SEVERITY.WARNING, path: `${p}.web.alternates`, message: 'Machine-readable rel=alternate absent', remediation: 'Expose machine-readable representations via rel=alternate' }));
    }
  }

  // ASV-WEB-002 / ASV-WEB-003 — historical self-canonical + current not duplicated at /vN
  (work.versions ?? []).forEach((v, i) => {
    const w = v.web;
    if (!w) return;
    const vp = `${p}.versions[${i}].web`;
    if (v.is_current) {
      if (typeof w.path === 'string' && new RegExp(`/works/${slug}/v\\d+/?$`).test(w.path)) {
        out.push(diag('ASV-WEB-003', { path: `${vp}.path`, message: 'Current version duplicated at a /vN path', remediation: 'Serve the current version only at /works/<slug>', evidence: w.path }));
      }
    } else if (w.canonical && slug) {
      const expected = `${worksUrl(slug)}/${v.vN}`;
      if (w.canonical !== expected) {
        out.push(diag('ASV-WEB-002', { path: `${vp}.canonical`, message: `Historical /vN not self-canonical: ${w.canonical}`, remediation: `Set canonical to ${expected}`, evidence: w.canonical }));
      }
    }
  });

  return out;
}
