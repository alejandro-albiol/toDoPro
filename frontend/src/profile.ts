class ProfileManager {
  private updateProfileApiUrl: string;
  private updatePasswordApiUrl: string;
  private token: string | null;

  constructor(updatePasswordUrl: string, updateProfileUrl: string) {
      this.token = localStorage.getItem('token');
      this.updatePasswordApiUrl = updatePasswordUrl;
      this.updateProfileApiUrl = updateProfileUrl.replace('UserID', this.getUserIdFromPath());
      this.initEventListeners();
  }

  private getUserIdFromPath(): string {
      const pathSegments = window.location.pathname.split('/');
      return pathSegments[pathSegments.length - 1];
  }

  private initEventListeners(): void {
      document.getElementById("edit-profile-button")?.addEventListener("click", () => this.toggleEditMode());
      document.getElementById("profile-edit-form")?.addEventListener("submit", (event) => this.updateProfile(event));
      document.getElementById("password-form")?.addEventListener("submit", (event) => this.updatePassword(event));
      document.getElementById("back-button")?.addEventListener("click", () => this.navigateHome());
  }

  private toggleEditMode(): void {
      document.querySelector(".view-mode")?.classList.toggle("hidden");
      document.getElementById("profile-edit-form")?.classList.toggle("hidden");
  }

  private async updateProfile(event: Event): Promise<void> {
    event.preventDefault();
    
    const username = (document.getElementById("username") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;

    const response = await fetch(`${this.updateProfileApiUrl}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`
        },
        body: JSON.stringify({ username, email })
    });

    const messageElement = document.getElementById("profile-message");

    try {
        const data = await response.json();

        if (response.ok) {
            messageElement!.textContent = "Profile updated successfully!";
            this.toggleEditMode();
        } else {
            messageElement!.textContent = data.errors?.[0]?.message || "Error updating profile.";
        }
    } catch (error) {
        messageElement!.textContent = "Unexpected error occurred.";
    }
}


  private async updatePassword(event: Event): Promise<void> {
      event.preventDefault();

      const oldPassword = (document.getElementById("currentPassword") as HTMLInputElement).value;
      const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
      const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;

      if (newPassword !== confirmPassword) {
          document.getElementById("password-message")!.textContent = "New passwords do not match.";
          return;
      }

      const response = await fetch(`${this.updatePasswordApiUrl}`, {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.token}`
          },
          body: JSON.stringify({ oldPassword, newPassword })
      });

      const messageElement = document.getElementById("password-message");
      try {
        const data = await response.json();

        if (response.ok) {
            messageElement!.textContent = "Password updated successfully!";
        } else {
            messageElement!.textContent = data.errors?.[0]?.message || "Error updating password.";
        }
    } catch (error) {
        messageElement!.textContent = "Unexpected error occurred.";
    }
  }

  private navigateHome(): void {
    const userId = this.getUserIdFromPath()
      window.location.href = `/home/${userId}`;
  }
}

const profileManager = new ProfileManager('http://localhost:3000/api/v1/auth/password/change', 'http://localhost:3000/api/v1/users/UserID');