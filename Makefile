
install:
	@bun install

run:
	@bun dev

background:
	@bun x trigger.dev dev

migrate:
	@bun x drizzle-kit migrate
