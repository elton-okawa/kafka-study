# Kafka Study

## Overview

The initial setup starts with a kafka topic with 4 partitions and one consumer.
Each time `add` button is clicked it'll be spawner a worker thread that connects a new kafka consumer.
Every log will be shown in frontend and also on terminal.

## Results

### Rebalancing

Every time a new consumer joins or leaves, a rebalance is triggered

[rebalancing](https://github.com/user-attachments/assets/507dac23-73d3-418f-90c1-43c9e3f5145f)

### Not defining message's key

When a message's key is not defined, they'll be distributed between partitions in a round robin manner by default.

[not-defining-message-key](https://github.com/user-attachments/assets/39f2ed98-2696-4247-8c21-df0ee9c83b82)

### Defining message's key

Defining message's key ensures that those messages will be delivered to the same partition and consumed in the same arrival order.

It's useful when order matters, for example, in a bank account application you can use client's id as message key to ensure that every message from this specific client will be processed in order.


[defining-message-key](https://github.com/user-attachments/assets/5fedbe2c-ac6f-4a48-9cbe-b5e77fd2763b)


### Consumers > Partitions

Whenever we have more consumers than partitions, extra consumers will be idle because kafka guarantees that each partition only have a single consumer, but remember that a single consumer can consume from more than one partition.

[more-consumers-than-partitions](https://github.com/user-attachments/assets/e4bdaf80-b618-4884-9c5b-64d5a0b2b414)

### Error while consuming message

When consumer keeps throwing error when consuming a message, the message won't be consumed, consequently queue size will increase until we solve this problem.

[errors-while-consuming-message](https://github.com/user-attachments/assets/d7884427-17cd-4e75-ac9d-ac0e50a1134a)

## Quick start

```
docker compose up
```

## Development

Install dependencies:

```bash
npm install
cd api && npm install
cd ../app && npm install
cd ..
```

Start kafka docker:

```bash
docker compose up -d kafka
```

Wait some seconds after container boot up and create our topic.

Start both frontend and api:

```bash
npm run start
```

Visit: http://localhost:4200/
