import { useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  StickyNote,
  ImagePlus,
  Download,
  Upload,
  Trash2,
} from 'lucide-react';
import { useBoardStore } from '../../store/useBoardStore';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';


const STRING_PALETTE = [
  { key: 'pine', value: '#587d58' },
  { key: 'terracotta', value: '#c76e5d' },
  { key: 'ochre', value: '#d1a750' },
  { key: 'azure', value: '#5c8ca8' },
];

export function Toolbar() {
  const { t, i18n } = useTranslation();
  const { screenToFlowPosition } = useReactFlow();
  const {
    addNote,
    activeStringColor,
    setActiveStringColor,
    exportJSON,
    importJSON,
    clearBoard,
  } = useBoardStore();

  const photoInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const getCenterPosition = () =>
    screenToFlowPosition({
      x: window.innerWidth / 2 - 144 + (Math.random() * 40 - 20),
      y: window.innerHeight / 2 - 120 + (Math.random() * 40 - 20),
    });

  return (
    <nav
      aria-label={t('toolbar.ariaLabel', 'Панель инструментов')}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-[#131713]/90 border border-[#232c23] shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl select-none"
    >
      <button
        onClick={() => addNote(getCenterPosition())}
        title={t('toolbar.textCardTitle')}
        className="flex items-center gap-2 h-10 px-4 rounded-full bg-[#2e452d] text-[#c2eec0] hover:bg-[#395537] active:scale-95 transition-all duration-150 text-xs font-medium cursor-pointer"
      >
        <StickyNote size={16} />
        <span>{t('toolbar.textCard')}</span>
      </button>

      <button
        onClick={() => photoInputRef.current?.click()}
        title={t('toolbar.photoCardTitle')}
        className="flex items-center gap-2 h-10 px-4 rounded-full bg-[#1b221b] text-[#b0bab0] border border-[#2b362b] hover:bg-[#232d23] hover:text-[#e1e6e1] active:scale-95 transition-all duration-150 text-xs font-medium cursor-pointer"
      >
        <ImagePlus size={16} />
        <span>{t('toolbar.photoCard')}</span>
      </button>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) addNote(getCenterPosition(), file);
          e.target.value = '';
        }}
      />

      <div className="h-6 w-px bg-[#263126] mx-1" />

      <div className="flex items-center gap-2 px-2 py-1 bg-[#181f18] border border-[#283428] rounded-full">
        {STRING_PALETTE.map((c) => {
          const isSelected = activeStringColor === c.value;
          return (
            <button
              key={c.value}
              onClick={() => setActiveStringColor(c.value)}
              title={`${t('toolbar.stringColors.' + c.key)}`}
              style={{ backgroundColor: c.value }}
              className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'scale-110 ring-2 ring-[#c2eec0] ring-offset-2 ring-offset-[#181f18]'
                  : 'opacity-50 hover:opacity-100 hover:scale-105'
              }`}
            />
          );
        })}
      </div>

      <div className="h-6 w-px bg-[#263126] mx-1" />

      <div className="flex items-center gap-1">
        <button
          onClick={exportJSON}
          title={t('toolbar.export')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#b0bab0] hover:text-[#e1e6e1] hover:bg-white/5 active:scale-90 transition cursor-pointer"
        >
          <Download size={17} />
        </button>

        <button
          onClick={() => importInputRef.current?.click()}
          title={t('toolbar.import')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#b0bab0] hover:text-[#e1e6e1] hover:bg-white/5 active:scale-90 transition cursor-pointer"
        >
          <Upload size={17} />
        </button>
        <input
          ref={importInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importJSON(file);
            e.target.value = '';
          }}
        />

        <button
          onClick={() => {
            if (confirm(t('toolbar.clearConfirm'))) clearBoard();
          }}
          title={t('toolbar.clear')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-red-400/80 hover:text-red-300 hover:bg-red-500/10 active:scale-90 transition cursor-pointer"
        >
          <Trash2 size={17} />
        </button>

        <div className="h-6 w-px bg-[#263126] mx-1" />

        <button
          onClick={() => i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru')}
          title={i18n.language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#b0bab0] hover:text-[#e1e6e1] hover:bg-white/5 active:scale-90 transition cursor-pointer"
        >
          <Globe size={17} />
        </button>
      </div>
    </nav>
  );
}
