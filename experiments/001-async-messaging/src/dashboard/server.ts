import express from "express";
import type { Channel } from "amqplib";
import type { Producer } from "kafkajs";
import { connectRabbit, sendTask as sendRabbitTask } from "../rabbitmq/producer/index.js";
import { pauseConsumer as pauseRabbit, resumeConsumer as resumeRabbit } from "../rabbitmq/consumer/index.js";
import { connectKafkaProducer, sendTask as sendKafkaTask } from "../kafka/producer/index.js";
import { pauseConsumer as pauseKafka, resumeConsumer as resumeKafka } from "../kafka/consumer/index.js";

const app = express();
app.use(express.json());
app.use(express.static(new URL("./public", import.meta.url).pathname));

let rabbitChannel: Channel | undefined;
let kafkaProducer: Producer | undefined;

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
app.listen(PORT, () => console.log(`Dashboard API sur http://localhost:${PORT}`));
