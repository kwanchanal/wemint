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
  name: "Kwanchanal Grographic",
  username: "kwan",
  bio: "Retired designer turned FinTech Product Manager, Mostly underwater",
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

const FORCE_PROFILE_MOCK = true;
const FORCE_APPEARANCE_MOCK = true;
const profile = FORCE_PROFILE_MOCK ? { ...defaultProfile } : storage.get("wemint_profile", defaultProfile);
const links = storage.get("wemint_links", defaultLinks);
const socialLinks = storage.get("wemint_social_links", {});
let inboxName = storage.get("wemint_inbox_name", "Get in touch");
let inboxPosition = storage.get("wemint_inbox_position", 0);
let inboxLayout = storage.get("wemint_inbox_layout", {
  type: "banner",
  thumbnail: "",
});
if (typeof inboxLayout.featured === "boolean") {
  inboxLayout = {
    type: inboxLayout.featured ? "banner" : "classic",
    thumbnail: inboxLayout.thumbnail || "",
  };
}
const defaultInboxFields = [
  { id: "inbox-name", label: "Name", required: false, type: "text" },
  { id: "inbox-email", label: "Email address", required: true, type: "email" },
  { id: "inbox-phone", label: "Phone number", required: true, type: "tel" },
  { id: "inbox-booking", label: "Booking Date", required: true, type: "date" },
];
let inboxFormFields = storage.get("wemint_inbox_fields", defaultInboxFields);
if (!Array.isArray(inboxFormFields) || inboxFormFields.length === 0) {
  inboxFormFields = [...defaultInboxFields];
}
const defaultAppearance = {
  profileImageUrl: "",
  backgroundImageUrl: "",
  backgroundColor: "#ffffff",
  buttonColor: "#b3b3b3",
  profileFontColor: "#111827",
  buttonFontColor: "#f9fafb",
};
const appearance = FORCE_APPEARANCE_MOCK
  ? { ...defaultAppearance }
  : storage.get("wemint_appearance", defaultAppearance);
const visibility = storage.get("wemint_visibility", {
  showProfileImage: true,
  showDisplayName: true,
  showBio: true,
  showSocialIcons: true,
});

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function prettyFieldType(type) {
  const map = {
    text: "Short answer",
    textarea: "Paragraph",
    single_choice: "Single choice",
    checkboxes: "Checkboxes",
    dropdown: "Dropdown",
    date: "Date",
    email: "Email",
    tel: "Phone",
  };
  return map[type] || "Short answer";
}

