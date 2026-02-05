const walletInput = document.getElementById('wallet');
const nameInput = document.getElementById('name');
const bioInput = document.getElementById('bio');
const messageInput = document.getElementById('message');
const avatarUpload = document.getElementById('avatar-upload');
const qrUpload = document.getElementById('qr-upload');
const previewName = document.getElementById('preview-name');
const previewDetail = document.getElementById('preview-detail');
const previewMessage = document.getElementById('preview-message');
const previewAvatar = document.querySelector('.preview-avatar');
const previewQr = document.querySelector('.preview-qr img');
const previewWallet = document.getElementById('preview-wallet');
const cropModal = document.getElementById('crop-modal');
const cropImage = document.getElementById('crop-image');
const cropApply = document.getElementById('crop-apply');
const cropCloseButtons = document.querySelectorAll('[data-close]');
const resetButtons = document.querySelectorAll('[data-reset]');
const shareLinkInput = document.getElementById('share-link');
const shareButton = document.getElementById('share-btn');
const downloadButton = document.getElementById('download-btn');
const nextButton = document.getElementById('btn-next');
const backButton = document.getElementById('btn-back');
const formSection = document.querySelector('[data-step="form"]');
const reviewSection = document.querySelector('[data-step="review"]');
const previewCard = document.querySelector('.preview-card');
const sidebar = document.querySelector('.sidebar');
const sheetOpen = document.getElementById('sheet-open');
const sheetClose = document.getElementById('sheet-close');

const defaultName = 'Kwanchanal Geographic';
const defaultDetail = 'Scuba Diving School and Recreation\nlocated in Koh Tao, Thailand';
const defaultMessage = "It's Kwan! Thank You For Support 🙏🏻";
const defaultWallet = '0x0df214be853caE6f646c9929EAfF857cb3452EFd';
const defaultAvatar = 'asset/phone-profile.png';
const defaultQr = 'asset/phone-qr.png';
const bioWrap = 35;
const cropTargets = {
  avatar: { img: previewAvatar, fallback: defaultAvatar, size: 256 },
  qr: { img: previewQr, fallback: defaultQr, size: 320 }
};

let cropper = null;
let cropTarget = null;
let cropInput = null;
let cropObjectUrl = '';

function wrapByChars(text, limit) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  let out = '';
  for (let i = 0; i < clean.length; i += limit) {
    out += clean.slice(i, i + limit);
    if (i + limit < clean.length) out += '\n';
  }
  return out;
}

function slugifyName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function updateShareLink() {
  if (!shareLinkInput) return;
  const source = nameInput.value.trim() || defaultName;
  const slug = slugifyName(source) || 'kwanchanal';
  shareLinkInput.value = `wemint.link/${slug}`;
}

function openCropper(file, targetKey, input) {
  if (!file) return;
  cropTarget = cropTargets[targetKey];
  cropInput = input;

  if (cropObjectUrl) {
    URL.revokeObjectURL(cropObjectUrl);
    cropObjectUrl = '';
  }

  cropObjectUrl = URL.createObjectURL(file);
  cropImage.src = cropObjectUrl;
  cropModal.classList.add('is-open');
  cropModal.setAttribute('aria-hidden', 'false');

  if (cropper) {
    cropper.destroy();
    cropper = null;
  }

  cropImage.onload = () => {
    cropper = new Cropper(cropImage, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      background: false,
      guides: false
    });
  };
}

function closeCropper() {
  cropModal.classList.remove('is-open');
  cropModal.setAttribute('aria-hidden', 'true');
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
  if (cropObjectUrl) {
    URL.revokeObjectURL(cropObjectUrl);
    cropObjectUrl = '';
  }
  if (cropInput) {
    cropInput.value = '';
  }
  cropTarget = null;
  cropInput = null;
}

