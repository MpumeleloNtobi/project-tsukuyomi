.PHONY: dev frontend backend clean

dev: frontend backend

frontend:
	@echo "Starting frontend..."
	@cd ./frontend && npm run dev

backend:
	@echo "Starting backend in new terminal..."
	@cd ./backend/src && npm start

frontend-lint:
	@cd ./frontend && npx prettier . --write

backend-lint:
	@cd ./backend && npx prettier . --write

clean:
	@echo "🧹 Cleaning up..."
	@pkill -f "npm run dev"
	@pkill -f "npm start"

help:
	@echo "Available targets:"
	@echo "  make dev     - Start both frontend and backend (backend in new terminal)"
	@echo "  make frontend - Start only frontend"
	@echo "  make backend - Start only backend in new terminal"
	@echo "  make clean   - Kill all running npm processes"
	@echo "  make help    - Show this help message"