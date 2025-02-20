class ErrorCodeHandler {
    private errorMessages: Record<number, string> = {
        400: "Oops! You made a bad request. Maybe your keyboard slipped? 🧐",
        401: "Unauthorized! Are you a spy? 🔍",
        403: "Forbidden! This place is top secret. 🤫",
        404: "Lost in cyberspace! 🚀 We couldn't find what you were looking for.",
        500: "Oh no! The server is having a meltdown. 🔥",
        502: "Bad Gateway! Someone forgot to feed the hamsters. 🐹",
        503: "Service Unavailable! We’re out for coffee ☕, back soon!",
        504: "Timeout! The internet needs a little nap. 💤",
    };

    private getStatusCode(): number | null {
        const statusCode = localStorage.getItem('error');
        return statusCode ? Number(statusCode) : null;
    }

    private buildMessage(): void {
        const httpCode = this.getStatusCode();
        const message = httpCode && this.errorMessages[httpCode]
            ? this.errorMessages[httpCode]
            : "no carga el code 🤯";

        document.getElementById('number-error')!.textContent = `Error ${httpCode || "Unknown"}`;
        document.getElementById('message-error')!.textContent = message;
    }

    private addGoBackButton(): void {
        const button = document.createElement('button');
        button.textContent = "Go Back";
        button.classList.add('error-btn');
        button.onclick = () => {
            localStorage.removeItem('error');
            window.location.href = "/index.html";
        };

        document.body.appendChild(button);
    }

    public initialize(): void {
        this.buildMessage();
        this.addGoBackButton();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const errorHandler = new ErrorCodeHandler();
    errorHandler.initialize();
});
