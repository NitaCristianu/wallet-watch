import React from 'react'
const DATA = [
    {
        title: "Plan 1",
    },
    {
        title: "Plan 2",
    },
    {
        title: "Plan 3",
    },
];

function Plan({ title }: { title: string }) {
    return (
        <div className="p-10 rounded-xl shadow-md transition-shadow duration-300 text-left hover:bg-gray-100">
            <div>
                <h1 className='text-text-primary text-lg font-[500] mt-2 mb-1'>{title}</h1>

            </div>
        </div>
    );
}

const Plans = () => {
    return (
        <div className='flex flex-col space-x-6 ml-2 mt-2'>
            {...DATA.map(data => (<Plan key={data.title} {...data} />))}
        </div>
    )
}

export default Plans