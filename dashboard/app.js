const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const defaultProfile = {
  name: "Kwanchanal Geographic",
  username: "khwan",
  bio: "Bio-native creator · Bangkok",
};

const defaultLinks = [
  {
    id: crypto.randomUUID(),
    title: "dribbble",
    url: "https://dribbble.com/shots/27030684-Korvex-ai-AI-Auto-UI",
    thumbnail: "",
    featured: true,
    enabled: true,
  },
  {
    id: crypto.randomUUID(),
    title: "portfolio",
    url: "https://kwanchanal.github.io/hello",
    thumbnail: "",
    featured: false,
    enabled: true,
  },
];

const profile = storage.get("wemint_profile", defaultProfile);
const links = storage.get("wemint_links", defaultLinks);
const socialLinks = storage.get("wemint_social_links", {});
const appearance = storage.get("wemint_appearance", {
  profileImageUrl: "",
  backgroundImageUrl: "",
  backgroundColor: "#0b201b",
  buttonColor: "#75d9a0",
  profileFontColor: "#dff4e7",
  buttonFontColor: "#0b201b",
});

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

const elements = {
  linksList: document.getElementById("linksList"),
  previewLinks: document.getElementById("previewLinks"),
  previewName: document.getElementById("previewName"),
  profileName: document.getElementById("profileName"),
  profileMeta: document.getElementById("profileMeta"),
  previewBio: document.getElementById("previewBio"),
  previewLinkbarUser: document.getElementById("previewUsername"),
  linkModal: document.getElementById("linkModal"),
  linkForm: document.getElementById("linkForm"),
  addLinkBtn: document.getElementById("addLinkBtn"),
  topbarAddBtn: document.getElementById("topbarAddBtn"),
  sidebarAddBtn: document.getElementById("sidebarAddBtn"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  modalTitle: document.getElementById("modalTitle"),
  footerSwitch: document.getElementById("footerSwitch"),
  previewCta: document.getElementById("previewCta"),
  editProfileBtn: document.getElementById("editProfileBtn"),
  profileModal: document.getElementById("profileModal"),
  profileForm: document.getElementById("profileForm"),
  profileNameInput: document.getElementById("profileNameInput"),
  profileUsernameInput: document.getElementById("profileUsernameInput"),
  profileMetaInput: document.getElementById("profileMetaInput"),
  closeProfileBtn: document.getElementById("closeProfileBtn"),
  bannerText: document.getElementById("bannerText"),
  socialModal: document.getElementById("socialModal"),
  socialModalTitle: document.getElementById("socialModalTitle"),
  socialForm: document.getElementById("socialForm"),
  socialUrl: document.getElementById("socialUrl"),
  closeSocialBtn: document.getElementById("closeSocialBtn"),
  openDesignBtn: document.getElementById("openDesignBtn"),
  designModal: document.getElementById("designModal"),
  designForm: document.getElementById("designForm"),
  closeDesignBtn: document.getElementById("closeDesignBtn"),
  profileImageUrl: document.getElementById("profileImageUrl"),
  profileImageFile: document.getElementById("profileImageFile"),
  profileImageHint: document.getElementById("profileImageHint"),
  backgroundImageUrl: document.getElementById("backgroundImageUrl"),
  backgroundImageFile: document.getElementById("backgroundImageFile"),
  backgroundImageHint: document.getElementById("backgroundImageHint"),
  backgroundColor: document.getElementById("backgroundColor"),
  buttonColor: document.getElementById("buttonColor"),
  profileFontColor: document.getElementById("profileFontColor"),
  buttonFontColor: document.getElementById("buttonFontColor"),
  backgroundColorPicker: document.getElementById("backgroundColorPicker"),
  buttonColorPicker: document.getElementById("buttonColorPicker"),
  profileFontColorPicker: document.getElementById("profileFontColorPicker"),
  buttonFontColorPicker: document.getElementById("buttonFontColorPicker"),
  resetDesignBtn: document.getElementById("resetDesignBtn"),
  footerUpgradeTip: document.getElementById("footerUpgradeTip"),
};

let editingId = null;
let openLayoutId = null;
let draggingLinkId = null;

function saveAll() {
  storage.set("wemint_profile", profile);
  storage.set("wemint_links", links);
  storage.set("wemint_social_links", socialLinks);
  storage.set("wemint_appearance", appearance);
}

function renderProfile() {
  elements.profileName.textContent = profile.name;
  elements.profileMeta.textContent = profile.bio;
  elements.previewName.textContent = profile.name;
  elements.previewBio.textContent = profile.bio;
  const username = profile.username ? profile.username.trim() : "";
  if (elements.previewLinkbarUser) {
    elements.previewLinkbarUser.textContent = username
      ? `wemint.app/${username}`
      : "wemint.app/";
  }
}

function applyAppearance() {
  const phone = document.querySelector(".phone");
  if (phone) {
    phone.style.setProperty("--phone-profile-color", appearance.profileFontColor || "#dff4e7");
    phone.style.setProperty("--phone-button-color", appearance.buttonColor || "#75d9a0");
    phone.style.setProperty("--phone-button-text", appearance.buttonFontColor || "#0b201b");
    phone.style.setProperty("--phone-link-color", appearance.buttonColor || "#75d9a0");
    phone.style.setProperty("--phone-link-text", appearance.buttonFontColor || "#0b201b");
    phone.style.backgroundColor = appearance.backgroundColor || "#0b201b";
    phone.style.backgroundImage = appearance.backgroundImageUrl
      ? `url(${appearance.backgroundImageUrl})`
      : "none";
  }

  document.querySelectorAll(".profile-avatar, .phone-avatar").forEach((avatar) => {
    const hasImage = Boolean(appearance.profileImageUrl);
    avatar.style.backgroundImage = hasImage ? `url(${appearance.profileImageUrl})` : "none";
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
    avatar.style.backgroundRepeat = "no-repeat";
    avatar.classList.toggle("has-image", hasImage);
  });
}

function setImageHint(hintEl, message) {
  if (!hintEl) return;
  hintEl.textContent = message;
}

function readImageFile(file, onLoad) {
  const reader = new FileReader();
  reader.onload = () => onLoad(reader.result);
  reader.readAsDataURL(file);
}

function openDesignModal() {
  const profileIsLocal = appearance.profileImageUrl?.startsWith("data:");
  const backgroundIsLocal = appearance.backgroundImageUrl?.startsWith("data:");

  elements.profileImageUrl.value = profileIsLocal ? "" : appearance.profileImageUrl || "";
  elements.backgroundImageUrl.value = backgroundIsLocal ? "" : appearance.backgroundImageUrl || "";
  elements.profileImageUrl.dataset.dirty = "false";
  elements.backgroundImageUrl.dataset.dirty = "false";
  if (elements.profileImageFile) elements.profileImageFile.value = "";
  if (elements.backgroundImageFile) elements.backgroundImageFile.value = "";
  setImageHint(
    elements.profileImageHint,
    profileIsLocal
      ? "Using local file (stored in browser)."
      : appearance.profileImageUrl
      ? "Using URL."
      : "Supports JPG, PNG, WebP."
  );
  setImageHint(
    elements.backgroundImageHint,
    backgroundIsLocal
      ? "Using local file (stored in browser)."
      : appearance.backgroundImageUrl
      ? "Using URL."
      : "Supports JPG, PNG, WebP."
  );
  elements.backgroundColor.value = appearance.backgroundColor || "";
  elements.buttonColor.value = appearance.buttonColor || "";
  elements.profileFontColor.value = appearance.profileFontColor || "";
  elements.buttonFontColor.value = appearance.buttonFontColor || "";
  if (elements.backgroundColorPicker) {
    elements.backgroundColorPicker.value = appearance.backgroundColor || "#0b201b";
  }
  if (elements.buttonColorPicker) {
    elements.buttonColorPicker.value = appearance.buttonColor || "#75d9a0";
  }
  if (elements.profileFontColorPicker) {
    elements.profileFontColorPicker.value = appearance.profileFontColor || "#dff4e7";
  }
  if (elements.buttonFontColorPicker) {
    elements.buttonFontColorPicker.value = appearance.buttonFontColor || "#0b201b";
  }
  elements.designModal.classList.add("is-open");
}

function resetAppearance() {
  appearance.profileImageUrl = "";
  appearance.backgroundImageUrl = "";
  appearance.backgroundColor = "#0b201b";
  appearance.buttonColor = "#75d9a0";
  appearance.profileFontColor = "#dff4e7";
  appearance.buttonFontColor = "#0b201b";
  saveAll();
  applyAppearance();
  openDesignModal();
}

function closeDesignModal() {
  elements.designModal.classList.remove("is-open");
}

function renderSocialSlots() {
  document.querySelectorAll(".social-slot").forEach((slot) => {
    const key = slot.dataset.platform;
    const url = socialLinks[key];
    if (url) {
      slot.classList.add("is-filled");
      slot.setAttribute("title", url);
    } else {
      slot.classList.remove("is-filled");
      slot.removeAttribute("title");
    }
  });
}

let activeSocialSlot = null;

function openSocialModal(slot) {
  activeSocialSlot = slot;
  const label = slot.dataset.label || "social";
  elements.socialModalTitle.textContent = `Add ${label} link`;
  const currentUrl = socialLinks[slot.dataset.platform] || "";
  elements.socialUrl.value = currentUrl;
  elements.socialModal.classList.add("is-open");
}

function closeSocialModal() {
  elements.socialModal.classList.remove("is-open");
  activeSocialSlot = null;
}

function createLayoutPanel(link) {
  const panel = document.createElement("div");
  panel.className = "layout-card";

  const layoutOptions = [
    {
      id: "classic",
      title: "Classic",
      desc: "Efficient, direct and compact.",
      preview: `
        <div class="layout-preview">
          <div class="layout-preview-classic">
            <div class="preview-avatar-sm"></div>
            <div class="preview-bar"></div>
            <span class="preview-dots">...</span>
          </div>
        </div>
      `,
    },
    {
      id: "featured",
      title: "Featured",
      desc: "Make your link stand out with a larger, more attractive display.",
      preview: `
        <div class="layout-preview">
          <div class="layout-preview-featured">
            <span class="preview-caption">Now touring, get your tickets</span>
            <span class="preview-dots">...</span>
          </div>
        </div>
      `,
    },
  ];

  let optionsHTML = "";
  layoutOptions.forEach((option) => {
    const isSelected =
      (option.id === "featured" && link.featured) ||
      (option.id === "classic" && !link.featured);

    let extraContent = "";
    if (option.id === "featured") {
      extraContent = `
        <div class="thumbnail-row">
          <button class="add-thumbnail-btn" type="button">
            <span class="material-symbols-outlined">add_photo_alternate</span>
            Add thumbnail
          </button>
          <button class="reset-thumbnail-btn" type="button">
            <span class="material-symbols-outlined">refresh</span>
            Reset
          </button>
          <input class="thumbnail-input" type="file" accept="image/*" />
        </div>
        <div class="thumbnail-hint">No thumbnail yet.</div>
        <div class="thumbnail-preview"></div>
      `;
    }

    optionsHTML += `
      <label class="layout-option${isSelected ? " is-selected" : ""}" data-layout="${option.id}">
        <input type="radio" name="layout-${link.id}" value="${option.id}" ${isSelected ? "checked" : ""} />
        <div class="layout-text">
          <div class="link-title">${option.title}</div>
          <div class="muted">${option.desc}</div>
          ${extraContent}
        </div>
        ${option.preview}
      </label>
    `;
  });

  panel.innerHTML = `
    <div class="layout-bar">
      <h3>Layout</h3>
      <button class="icon-btn layout-close-btn" aria-label="Close">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="layout-body">
      <p class="muted">Choose a layout for your link</p>
      <div class="layout-options">${optionsHTML}</div>
    </div>
  `;

  // Close button
  panel.querySelector(".layout-close-btn").addEventListener("click", () => {
    openLayoutId = null;
    renderLinks();
  });

  // Radio change events
  panel.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      link.featured = input.value === "featured";
      saveAll();
      renderPreview();
      renderLinks();
    });
  });

  const thumbInput = panel.querySelector(".thumbnail-input");
  const thumbButton = panel.querySelector(".add-thumbnail-btn");
  const resetThumbButton = panel.querySelector(".reset-thumbnail-btn");
  const thumbPreview = panel.querySelector(".thumbnail-preview");
  const thumbHint = panel.querySelector(".thumbnail-hint");

  const updateThumbnailUI = () => {
    if (!thumbPreview || !thumbHint) return;
    if (link.thumbnail) {
      thumbPreview.innerHTML = `<img src="${escapeHTML(link.thumbnail)}" alt="" />`;
      thumbHint.textContent = "Thumbnail ready.";
    } else {
      thumbPreview.innerHTML = "";
      thumbHint.textContent = "No thumbnail yet.";
    }
  };

  if (thumbButton && thumbInput) {
    thumbInput.addEventListener("change", () => {
      const file = thumbInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        link.thumbnail = reader.result;
        saveAll();
        renderPreview();
        renderLinks();
      };
      reader.readAsDataURL(file);
    });

    thumbButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      thumbInput.click();
    });
  }

  if (resetThumbButton) {
    resetThumbButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      link.thumbnail = "";
      saveAll();
      renderPreview();
      renderLinks();
    });
  }

  updateThumbnailUI();

  return panel;
}

