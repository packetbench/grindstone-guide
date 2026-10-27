/* Add researched series lessons to the shared library without rewriting the original cards. */
(() => {
  'use strict';
  const data = window.GRINDSTONE;
  if (!data) return;
  const additions = [...(window.GRINDSTONE_SERIES_MOVES?.entries || []), ...(window.GRINDSTONE_SERIES_BOTTOM?.entries || []), ...(window.GRINDSTONE_SERIES_NEUTRAL?.moves || []), ...(window.GRINDSTONE_SERIES_TOP?.moves || []), ...(window.GRINDSTONE_SERIES_ESCAPES?.moves || []), ...(window.GRINDSTONE_SERIES_FOUNDATION?.moves || []), ...(window.GRINDSTONE_SERIES_TOP_ADDITIONS?.moves || []), ...(window.GRINDSTONE_SERIES_NEUTRAL_ADDITIONS?.moves || []), ...(window.GRINDSTONE_SERIES_READY_ADDITIONS?.moves || []), ...[window.GRINDSTONE_SERIES_NEUTRAL_NEXT, window.GRINDSTONE_SERIES_TOP_NEXT, window.GRINDSTONE_SERIES_DEFENSE_NEXT, window.GRINDSTONE_SERIES_WESTERN, window.GRINDSTONE_SERIES_NAVY, window.GRINDSTONE_SERIES_LEG_ONE, window.GRINDSTONE_SERIES_LEG_TWO, window.GRINDSTONE_SERIES_LEG_ESCAPES].flatMap(module => module?.moves || [])];
  additions.forEach(move => {
    if (data.moves.some(existing => existing.id === move.id)) throw new Error('Duplicate move ID: ' + move.id);
    data.moves.push(move);
    if (window.GRINDSTONE_TAGS) window.GRINDSTONE_TAGS.entries[move.id] = move.category;
    if (move.video?.url) data.videos[move.id] = { video: { ...move.video, format: move.video.format || 'lesson', match: move.video.match || 'component', note: move.video.note || 'The written coaching progression below is an adaptation of the cited creator lesson. Check the demonstrated starting position before teaching.', verified_by: move.verification }, usa_wrestling: (move.sources || []).filter(source => /usawmembership\.com|themat\.com/.test(source.url)) };
    data.research[move.id] = { research: { selected_variant: move.purpose, source_limits: move.verification }, sources: (move.sources || []).map(source => ({ ...source, accessed: source.accessed || (['N01','N02','N11'].includes(move.id) ? '2026-10-23' : '2026-10-24') })) };
  });
})();
