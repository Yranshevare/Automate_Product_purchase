const Checkbox = ({ label, value, checked, onChange }) => {
    return (
      <label className="checkbox-label">
        <input type="checkbox" value={value} checked={checked} onChange={onChange} />
        {label}
      </label>
    );
  };
  export default Checkbox