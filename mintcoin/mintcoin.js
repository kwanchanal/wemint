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

const FACTORY_ADDRESS = "0xa73b1C83dFd2EeC46434f931c6A891FC9E6628E2";
const FACTORY_ADDRESSES = [
  "0xa73b1C83dFd2EeC46434f931c6A891FC9E6628E2",
  "0x08813b21e4B2fB89Dbd8b25CcC54fFf69dA08BFF"
];
const DEPLOY_FEE_ETH = "0.001";
const FACTORY_ABI = [
  "event CoinCreated(address indexed coin,address indexed owner,string name,string symbol,string description)",
  "function createCoin(string name,string symbol,uint8 decimals,uint256 initialSupply,address owner,uint256 cap,string description) payable returns (address)"
];
const FACTORY_ABI_LEGACY = [
  "event CoinCreated(address indexed coin,address indexed owner,string name,string symbol)"
];
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function description() view returns (string)"
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
    const description = document.querySelector("#coin-description")?.value.trim() || "";

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

      const tx = await factory.createCoin(name, symbol, decimals, initialSupply, owner, capValue, description, { value: fee });
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
const headerText = document.querySelector("#header-text");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const createdList = document.querySelector("#created-list");
const createdEmpty = document.querySelector("#created-empty");
const placeholderImage = "../assets/placeholder/placeholder2.png";

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

if (headerText) {
  const headerMessage = "MINT YOUR COIN";
  let headerIndex = 0;
  let headerDeleting = false;

  const typeHeader = () => {
    if (prefersReducedMotion) {
      headerText.textContent = headerMessage;
      return;
    }
    headerText.textContent = headerMessage.slice(0, headerIndex);
    if (!headerDeleting && headerIndex < headerMessage.length) {
      headerIndex += 1;
      setTimeout(typeHeader, 110);
      return;
    }
    if (!headerDeleting) {
      headerDeleting = true;
      setTimeout(typeHeader, 900);
      return;
    }
    if (headerIndex > 0) {
      headerIndex -= 1;
      setTimeout(typeHeader, 60);
      return;
    }
    headerDeleting = false;
    setTimeout(typeHeader, 500);
  };

  typeHeader();
}

const getNetworkLabel = (chainId) => {
  if (chainId === 84532) return "BASE SEPO";
  if (chainId === 8453) return "BASE MAIN";
  return "NETWORK";
};

const createCoinCard = ({ address, name, symbol, description, networkLabel }) => {
  const article = document.createElement("article");
  article.className = "coin-card";
  article.innerHTML = `
    <div class="coin-card__img">
      <img src="${placeholderImage}" alt="${name} logo" />
    </div>
    <div class="coin-card__body">
      <h3>${networkLabel} - ${symbol}</h3>
      <p>${description || name}</p>
      <div class="coin-card__meta">
        <span>${address}</span>
        <span class="pill">Created</span>
      </div>
    </div>
    <div class="coin-card__actions">
      <button class="ghost" type="button" aria-label="favorite">❤</button>
      <button class="ghost" type="button" aria-label="copy address">⧉</button>
    </div>
  `;
  const copyBtn = article.querySelector('[aria-label="copy address"]');
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard?.writeText(address);
    });
  }
  return article;
};

const renderCreatedCoins = (coins, networkLabel) => {
  if (!createdList || !createdEmpty) return;
  createdList.innerHTML = "";
  if (!coins.length) {
    createdEmpty.style.display = "block";
    return;
  }
  createdEmpty.style.display = "none";
  coins.forEach((coin) => {
    createdList.appendChild(createCoinCard({ ...coin, networkLabel }));
  });
};

const loadCreatedCoins = async () => {
  if (!createdList || !window.ethers) return;
  const fallback = [
    {
      address: "0xa1206055387fb5573591ce921e91db2a3a770f83",
      name: "WeMint01",
      symbol: "WEMINT01",
      description: "We Mint community coin"
    }
  ];

  let provider;
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
  } else {
    provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  }

  try {
    const network = await provider.getNetwork();
    const networkLabel = getNetworkLabel(Number(network.chainId));
    const iface = new ethers.Interface(FACTORY_ABI);
    const legacyIface = new ethers.Interface(FACTORY_ABI_LEGACY);
    const logs = (
      await Promise.all(
        FACTORY_ADDRESSES.map(async (address) => {
          const [modernLogs, legacyLogs] = await Promise.all([
            provider.getLogs({
              address,
              topics: [iface.getEvent("CoinCreated").topicHash],
              fromBlock: 0,
              toBlock: "latest"
            }),
            provider.getLogs({
              address,
              topics: [legacyIface.getEvent("CoinCreated").topicHash],
              fromBlock: 0,
              toBlock: "latest"
            })
          ]);
          return [...modernLogs, ...legacyLogs];
        })
      )
    ).flat();

    const seen = new Set();
    const coins = [];
    for (const log of logs) {
      let parsed;
      let description = "";
      try {
        parsed = iface.parseLog(log);
        description = parsed.args.description;
      } catch (error) {
        parsed = legacyIface.parseLog(log);
      }
      const address = parsed.args.coin;
      if (seen.has(address)) continue;
      seen.add(address);
      let name = parsed.args.name;
      let symbol = parsed.args.symbol;
      try {
        const token = new ethers.Contract(address, ERC20_ABI, provider);
        name = await token.name();
        symbol = await token.symbol();
        description = description || await token.description();
      } catch (error) {
        // Keep event data if token call fails.
      }
      coins.push({ address, name, symbol, description });
    }

    renderCreatedCoins(coins.length ? coins : fallback, networkLabel);
  } catch (error) {
    renderCreatedCoins(fallback, "BASE SEPO");
  }
};

loadCreatedCoins();