const elements = {
  linksList: document.getElementById("linksList"),
  previewLinks: document.getElementById("previewLinks"),
  previewName: document.getElementById("previewName"),
  profileName: document.getElementById("profileName"),
  profileMeta: document.getElementById("profileMeta"),
  previewBio: document.getElementById("previewBio"),
  profileSocialIcons: document.getElementById("profileSocialIcons"),
  previewSocialIcons: document.getElementById("previewSocialIcons"),
  previewLinkbarUser: document.getElementById("previewUsername"),
  downloadPreviewBtn: document.getElementById("downloadPreviewBtn"),
  linkModal: document.getElementById("linkModal"),
  linkForm: document.getElementById("linkForm"),
  addLinkBtn: document.getElementById("addLinkBtn"),
  topbarAddBtn: document.getElementById("topbarAddBtn"),
  sidebarAddBtn: document.getElementById("sidebarAddBtn"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  modalTitle: document.getElementById("modalTitle"),
  footerSwitch: document.getElementById("footerSwitch"),
  inboxSection: document.getElementById("inboxSection"),
  inboxLayoutBtn: document.getElementById("inboxLayoutBtn"),
  inboxPanel: document.getElementById("inboxPanel"),
  inboxCloseBtn: document.getElementById("inboxCloseBtn"),
  inboxSwitch: document.getElementById("inboxSwitch"),
  inboxTitle: document.getElementById("inboxTitle"),
  inboxEditBtn: document.getElementById("inboxEditBtn"),
  inboxEditFormBtn: document.getElementById("inboxEditFormBtn"),
  inboxLayoutBody: document.getElementById("inboxLayoutBody"),
  previewInboxBanner: document.getElementById("previewInboxBanner"),
  previewInboxSheet: document.getElementById("previewInboxSheet"),
  previewInboxSheetBackdrop: document.getElementById("previewInboxSheetBackdrop"),
  previewInboxSheetClose: document.getElementById("previewInboxSheetClose"),
  previewInboxSheetTitle: document.getElementById("previewInboxSheetTitle"),
  previewInboxForm: document.getElementById("previewInboxForm"),
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
  profileImageFile: document.getElementById("profileImageFile"),
  profileImageHint: document.getElementById("profileImageHint"),
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
  cropModal: document.getElementById("cropModal"),
  cropImage: document.getElementById("cropImage"),
  cropTitle: document.getElementById("cropTitle"),
  closeCropBtn: document.getElementById("closeCropBtn"),
  cropCancelBtn: document.getElementById("cropCancelBtn"),
  cropSaveBtn: document.getElementById("cropSaveBtn"),
  inboxFormModal: document.getElementById("inboxFormModal"),
  inboxFormRows: document.getElementById("inboxFormRows"),
  closeInboxFormBtn: document.getElementById("closeInboxFormBtn"),
  dismissInboxFormBtn: document.getElementById("dismissInboxFormBtn"),
  inboxAddFieldBtn: document.getElementById("inboxAddFieldBtn"),
  inboxFormDoneBtn: document.getElementById("inboxFormDoneBtn"),
  inboxFieldLibraryModal: document.getElementById("inboxFieldLibraryModal"),
  inboxFieldLibraryList: document.getElementById("inboxFieldLibraryList"),
  inboxFieldSearchInput: document.getElementById("inboxFieldSearchInput"),
  inboxFieldLibraryBackBtn: document.getElementById("inboxFieldLibraryBackBtn"),
  dismissInboxFieldLibraryBtn: document.getElementById("dismissInboxFieldLibraryBtn"),
  inboxFieldConfigModal: document.getElementById("inboxFieldConfigModal"),
  inboxFieldConfigForm: document.getElementById("inboxFieldConfigForm"),
  inboxFieldTypeSelect: document.getElementById("inboxFieldTypeSelect"),
  inboxFieldLabelInput: document.getElementById("inboxFieldLabelInput"),
  inboxFieldRequiredInput: document.getElementById("inboxFieldRequiredInput"),
  inboxFieldConfigBackBtn: document.getElementById("inboxFieldConfigBackBtn"),
  dismissInboxFieldConfigBtn: document.getElementById("dismissInboxFieldConfigBtn"),
  sidebar: document.getElementById("sidebar"),
  sidebarToggle: document.getElementById("sidebarToggle"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),
  showProfileImage: document.getElementById("showProfileImage"),
  showDisplayName: document.getElementById("showDisplayName"),
  showBio: document.getElementById("showBio"),
  showSocialIcons: document.getElementById("showSocialIcons"),
};

let editingId = null;
let openLayoutId = null;
let draggingItemId = null;
let inboxOpen = false;
let inboxTab = "forms";
let cropper = null;
let cropCallback = null;
let preferredFieldType = "text";

const CROP_RATIOS = {
  profile: 1,
  thumbnail: 16 / 9,
  background: 1 / 2,
};

function saveAll() {
  storage.set("wemint_profile", profile);
  storage.set("wemint_links", links);
  storage.set("wemint_social_links", socialLinks);
  storage.set("wemint_appearance", appearance);
  storage.set("wemint_visibility", visibility);
  storage.set("wemint_inbox_position", inboxPosition);
  storage.set("wemint_inbox_name", inboxName);
  storage.set("wemint_inbox_layout", inboxLayout);
  storage.set("wemint_inbox_fields", inboxFormFields);
}

function renderProfile() {
  elements.profileName.textContent = profile.name;
  elements.profileMeta.textContent = profile.bio;
  elements.previewName.textContent = profile.name;
  elements.previewBio.textContent = profile.bio;
  elements.previewName.style.display = visibility.showDisplayName ? "" : "none";
  elements.previewBio.style.display = visibility.showBio ? "" : "none";
  if (elements.previewSocialIcons) {
    elements.previewSocialIcons.style.display = visibility.showSocialIcons ? "" : "none";
  }
  updateAvatarInitials();
  const username = profile.username ? profile.username.trim() : "";
  if (elements.previewLinkbarUser) {
    elements.previewLinkbarUser.textContent = username
      ? `wemint.link/${username}`
      : "wemint.link/";
  }
}

function applyAppearance() {
  const phone = document.querySelector(".phone");
  if (phone) {
    phone.style.setProperty("--phone-profile-color", appearance.profileFontColor || "#111827");
    phone.style.setProperty("--phone-button-color", appearance.buttonColor || "#b3b3b3");
    phone.style.setProperty("--phone-button-text", appearance.buttonFontColor || "#f9fafb");
    phone.style.setProperty("--phone-link-color", appearance.buttonColor || "#b3b3b3");
    phone.style.setProperty("--phone-link-text", appearance.buttonFontColor || "#f9fafb");
    phone.style.backgroundColor = appearance.backgroundColor || "#ffffff";
    phone.style.backgroundImage = appearance.backgroundImageUrl
      ? `url(${appearance.backgroundImageUrl})`
      : "none";
  }

  const hasImage = Boolean(appearance.profileImageUrl);
  document.querySelectorAll(".profile-avatar").forEach((avatar) => {
    avatar.style.display = "";
    avatar.style.backgroundImage = hasImage ? `url(${appearance.profileImageUrl})` : "none";
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
    avatar.style.backgroundRepeat = "no-repeat";
    avatar.classList.toggle("has-image", hasImage);
  });
  document.querySelectorAll(".phone-avatar").forEach((avatar) => {
    avatar.style.display = visibility.showProfileImage ? "" : "none";
    avatar.style.backgroundImage = hasImage ? `url(${appearance.profileImageUrl})` : "none";
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
    avatar.style.backgroundRepeat = "no-repeat";
    avatar.classList.toggle("has-image", hasImage);
  });
}

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function ensureAvatarInitials(avatar) {
  let el = avatar.querySelector(".avatar-initials");
  if (!el) {
    el = document.createElement("span");
    el.className = "avatar-initials";
    el.setAttribute("aria-hidden", "true");
    avatar.appendChild(el);
  }
  return el;
}

function updateAvatarInitials() {
  const initials = getInitials(profile.name);
  const hasImage = Boolean(appearance.profileImageUrl);
  document.querySelectorAll(".profile-avatar, .phone-avatar").forEach((avatar) => {
    const el = ensureAvatarInitials(avatar);
    el.textContent = initials;
    avatar.classList.toggle("has-initials", !hasImage);
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

function closeCropModal() {
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
  cropCallback = null;
  elements.cropModal.classList.remove("is-open");
  elements.cropModal.setAttribute("aria-hidden", "true");
}

function openCropModal({ file, title, aspectRatio, onSave }) {
  if (!file || !elements.cropImage) return;
  cropCallback = onSave;
  elements.cropTitle.textContent = title || "Crop image";
  readImageFile(file, (dataUrl) => {
    elements.cropImage.src = dataUrl;
    if (cropper) cropper.destroy();
    cropper = new Cropper(elements.cropImage, {
      aspectRatio,
      viewMode: 1,
      autoCropArea: 1,
      background: false,
      responsive: true,
      movable: true,
      zoomable: true,
      scalable: false,
      rotatable: false,
      zoomOnWheel: true,
    });
    elements.cropModal.classList.add("is-open");
    elements.cropModal.setAttribute("aria-hidden", "false");
  });
}

function saveCrop() {
  if (!cropper || !cropCallback) return;
  const canvas = cropper.getCroppedCanvas({
    imageSmoothingQuality: "high",
  });
  const dataUrl = canvas.toDataURL("image/png");
  cropCallback(dataUrl);
  closeCropModal();
}

function openDesignModal() {
  const backgroundIsLocal = appearance.backgroundImageUrl?.startsWith("data:");

  if (elements.profileImageFile) elements.profileImageFile.value = "";
  if (elements.backgroundImageFile) elements.backgroundImageFile.value = "";
  setImageHint(
    elements.backgroundImageHint,
    backgroundIsLocal ? "Using local file (stored in browser)." : "Supports JPG, PNG, WebP."
  );
  elements.backgroundColor.value = appearance.backgroundColor || "";
  elements.buttonColor.value = appearance.buttonColor || "";
  elements.profileFontColor.value = appearance.profileFontColor || "";
  elements.buttonFontColor.value = appearance.buttonFontColor || "";
  if (elements.backgroundColorPicker) {
    elements.backgroundColorPicker.value = appearance.backgroundColor || defaultAppearance.backgroundColor;
  }
  if (elements.buttonColorPicker) {
    elements.buttonColorPicker.value = appearance.buttonColor || defaultAppearance.buttonColor;
  }
  if (elements.profileFontColorPicker) {
    elements.profileFontColorPicker.value = appearance.profileFontColor || defaultAppearance.profileFontColor;
  }
  if (elements.buttonFontColorPicker) {
    elements.buttonFontColorPicker.value = appearance.buttonFontColor || defaultAppearance.buttonFontColor;
  }
  elements.designModal.classList.add("is-open");
}

function resetAppearance() {
  appearance.profileImageUrl = "";
  appearance.backgroundImageUrl = "";
  appearance.backgroundColor = defaultAppearance.backgroundColor;
  appearance.buttonColor = defaultAppearance.buttonColor;
  appearance.profileFontColor = defaultAppearance.profileFontColor;
  appearance.buttonFontColor = defaultAppearance.buttonFontColor;
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
      openCropModal({
        file,
        title: "Crop thumbnail",
        aspectRatio: CROP_RATIOS.thumbnail,
        onSave: (dataUrl) => {
          link.thumbnail = dataUrl;
          saveAll();
          renderPreview();
          renderLinks();
        },
      });
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

function setInboxOpen(value) {
  inboxOpen = value;
  if (!elements.inboxSection || !elements.inboxLayoutBtn) return;
  elements.inboxSection.classList.toggle("is-open", inboxOpen);
  elements.inboxLayoutBtn.classList.toggle("is-active", inboxOpen);
}

function setInboxTab(tab) {
  inboxTab = tab;
  if (!elements.inboxSection) return;
  const tabs = elements.inboxSection.querySelectorAll("[data-inbox-tab]");
  const panels = elements.inboxSection.querySelectorAll("[data-inbox-panel]");
  tabs.forEach((btn) => {
    const isActive = btn.dataset.inboxTab === inboxTab;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.inboxPanel === inboxTab);
  });

  if (inboxTab === "layout") {
    renderInboxLayoutOptions();
  }
}

function setInboxSheetOpen(value) {
  if (!elements.previewInboxSheet || !elements.previewInboxSheetBackdrop) return;
  elements.previewInboxSheet.classList.toggle("is-open", value);
  elements.previewInboxSheetBackdrop.classList.toggle("is-open", value);
  if (elements.previewInboxSheetTitle) {
    elements.previewInboxSheetTitle.textContent = inboxName;
  }
}

function renderInboxBanner() {
  if (!elements.previewInboxBanner) return;
  const isBanner = inboxLayout.type === "banner";
  const isVisible = isBanner && elements.inboxSwitch?.checked;
  elements.previewInboxBanner.classList.toggle("is-visible", Boolean(isVisible));
  if (!isVisible) return;

  const bannerTitle = escapeHTML(inboxName);
  elements.previewInboxBanner.className = "phone-bottom-banner is-visible";
  elements.previewInboxBanner.innerHTML = `
    <div class="banner-handle">
      <div class="banner-title">${bannerTitle}</div>
      <button class="banner-toggle" type="button" aria-label="Open form">
        <span class="material-symbols-outlined">keyboard_arrow_up</span>
      </button>
    </div>
  `;

  const toggleBtn = elements.previewInboxBanner.querySelector(".banner-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (event) => {
      event.preventDefault();
      setInboxSheetOpen(true);
    });
  }
  elements.previewInboxBanner.addEventListener("click", (event) => {
    if (event.target.closest(".banner-toggle")) return;
    setInboxSheetOpen(true);
  });
}

function renderPreviewInboxForm() {
  if (!elements.previewInboxForm) return;

  const fieldsHTML = inboxFormFields.map((field) => {
    const labelSuffix = field.required ? "(required)" : "(optional)";
    const label = `${field.label} ${labelSuffix}`;
    const safeLabel = escapeHTML(label);
    const safePlaceholder = escapeHTML(field.label);
    const isRequired = field.required ? "required" : "";

    if (field.type === "date") {
      return `
        <label class="sheet-field">
          <span>${safeLabel}</span>
          <input type="date" ${isRequired} />
        </label>
      `;
    }

    const inputType = field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text";
    return `
      <label class="sheet-field">
        <span>${safeLabel}</span>
        <input type="${inputType}" placeholder="${safePlaceholder}" ${isRequired} />
      </label>
    `;
  }).join("");

  elements.previewInboxForm.innerHTML = `
    ${fieldsHTML}
    <button class="sheet-submit" type="button" disabled>Send</button>
    <p class="sheet-footnote">
      By submitting, you agree to wemint.link's T&amp;Cs and Privacy Notice.
    </p>
  `;
}

function renderInboxFormEditor() {
  if (!elements.inboxFormRows) return;
  elements.inboxFormRows.innerHTML = inboxFormFields.map((field) => `
    <div class="inbox-form-row" data-field-id="${escapeHTML(field.id)}">
      <span class="material-symbols-outlined inbox-row-drag">drag_indicator</span>
      <span class="inbox-row-label">${escapeHTML(field.label)}</span>
      <input class="inbox-row-required" type="checkbox" ${field.required ? "checked" : ""} aria-label="Required ${escapeHTML(field.label)}" />
      <button class="inbox-row-remove" type="button" aria-label="Remove ${escapeHTML(field.label)}">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  `).join("");

  elements.inboxFormRows.querySelectorAll(".inbox-form-row").forEach((row) => {
    const id = row.dataset.fieldId;
    const requiredInput = row.querySelector(".inbox-row-required");
    const removeBtn = row.querySelector(".inbox-row-remove");

    if (requiredInput) {
      requiredInput.addEventListener("change", () => {
        const target = inboxFormFields.find((field) => field.id === id);
        if (!target) return;
        target.required = requiredInput.checked;
        saveAll();
        renderPreviewInboxForm();
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        if (inboxFormFields.length <= 1) return;
        inboxFormFields = inboxFormFields.filter((field) => field.id !== id);
        saveAll();
        renderInboxFormEditor();
        renderPreviewInboxForm();
      });
    }
  });
}

function openSimpleModal(modal) {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeSimpleModal(modal) {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function closeAllInboxFormModals() {
  closeSimpleModal(elements.inboxFormModal);
  closeSimpleModal(elements.inboxFieldLibraryModal);
  closeSimpleModal(elements.inboxFieldConfigModal);
}

function openInboxFormModal() {
  renderInboxFormEditor();
  openSimpleModal(elements.inboxFormModal);
}

function openInboxFieldLibraryModal() {
  closeSimpleModal(elements.inboxFormModal);
  openSimpleModal(elements.inboxFieldLibraryModal);
  renderInboxFieldLibrary(elements.inboxFieldSearchInput?.value || "");
}

function openInboxFieldConfigModal(type = "text", label = "") {
  preferredFieldType = type;
  if (elements.inboxFieldTypeSelect) {
    elements.inboxFieldTypeSelect.value = preferredFieldType;
  }
  if (elements.inboxFieldLabelInput) {
    elements.inboxFieldLabelInput.value = label || prettyFieldType(preferredFieldType);
  }
  if (elements.inboxFieldRequiredInput) {
    elements.inboxFieldRequiredInput.checked = false;
  }
  closeSimpleModal(elements.inboxFieldLibraryModal);
  openSimpleModal(elements.inboxFieldConfigModal);
}

function renderInboxFieldLibrary(searchQuery = "") {
  if (!elements.inboxFieldLibraryList) return;
  const q = searchQuery.trim().toLowerCase();
  const options = [
    { type: "text", label: "Your Message", section: "Suggestions" },
    { type: "text", label: "Country", section: "Suggestions" },
    { type: "date", label: "Date of birth", section: "Suggestions" },
    { type: "textarea", label: "Message", section: "Suggestions" },
    { type: "text", label: "Short answer", section: "Write your own" },
    { type: "textarea", label: "Paragraph", section: "Write your own" },
    { type: "single_choice", label: "Single choice", section: "Write your own" },
    { type: "checkboxes", label: "Checkboxes", section: "Write your own" },
    { type: "dropdown", label: "Dropdown", section: "Write your own" },
    { type: "date", label: "Date", section: "Write your own" },
  ];

  const filtered = options.filter((item) => !q || item.label.toLowerCase().includes(q));
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const sectionOrder = ["Suggestions", "Write your own"];
  let html = "";
  sectionOrder.forEach((section) => {
    const list = grouped[section];
    if (!list?.length) return;
    html += `<div class="inbox-library-group-title">${escapeHTML(section)}</div>`;
    list.forEach((item, index) => {
      const itemId = `${section}-${index}`;
      html += `
        <button class="inbox-library-item" type="button" data-item-id="${escapeHTML(itemId)}">
          <span>${escapeHTML(item.label)}</span>
          <span class="material-symbols-outlined">add</span>
        </button>
      `;
    });
  });

  if (!html) {
    html = `<div class="inbox-panel-desc">No field found.</div>`;
  }

  elements.inboxFieldLibraryList.innerHTML = html;

  elements.inboxFieldLibraryList.querySelectorAll(".inbox-library-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.querySelector("span")?.textContent?.trim() || "Short answer";
      const selected = options.find((item) => item.label === text);
      openInboxFieldConfigModal(selected?.type || "text", selected?.label || text);
    });
  });
}

function renderInboxLayoutOptions() {
  if (!elements.inboxLayoutBody) return;

  const layoutOptions = [
    {
      id: "banner",
      title: "Banner",
      desc: "Sticky bottom banner that opens a contact sheet.",
      preview: `
        <div class="layout-preview">
          <div class="layout-preview-banner">
            <span class="preview-caption">Get in touch</span>
            <span class="preview-dots">...</span>
          </div>
        </div>
      `,
    },
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
  ];

  let optionsHTML = "";
  layoutOptions.forEach((option) => {
    const isSelected = option.id === inboxLayout.type;

    optionsHTML += `
      <label class="layout-option${isSelected ? " is-selected" : ""}" data-layout="${option.id}">
        <input type="radio" name="layout-inbox" value="${option.id}" ${isSelected ? "checked" : ""} />
        <div class="layout-text">
          <div class="link-title">${option.title}</div>
          <div class="muted">${option.desc}</div>
        </div>
        ${option.preview}
      </label>
    `;
  });

  elements.inboxLayoutBody.innerHTML = optionsHTML;

  elements.inboxLayoutBody.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      inboxLayout.type = input.value;
      saveAll();
      renderPreview();
      renderInboxLayoutOptions();
    });
  });
}

