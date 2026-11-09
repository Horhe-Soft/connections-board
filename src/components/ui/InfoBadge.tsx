import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function InfoBadge() {
  const { t } = useTranslation();

  return (
    <div className="fixed top-6 left-6 z-50 w-10 h-10 group select-none">
      <div
        className="w-10 h-10 rounded-2xl bg-[#131713]/90 border border-[#232c23] flex items-center justify-center text-[#b0bab0] group-hover:text-[#c2eec0] group-hover:border-[#3b4b3c] shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-200 cursor-pointer"
        aria-label={t('infoBadge.ariaLabel')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
        >
          <path
            d="M 4 10.5 L 4 16.5 C 4 18.1569 5.34315 19.5 7 19.5 L 15 19.5"
            stroke="#587D58"
            strokeWidth="2.2"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <rect
            x="7.5"
            y="5.5"
            width="12.5"
            height="10"
            rx="2"
            stroke="#8FBC8F"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="absolute top-full left-0 pt-2 invisible opacity-0 translate-y-1 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out">
        <div className="w-60 p-4 rounded-3xl bg-[#131713]/95 border border-[#232c23] shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-xl flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[#e1e6e1] tracking-wide">
              {t('infoBadge.title')}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#2e452d] text-[#c2eec0] border border-[#3b5739]">
              {t('common.version')}
            </span>
          </div>

          <p className="text-xs text-[#b0bab0] leading-relaxed">
            {t('infoBadge.description')}
          </p>

          <div className="h-px w-full bg-[#232c23]" />

          <a
            href="https://github.com/Horhe-Soft"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#1b221b] hover:bg-[#232d23] border border-[#2b362b] text-xs font-medium text-[#c2eec0] transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>{t('infoBadge.github')}</span>
            </div>
            <ExternalLink size={13} className="opacity-75" />
          </a>
        </div>
      </div>
    </div>
  );
}
