'use client';

function CustomContextMenu({options,className}) {
    return (
        <div className={`absolute flex flex-col top-[110%] z-999 right-1 rounded-md shadow-2xl bg-(--card)`}>
            {options.map(el => {
            return <button onClick={el.handler} key={el.text} className="flex items-center gap-1 text-sm text-left py-3 px-6 border-b border-(--border) hover:bg-(--card-hover)">
              {el.icon} {el.text}
            </button>
            })}
        </div>
    )
}

export default CustomContextMenu