function getCombinedOrder() {
  const clamped = Math.max(0, Math.min(inboxPosition, links.length));
  const order = links.map((link) => link.id);
  order.splice(clamped, 0, "inbox");
  return order;
}

function applyCombinedOrder(order) {
  inboxPosition = order.indexOf("inbox");
  const map = new Map(links.map((link) => [link.id, link]));
  links.length = 0;
  order.forEach((id) => {
    if (id === "inbox") return;
    const item = map.get(id);
    if (item) links.push(item);
  });
  saveAll();
}

function renderLinks() {
  elements.linksList.innerHTML = "";
  if (elements.inboxTitle) {
    elements.inboxTitle.textContent = inboxName;
  }
  const order = getCombinedOrder();
  const inboxSection = elements.inboxSection;
  if (inboxSection && inboxSection.parentElement !== elements.linksList) {
    inboxSection.remove();
  }

  const attachDragHandlers = (target, targetId, dragHandle) => {
    if (!target || !dragHandle) return;
    dragHandle.setAttribute("draggable", "true");
    dragHandle.addEventListener("dragstart", (event) => {
      draggingItemId = targetId;
      target.classList.add("is-dragging");
      event.dataTransfer.setData("text/plain", targetId);
      event.dataTransfer.effectAllowed = "move";
    });
    dragHandle.addEventListener("dragend", () => {
      draggingItemId = null;
      target.classList.remove("is-dragging");
    });

    target.addEventListener("dragover", (event) => {
      if (!draggingItemId || draggingItemId === targetId) return;
      event.preventDefault();
      target.classList.add("drag-over");
    });

    target.addEventListener("dragleave", () => {
      target.classList.remove("drag-over");
    });

    target.addEventListener("drop", (event) => {
      if (!draggingItemId || draggingItemId === targetId) return;
      event.preventDefault();
      target.classList.remove("drag-over");
      const currentOrder = getCombinedOrder();
      const fromIndex = currentOrder.indexOf(draggingItemId);
      const toIndex = currentOrder.indexOf(targetId);
      if (fromIndex < 0 || toIndex < 0) return;
      const [moved] = currentOrder.splice(fromIndex, 1);
      const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      currentOrder.splice(insertIndex, 0, moved);
      applyCombinedOrder(currentOrder);
      renderLinks();
      renderPreview();
    });
  };

  order.forEach((itemId) => {
    if (itemId === "inbox" && inboxSection) {
      elements.linksList.appendChild(inboxSection);
      attachDragHandlers(inboxSection, "inbox", inboxSection.querySelector(".inbox-header-left"));
      return;
    }
    const link = links.find((entry) => entry.id === itemId);
    if (!link) return;
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
            <button class="icon-btn-sm edit-title-btn" aria-label="Edit title">
              <span class="material-symbols-outlined">edit</span>
            </button>
          </div>
          <div class="link-url-row">
            <span class="link-url">${displayUrl}</span>
            <button class="icon-btn-sm edit-url-btn" aria-label="Edit URL">
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

    // Inline edit handlers (same behavior pattern as Inbox title edit)
    const startInlineEdit = ({ selector, value, className, onCommit }) => {
      const currentNode = card.querySelector(selector);
      if (!currentNode) return;
      const currentValue = value;
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentValue;
      input.className = className;
      currentNode.replaceWith(input);
      input.focus();
      input.select();

      const commit = () => {
        onCommit(input.value, currentValue);
      };

      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          input.value = currentValue;
          input.blur();
        }
      });
    };

    const editTitleBtn = card.querySelector(".edit-title-btn");
    if (editTitleBtn) {
      editTitleBtn.addEventListener("click", () => {
        startInlineEdit({
          selector: ".link-title",
          value: link.title || "",
          className: "inbox-title-input",
          onCommit: (nextValue, fallbackValue) => {
            const next = nextValue.trim() || fallbackValue || "Untitled";
            link.title = next;
            saveAll();
            renderLinks();
            renderPreview();
          },
        });
      });
    }

    const editUrlBtn = card.querySelector(".edit-url-btn");
    if (editUrlBtn) {
      editUrlBtn.addEventListener("click", () => {
        startInlineEdit({
          selector: ".link-url",
          value: link.url || "",
          className: "inbox-title-input link-url-input",
          onCommit: (nextValue, fallbackValue) => {
            const next = nextValue.trim() || fallbackValue || "https://";
            link.url = next;
            saveAll();
            renderLinks();
            renderPreview();
          },
        });
      });
    }

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
    attachDragHandlers(card, link.id, dragHandle);

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
  const order = getCombinedOrder();
  order.forEach((itemId) => {
    if (itemId === "inbox") {
      if (!elements.inboxSwitch?.checked) {
        setInboxSheetOpen(false);
        return;
      }
      if (inboxLayout.type !== "banner") {
        const inboxItem = document.createElement("div");
        inboxItem.className = "phone-link inbox";
        inboxItem.innerHTML = `
          <span>${escapeHTML(inboxName)}</span>
        `;
        inboxItem.addEventListener("click", () => setInboxSheetOpen(true));
        elements.previewLinks.appendChild(inboxItem);
      }
      renderInboxBanner();
      return;
    }
    const link = links.find((entry) => entry.id === itemId);
    if (!link || !link.enabled) return;
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

  renderInboxBanner();
  renderPreviewInboxForm();
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
  const profileIsLocal = appearance.profileImageUrl?.startsWith("data:");
  setImageHint(
    elements.profileImageHint,
    profileIsLocal ? "Using local file (stored in browser)." : "Supports JPG, PNG, WebP."
  );
  if (elements.showProfileImage) elements.showProfileImage.checked = visibility.showProfileImage;
  if (elements.showDisplayName) elements.showDisplayName.checked = visibility.showDisplayName;
  if (elements.showBio) elements.showBio.checked = visibility.showBio;
  if (elements.showSocialIcons) elements.showSocialIcons.checked = visibility.showSocialIcons;
  elements.profileModal.classList.add("is-open");
  elements.profileModal.setAttribute("aria-hidden", "false");
}

function closeProfileModal() {
  elements.profileModal.classList.remove("is-open");
  elements.profileModal.setAttribute("aria-hidden", "true");
}

async function downloadPreviewImage() {
  const phone = document.querySelector(".phone");
  if (!phone) return;
  if (typeof html2canvas !== "function") {
    alert("Download not ready. Please refresh the page and try again.");
    return;
  }
  const btn = elements.downloadPreviewBtn;
  if (btn) {
    btn.disabled = true;
    btn.classList.add("is-loading");
  }
  try {
    const bgColor = appearance.backgroundColor || "#ffffff";
    const canvas = await html2canvas(phone, {
      backgroundColor: bgColor,
      useCORS: true,
      scale: 2,
    });
    await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve();
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "wemint-preview.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png");
    });
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("is-loading");
    }
  }
}

