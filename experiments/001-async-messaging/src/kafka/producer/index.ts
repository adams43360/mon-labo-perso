import { Kafka, type Producer } from "kafkajs";
import { createTask, type Task } from "../../shared/task.js";

export const TOPIC = "tasks";

export const kafka = new Kafka({
  clientId: "labo-producer",
  brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"],
});

export async function connectKafkaProducer(): Promise<Producer> {
  const producer = kafka.producer();
  await producer.connect();
  return producer;
}

export async function sendTask(
  producer: Producer,
  type: string,
  payload: Record<string, unknown>,
): Promise<Task> {
  const task = createTask(type, payload);
  await producer.send({
    topic: TOPIC,
    messages: [{ key: task.id, value: JSON.stringify(task) }],
  });
  return task;
}
