# AI Multi-Agent Workflow Engine - Chat UI

A stunning, modern chatbot interface built with React, TypeScript, Tailwind CSS, and Framer Motion. This UI communicates with a backend multi-agent system that processes queries through four specialized agents: Research, Analysis, Validation, and Writer.

## Features

- **Beautiful Chat Interface** - ChatGPT-style UI with rounded bubbles and smooth animations
- **Agent Processing Visualization** - Real-time stepper showing progress through 4 agents
- **Glassmorphism Design** - Modern, premium UI with backdrop blur and gradients
- **Responsive Layout** - Works seamlessly on mobile and desktop
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Auto-scroll** - Automatically scrolls to latest messages
- **Typing Indicator** - Shows when AI is processing
- **Chat History Sidebar** - Clean navigation with past conversations (UI only)
- **Real-time Status** - Online indicator in header

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Vite** - Fast build tool
- **Lucide React** - Beautiful icons

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Backend Requirements

The frontend expects a backend server running at:

```
POST http://127.0.0.1:9000/api/run
```

**Request Body:**
```json
{
  "query": "user message here"
}
```

**Expected Response:**
```json
{
  "result": "AI response here"
}
```

The backend can also return the response in other formats like:
- `{ "output": "..." }`
- `{ "message": "..." }`

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Left sidebar with logo, new chat, history
│   ├── ChatMessage.tsx      # Individual message bubbles
│   ├── AgentStepper.tsx     # 4-step agent progress indicator
│   └── ChatInput.tsx        # Bottom input with send button
├── App.tsx                  # Main application component
├── index.css                # Tailwind imports
└── main.tsx                 # React entry point
```

## Component Overview

### App.tsx
Main application component that manages:
- Message state and history
- API communication with backend
- Agent progress simulation
- Chat flow and error handling

### Sidebar.tsx
Left navigation panel featuring:
- Branding with logo and title
- "New Chat" button
- Chat history list (static UI for now)
- User profile section

### ChatMessage.tsx
Displays individual messages with:
- User/AI avatar indicators
- Message bubbles with different styling
- Typing indicator animation
- Agent processing stepper integration
- Timestamp display

### AgentStepper.tsx
Visualizes the 4-agent workflow:
- Research Agent (Search icon, blue gradient)
- Analysis Agent (Brain icon, cyan gradient)
- Validation Agent (CheckCircle icon, teal gradient)
- Writer Agent (Pencil icon, green gradient)

Each step shows: Pending → Processing (animated) → Completed

### ChatInput.tsx
Bottom input area with:
- Auto-expanding textarea
- Send button with gradient
- Microphone icon (UI only)
- Disabled state during processing
- Enter to send (Shift+Enter for new line)

## API Integration

The app makes a POST request to your backend when a user sends a message:

```typescript
const response = await fetch('http://127.0.0.1:9000/api/run', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: messageText }),
});

const data = await response.json();
```

While waiting for the response, the UI shows:
1. User message appears immediately
2. "AI is thinking..." typing indicator
3. Animated agent progress stepper
4. Final response with all agents marked complete

## Customization

### Colors
The app uses a cyan-to-blue gradient theme. To change colors, update the Tailwind classes:

- Primary gradient: `from-cyan-500 to-blue-600`
- Background: `from-slate-950 via-slate-900`
- Borders: `border-slate-700/50`

### Agent Configuration
To modify the agents shown in the stepper, edit `AgentStepper.tsx`:

```typescript
const agents = [
  { name: 'Research', icon: Search, color: 'from-blue-500 to-cyan-500' },
  { name: 'Analysis', icon: Brain, color: 'from-cyan-500 to-teal-500' },
  { name: 'Validation', icon: CheckCircle2, color: 'from-teal-500 to-emerald-500' },
  { name: 'Writer', icon: Pencil, color: 'from-emerald-500 to-green-500' },
];
```

### Animation Timing
Agent progress timing can be adjusted in `App.tsx`:

```typescript
const simulateAgentProgress = () => {
  return new Promise<void>((resolve) => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentAgentStep(step);
      if (step >= 4) {
        clearInterval(interval);
        resolve();
      }
    }, 800); // Change this value (milliseconds per step)
  });
};
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Error Handling

The UI gracefully handles errors:
- Network failures
- Backend not running
- Invalid responses

Error messages are displayed in the chat with helpful context.

## Browser Support

Modern browsers with ES2020 support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
