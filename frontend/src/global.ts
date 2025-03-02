const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem("token");

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await originalFetch(input, options);

    if (!response.ok) {
      await handleHttpError(response);
    }

    return response;
  } catch (error) {
    console.error("Network error:", error);
    handleNetworkError();
    throw error;
  }
};

async function handleHttpError(response: Response): Promise<void> {
  const excludedPaths: string[] = ["/login", "/register"];
  const currentPath: string = window.location.pathname;

  if (excludedPaths.some((path) => currentPath.startsWith(path))) {
    return;
  }

  let errorCode = "";
  let errorMessage = "An unexpected error occurred.";

  try {
    const responseBody = await response.clone().json();
    if (responseBody && typeof responseBody === "object" && responseBody.errors) {
      errorCode = responseBody.errors.code as string;
      errorMessage = responseBody.errors.message as string;
    }
  } catch (error) {
    console.warn("Failed to parse error response:", error);
  }

  localStorage.setItem("http-error", response.status.toString());
  localStorage.setItem("error-code", errorCode);
  localStorage.setItem("error-message", errorMessage);

  showModal(errorCode, errorMessage, response.status.toString());
}

function handleNetworkError(): void {
  const excludedPaths: string[] = ["/login", "/register"];
  const currentPath: string = window.location.pathname;

  if (!excludedPaths.some((path) => currentPath.startsWith(path))) {
    const errorCode = "NETWORK_ERROR";
    const errorMessage = "Network error. Please check your connection.";
    localStorage.setItem("http-error", errorCode);
    localStorage.setItem("error-code", errorCode);
    localStorage.setItem("error-message", errorMessage);

    showModal(errorCode, errorMessage, "NETWORK_ERROR");
  }
}

function showModal(errorCode: string, errorMessage: string, httpCode: string): void {
  let modal = document.getElementById('error-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'error-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2 id="number-error">Error</h2>
        <p id="message-error">An unexpected error occurred.</p>
        <p id="error-code"></p>
        <button id="close-modal">Close</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-modal')!.onclick = () => {
      modal!.classList.remove('visible');
    };
  }

  const numberError = document.getElementById('number-error');
  const messageError = document.getElementById('message-error');
  const internalErrorCode = document.getElementById('error-code');

  if (numberError && messageError && internalErrorCode) {
    numberError.textContent = `Error ${httpCode || "Unknown"}`;
    messageError.textContent = errorMessage;
    internalErrorCode.textContent = `Internal Error Code: ${errorCode}`;
    modal.classList.add('visible');
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Global fetch interceptor initialized");
});
