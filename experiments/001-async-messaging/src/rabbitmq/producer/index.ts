import amqp, { type Channel, type ChannelModel } from "amqplib";
import { createTask, type Task } from "../../shared/task.js";

export const QUEUE = "tasks";
const DLX = "tasks.dlx";
export const DLQ = "tasks.dlq";

export async function connectRabbit(): Promise<{ conn: ChannelModel; channel: Channel }> {
  const conn = await amqp.connect(process.env.RABBITMQ_URL ?? "amqp://labo:labo@localhost:5672");
  const channel = await conn.createChannel();

  await channel.assertExchange(DLX, "fanout", { durable: true });
  await channel.assertQueue(DLQ, { durable: true });
  await channel.bindQueue(DLQ, DLX, "");

  await channel.assertQueue(QUEUE, {
    durable: true,
    arguments: { "x-dead-letter-exchange": DLX },
  });

  return { conn, channel };
}

export async function sendTask(
  channel: Channel,
  type: string,
  payload: Record<string, unknown>,
): Promise<Task> {
  const task = createTask(type, payload);
  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(task)), { persistent: true });
  return task;
}