function updatePreview() {
  const name = nameInput.value.trim();
  const bio = bioInput.value.trim();
  const message = messageInput.value.trim();
  const wallet = walletInput.value.trim();

  previewName.textContent = name || defaultName;
  if (bio) {
    previewDetail.textContent = wrapByChars(bio, bioWrap);
  } else {
    previewDetail.textContent = defaultDetail;
  }
  previewWallet.textContent = wallet || defaultWallet;

  previewMessage.hidden = false;
  previewMessage.textContent = message || defaultMessage;

  updateShareLink();
}

[walletInput, nameInput, bioInput, messageInput].forEach((el) => {
  el.addEventListener('input', updatePreview);
  el.addEventListener('change', updatePreview);
});

avatarUpload.addEventListener('change', () => {
  const file = avatarUpload.files && avatarUpload.files[0];
  openCropper(file, 'avatar', avatarUpload);
});

qrUpload.addEventListener('change', () => {
  const file = qrUpload.files && qrUpload.files[0];
  openCropper(file, 'qr', qrUpload);
});

updatePreview();

function toggleSheet(open) {
  if (!window.matchMedia('(max-width: 900px)').matches) return;
  document.body.classList.toggle('sheet-open', open);
}

if (sheetOpen) {
  sheetOpen.addEventListener('click', () => toggleSheet(true));
}

if (sheetClose) {
  sheetClose.addEventListener('click', () => toggleSheet(false));
}

window.addEventListener('resize', () => toggleSheet(false));

cropApply.addEventListener('click', () => {
  if (!cropper || !cropTarget) {
    closeCropper();
    return;
  }
  const canvas = cropper.getCroppedCanvas({
    width: cropTarget.size,
    height: cropTarget.size
  });
  cropTarget.img.src = canvas.toDataURL('image/png');
  closeCropper();
});

cropCloseButtons.forEach((btn) => {
  btn.addEventListener('click', closeCropper);
});

resetButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-reset');
    const target = cropTargets[key];
    if (!target) return;
    target.img.src = target.fallback;
    if (key === 'avatar') avatarUpload.value = '';
    if (key === 'qr') qrUpload.value = '';
  });
});

if (shareButton) {
  shareButton.addEventListener('click', async () => {
    updateShareLink();
    const url = shareLinkInput?.value || 'wemint.link/kwanchanal';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Payment link', text: url, url: `https://${url}` });
        return;
      } catch (err) {
        console.error('Share failed', err);
      }
    }
    if (shareLinkInput) {
      try {
        await navigator.clipboard.writeText(url);
        shareButton.classList.add('copied');
        setTimeout(() => shareButton.classList.remove('copied'), 1200);
      } catch (err) {
        console.error('Copy failed', err);
      }
    }
  });
}

if (downloadButton && previewCard) {
  downloadButton.addEventListener('click', async () => {
    try {
      const canvas = await html2canvas(previewCard, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = 'wemint-preview.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    }
  });
}

function showReview(show) {
  if (!formSection || !reviewSection) return;
  formSection.classList.toggle('is-hidden', show);
  reviewSection.classList.toggle('is-hidden', !show);
  if (backButton) {
    backButton.classList.toggle('is-hidden', !show);
  }
  if (nextButton) {
    nextButton.classList.toggle('is-hidden', show);
  }
}

if (nextButton) {
  nextButton.addEventListener('click', () => {
    showReview(true);
  });
}

if (backButton) {
  backButton.addEventListener('click', () => {
    if (reviewSection && !reviewSection.classList.contains('is-hidden')) {
      showReview(false);
    }
  });
}

const copyButtons = document.querySelectorAll('[data-copy]');
copyButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const selector = btn.getAttribute('data-copy');
    const target = document.querySelector(selector);
    if (!target) return;

    try {
      const value = 'value' in target ? target.value : target.textContent;
      await navigator.clipboard.writeText(value.trim());
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1200);
    } catch (err) {
      console.error('Copy failed', err);
    }
  });
});
