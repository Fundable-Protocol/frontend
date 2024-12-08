interface SwitchProps {
  id: string;
  valueBasis: boolean;
  handleToggle: () => void;
}

export function Switch({ id, valueBasis, handleToggle }: SwitchProps) {
  return (
    <div className="relative inline-block w-12 h-6 cursor-pointer">
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
          ${valueBasis ? 'bg-starknet-cyan' : 'bg-gray-400'}
        `}
      >
        <span
          className={`
            absolute w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out
            transform ${valueBasis ? 'translate-x-6' : 'translate-x-1'} top-1
          `}
        />
      </label>
    </div>
  );
} 