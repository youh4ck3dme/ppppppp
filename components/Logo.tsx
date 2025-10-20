import React from 'react';

// Using a static path, consistent with the project's asset handling.
const logoSrc = '/assets/logo.webp';

interface LogoProps {
    className?: string;
    alt?: string;
}

const Logo: React.FC<LogoProps> = ({ className, alt = "Papi Hair Design Logo" }) => {
    return (
        <img src={logoSrc} alt={alt} className={className} />
    );
};

export default Logo;