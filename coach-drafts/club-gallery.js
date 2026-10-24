(() => {
  "use strict";
  const data = JSON.parse(document.getElementById("club-data").textContent);
  const photos = [...data.photos].sort((a, b) => Number(b.collection === "season") - Number(a.collection === "season") || Number(a.asset_type === "graphic") - Number(b.asset_type === "graphic"));
  const storagePrefix = "grindstone-club-photo-review-v1:";
  const states = new Map();
  const cards = new Map();
  const grid = document.getElementById("club-grid");
  const search = document.getElementById("photo-search");
  const notice = document.getElementById("storage-notice");
  let filter = "all";
  let statusTimer;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function link(text, href) {
    const node = el("a", "", text);
    node.href = href;
    node.target = "_blank";
    node.rel = "noopener noreferrer";
    return node;
  }
  function emptyState() {
    return {coach_names: "", notes: "", decision: "", updated_at: null};
  }
  function hasReview(state) {
    return Boolean(state.coach_names.trim() || state.notes.trim() || state.decision);
  }
  function storageWarning() {
    notice.hidden = false;
    notice.textContent = "This browser could not save the review locally. Your current entries remain on this page; export them before closing or refreshing.";
  }
  function loadState(photo) {
    try {
      const raw = JSON.parse(localStorage.getItem(storagePrefix + photo.id) || "null");
      if (!raw || typeof raw !== "object") return emptyState();
      return {
        coach_names: typeof raw.coach_names === "string" ? raw.coach_names : "",
        notes: typeof raw.notes === "string" ? raw.notes : "",
        decision: ["coach-page", "gallery", "skip"].includes(raw.decision) ? raw.decision : "",
        updated_at: typeof raw.updated_at === "string" ? raw.updated_at : null
      };
    } catch (error) {
      storageWarning();
      return emptyState();
    }
  }
  function savedMessage(node, state, failed) {
    node.classList.toggle("error", failed);
    if (failed) {
      node.textContent = "Not saved in this browser. Export to keep this entry.";
    } else if (state.updated_at) {
      const when = new Date(state.updated_at);
      node.textContent = "Saved in this browser" + (Number.isNaN(when.getTime()) ? "." : " · " + when.toLocaleString());
    } else {
      node.textContent = "No review yet.";
    }
  }
  function updateProgress() {
    const count = photos.filter(photo => hasReview(states.get(photo.id))).length;
    document.getElementById("review-progress").textContent = count + " with review notes";
  }
  function applyFilter() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    photos.forEach(photo => {
      const state = states.get(photo.id);
      const matchesGroup = filter === "all" ||
        (filter === "season" && photo.collection === "season") ||
        (filter === "candidates" && photo.review_candidate) ||
        (filter === "priority" && photo.coaching_candidate) ||
        (filter === "reviewed" && hasReview(state));
      const haystack = [photo.id, photo.path, photo.caption, photo.kind, state.coach_names, state.notes].join(" ").toLowerCase();
      const visible = matchesGroup && (!query || haystack.includes(query));
      cards.get(photo.id).hidden = !visible;
      if (visible) count += 1;
    });
    document.getElementById("result-count").textContent = "Showing " + count + " of " + photos.length + " images" + (query ? " matching your search." : ".");
    document.getElementById("empty-result").hidden = count !== 0;
    document.querySelectorAll("[data-filter]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });
  }
  function createCard(photo) {
    const state = states.get(photo.id);
    const card = el("article", "club-card");
    card.id = photo.id;
    card.setAttribute("aria-labelledby", photo.id + "-title");
    const heading = el("div", "club-card-head");
    const title = el("h2");
    title.id = photo.id + "-title";
    const permalink = el("a", "", photo.id);
    permalink.href = "#" + photo.id;
    title.append(permalink);
    heading.append(title);
    if (photo.coaching_candidate) heading.append(el("span", "badge", "Coaching candidate"));
    else if (photo.review_candidate) heading.append(el("span", "badge roster", "Review candidate"));
    card.append(heading);

    const figure = el("figure");
    const imageLink = link("", photo.path);
    imageLink.className = "club-image-link";
    imageLink.setAttribute("aria-label", "Open original " + photo.id + " at full resolution");
    const img = el("img");
    img.src = photo.path;
    img.alt = photo.caption || "Grindstone club gallery photo " + photo.id + "; people awaiting identification";
    img.width = photo.width;
    img.height = photo.height;
    img.loading = "lazy";
    img.decoding = "async";
    imageLink.append(img);
    figure.append(imageLink);

    const caption = el("figcaption", "club-photo-caption");
    const links = el("div", "club-links");
    links.append(link("Open original", photo.path), link("Public image", photo.url), link("Club source", photo.source_url));
    if (photo.caption) caption.append(el("p", "", photo.caption));
    caption.append(links);
    const size = photo.bytes >= 1000000 ? (photo.bytes / 1000000).toFixed(2) + " MB" : Math.round(photo.bytes / 1000) + " KB";
    caption.append(el("p", "image-meta", photo.width + " × " + photo.height + " px · " + size + " · Original file retained"));
    const provenance = el("details");
    provenance.append(el("summary", "", "File provenance"));
    provenance.append(el("p", "", photo.provenance || "Published in the public Grindstone Wrestling Club gallery. Individual photographer and adult names are not supplied in this source."));
    provenance.append(el("code", "", photo.path), el("code", "", "SHA-256: " + photo.sha256));
    caption.append(provenance);
    figure.append(caption);
    card.append(figure);

    const form = el("div", "club-form");
    function field(labelText, key, tag, placeholder) {
      const wrapper = el("div", "club-field");
      const input = el(tag);
      input.id = photo.id + "-" + key;
      input.name = photo.id + "-" + key;
      if (placeholder) input.placeholder = placeholder;
      if (tag === "input") input.type = "text";
      const label = el("label", "", labelText);
      label.htmlFor = input.id;
      wrapper.append(label, input);
      form.append(wrapper);
      return input;
    }
    const names = field("Coach name(s) in this photo", "coach_names", "input", "Add names you recognize");
    names.value = state.coach_names;
    const notes = field("Position in the image and notes", "notes", "textarea", "For example: Coach name — left side, black shirt. Also add an event, date, or crop suggestion.");
    notes.value = state.notes;
    const decision = field("Suggested use", "decision", "select");
    [
      ["", "Not decided"],
      ["coach-page", "Coach page candidate"],
      ["gallery", "Club gallery candidate"],
      ["skip", "Skip this photo"]
    ].forEach(([value, label]) => {
      const option = el("option", "", label);
      option.value = value;
      decision.append(option);
    });
    decision.value = state.decision;
    const saved = el("p", "club-saved");
    saved.setAttribute("aria-live", "polite");
    savedMessage(saved, state, false);
    form.append(saved);

    function save() {
      const next = {
        coach_names: names.value,
        notes: notes.value,
        decision: decision.value,
        updated_at: new Date().toISOString()
      };
      states.set(photo.id, next);
      let failed = false;
      try {
        localStorage.setItem(storagePrefix + photo.id, JSON.stringify(next));
      } catch (error) {
        failed = true;
        storageWarning();
      }
      savedMessage(saved, next, failed);
      updateProgress();
    }
    names.addEventListener("input", save);
    notes.addEventListener("input", save);
    decision.addEventListener("change", save);
    card.append(form);
    return card;
  }
  photos.forEach(photo => {
    states.set(photo.id, loadState(photo));
    const card = createCard(photo);
    cards.set(photo.id, card);
    grid.append(card);
  });
  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      applyFilter();
    });
  });
  search.addEventListener("input", applyFilter);
  document.getElementById("export-review").addEventListener("click", () => {
    const exported = {
      schema_version: 1,
      collection: data.title,
      exported_at: new Date().toISOString(),
      identification_note: "Coach names and photo-use decisions below are reviewer entries, not identifications from the source.",
      photos: photos.map(photo => ({...photo, review: {...states.get(photo.id)}}))
    };
    const blob = new Blob([JSON.stringify(exported, null, 2) + "\n"], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const download = el("a");
    download.href = url;
    download.download = "club-photo-review.json";
    document.body.append(download);
    download.click();
    download.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    const status = document.getElementById("status");
    status.textContent = "Review JSON exported with all " + photos.length + " image records.";
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => { status.textContent = ""; }, 6000);
  });
  function revealLinkedPhoto() {
    const id = window.location.hash.slice(1);
    if (!cards.has(id)) return;
    if (cards.get(id).hidden) {
      filter = "all";
      search.value = "";
      applyFilter();
    }
    cards.get(id).scrollIntoView({block: "start"});
  }
  updateProgress();
  applyFilter();
  window.addEventListener("hashchange", revealLinkedPhoto);
  if (window.location.hash) window.requestAnimationFrame(revealLinkedPhoto);
})();
