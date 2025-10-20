import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : '0px';
    }
  }, [isOpen]);

  return (
    <div className="border-b border-[var(--color-border-secondary)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="accordion-header"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title}`}
      >
        <span>{title}</span>
        <Icon id="chevron-down" className="w-5 h-5" />
      </button>
      <div
        ref={contentRef}
        id={`accordion-content-${title}`}
        className="accordion-content"
        style={{ maxHeight: defaultOpen && !contentRef.current ? 'none' : (isOpen ? `${contentRef.current?.scrollHeight}px` : '0px') }}
        aria-hidden={!isOpen}
      >
        <div className="accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;