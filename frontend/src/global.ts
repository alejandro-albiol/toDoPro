const originalFetch = window.fetch;

window.fetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await originalFetch(url, options);

    const currentPath = window.location.pathname;

    const excludedPaths = ["/login", "/register"];
    const isExcluded = excludedPaths.some((path) => currentPath.startsWith(path));

    if (!isExcluded && response.status > 400 && response.status < 600) {
      localStorage.setItem('error', `${response.status}`)
      window.location.href = "/httpError.html";
    }

    return response;
  } catch (error) {
    console.error("Network error:", error);

    const currentPath = window.location.pathname;
    const excludedPaths = ["/login", "/register"];
    const isExcluded = excludedPaths.some((path) => currentPath.startsWith(path));

    if (!isExcluded) {
      window.location.href = "/index.html";
    }

    throw error;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("Global fetch interceptor");
});
