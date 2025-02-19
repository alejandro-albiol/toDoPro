import { Task } from "../../tasks/models/entities/task.entity.js";
import { AiProcessingException } from "../exceptions/ai-processing-exception.js";
import { IAiRecommendationService } from "./i-ai-recommendation.service.js";
import Groq from "groq-sdk";

export class AiRecommendationService implements IAiRecommendationService {
    private groq: Groq;

    constructor() {
        this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    async recommend(tasks: Task[]): Promise<string> {
        try {
            const formattedTasks = tasks.map(task => `Title: ${task.title}, Description: ${task.description}`).join("\n");

            const response = await this.groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are an AI assistant that helps prioritize tasks." },
                    { role: "user", content: `Given the following tasks, suggest how to prioritize them:\n${formattedTasks}. Always send plain text response under 100 characters.` }
                ],
                model: "llama-3.3-70b-versatile"
            });

            return response.choices[0]?.message?.content || "No recommendation available.";
        } catch (error) {
            console.error("Error getting AI recommendation:", error);
            throw new AiProcessingException("Failed to fetch AI recommendation.");
        }
    }
}
