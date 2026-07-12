import type { Task } from "../../shared/task.js";
import { kafka, TOPIC } from "../producer/index.js";

export const ERROR_TOPIC = "tasks.errors";
let paused = false;

export function pauseConsumer(): void {
  paused = true;
}

export function resumeConsumer(): void {
  paused = false;
}

export async function startConsumer(onTask: (task: Task) => Promise<void>) {
  const consumer = kafka.consumer({ groupId: "labo-consumers" });
  const producer = kafka.producer();
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (paused) {
        await consumer.pause([{ topic: TOPIC }]);
        setTimeout(() => consumer.resume([{ topic: TOPIC }]), 500);
        return;
      }

      const task: Task = JSON.parse(message.value!.toString());
      try {
        await onTask(task);
      } catch {
        // Kafka n'a pas de DLQ native : on republie sur un topic d'erreurs dédié
        await producer.send({
          topic: ERROR_TOPIC,
          messages: [{ key: task.id, value: JSON.stringify(task) }],
        });
      }
    },
  });

  return consumer;
}
