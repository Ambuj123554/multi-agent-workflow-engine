import { motion } from 'framer-motion';
import { Search, Brain, CheckCircle2, Pencil, Loader2 } from 'lucide-react';

interface AgentStepperProps {
  currentStep: number;
}

export default function AgentStepper({ currentStep }: AgentStepperProps) {
  const agents = [
    { name: 'Research', icon: Search, color: 'from-blue-500 to-cyan-500' },
    { name: 'Analysis', icon: Brain, color: 'from-cyan-500 to-teal-500' },
    { name: 'Validation', icon: CheckCircle2, color: 'from-teal-500 to-emerald-500' },
    { name: 'Writer', icon: Pencil, color: 'from-emerald-500 to-green-500' },
  ];

  return (
    <div className="space-y-3 mb-4">
      {agents.map((agent, index) => {
        const Icon = agent.icon;
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isCompleted
                  ? `bg-gradient-to-br ${agent.color} shadow-lg`
                  : isCurrent
                  ? `bg-gradient-to-br ${agent.color} animate-pulse shadow-lg`
                  : 'bg-slate-700/50'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Icon className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="flex-1">
              <p
                className={`text-sm font-medium transition-colors ${
                  isCompleted || isCurrent ? 'text-white' : 'text-slate-400'
                }`}
              >
                {agent.name} Agent
              </p>
              <p className="text-xs text-slate-500">
                {isCompleted ? 'Completed' : isCurrent ? 'Processing...' : 'Pending'}
              </p>
            </div>

            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-emerald-400"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
