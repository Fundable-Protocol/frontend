interface SwitchProps {
  id: string;
  valueBasis: boolean;
  handleToggle: () => void;
}

export function Switch({ id, valueBasis, handleToggle }: SwitchProps) {
  return (
    <div className="relative inline-block w-14 h-7 cursor-pointer">
      <input
        type="checkbox"
        id={id}
        className="hidden"
        checked={valueBasis}
        onChange={handleToggle}
      />
      <label
        htmlFor={id}
        className={`
          absolute inset-0 rounded-full transition duration-300 ease-in-out
          ${valueBasis 
            ? 'bg-gradient-to-r from-[#440495] to-[#B102CD]' 
            : 'bg-[#1a1a1a] border border-[#5b21b6] border-opacity-40'}
          shadow-inner
        `}
      >
        <span
          className={`
            absolute w-5 h-5 bg-white rounded-full shadow-md
            transition-transform duration-300 ease-in-out
            transform ${valueBasis ? 'translate-x-8' : 'translate-x-1'} top-1
            ${valueBasis ? 'shadow-[#B102CD]/50' : 'shadow-[#5b21b6]/30'}
          `}
        />
      </label>
    </div>
  );
} 