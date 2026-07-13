import express from "express";
import { fileURLToPath } from "node:url";
import type { Channel } from "amqplib";
import type { Producer } from "kafkajs";
import { connectRabbit, sendTask as sendRabbitTask } from "../rabbitmq/producer/index.js";
import { pauseConsumer as pauseRabbit, resumeConsumer as resumeRabbit, startConsumer as startRabbitConsumer } from "../rabbitmq/consumer/index.js";
import { connectKafkaProducer, sendTask as sendKafkaTask } from "../kafka/producer/index.js";
import { pauseConsumer as pauseKafka, resumeConsumer as resumeKafka, startConsumer as startKafkaConsumer } from "../kafka/consumer/index.js";
import type { Task } from "../shared/task.js";

const app = express();
app.use(express.json());
app.use(express.static(fileURLToPath(new URL("./public", import.meta.url))));

let rabbitChannel: Channel | undefined;
let kafkaProducer: Producer | undefined;

async function handleTask(backend: string, task: Task): Promise<void> {
  console.log(`[${backend}] traitement de la tâche ${task.id} (${task.type})`);
  if (task.type === "demo.fail") {
    throw new Error("échec simulé pour démonstration");
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`[${backend}] tâche ${task.id} traitée avec succès`);
}

startRabbitConsumer((task) => handleTask("rabbitmq", task)).catch((err) =>
  console.error("Erreur consumer RabbitMQ:", err),
);
startKafkaConsumer((task) => handleTask("kafka", task)).catch((err) =>
  console.error("Erreur consumer Kafka:", err),
);

app.post("/tasks/:backend", async (req, res) => {
  const { backend } = req.params;
  const { type, payload } = req.body as { type: string; payload: Record<string, unknown> };

  if (backend === "rabbitmq") {
    if (!rabbitChannel) rabbitChannel = (await connectRabbit()).channel;
    const task = await sendRabbitTask(rabbitChannel, type, payload ?? {});
    return res.json(task);
  }
  if (backend === "kafka") {
    if (!kafkaProducer) kafkaProducer = await connectKafkaProducer();
    const task = await sendKafkaTask(kafkaProducer, type, payload ?? {});
    return res.json(task);
  }
  return res.status(400).json({ error: "backend inconnu, attendu 'rabbitmq' ou 'kafka'" });
});

app.post("/pause/:backend", (req, res) => {
  req.params.backend === "rabbitmq" ? pauseRabbit() : pauseKafka();
  res.json({ paused: true });
});

app.post("/resume/:backend", (req, res) => {
  req.params.backend === "rabbitmq" ? resumeRabbit() : resumeKafka();
  res.json({ paused: false });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Dashboard sur http://localhost:${PORT}`));
