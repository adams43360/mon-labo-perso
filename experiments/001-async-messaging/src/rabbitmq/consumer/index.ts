import type { Task } from "../../shared/task.js";
import { connectRabbit, QUEUE } from "../producer/index.js";

let paused = false;

export function pauseConsumer(): void {
  paused = true;
}

export function resumeConsumer(): void {
  paused = false;
}

export async function startConsumer(onTask: (task: Task) => Promise<void>): Promise<void> {
  const { channel } = await connectRabbit();
  await channel.prefetch(1);

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    if (paused) {
      // remis en tête de file, on retente après un court délai
      channel.nack(msg, false, true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    const task: Task = JSON.parse(msg.content.toString());
    try {
      await onTask(task);
      channel.ack(msg);
    } catch {
      // rejeté sans requeue -> routé vers la dead-letter exchange, donc la DLQ
      channel.nack(msg, false, false);
    }
  });
}
