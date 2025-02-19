const originalFetch = window.fetch;

window.fetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  // Add Authorization header if token exists
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await originalFetch(url, options);

    // Get the current page path
    const currentPath = window.location.pathname;

    // List of pages where we should NOT auto-redirect
    const excludedPaths = ["/login", "/signup", "/register"];
    const isExcluded = excludedPaths.some((path) => currentPath.startsWith(path));

    // Redirect only if we're NOT on an excluded page and the response is an error
    if (!isExcluded && response.status >= 400 && response.status < 600) {
      console.error(`Error ${response.status}: Redirecting to index`);
      window.location.href = "/index.html"; // Adjust this as needed
    }

    return response;
  } catch (error) {
    console.error("Network error:", error);

    // Only redirect if NOT on login/signup pages
    const currentPath = window.location.pathname;
    const excludedPaths = ["/login", "/signup", "/register"];
    const isExcluded = excludedPaths.some((path) => currentPath.startsWith(path));

    if (!isExcluded) {
      window.location.href = "/index.html";
    }

    throw error;
  }
};

// Ensure the script runs on every page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Global fetch interceptor loaded!");
});
