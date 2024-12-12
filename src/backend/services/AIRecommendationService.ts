import Groq from 'groq-sdk';
import { Task } from '../models/entities/Task';
import { SingleRecommendationResult } from '../models/responses/ProcessResult';
import { GroqCompletion } from '../models/responses/GroqResponses';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class AIRecommendationService {
  static async getTaskRecommendation(
    pendingTasks: Task[],
  ): Promise<SingleRecommendationResult> {
    if (!pendingTasks || pendingTasks.length === 0) {
      return {
        isSuccess: true,
        message: 'No tasks to analyze',
        data: 'Great job! You have no pending tasks. Time to set new goals!',
      };
    }

    if (pendingTasks.length > 10) {
      pendingTasks = pendingTasks.slice(0, 10);
    }

    const chatCompletion = await this.getGroqCompletion(pendingTasks);
    const recommendation = chatCompletion.choices[0]?.message?.content || '';

    if (!recommendation || recommendation.length > 150) {
      return {
        isSuccess: true,
        message: 'Default recommendation provided',
        data: 'Focus on completing your highest priority tasks first.',
      };
    }

    return {
      isSuccess: true,
      message: 'Recommendation generated successfully',
      data: recommendation,
    };
  }

  private static async getGroqCompletion(
    tasks: Task[],
  ): Promise<GroqCompletion> {
    const formattedTasks = tasks.map((task) => ({
      title: task.title,
      description: task.description || 'No description',
    }));

    return groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `You are Groq, a friendly task advisor. Based on these tasks: ${JSON.stringify(formattedTasks)}, 
                             provide ONE short motivational tip about task prioritization.
                             Keep your response under 100 characters.
                             Be encouraging but concise.
                             Do not mention specific tasks.`,
        },
      ],
      model: 'llama3-8b-8192',
      max_tokens: 50,
      temperature: 0.5,
    });
  }
}
