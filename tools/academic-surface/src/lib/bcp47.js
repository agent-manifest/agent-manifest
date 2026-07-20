// Surface language validation (ASV-WORK-007). The Academic Surface requires a
// well-formed BCP-47 tag whose primary subtag is an ISO 639-1 (two-letter) code.
// This deliberately rejects `enc` (a 3-letter ISO 639-3 code mistakenly present
// in some Zenodo records) on the surface itself. The Zenodo mirror value lives in
// provenance.external_metadata and is only a WARNING there (Precision 4).

// ISO 639-1 two-letter codes (complete set).
const ISO_639_1 = new Set(
  ('aa ab ae af ak am an ar as av ay az ba be bg bh bi bm bn bo br bs ca ce ch co cr cs cu cv cy ' +
    'da de dv dz ee el en eo es et eu fa ff fi fj fo fr fy ga gd gl gn gu gv ha he hi ho hr ht hu ' +
    'hy hz ia id ie ig ii ik io is it iu ja jv ka kg ki kj kk kl km kn ko kr ks ku kv kw ky la lb ' +
    'lg li ln lo lt lu lv mg mh mi mk ml mn mr ms mt my na nb nd ne ng nl nn no nr nv ny oc oj om ' +
    'or os pa pi pl ps pt qu rm rn ro ru rw sa sc sd se sg si sk sl sm sn so sq sr ss st su sv sw ' +
    'ta te tg th ti tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa wo xh yi yo za zh zu')
    .split(/\s+/)
);

// General BCP-47 shape: primary subtag + optional script/region/variant subtags.
const BCP47_SHAPE = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{1,8})*$/;

/** True when the tag is a valid surface language (ISO 639-1 primary subtag). */
export function isSurfaceLanguageValid(tag) {
  if (typeof tag !== 'string' || !BCP47_SHAPE.test(tag)) return false;
  const primary = tag.split('-')[0].toLowerCase();
  return ISO_639_1.has(primary);
}
