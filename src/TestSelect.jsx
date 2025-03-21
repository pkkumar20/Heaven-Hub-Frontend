const selectDropdown = ({
  field,
  value,
  change,
  bLur,
  borderClass,
  textColorClass,
  labelClass,
  messages,
  validity,
  icon,
  label,
  options,
}) => {
  return (
    <>
      <div className="relative lg:my-0 mb-[1.50rem] mt-[0rem]">
        <select
          name={field}
          value={value}
          onChange={change}
          onBlur={bLur}
          className={`peer w-full h-12 bg-transparent border ${borderClass(
            `${field}`
          )} rounded-md px-2 pt-4 pl-3 text-left outline-none transition duration-300 focus:border-blue-500 ${textColorClass(
            `${field}`
          )} appearance-none`}
        >
          <option selected hidden value=""></option>
          {options.map((option) => (
            <option key={option.id} value={JSON.stringify(option)}>
              {option.name}
            </option>
          ))}
        </select>
        <label
          className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${labelClass(
            `${field}`
          )} 
    peer-placeholder-shown:top-3
    peer-placeholder-shown:text-base
    peer-focus:top-[-0.6rem]
    peer-focus:left-2
    peer-focus:text-sm
    ${value ? "top-[-0.6rem] text-sm" : "top-3 text-base"}
  `}
        >
          {label}
        </label>
        {icon(`${field}`)}

        {messages && (
          <p
            className={`mt-[0.5rem] text-sm mb-4 ${
              validity ? "text-green-500" : "text-red-500"
            }`}
          >
            {messages}
          </p>
        )}
      </div>
    </>
  );
};
export default selectDropdown;