function initEvents() {
  elements.addLinkBtn.addEventListener("click", () => openModal());
  if (elements.topbarAddBtn) {
    elements.topbarAddBtn.addEventListener("click", openProfileModal);
  }
  if (elements.downloadPreviewBtn) {
    elements.downloadPreviewBtn.addEventListener("click", downloadPreviewImage);
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

  if (elements.inboxLayoutBtn) {
    elements.inboxLayoutBtn.addEventListener("click", () => {
      setInboxOpen(!inboxOpen);
    });
  }

  if (elements.inboxCloseBtn) {
    elements.inboxCloseBtn.addEventListener("click", () => {
      setInboxOpen(false);
    });
  }

  if (elements.inboxSection) {
    elements.inboxSection.querySelectorAll("[data-inbox-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setInboxTab(btn.dataset.inboxTab);
      });
    });
  }

  if (elements.inboxSwitch) {
    elements.inboxSwitch.addEventListener("change", renderPreview);
  }

  if (elements.inboxEditBtn && elements.inboxTitle) {
    elements.inboxEditBtn.addEventListener("click", () => {
      const current = inboxName;
      const input = document.createElement("input");
      input.type = "text";
      input.value = current;
      input.className = "inbox-title-input";
      elements.inboxTitle.replaceWith(input);
      input.focus();
      input.select();

      const commit = () => {
        const next = input.value.trim() || "Get in touch";
        inboxName = next;
        saveAll();
        const span = document.createElement("span");
        span.className = "link-title";
        span.id = "inboxTitle";
        span.textContent = inboxName;
        input.replaceWith(span);
        elements.inboxTitle = span;
        if (elements.previewInboxSheetTitle) {
          elements.previewInboxSheetTitle.textContent = inboxName;
        }
        renderPreview();
      };

      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          input.value = current;
          input.blur();
        }
      });
    });
  }

  if (elements.inboxEditFormBtn) {
    elements.inboxEditFormBtn.addEventListener("click", openInboxFormModal);
  }
  if (elements.inboxAddFieldBtn) {
    elements.inboxAddFieldBtn.addEventListener("click", openInboxFieldLibraryModal);
  }
  if (elements.closeInboxFormBtn) {
    elements.closeInboxFormBtn.addEventListener("click", closeAllInboxFormModals);
  }
  if (elements.dismissInboxFormBtn) {
    elements.dismissInboxFormBtn.addEventListener("click", closeAllInboxFormModals);
  }
  if (elements.inboxFormDoneBtn) {
    elements.inboxFormDoneBtn.addEventListener("click", closeAllInboxFormModals);
  }
  if (elements.inboxFieldLibraryBackBtn) {
    elements.inboxFieldLibraryBackBtn.addEventListener("click", () => {
      closeSimpleModal(elements.inboxFieldLibraryModal);
      openInboxFormModal();
    });
  }
  if (elements.dismissInboxFieldLibraryBtn) {
    elements.dismissInboxFieldLibraryBtn.addEventListener("click", closeAllInboxFormModals);
  }
  if (elements.inboxFieldConfigBackBtn) {
    elements.inboxFieldConfigBackBtn.addEventListener("click", () => {
      closeSimpleModal(elements.inboxFieldConfigModal);
      openInboxFieldLibraryModal();
    });
  }
  if (elements.dismissInboxFieldConfigBtn) {
    elements.dismissInboxFieldConfigBtn.addEventListener("click", closeAllInboxFormModals);
  }
  if (elements.inboxFieldSearchInput) {
    elements.inboxFieldSearchInput.addEventListener("input", () => {
      renderInboxFieldLibrary(elements.inboxFieldSearchInput.value);
    });
  }
  if (elements.inboxFieldTypeSelect) {
    elements.inboxFieldTypeSelect.addEventListener("change", () => {
      preferredFieldType = elements.inboxFieldTypeSelect.value;
      if (elements.inboxFieldLabelInput && !elements.inboxFieldLabelInput.value.trim()) {
        elements.inboxFieldLabelInput.value = prettyFieldType(preferredFieldType);
      }
    });
  }
  if (elements.inboxFieldConfigForm) {
    elements.inboxFieldConfigForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const type = elements.inboxFieldTypeSelect?.value || "text";
      const rawLabel = elements.inboxFieldLabelInput?.value || "";
      const label = rawLabel.trim() || prettyFieldType(type);
      const isRequired = Boolean(elements.inboxFieldRequiredInput?.checked);
      const suggestedInputType = type === "single_choice" || type === "checkboxes" || type === "dropdown"
        ? "text"
        : type;

      const newField = {
        id: crypto.randomUUID(),
        type: suggestedInputType,
        label,
        required: isRequired,
      };
      inboxFormFields.push(newField);
      saveAll();
      renderInboxFormEditor();
      renderPreviewInboxForm();
      closeSimpleModal(elements.inboxFieldConfigModal);
      openInboxFormModal();
    });
  }

  [elements.inboxFormModal, elements.inboxFieldLibraryModal, elements.inboxFieldConfigModal].forEach((modal) => {
    if (!modal) return;
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeAllInboxFormModals();
    });
  });

  if (elements.previewInboxSheetClose) {
    elements.previewInboxSheetClose.addEventListener("click", () => setInboxSheetOpen(false));
  }
  if (elements.previewInboxSheetBackdrop) {
    elements.previewInboxSheetBackdrop.addEventListener("click", () => setInboxSheetOpen(false));
  }

  if (elements.previewInboxSheetTitle) {
    elements.previewInboxSheetTitle.textContent = inboxName;
  }

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
    applyAppearance();
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
  elements.cropModal.addEventListener("click", (event) => {
    if (event.target === elements.cropModal) closeCropModal();
  });
  elements.closeCropBtn.addEventListener("click", closeCropModal);
  elements.cropCancelBtn.addEventListener("click", closeCropModal);
  elements.cropSaveBtn.addEventListener("click", saveCrop);

  if (elements.sidebarToggle && elements.sidebar && elements.sidebarOverlay) {
    const closeSidebar = () => {
      elements.sidebar.classList.remove("is-open");
      elements.sidebarOverlay.classList.remove("is-visible");
      elements.sidebarOverlay.setAttribute("aria-hidden", "true");
    };

    const openSidebar = () => {
      elements.sidebar.classList.add("is-open");
      elements.sidebarOverlay.classList.add("is-visible");
      elements.sidebarOverlay.setAttribute("aria-hidden", "false");
    };

    elements.sidebarToggle.addEventListener("click", () => {
      const isOpen = elements.sidebar.classList.contains("is-open");
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    elements.sidebarOverlay.addEventListener("click", closeSidebar);
  }

  if (elements.showProfileImage) {
    elements.showProfileImage.addEventListener("change", () => {
      visibility.showProfileImage = elements.showProfileImage.checked;
      saveAll();
      applyAppearance();
    });
  }

  if (elements.showDisplayName) {
    elements.showDisplayName.addEventListener("change", () => {
      visibility.showDisplayName = elements.showDisplayName.checked;
      saveAll();
      renderProfile();
    });
  }

  if (elements.showBio) {
    elements.showBio.addEventListener("change", () => {
      visibility.showBio = elements.showBio.checked;
      saveAll();
      renderProfile();
    });
  }
  if (elements.showSocialIcons) {
    elements.showSocialIcons.addEventListener("change", () => {
      visibility.showSocialIcons = elements.showSocialIcons.checked;
      saveAll();
      renderProfile();
    });
  }

  elements.designForm.addEventListener("submit", (event) => {
    event.preventDefault();
    appearance.backgroundColor = elements.backgroundColor.value.trim();
    appearance.buttonColor = elements.buttonColor.value.trim();
    appearance.profileFontColor = elements.profileFontColor.value.trim();
    appearance.buttonFontColor = elements.buttonFontColor.value.trim();
    saveAll();
    applyAppearance();
    closeDesignModal();
  });

  elements.resetDesignBtn.addEventListener("click", resetAppearance);

  if (elements.profileImageFile) {
    elements.profileImageFile.addEventListener("change", () => {
      const file = elements.profileImageFile.files?.[0];
      if (!file) return;
      openCropModal({
        file,
        title: "Crop profile image",
        aspectRatio: CROP_RATIOS.profile,
        onSave: (dataUrl) => {
          appearance.profileImageUrl = dataUrl;
          saveAll();
          applyAppearance();
          setImageHint(elements.profileImageHint, "Using local file (stored in browser).");
        },
      });
    });
  }

  if (elements.backgroundImageFile) {
    elements.backgroundImageFile.addEventListener("change", () => {
      const file = elements.backgroundImageFile.files?.[0];
      if (!file) return;
      openCropModal({
        file,
        title: "Crop background image",
        aspectRatio: CROP_RATIOS.background,
        onSave: (dataUrl) => {
          appearance.backgroundImageUrl = dataUrl;
          saveAll();
          applyAppearance();
          setImageHint(elements.backgroundImageHint, "Using local file (stored in browser).");
        },
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

  setInboxOpen(inboxOpen);
  setInboxTab(inboxTab);
  renderInboxBanner();
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
  if (FORCE_PROFILE_MOCK) {
    storage.set("wemint_profile", defaultProfile);
  }
  if (FORCE_APPEARANCE_MOCK) {
    storage.set("wemint_appearance", defaultAppearance);
  }
  renderProfile();
  renderLinks();
  renderPreview();
  initEvents();
  renderSocialSlots();
  applyAppearance();
  initNavAccordion();
  initBannerCycle();
  if (FORCE_PROFILE_MOCK) {
    openProfileModal();
  }
}

init();
