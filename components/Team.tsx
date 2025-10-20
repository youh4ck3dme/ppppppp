import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { teamMembers as staticTeamMembers } from '../constants';
import { TeamMember } from '../types';
import { NavigationIntent } from '../App';
import SectionHeader from './SectionHeader';
import { SkeletonTeamMemberCard } from './skeletons/SkeletonTeamMemberCard';

interface TeamProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
    const { t } = useTranslation();

    return (
        <div className="team-member-card group">
            <div className="team-member-image-wrapper">
                 <img src={member.image} alt={member.name} loading="lazy" className="team-member-image" />
            </div>
            <div className="team-member-content">
                <h3 className="text-2xl font-serif font-bold text-white mb-1">{member.name}</h3>
                <p className="font-semibold text-[var(--color-accent)] mb-4">{t(member.titleId)}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{t(member.bioId)}</p>
            </div>
        </div>
    );
};

const Team: React.FC<TeamProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [members, setMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setMembers(staticTeamMembers);
            setIsLoading(false);
        }, 1000); // 1-second delay for simulation
        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto animate-fade-in-up">
                <SectionHeader title={t('team_title')} subtitle={t('team_subtitle')} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                           <SkeletonTeamMemberCard key={index} />
                        ))
                    ) : (
                        members.map((member, index) => (
                            <div key={member.id} style={{ animationDelay: `${index * 150}ms` }} className="animate-fade-in-up opacity-0">
                               <TeamMemberCard member={member} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Team;