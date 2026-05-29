// TODO:
// [x] Wire frontend script loading
// [x] Add button click behavior
// [x] Connect browser requests to count routes

const countDisplay = document.getElementById("countDisplay");
const multiplierInput = document.getElementById("multiplierInput");
const incrementButton = document.getElementById("incrementButton");
const multiplyButton = document.getElementById("multiplyButton");
const errorMessage = document.getElementById("errorMessage");

let currentCount = 0;
let increaseHighlightTimeoutId;

function renderCount(nextCount) {
  const didIncrease = nextCount > currentCount;

  currentCount = nextCount;
  countDisplay.hidden = false;
  countDisplay.textContent = String(nextCount);

  if (!didIncrease) {
    countDisplay.classList.remove("is-increasing");
    return;
  }

  countDisplay.classList.add("is-increasing");
  window.clearTimeout(increaseHighlightTimeoutId);
  increaseHighlightTimeoutId = window.setTimeout(() => {
    countDisplay.classList.remove("is-increasing");
  }, 400);
}

function setErrorMessage(message) {
  errorMessage.textContent = message;
}

async function readJsonResponse(response) {
  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    const errorText =
      responseBody && typeof responseBody.error === "string"
        ? responseBody.error
        : `Request failed with status ${response.status}.`;

    throw new Error(errorText);
  }

  return responseBody;
}

// Load the current count first so the page reflects the server state.
async function loadCurrentCount() {
  setErrorMessage("");

  try {
    const response = await fetch("/count");
    const responseBody = await readJsonResponse(response);

    renderCount(responseBody.count);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load the current count.";

    setErrorMessage(message);
    countDisplay.hidden = false;
    countDisplay.textContent = "Unavailable";
  }
}

// Send increment requests through the backend and re-render from its response.
async function updateCountBy(incrementBy) {
  setErrorMessage("");

  try {
    const response = await fetch("/increment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: incrementBy }),
    });
    const responseBody = await readJsonResponse(response);

    renderCount(responseBody.count);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update the count.";

    setErrorMessage(message);
  }
}

incrementButton.addEventListener("click", async () => {
  await updateCountBy(1);
});

multiplyButton.addEventListener("click", async () => {
  const multiplier = Number(multiplierInput.value);

  if (!Number.isFinite(multiplier) || !Number.isSafeInteger(multiplier)) {
    setErrorMessage("Please enter a valid whole-number multiplier.");
    return;
  }

  if (multiplier < 1) {
    setErrorMessage("Please enter a multiplier of 1 or more.");
    return;
  }

  // Multiplying zero by any positive integer still produces zero.
  if (currentCount === 0) {
    renderCount(0);
    setErrorMessage("");
    return;
  }

  if (currentCount === Number.MAX_SAFE_INTEGER) {
    if (multiplier === 1) {
      setErrorMessage("");
      return;
    }

    setErrorMessage("The maximum count has been reached. No safe multiplier is possible other than 1.");
    return;
  }

  const nextCount = currentCount * multiplier;

  if (!Number.isSafeInteger(nextCount) || nextCount > Number.MAX_SAFE_INTEGER) {
    const maxMultiplier = Math.floor(Number.MAX_SAFE_INTEGER / currentCount);

    setErrorMessage(
      `The multiplier must be between 1 and ${maxMultiplier} for the current count.`,
    );
    return;
  }

  const incrementBy = nextCount - currentCount;

  if (incrementBy < 1) {
    if (multiplier === 1) {
      setErrorMessage("");
      return;
    }

    setErrorMessage("The multiplier must be 1 or greater.");
    return;
  }

  await updateCountBy(incrementBy);
});

void loadCurrentCount();
