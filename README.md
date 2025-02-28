# Gradual

A learning platform that breaks down complex topics into digestible steps. Learn at your own pace with our adaptive learning system.

## Pre-requisites

- [Bun](https://bun.sh/docs/installation)

## Setting environment

1. Go to [trigger.dev](trigger.dev) to get the DEVELOPMENT secret key (this is personal) and put it into `TRIGGER_SECRET_KEY`. This should have a format like `tr_dev_....`.
2. Go to neon dashboard to get the DEVELOPMENT database url of your branch and put it into `DATABASE_URL`.

## Development

1. Run web platform:

```bash
bun install
bun dev
```

2. Run background tasks:

```bash
bun x trigger.dev dev
```

3. Run migrations (only in a new database)

```bash
bun x drizzle-kit migrate
```
