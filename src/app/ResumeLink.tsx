import { RESUME_HREF } from '../lib/site'

/**
 * Document-icon resume control, adapted from davishiggins.com's `.sb-resume`
 * anchor: a folded-paper glyph with three lines that opens the PDF directly in a
 * new tab. No resume page, modal, or forced download.
 */
export function ResumeLink({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <a
      href={RESUME_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open resume PDF (opens in a new tab)"
      className={`resume-link ${compact ? 'resume-link--compact' : ''} ${className}`}
    >
      <span className="resume-link__viz" aria-hidden="true">
        <span className="resume-link__doc">
          <span className="resume-link__fold" />
          <span className="resume-link__line" />
          <span className="resume-link__line" />
          <span className="resume-link__line" />
        </span>
      </span>
      {compact ? null : (
        <span className="resume-link__label" aria-hidden="true">
          Resume
        </span>
      )}
    </a>
  )
}
