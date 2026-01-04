const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    tabs.forEach((btn) => {
      btn.classList.toggle("is-active", btn === tab);
      btn.setAttribute("aria-selected", btn === tab ? "true" : "false");
    });
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === target);
    });
  });
});

const connectButton = document.querySelector(".wallet__btn");
const ownerAddress = document.querySelector("#owner-address");
const mintButton = document.querySelector(".mint-btn");
const mintStatus = document.querySelector(".mint-status");

const FACTORY_ADDRESS = "REPLACE_WITH_FACTORY_ADDRESS";
const DEPLOY_FEE_ETH = "0.001";
const FACTORY_ABI = [
  "function createCoin(string name,string symbol,uint8 decimals,uint256 initialSupply,address owner,uint256 cap) payable returns (address)"
];
let isConnected = false;

const shortenAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-2)}`;
};

if (connectButton) {
  connectButton.addEventListener("click", async () => {
    if (isConnected) {
      isConnected = false;
      connectButton.textContent = "CONNECT WALLET";
      if (ownerAddress) ownerAddress.value = "";
      return;
    }
    if (!window.ethereum) {
      connectButton.textContent = "METAMASK NOT FOUND";
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const short = shortenAddress(accounts[0]);
      isConnected = true;
      connectButton.textContent = short;
      if (ownerAddress) ownerAddress.value = accounts[0];
    } catch (error) {
      connectButton.textContent = "CONNECT WALLET";
    }
  });
}

const getNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

if (mintButton) {
  mintButton.addEventListener("click", async () => {
    if (!window.ethereum || !window.ethers) {
      if (mintStatus) mintStatus.textContent = "METAMASK NOT FOUND";
      return;
    }
    if (FACTORY_ADDRESS === "REPLACE_WITH_FACTORY_ADDRESS") {
      if (mintStatus) mintStatus.textContent = "SET FACTORY ADDRESS";
      return;
    }

    const name = document.querySelector("#coin-name")?.value.trim();
    const symbol = document.querySelector("#coin-symbol")?.value.trim();
    const decimals = getNumber(document.querySelector("#coin-decimals")?.value, 18);
    const initialSupplyRaw = document.querySelector("#initial-supply")?.value || "0";
    const owner = ownerAddress?.value.trim();
    const capRaw = document.querySelector("#supply-cap")?.value || "0";

    if (!name || !symbol || !owner) {
      if (mintStatus) mintStatus.textContent = "PLEASE FILL REQUIRED FIELDS";
      return;
    }

    try {
      mintButton.disabled = true;
      if (mintStatus) mintStatus.textContent = "REQUESTING SIGNATURE...";

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

      const initialSupply = ethers.parseUnits(initialSupplyRaw, decimals);
      const capValue = capRaw ? ethers.parseUnits(capRaw, decimals) : 0n;
      const fee = ethers.parseEther(DEPLOY_FEE_ETH);

      const tx = await factory.createCoin(name, symbol, decimals, initialSupply, owner, capValue, { value: fee });
      if (mintStatus) mintStatus.textContent = "DEPLOYING...";

      await tx.wait();
      if (mintStatus) mintStatus.textContent = "DEPLOYED";
    } catch (error) {
      if (mintStatus) mintStatus.textContent = "FAILED TO DEPLOY";
    } finally {
      mintButton.disabled = false;
    }
  });
}

const imageInput = document.querySelector("#coin-image");
const previewImage = document.querySelector(".preview__image");
const previewEmpty = document.querySelector(".preview__empty");

if (imageInput) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    previewImage.src = url;
    previewImage.style.display = "block";
    if (previewEmpty) {
      previewEmpty.style.display = "none";
    }
  });
}
