class ProfileManager {
    private updateProfileApiUrl: string;
    private updatePasswordApiUrl: string;
    private userApiUrl: string;
    private tasksApiUrl: string
    private token: string | null;
  
    constructor(updatePasswordUrl: string, updateProfileUrl: string, userApiUrl: string, tasksApiUrl: string) {
      this.token = localStorage.getItem("token");
      this.updatePasswordApiUrl = updatePasswordUrl;
      this.updateProfileApiUrl = updateProfileUrl.replace("UserID", this.getUserIdFromPath());
      this.userApiUrl = userApiUrl.replace("UserID", this.getUserIdFromPath());
      this.tasksApiUrl = tasksApiUrl.replace("UserID", this.getUserIdFromPath());
  
      this.initEventListeners();
      this.loadUserProfile();
      this.loadUserStats();
    }
  
    private getUserIdFromPath(): string {
      const pathSegments = window.location.pathname.split("/");
      return pathSegments[pathSegments.length - 1];
    }
  
    private initEventListeners(): void {
      document.getElementById("edit-profile-button")?.addEventListener("click", () => this.toggleEditMode());
      document.getElementById("profile-edit-form")?.addEventListener("submit", (event) => this.updateProfile(event));
      document.getElementById("password-form")?.addEventListener("submit", (event) => this.updatePassword(event));
      document.getElementById("back-button")?.addEventListener("click", () => this.navigateHome());
    }
  
    private async loadUserProfile(): Promise<void> {
      try {
        const response = await fetch(this.userApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`,
          },
        });
  
        if (!response.ok) throw new Error("Failed to load user profile");
  
        const result = await response.json();
        const user = result.data
  
        document.querySelector(".username")!.textContent = user.username;
        document.querySelector(".email")!.textContent = user.email;
  
        (document.getElementById("username") as HTMLInputElement).value = user.username;
        (document.getElementById("email") as HTMLInputElement).value = user.email;
      } catch (error) {
        console.error("Error loading user profile:", error);
        document.getElementById("profile-message")!.textContent = "Error loading profile data.";
      }
    }
  
    private toggleEditMode(): void {
      document.querySelector(".view-mode")?.classList.toggle("hidden");
      document.getElementById("profile-edit-form")?.classList.toggle("hidden");
    }
  
    private async updateProfile(event: Event): Promise<void> {
      event.preventDefault();
  
      const username = (document.getElementById("username") as HTMLInputElement).value;
      const email = (document.getElementById("email") as HTMLInputElement).value;
  
      try {
        const response = await fetch(this.updateProfileApiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`,
          },
          body: JSON.stringify({ username, email }),
        });
  
        const messageElement = document.getElementById("profile-message");
  
        if (response.ok) {
          messageElement!.textContent = "Profile updated successfully!";
          this.loadUserProfile();
          this.toggleEditMode();
        } else {
          const data = await response.json();
          messageElement!.textContent = data.errors?.[0]?.message || "Error updating profile.";
        }
      } catch (error) {
        document.getElementById("profile-message")!.textContent = "Unexpected error occurred.";
      }
    }
  
    private async updatePassword(event: Event): Promise<void> {
      event.preventDefault();
  
      const oldPassword = (document.getElementById("currentPassword") as HTMLInputElement).value;
      const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
      const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;
  
      const messageElement = document.getElementById("password-message");
  
      if (!this.isValidPassword(oldPassword)) {
        messageElement!.textContent = "Old password must be at least 8 characters and contain letters and numbers.";
        return;
      }
  
      if (!this.isValidPassword(newPassword)) {
        messageElement!.textContent = "New password must be at least 8 characters and contain letters and numbers.";
        return;
      }
  
      if (newPassword !== confirmPassword) {
        messageElement!.textContent = "New passwords do not match.";
        return;
      }
  
      try {
        const response = await fetch(this.updatePasswordApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        });
  
        if (response.ok) {
          messageElement!.textContent = "Password updated successfully!";
          (document.getElementById("currentPassword") as HTMLInputElement).value = "";
          (document.getElementById("newPassword") as HTMLInputElement).value = "";
          (document.getElementById("confirmPassword") as HTMLInputElement).value = "";
        } else {
          const data = await response.json();
          messageElement!.textContent = data.errors?.[0]?.message || "Error updating password.";
        }
      } catch (error) {
        console.error("Error updating password:", error);
        messageElement!.textContent = "Unexpected error occurred.";
      }
    }
  
    private isValidPassword(password: string): boolean {
      return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    }
  
    private navigateHome(): void {
      const userId = this.getUserIdFromPath();
      window.location.href = `/home/${userId}`;
    }

    private async loadUserStats(): Promise<void> {
        try {
          const response = await fetch(this.tasksApiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.token}`,
            },
          });
    
          const result = await response.json();
          const tasks = result.data;

          if (!tasks) {
            document.getElementById("total-tasks")!.textContent = "0";
    
            document.getElementById("completed-tasks")!.textContent = "0";
            document.getElementById("pending-tasks")!.textContent = "0";
            return;
          }

          const completedTasks = tasks.filter((task: any) => task.completed === true);
          const pendingTasks = tasks.filter((task: any) => task.completed === false);
    
          document.getElementById("total-tasks")!.textContent = tasks.length.toString();
          document.getElementById("completed-tasks")!.textContent = completedTasks.length.toString();
          document.getElementById("pending-tasks")!.textContent = pendingTasks.length.toString();
        } catch (error) {
          console.error("Error loading user statistics:", error);
          document.getElementById("total-tasks")!.textContent = "Error loading stats.";
          document.getElementById("completed-tasks")!.textContent = "Error loading stats.";
          document.getElementById("pending-tasks")!.textContent = "Error loading stats.";
        }
      }
  }
  
  const profileManager = new ProfileManager(
    "http://localhost:3000/api/v1/auth/password/change",
    "http://localhost:3000/api/v1/users/UserID",
    "http://localhost:3000/api/v1/users/UserID",
    "http://localhost:3000/api/v1/tasks/user/UserID"
  );
