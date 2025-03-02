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
        const statusCode = localStorage.getItem('http-error');
        return statusCode ? Number(statusCode) : null;
    }

    private buildMessage(): void {
        const httpCode = this.getStatusCode();
        const errorCode = localStorage.getItem('error-code');
        const errorMessage = localStorage.getItem('error-message');
        const message = httpCode && this.errorMessages[httpCode]
            ? this.errorMessages[httpCode]
            : errorMessage || "An unexpected error occurred.";

        document.getElementById('number-error')!.textContent = `Error ${httpCode || "Unknown"}`;
        document.getElementById('message-error')!.textContent = message;

        if (errorCode) {
            const errorCodeElement = document.createElement('p');
            errorCodeElement.id = 'error-code';
            errorCodeElement.textContent = `Internal Error Code: ${errorCode}`;
            document.querySelector('.error-container')!.appendChild(errorCodeElement);
        }
    }

    private addGoBackButton(): void {
        const button = document.createElement('button');
        button.textContent = "Go Back";
        button.classList.add('error-btn');
        button.onclick = () => {
            localStorage.removeItem('http-error');
            localStorage.removeItem('error-code');
            localStorage.removeItem('error-message');
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
