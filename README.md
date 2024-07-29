# Kafka Study

[output-webm.webm](https://github.com/user-attachments/assets/f26affeb-da4b-43d0-b3ea-924f66a43473)

## Overview

The initial setup starts with a kafka topic with 4 partitions and one consumer.
Each time `add` button is clicked it'll be spawner a worker thread that connects a new kafka consumer.
Every log will be shown in frontend and also on terminal.

## Results

### Rebalancing

Every time a new consumer joins or leaves, a rebalance is triggered

### Not defining message's key

When a message's key is not defined, they'll be distributed between partitions in a round robin manner by default.

### Defining message's key

Defining message's key ensures that those messages will be delivered to the same partition and consumed in the same arrival order.
It's useful when order matters, for example, in a bank account application you can use client's id as message key to ensure that every message from this specific client will be processed in order.

### Consumers > Partitions (not in demo video yet)

Whenever we have more consumers than partitions, extra consumers will be idle because kafka guarantees that each partition one have a single consumer, but a single consumer can consume from more than one partition.

## Quick start

Install dependencies:

```bash
npm install
cd api && npm install
cd ../app && npm install
cd ..
```

Start kafka docker:

```bash
cd api && sudo docker compose up -d
cd ..
```

Wait some seconds after container boot up and create our topic.

Start both frontend and api:

```bash
npm run start
```

Visit: http://localhost:4200/
