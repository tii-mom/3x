import React, { useState } from 'react';
import { ActivityEvent, ActivityFilter } from '../../types';
import { ActivityItemComponent } from './ActivityItem';
import { EmptyState } from '../feedback/EmptyState';

interface ActivityTimelineProps {
  activities: ActivityEvent[];
  onSelectEvent?: (event: ActivityEvent) => void;
  className?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  onSelectEvent,
  className = '',
}) => {
  const [filter, setFilter] = useState<ActivityFilter>('All');

  const filteredActivities = activities.filter((event) => {
    if (filter === 'All') return true;
    if (filter === 'Money') {
      return event.type === 'INVESTED' || event.type === 'EXITED' || event.type === 'PROTECTED';
    }
    if (filter === 'AI') {
      return (
        event.type === 'OBSERVED' ||
        event.type === 'RESEARCHED' ||
        event.type === 'INVESTED' ||
        event.type === 'EXITED'
      );
    }
    if (filter === 'Risk') {
      return event.type === 'PROTECTED' || event.type === 'RISK_CHANGED';
    }
    return true;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(['All', 'Money', 'AI', 'Risk'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filter === tab
                ? 'bg-[#11141C] text-white shadow-xs'
                : 'bg-white text-[#64748B] border border-[#E2E7F0] hover:bg-[#F8FAFC]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Activity Timeline List */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          title="No Matching Records"
          description={`No events found under the ${filter} filter.`}
          actionText="Show All Records"
          onAction={() => setFilter('All')}
        />
      ) : (
        <div className="space-y-2.5">
          {filteredActivities.map((event) => (
            <ActivityItemComponent
              key={event.id}
              event={event}
              onClick={() => onSelectEvent && onSelectEvent(event)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
