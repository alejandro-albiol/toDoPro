import Groq from 'groq-sdk';
import { Task } from '../../tasks/models/entities/task.entity.js';
import { ChatCompletion } from 'groq-sdk/src/resources/chat/completions.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class AIRecommendationService {
  static async getTaskRecommendation(pendingTasks: Task[]): Promise<string> {
    if (!pendingTasks || pendingTasks.length === 0) {
      throw new Error('No tasks to analyze');
    }

    if (pendingTasks.length > 10) {
      pendingTasks = pendingTasks.slice(0, 10);
    }

    const chatCompletion = await this.getGroqCompletion(pendingTasks);
    const recommendation = chatCompletion.choices[0]?.message?.content || '';

    if (!recommendation || recommendation.length > 150) {
      throw new Error('Default recommendation provided');
    }

    return recommendation;
  }

  private static async getGroqCompletion(
    tasks: Task[],
  ): Promise<ChatCompletion> {
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
                             Be encouraging but concise. Always send a plain text response.`,
        },
      ],
      model: 'llama3-8b-8192',
      max_tokens: 50,
      temperature: 0.5,
    });
  }
}
