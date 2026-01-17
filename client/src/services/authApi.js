// 🔹 Central response handler
const handleResponse = async (res) => {
  // ❌ Token expired / invalid / not authorized
  if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  // ✅ Normal response
  return res.json();
};

// 🔐 LOGIN
export const loginUser = async (email, password) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res);
};

// 🔐 SIGNUP
export const signupUser = async (name, email, password) => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(res);
};

// 🔐 FORGOT PASSWORD (NO TOKEN REQUIRED)
export const forgotPassword = async (email) => {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse(res);
};

// 🔐 RESET PASSWORD (NO AUTH TOKEN, ONLY RESET TOKEN)
export const resetPassword = async (token, newPassword) => {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  return handleResponse(res);
};
