import React from 'react';

export const SkeletonTeamMemberCard: React.FC = () => (
    <div className="team-member-card">
        <div className="team-member-image-wrapper skeleton-shimmer"></div>
        <div className="team-member-content">
            <div className="h-7 skeleton-shimmer rounded w-3/4 mb-2"></div>
            <div className="h-5 skeleton-shimmer rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
                <div className="h-3.5 skeleton-shimmer rounded"></div>
                <div className="h-3.5 skeleton-shimmer rounded"></div>
                <div className="h-3.5 skeleton-shimmer rounded w-5/6"></div>
            </div>
        </div>
    </div>
);