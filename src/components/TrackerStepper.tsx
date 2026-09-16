import { Check } from 'lucide-react';
import clsx from 'clsx';
import { TRACKER_STAGES } from '../types/portal';

interface TrackerStepperProps {
  currentStep: number;
  paused?: boolean;
}

export function TrackerStepper({ currentStep, paused = false }: TrackerStepperProps) {
  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {TRACKER_STAGES.map((stage, index) => {
        const done = index < currentStep;
        const active = index === currentStep;
        return (
          <li
            key={stage}
            className={clsx(
              'relative rounded-lg border px-3 py-3',
              done && 'border-emerald-300 bg-emerald-50',
              active && !paused && 'border-kiln-500 bg-orange-50',
              active && paused && 'border-amber-400 bg-amber-50',
              !done && !active && 'border-mill-200 bg-mill-50',
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold',
                  done && 'bg-emerald-600 text-white',
                  active && 'bg-kiln-500 text-mill-950',
                  !done && !active && 'bg-white text-mill-800',
                )}
              >
                {done ? <Check size={13} /> : index + 1}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-mill-800/70">
                {done ? 'Cleared' : active ? (paused ? 'On hold' : 'Live') : 'Queued'}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium leading-snug text-mill-950">{stage}</p>
          </li>
        );
      })}
    </ol>
  );
}
