import { Task } from "../../tasks/models/entities/task.entity.js";
import { AiProcessingException } from "../exceptions/ai-processing-exception.js";
import { AiConnectionError } from "../exceptions/ai-connection.exception.js";
import { IAiRecommendationService } from "./i-ai-recommendation.service.js";
import Groq from "groq-sdk";

export class AiRecommendationService implements IAiRecommendationService {
    private groq: Groq;

    constructor() {
        this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    async recommend(tasks: Task[]): Promise<string> {
        try {
            if (tasks.length === 0) {
                return "No tasks available. Try adding one to get a recommendation!";
            }

            const formattedTasks = tasks.map(task => 
                `- ${task.title}: ${task.description} (Completed: ${task.completed})`
            ).join("\n");
        
            const response = await this.groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are an AI assistant that helps users prioritize tasks effectively." },
                    { 
                        role: "user", 
                        content: `Here are my tasks:\n${formattedTasks}\n
                        Based on deadlines, priority, and task descriptions, suggest the best order to complete them.
                        Your response should be concise (under 100 characters) and practical. If all tasks are completed, suggest a new task to add.` 
                    }
                ],
                model: "llama-3.3-70b-versatile"
            });
    
            return response.choices[0]?.message?.content || "No recommendation available.";
        } catch (error) {
            if ((error as any).code === 'ENOTFOUND') {
                throw new AiConnectionError("Failed to connect to AI service.");
            }
            throw new AiProcessingException("Failed to fetch AI recommendation.");
        }
    }
}