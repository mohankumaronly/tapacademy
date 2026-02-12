const InputText = ({ type = "text", placeholder, name, value, onChange, label }) => {
    return (
        <div className='flex flex-col gap-1.5 w-full'>
            <label htmlFor={name} className='text-sm font-semibold text-gray-700 ml-1'>
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className='w-full border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-800 placeholder:text-gray-400' 
            />
        </div>
    )
}

export default InputText;