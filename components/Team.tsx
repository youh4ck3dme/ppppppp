import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavigationIntent } from '../App';
import SectionHeader from './SectionHeader';
import { SkeletonTeamMemberCard } from './skeletons/SkeletonTeamMemberCard';

interface TeamProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const TeamMemberCard: React.FC<{ member: any }> = ({ member }) => {
    return (
        <div className="team-member-card group h-full">
            <div className="team-member-image-wrapper">
                 <img src={member.imageUrl} alt={member.name} loading="lazy" className="team-member-image" />
            </div>
            <div className="team-member-content">
                <h3 className="text-2xl font-serif font-bold text-white mb-1">{member.name}</h3>
                <p className="font-semibold text-[var(--color-accent)] mb-4">{member.title}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                <ul className="mt-4 space-y-2 text-gray-300 text-sm">
                    {member.services.map((service: string, index: number) => (
                        <li key={index} className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-[var(--color-accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>{service}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const Team: React.FC<TeamProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const teamMembers = t('team') || [];

    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto animate-fade-in-up">
                <SectionHeader title={t('about_us_header')} subtitle={t('about_us_subheader')} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.length > 0 ? (
                        teamMembers.map((member: any, index: number) => (
                            <div key={index} style={{ animationDelay: `${index * 150}ms` }} className="animate-fade-in-up opacity-0">
                               <TeamMemberCard member={member} />
                            </div>
                        ))
                    ) : (
                        Array.from({ length: 3 }).map((_, index) => (
                           <SkeletonTeamMemberCard key={index} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Team;
