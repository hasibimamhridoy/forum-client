"use server";

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const apiUrl = process.env.NEXT_PUBLIC_SERVICE_API_URL;

  if (!apiUrl) {
    return {
      success: false,
      error: "API configuration error",
    };
  }

  try {
    const response = await fetch(`${apiUrl}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    console.log("response ", response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("errorData ", errorData);
      return {
        success: false,
        error: errorData.message || "Registration failed",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Failed to connect to the server",
    };
  }
}
