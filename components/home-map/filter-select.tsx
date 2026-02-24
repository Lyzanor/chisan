type FilterOption = {
  value: string;
  count: number;
};

type FilterSelectProps = {
  label: string;
  value: string;
  allLabel: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

export default function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="km0-field">
      <span className="km0-field-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="km0-select">
        <option value="">{allLabel}</option>
        {options.map((bucket) => (
          <option key={bucket.value} value={bucket.value}>
            {bucket.value} ({bucket.count})
          </option>
        ))}
      </select>
    </label>
  );
}