function renderLinks() {
  elements.linksList.innerHTML = "";
  links.forEach((link) => {
    const card = document.createElement("div");
    card.className = "link-card";

    const safeTitle = escapeHTML(link.title);
    const safeUrl = escapeHTML(link.url);
    const displayUrl =
      link.url.length > 45
        ? escapeHTML(link.url.substring(0, 45) + "...")
        : safeUrl;

    const isLayoutOpen = openLayoutId === link.id;

    card.innerHTML = `
      <div class="link-row">
        <div class="link-drag">
          <span class="material-symbols-outlined">drag_indicator</span>
        </div>
        <div class="link-info">
          <div class="link-title-row">
            <span class="link-title">${safeTitle}</span>
            <button class="icon-btn-sm edit-link-btn" aria-label="Edit title">
              <span class="material-symbols-outlined">edit</span>
            </button>
          </div>
          <div class="link-url-row">
            <span class="link-url">${displayUrl}</span>
            <button class="icon-btn-sm edit-link-btn" aria-label="Edit URL">
              <span class="material-symbols-outlined">edit</span>
            </button>
          </div>
        </div>
        <div class="link-right">
          <label class="switch">
            <input type="checkbox" ${link.enabled ? "checked" : ""} />
            <span class="slider"></span>
          </label>
        </div>
      </div>
      <div class="link-meta-row">
        <div class="link-tool-icons">
          <button class="icon-btn-sm layout-toggle-btn${isLayoutOpen ? " is-active" : ""}" aria-label="Layout">
            <span class="material-symbols-outlined">grid_view</span>
          </button>
          <button class="icon-btn-sm" aria-label="Pin">
            <span class="material-symbols-outlined">push_pin</span>
          </button>
          <button class="icon-btn-sm" aria-label="Thumbnail">
            <span class="material-symbols-outlined">image</span>
          </button>
          <button class="icon-btn-sm" aria-label="Favorite">
            <span class="material-symbols-outlined">star</span>
          </button>
          <button class="icon-btn-sm" aria-label="Copy">
            <span class="material-symbols-outlined">content_copy</span>
          </button>
          <button class="icon-btn-sm" aria-label="Lock">
            <span class="material-symbols-outlined">lock</span>
          </button>
          <span class="link-stats">
            <span class="material-symbols-outlined">bar_chart</span>
            0 clicks
          </span>
        </div>
        <button class="icon-btn-sm link-delete" aria-label="Delete">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;

    // Toggle event
    card
      .querySelector(".link-right .switch input")
      .addEventListener("change", (event) => {
        link.enabled = event.target.checked;
        saveAll();
        renderPreview();
      });

    // Edit button events
    card.querySelectorAll(".edit-link-btn").forEach((btn) => {
      btn.addEventListener("click", () => openModal(link.id));
    });

    // Layout toggle button
    card.querySelector(".layout-toggle-btn").addEventListener("click", () => {
      openLayoutId = openLayoutId === link.id ? null : link.id;
      renderLinks();
    });

    // Delete event
    card.querySelector(".link-delete").addEventListener("click", () => {
      const index = links.findIndex((item) => item.id === link.id);
      if (index > -1) {
        links.splice(index, 1);
        if (openLayoutId === link.id) openLayoutId = null;
        saveAll();
        renderLinks();
        renderPreview();
      }
    });

    const dragHandle = card.querySelector(".link-drag");
    if (dragHandle) {
      dragHandle.setAttribute("draggable", "true");
      dragHandle.addEventListener("dragstart", (event) => {
        draggingLinkId = link.id;
        card.classList.add("is-dragging");
        event.dataTransfer.setData("text/plain", link.id);
        event.dataTransfer.effectAllowed = "move";
      });
      dragHandle.addEventListener("dragend", () => {
        draggingLinkId = null;
        card.classList.remove("is-dragging");
      });
    }

    card.addEventListener("dragover", (event) => {
      if (!draggingLinkId || draggingLinkId === link.id) return;
      event.preventDefault();
      card.classList.add("drag-over");
    });

    card.addEventListener("dragleave", () => {
      card.classList.remove("drag-over");
    });

    card.addEventListener("drop", (event) => {
      if (!draggingLinkId || draggingLinkId === link.id) return;
      event.preventDefault();
      card.classList.remove("drag-over");
      const fromIndex = links.findIndex((item) => item.id === draggingLinkId);
      const toIndex = links.findIndex((item) => item.id === link.id);
      if (fromIndex < 0 || toIndex < 0) return;
      const [moved] = links.splice(fromIndex, 1);
      const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      links.splice(insertIndex, 0, moved);
      saveAll();
      renderLinks();
      renderPreview();
    });

    elements.linksList.appendChild(card);

    // If layout panel is open for this link, insert it after the card
    if (isLayoutOpen) {
      const layoutPanel = createLayoutPanel(link);
      elements.linksList.appendChild(layoutPanel);
    }
  });
}

function renderPreview() {
  elements.previewLinks.innerHTML = "";
  links
    .filter((link) => link.enabled)
    .forEach((link) => {
      const btn = document.createElement("div");
      const safeTitle = escapeHTML(link.title);

      if (link.featured) {
        btn.className = "phone-link featured";
        const thumbContent = link.thumbnail
          ? `<img src="${escapeHTML(link.thumbnail)}" alt="" />`
          : "";
        btn.innerHTML = `
          <div class="phone-link-thumb">${thumbContent}</div>
          <div class="phone-link-bottom">
            <span>${safeTitle}</span>
            <span class="phone-link-more"><span class="material-symbols-outlined">more_vert</span></span>
          </div>
        `;
      } else {
        btn.className = "phone-link";
        btn.innerHTML = `
          <div class="phone-link-icon"><span class="material-symbols-outlined">star_shine</span></div>
          <span>${safeTitle}</span>
          <span class="phone-link-more"><span class="material-symbols-outlined">more_vert</span></span>
        `;
      }

      elements.previewLinks.appendChild(btn);
    });

  elements.previewCta.style.display = elements.footerSwitch.checked
    ? "block"
    : "none";
}

function openModal(id = null) {
  editingId = id;
  const isEdit = Boolean(id);
  elements.modalTitle.textContent = isEdit ? "Edit link" : "Add link";
  const link = links.find((item) => item.id === id);
  elements.linkForm.reset();
  if (link) {
    elements.linkForm.title.value = link.title;
    elements.linkForm.url.value = link.url;
  }
  elements.linkModal.classList.add("is-open");
}

function closeModal() {
  elements.linkModal.classList.remove("is-open");
}

function openProfileModal() {
  elements.profileNameInput.value = profile.name;
  elements.profileUsernameInput.value = profile.username || "";
  elements.profileMetaInput.value = profile.bio;
  elements.profileModal.classList.add("is-open");
}

function closeProfileModal() {
  elements.profileModal.classList.remove("is-open");
}

function initEvents() {
  elements.addLinkBtn.addEventListener("click", () => openModal());
  if (elements.topbarAddBtn) {
    elements.topbarAddBtn.addEventListener("click", () => openModal());
  }
  if (elements.sidebarAddBtn) {
    elements.sidebarAddBtn.addEventListener("click", () => openModal());
  }
  elements.closeModalBtn.addEventListener("click", closeModal);
  elements.linkModal.addEventListener("click", (event) => {
    if (event.target === elements.linkModal) closeModal();
  });

  elements.linkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.linkForm);
    const linkData = {
      id: editingId || crypto.randomUUID(),
      title: formData.get("title"),
      url: formData.get("url"),
      thumbnail: editingId ? links.find((item) => item.id === editingId)?.thumbnail || "" : "",
      featured: false,
      enabled: true,
    };

    if (editingId) {
      const index = links.findIndex((item) => item.id === editingId);
      if (index > -1) links[index] = { ...links[index], ...linkData };
    } else {
      links.unshift(linkData);
    }

    editingId = null;
    saveAll();
    renderLinks();
    renderPreview();
    closeModal();
  });

  elements.footerSwitch.addEventListener("change", () => {
    elements.footerSwitch.checked = true;
    if (elements.footerUpgradeTip) {
      elements.footerUpgradeTip.classList.add("is-visible");
      clearTimeout(elements.footerUpgradeTip._hideTimer);
      elements.footerUpgradeTip._hideTimer = setTimeout(() => {
        elements.footerUpgradeTip.classList.remove("is-visible");
      }, 1600);
    }
    renderPreview();
  });

  elements.editProfileBtn.addEventListener("click", openProfileModal);
  elements.closeProfileBtn.addEventListener("click", closeProfileModal);
  elements.profileModal.addEventListener("click", (event) => {
    if (event.target === elements.profileModal) closeProfileModal();
  });

  elements.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    profile.name = elements.profileNameInput.value.trim();
    profile.username = elements.profileUsernameInput.value.trim();
    profile.bio = elements.profileMetaInput.value.trim();
    saveAll();
    renderProfile();
    closeProfileModal();
  });

  document.querySelectorAll(".social-slot").forEach((slot) => {
    slot.addEventListener("click", () => openSocialModal(slot));
  });

  elements.closeSocialBtn.addEventListener("click", closeSocialModal);
  elements.socialModal.addEventListener("click", (event) => {
    if (event.target === elements.socialModal) closeSocialModal();
  });

  elements.socialForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!activeSocialSlot) return;
    const url = elements.socialUrl.value.trim();
    socialLinks[activeSocialSlot.dataset.platform] = url;
    saveAll();
    renderSocialSlots();
    closeSocialModal();
  });

  elements.openDesignBtn.addEventListener("click", openDesignModal);
  elements.closeDesignBtn.addEventListener("click", closeDesignModal);
  elements.designModal.addEventListener("click", (event) => {
    if (event.target === elements.designModal) closeDesignModal();
  });

  elements.designForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (elements.profileImageUrl.dataset.dirty === "true") {
      appearance.profileImageUrl = elements.profileImageUrl.value.trim();
    }
    if (elements.backgroundImageUrl.dataset.dirty === "true") {
      appearance.backgroundImageUrl = elements.backgroundImageUrl.value.trim();
    }
    appearance.backgroundColor = elements.backgroundColor.value.trim();
    appearance.buttonColor = elements.buttonColor.value.trim();
    appearance.profileFontColor = elements.profileFontColor.value.trim();
    appearance.buttonFontColor = elements.buttonFontColor.value.trim();
    saveAll();
    applyAppearance();
    closeDesignModal();
  });

  elements.resetDesignBtn.addEventListener("click", resetAppearance);

  elements.profileImageUrl.addEventListener("input", () => {
    elements.profileImageUrl.dataset.dirty = "true";
    setImageHint(
      elements.profileImageHint,
      elements.profileImageUrl.value.trim() ? "Using URL." : "Supports JPG, PNG, WebP."
    );
  });

  elements.backgroundImageUrl.addEventListener("input", () => {
    elements.backgroundImageUrl.dataset.dirty = "true";
    setImageHint(
      elements.backgroundImageHint,
      elements.backgroundImageUrl.value.trim() ? "Using URL." : "Supports JPG, PNG, WebP."
    );
  });

  if (elements.profileImageFile) {
    elements.profileImageFile.addEventListener("change", () => {
      const file = elements.profileImageFile.files?.[0];
      if (!file) return;
      readImageFile(file, (dataUrl) => {
        appearance.profileImageUrl = dataUrl;
        saveAll();
        applyAppearance();
        elements.profileImageUrl.value = "";
        elements.profileImageUrl.dataset.dirty = "false";
        setImageHint(elements.profileImageHint, "Using local file (stored in browser).");
      });
    });
  }

  if (elements.backgroundImageFile) {
    elements.backgroundImageFile.addEventListener("change", () => {
      const file = elements.backgroundImageFile.files?.[0];
      if (!file) return;
      readImageFile(file, (dataUrl) => {
        appearance.backgroundImageUrl = dataUrl;
        saveAll();
        applyAppearance();
        elements.backgroundImageUrl.value = "";
        elements.backgroundImageUrl.dataset.dirty = "false";
        setImageHint(elements.backgroundImageHint, "Using local file (stored in browser).");
      });
    });
  }

  const wireColorPicker = (picker, input) => {
    if (!picker || !input) return;
    picker.addEventListener("input", () => {
      input.value = picker.value;
      input.dispatchEvent(new Event("input"));
    });
    input.addEventListener("input", () => {
      const value = input.value.trim();
      if (/^#([0-9a-fA-F]{6})$/.test(value)) {
        picker.value = value;
      }
    });
  };

  wireColorPicker(elements.backgroundColorPicker, elements.backgroundColor);
  wireColorPicker(elements.buttonColorPicker, elements.buttonColor);
  wireColorPicker(elements.profileFontColorPicker, elements.profileFontColor);
  wireColorPicker(elements.buttonFontColorPicker, elements.buttonFontColor);
}

function initNavAccordion() {
  document.querySelectorAll(".nav-title").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".nav-section");
      if (!section) return;
      section.classList.toggle("is-collapsed");
    });
  });
}

function initBannerCycle() {
  if (!elements.bannerText) return;
  const messages = [
    "Built For You",
    "Bespoke Design for Brand - Contact Us",
    "Your Brand in One-Page",
    "Build For Global Economy",
    "Web3 Friendly  - Web2 Mazimize",
  ];
  let index = 0;
  elements.bannerText.textContent = messages[index];
  setInterval(() => {
    elements.bannerText.style.opacity = "0";
    elements.bannerText.style.transform = "translateY(-6px)";
    setTimeout(() => {
      index = (index + 1) % messages.length;
      elements.bannerText.textContent = messages[index];
      elements.bannerText.style.opacity = "1";
      elements.bannerText.style.transform = "translateY(0)";
    }, 320);
  }, 3500);
}

function init() {
  renderProfile();
  renderLinks();
  renderPreview();
  initEvents();
  renderSocialSlots();
  applyAppearance();
  initNavAccordion();
  initBannerCycle();
}

init();
