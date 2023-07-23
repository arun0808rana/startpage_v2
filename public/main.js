const modal = document.querySelector(".modal");
const modalCloseBtn = document.querySelector(".modal-close");
const settingsBtn = document.querySelector(".settings");
const userTextarea = document.querySelector(".user-area");
const linksContainer = document.querySelector(".links-container");

let bookmarks = [];

(async () => {
  bookmarks = await getBookmarks();
  renderBookmarks();
})();

settingsBtn.onclick = () => {
  modal.style.display = "block";
  userTextarea.value = JSON.stringify(bookmarks, undefined, 2);;
};

modalCloseBtn.onclick = () => {
  modal.style.display = "none";
};


async function getBookmarks() {
  const cachedBookmarks = localStorage.getItem("cachedBookmarks");

  if (cachedBookmarks) {
    console.log("Using cached bookmarks");
    return JSON.parse(cachedBookmarks);
  }

  console.log("Using default bookmarks");
  const response = await fetch("/default.json");
  const tempBookmarks = await response.json();
  localStorage.setItem("cachedBookmarks", JSON.stringify(tempBookmarks));
  return tempBookmarks;
}

async function renderBookmarks() {
  bookmarks = sortByAlphabeticalOrder(bookmarks);
  const linksFragment = document.createDocumentFragment();

  for (let bookmark of bookmarks) {
    const link = document.createElement("a");
    link.href = bookmark.url;
    link.classList.add("links");
    link.textContent = bookmark.name;
    linksFragment.appendChild(link);
  }

  linksContainer.innerHTML = "";
  linksContainer.appendChild(linksFragment);
}

function sortByAlphabeticalOrder(arr) {
  return arr.sort((a, b) => a.name.localeCompare(b.name));
}

function exportDB() {
  // Convert the JavaScript object to a JSON string
  let jsonString = JSON.stringify(bookmarks, null, 2);

  // Create a Blob containing the JSON data
  let blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary URL for the Blob
  let url = URL.createObjectURL(blob);

  // Create a temporary anchor element to trigger the download
  let downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `Export_${new Date().toDateString()}.json`; // File name for the downloaded file

  // Append the anchor element to the document and trigger the download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up the temporary resources
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

async function importDB() {
  const importedEntries = JSON.stringify(JSON.parse(userTextarea.value));
  localStorage.removeItem("cachedBookmarks");
  localStorage.setItem("cachedBookmarks", importedEntries);
  bookmarks = JSON.parse(localStorage.getItem("cachedBookmarks"));
  await renderBookmarks();
  userTextarea.value = "";
}
